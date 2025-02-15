from datetime import timedelta
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import pre_save
from django.db.models import Max
from django.utils import timezone
from utils.snippets import (
    autoslugFromField, autoSlugFromUUID, get_static_file_path, image_as_base64
)
from utils.image_upload_helpers import (
    get_code_snippet_image_path,
)


""" *************** Code Snippet *************** """


@autoslugFromField(fieldname="title")
class CodeSnippet(models.Model):
    class Status(models.TextChoices):
        PUBLISHED = 'Published', _('Published')
        DRAFT = 'Draft', _('Draft')
        ARCHIVED = 'Archived', _('Archived')

    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    overview = models.TextField(max_length=500, blank=True, null=True)
    image = models.ImageField(upload_to=get_code_snippet_image_path, blank=True, null=True)
    language = models.CharField(max_length=50, blank=True)
    tags = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PUBLISHED)
    content = models.TextField()
    order = models.PositiveIntegerField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'code_snippet'
        verbose_name = _('Code Snippet')
        verbose_name_plural = _('Code Snippets')
        # NOTE: Ordering explicitly defined in `get_queryset` method of `BlogViewset` class
        # This won't have any effect
        ordering = ('-order', '-created_at')
        get_latest_by = "created_at"

    def __str__(self):
        return self.title

    def get_image(self):
        if self.image:
            image_path = self.image.url
        else:
            image_path = get_static_file_path("icons/code.png")
        return image_as_base64(image_path)


# Signals

@receiver(pre_save, sender=CodeSnippet)
def generate_order(sender, instance, **kwargs):
    """
    This method will generate order for new instances only.
    Order will be generated automatically like 1, 2, 3, 4 and so on.
    If any order is deleted then it will be reused. Like if 3 is deleted then next created order
    will be 3 instead of 5.
    """
    if not instance.pk:  # Only generate order for new instances
        if instance.order is None:
            deleted_orders = CodeSnippet.objects.filter(order__isnull=False).values_list('order', flat=True)
            max_order = CodeSnippet.objects.aggregate(Max('order')).get('order__max')

            if deleted_orders:
                deleted_orders = sorted(deleted_orders)
                reused_order = None
                for i in range(1, max_order + 2):
                    if i not in deleted_orders:
                        reused_order = i
                        break
                if reused_order is not None:
                    instance.order = reused_order
            else:
                instance.order = max_order + 1 if max_order is not None else 1


""" *************** Code Snippet View *************** """


@autoSlugFromUUID()
class CodeSnippetView(models.Model):
    clientID = models.CharField(max_length=255)
    code_snippet = models.ForeignKey(CodeSnippet, on_delete=models.CASCADE, related_name='views')
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    first_visited_at = models.DateTimeField(auto_now_add=True)
    last_visited_at = models.DateTimeField(auto_now=True)
    liked = models.BooleanField(default=False)

    class Meta:
        db_table = 'code_snippet_view'
        verbose_name = _('Code Snippet View')
        verbose_name_plural = _('Code Snippet Views')
        ordering = ('-last_visited_at',)
        get_latest_by = "created_at"
        unique_together = [["clientID", "code_snippet"]]

    def __str__(self):
        return self.clientID


""" *************** Code Snippet Comment *************** """


@autoSlugFromUUID()
class CodeSnippetComment(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    comment = models.TextField()
    code_snippet = models.ForeignKey(CodeSnippet, on_delete=models.CASCADE, related_name='comments')
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'code_snippet_comment'
        verbose_name = _('Code Snippet Comment')
        verbose_name_plural = _('Code Snippet Comments')
        ordering = ('-created_at',)
        get_latest_by = "created_at"

    def __str__(self):
        return f"{self.name} :- {self.code_snippet.title}"

    def get_timestamp(self):
        now = timezone.now()
        time_difference = now - self.created_at

        if time_difference.total_seconds() < 60:  # Less than a minute
            seconds_ago = int(time_difference.total_seconds())
            return f"{seconds_ago} second{'s' if seconds_ago > 1 else ''} ago"
        elif time_difference.total_seconds() < 3600:  # Less than an hour
            minutes_ago = int(time_difference.total_seconds() // 60)
            return f"{minutes_ago} minute{'s' if minutes_ago > 1 else ''} ago"
        elif time_difference < timedelta(days=1):  # Less than a day
            hours_ago = time_difference.seconds // 3600
            return f"{hours_ago} hour{'s' if hours_ago > 1 else ''} ago"
        elif time_difference < timedelta(days=30):
            days_ago = time_difference.days
            return f"{days_ago} days ago"
        elif time_difference < timedelta(days=365):
            months_ago = time_difference.days // 30
            return f"{months_ago} months ago"
        else:
            years_ago = time_difference.days // 365
            months_remaining = (time_difference.days % 365) // 30
            days_remaining = (time_difference.days % 365) % 30
            if months_remaining == 0:
                return f"{years_ago} year{'s' if years_ago > 1 else ''} ago"
            elif days_remaining == 0:
                return f"{years_ago} year{'s' if years_ago > 1 else ''} {months_remaining} \
            month{'s' if months_remaining > 1 else ''} ago"
            else:
                return f"{years_ago} year{'s' if years_ago > 1 else ''} {months_remaining} \
            month{'s' if months_remaining > 1 else ''} and {days_remaining} day{'s' if days_remaining > 1 else ''} ago"
