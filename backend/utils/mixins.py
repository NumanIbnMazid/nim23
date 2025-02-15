from django.db import models
from django.conf import settings
from django.utils.timezone import datetime
from django.utils.translation import gettext_lazy as _
from utils.helpers import CustomModelManager
from utils.snippets import file_as_base64


"""
----------------------- * Custom Model Admin Mixins * -----------------------
"""


class CustomModelAdminMixin(object):
    """
    DOCSTRING for CustomModelAdminMixin:
    This model mixing automatically displays all fields of a model in admin panel following the criteria.
    code: @ Numan Ibn Mazid
    """

    def __init__(self, model, admin_site):
        self.list_display = [
            field.name
            for field in model._meta.fields
            if field.get_internal_type() != "TextField"
        ]
        super(CustomModelAdminMixin, self).__init__(model, admin_site)


"""
----------------------- * Model Media Mixin * -----------------------
"""

class ModelMediaMixin(models.Model):
    """
    Derived Model Class should have a field named 'file'.
    """
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # custom model manager
    objects = CustomModelManager()

    class Meta:
        abstract = True

    def get_file(self):
        if self.file:
            file_path = self.file.url
            return file_as_base64(file_path)
        return


class DurationMixin:
    title = None
    """
    Derived Model Class must have fields: `start_date`, `end_date` and `present`.
    """
    def get_duration(self):
        if self.end_date is None and not self.present:
            raise ValueError(_("End date is required to calculate duration in days. Please provide end date or mark as present."))
        if self.present and self.end_date is not None:
            raise ValueError(_("End date is not required when marked as present. Please remove end date or mark as not present."))

        end_date = None
        if self.end_date is not None:
            end_date = self.end_date.strftime("%b %Y")
        if self.present:
            end_date = _("Present")
        start_date = self.start_date.strftime("%b %Y")
        return f"{start_date} - {end_date}"

    def get_duration_in_days(self):
        if self.end_date is None and not self.present:
            raise ValueError(_("End date is required to calculate duration in days. Please provide end date or mark as present."))
        if self.present and self.end_date is not None:
            raise ValueError(_("End date is not required when marked as present. Please remove end date or mark as not present."))

        end_date = None
        if self.end_date is not None:
            end_date = self.end_date
        if self.present:
            end_date = datetime.now().date()

        duration = end_date - self.start_date

        years = duration.days // 365
        months = (duration.days % 365) // 30
        days = (duration.days % 365) % 30

        duration_str = ""
        if years > 0:
            duration_str += f"{years} Year{'s' if years > 1 else ''}, "
        if months > 0:
            duration_str += f"{months} Month{'s' if months > 1 else ''}"
        # if days > 0:
        #     duration_str += f"{days} Day{'s' if days > 1 else ''}"

        if years < 1 and months < 1:
            duration_str = f"{days} Day{'s' if days > 1 else ''}"

        return duration_str
