from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import pre_save
from django.db.models import Max
from utils.helpers import CustomModelManager
from utils.snippets import autoSlugWithFieldAndUUID, autoSlugFromUUID, get_static_file_path, image_as_base64
from utils.image_upload_helpers import (
    get_blog_image_path,
)


""" *************** Blog Category *************** """


@autoSlugWithFieldAndUUID(fieldname="name")
class BlogCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # custom model manager
    objects = CustomModelManager()

    class Meta:
        db_table = 'blog_category'
        verbose_name = _('Blog Category')
        verbose_name_plural = _('Blog Categories')
        ordering = ('-created_at',)
        get_latest_by = "created_at"

    def __str__(self):
        return self.name


""" *************** Blog *************** """


@autoSlugWithFieldAndUUID(fieldname="title")
class Blog(models.Model):
    class Status(models.TextChoices):
        PUBLISHED = 'Published', _('Published')
        DRAFT = 'Draft', _('Draft')
        ARCHIVED = 'Archived', _('Archived')

    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    category = models.ForeignKey(BlogCategory, on_delete=models.CASCADE, related_name='blogs', blank=True, null=True)
    image = models.ImageField(upload_to=get_blog_image_path, blank=True, null=True)
    content = models.TextField()
    author = models.CharField(max_length=100, default="Numan Ibn Mazid", blank=True)
    keywords = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PUBLISHED)
    reading_time = models.PositiveIntegerField(blank=True, null=True)
    order = models.PositiveIntegerField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # custom model manager
    objects = CustomModelManager()

    class Meta:
        db_table = 'blog'
        verbose_name = _('Blog')
        verbose_name_plural = _('Blogs')
        ordering = ('order', '-created_at')
        get_latest_by = "created_at"

    def __str__(self):
        return self.title

    def get_image(self):
        if self.image:
            image_path = settings.MEDIA_ROOT + self.image.url.lstrip("/media/")
        else:
            image_path = get_static_file_path("icons/blog.png")
        return image_as_base64(image_path)


# Signals

@receiver(pre_save, sender=Blog)
def generate_order(sender, instance, **kwargs):
    """
    This method will generate order for new instances only.
    Order will be generated automatically like 1, 2, 3, 4 and so on.
    If any order is deleted then it will be reused. Like if 3 is deleted then next created order will be 3 instead of 5.
    """
    if not instance.pk:  # Only generate order for new instances
        if instance.order is None:
            deleted_orders = Blog.objects.filter(order__isnull=False).values_list('order', flat=True)
            max_order = Blog.objects.aggregate(Max('order')).get('order__max')

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


""" *************** Blog View IP *************** """


@autoSlugFromUUID()
class BlogViewIP(models.Model):
    ip_address = models.CharField(max_length=255, unique=True)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='view_ips')
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    first_visited_at = models.DateTimeField(auto_now_add=True)
    last_visited_at = models.DateTimeField(auto_now=True)
    liked = models.BooleanField(default=False)

    # custom model manager
    objects = CustomModelManager()

    class Meta:
        db_table = 'blog_view_ip'
        verbose_name = _('Blog View IP')
        verbose_name_plural = _('Blog View IPs')
        ordering = ('-last_visited_at',)
        get_latest_by = "created_at"

    def __str__(self):
        return self.ip_address


""" *************** Blog Comment *************** """


@autoSlugFromUUID()
class BlogComment(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    comment = models.TextField()
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # custom model manager
    objects = CustomModelManager()

    class Meta:
        db_table = 'blog_comment'
        verbose_name = _('Blog Comment')
        verbose_name_plural = _('Blog Comments')
        ordering = ('-created_at',)
        get_latest_by = "created_at"

    def __str__(self):
        return f"{self.name} :- {self.blog.title}"
