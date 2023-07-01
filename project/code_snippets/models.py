from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import pre_save
from django.db.models import Max
from utils.helpers import CustomModelManager
from utils.snippets import autoSlugWithFieldAndUUID, get_static_file_path, image_as_base64
from utils.image_upload_helpers import (
    get_code_snippet_image_path,
)


""" *************** Code Snippet *************** """


@autoSlugWithFieldAndUUID(fieldname="title")
class CodeSnippet(models.Model):
    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    short_description = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to=get_code_snippet_image_path, blank=True, null=True)
    language = models.CharField(max_length=50, blank=True)
    content = models.TextField()
    order = models.PositiveIntegerField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # custom model manager
    objects = CustomModelManager()

    class Meta:
        db_table = 'code_snippet'
        verbose_name = _('Code Snippet')
        verbose_name_plural = _('Code Snippets')
        ordering = ('order', '-created_at')
        get_latest_by = "created_at"

    def __str__(self):
        return self.title

    def get_image(self):
        if self.image:
            image_path = settings.MEDIA_ROOT + self.image.url.lstrip("/media/")
        else:
            image_path = get_static_file_path("icons/code.png")
        return image_as_base64(image_path)


# Signals

@receiver(pre_save, sender=CodeSnippet)
def generate_order(sender, instance, **kwargs):
    """
    This method will generate order for new instances only.
    Order will be generated automatically like 1, 2, 3, 4 and so on.
    If any order is deleted then it will be reused. Like if 3 is deleted then next created order will be 3 instead of 5.
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
