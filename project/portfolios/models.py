from django.db import models
from django.conf import settings
from django.utils import dateformat
from django.utils.timezone import datetime
from django.utils.translation import gettext_lazy as _
from utils.helpers import CustomModelManager
from utils.snippets import autoslugWithFieldAndUUID, image_as_base64, get_static_file_path
from utils.image_upload_helpers import get_professional_experience_company_image_path
from ckeditor.fields import RichTextField


""" *************** Professional Experience *************** """


@autoslugWithFieldAndUUID(fieldname="company")
class ProfessionalExperience(models.Model):
    """
    Professional Experience model.
    Details: Includes Job Experiences and other professional experiences.
    """
    class JobType(models.TextChoices):
        FULL_TIME = _('Full Time'), _('Full Time')
        PART_TIME = _('Part Time'), _('Part Time')
        CONTRACTUAL = _('Contractual'), _('Contractual')
        REMOTE = _('Remote'), _('Remote')

    slug = models.SlugField(max_length=255, unique=True)
    company = models.CharField(max_length=150)
    company_image = models.ImageField(upload_to=get_professional_experience_company_image_path, blank=True, null=True)
    company_url = models.URLField(blank=True, null=True)
    address = models.CharField(max_length=254, blank=True, null=True)
    designation = models.CharField(max_length=150)
    job_type = models.CharField(max_length=20, choices=JobType.choices, default=JobType.FULL_TIME)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    currently_working = models.BooleanField(default=False)
    description = RichTextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # custom model manager
    objects = CustomModelManager()

    class Meta:
        db_table = 'professional_experience'
        verbose_name = _('Professional Experience')
        verbose_name_plural = _('Professional Experiences')
        ordering = ('-currently_working', '-start_date')
        get_latest_by = "created_at"

    def __str__(self):
        return self.company

    def get_duration(self):
        if self.end_date is None and not self.currently_working:
            raise ValueError("End date is required to calculate duration in days. Please provide end date or mark as currently working.")
        if self.currently_working and self.end_date is not None:
            raise ValueError("End date is not required when marked as currently working. Please remove end date or mark as not currently working.")

        end_date = None
        if self.end_date is not None:
            end_date = self.end_date.strftime("%b %Y")
        if self.currently_working:
            end_date = "Present"
        start_date = self.start_date.strftime("%b %Y")
        return f"{start_date} - {end_date}"

    def get_duration_in_days(self):
        if self.end_date is None and not self.currently_working:
            raise ValueError("End date is required to calculate duration in days. Please provide end date or mark as currently working.")
        if self.currently_working and self.end_date is not None:
            raise ValueError("End date is not required when marked as currently working. Please remove end date or mark as not currently working.")

        end_date = None
        if self.end_date is not None:
            end_date = self.end_date
        if self.currently_working:
            end_date = datetime.now().date()

        duration = end_date - self.start_date

        years = duration.days // 365
        months = (duration.days % 365) // 30
        days = (duration.days % 365) % 30

        duration_str = ""
        if years > 0:
            duration_str += f"{years} Year{'s' if years > 1 else ''}, "
        if months > 0:
            duration_str += f"{months} Month{'s' if months > 1 else ''}, "
        if days > 0:
            duration_str += f"{days} Day{'s' if days > 1 else ''}"

        return duration_str

    def get_end_date(self):
        if self.currently_working:
            return _('Present')
        elif self.end_date:
            # return formatted date (supporting translation)
            return dateformat.format(self.end_date, "F Y")
        return _('Not Specified')

    def get_company_image(self):
        if self.company_image:
            image_path = settings.MEDIA_ROOT + self.company_image.url.lstrip("/media/")
        else:
            image_path = get_static_file_path("icons/office-building.png")
        return image_as_base64(image_path)
