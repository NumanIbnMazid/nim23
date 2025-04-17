from django.db import models
from utils.snippets import autoSlugFromUUID
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError


""" *************** Recommendr Utils *************** """


@autoSlugFromUUID()
class RecommendrUtils(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    system_prompt = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "recommendr_utils"
        verbose_name = _("Recommendr Utils")
        verbose_name_plural = _("Recommendr Utils")
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.title}"

    def clean(self):
        if RecommendrUtils.objects.exclude(pk=self.pk).exists():
            raise ValidationError("Only one RecommendrUtils instance is allowed.")

    def save(self, *args, **kwargs):
        self.full_clean()  # Triggers the `clean` method above
        super().save(*args, **kwargs)
