from django.db import models
from django.conf import settings
from django.utils import dateformat
from django.utils.timezone import datetime
from django.db.models.signals import pre_save
from django.db.models import Max
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from utils.helpers import CustomModelManager
from utils.snippets import autoslugWithFieldAndUUID, image_as_base64, get_static_file_path
from utils.image_upload_helpers import (
    get_professional_experience_company_image_path, get_skill_image_path
)
from ckeditor.fields import RichTextField


""" *************** Professional Experience *************** """


@autoslugWithFieldAndUUID(fieldname="company")
class ProfessionalExperience(models.Model):
    """
    Professional Experience model.
    Details: Includes Job Experiences and other professional experiences.
    """
    class JobType(models.TextChoices):
        FULL_TIME = 'Full Time', _('Full Time')
        PART_TIME = 'Part Time', _('Part Time')
        CONTRACTUAL = 'Contractual', _('Contractual')
        REMOTE = 'Remote', _('Remote')

    company = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
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
            image_path = get_static_file_path("icons/company.png")
        return image_as_base64(image_path)


""" *************** Skill *************** """


@autoslugWithFieldAndUUID(fieldname="title")
class Skill(models.Model):
    """
    Skill model.
    """
    class Level(models.TextChoices):
        One = 1, '1'
        Two = 2, '2'
        Three = 3, '3'
        Four = 4, '4'
        Five = 5, '5'

    title = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    image = models.ImageField(upload_to=get_skill_image_path, blank=True, null=True)
    level = models.CharField(choices=Level.choices, default=None, blank=True, null=True)
    order = models.PositiveIntegerField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # custom model manager
    objects = CustomModelManager()

    class Meta:
        db_table = 'skill'
        verbose_name = _('Skill')
        verbose_name_plural = _('Skills')
        ordering = ('order', '-created_at')
        get_latest_by = "created_at"

    def __str__(self):
        return self.title

    def get_image(self):
        if self.image:
            image_path = settings.MEDIA_ROOT + self.image.url.lstrip("/media/")
        else:
            image_path = get_static_file_path("icons/skill.png")
        return image_as_base64(image_path)


@receiver(pre_save, sender=Skill)
def generate_order(sender, instance, **kwargs):
    """
    This method will generate order for new instances only.
    Order will be generated automatically like 1, 2, 3, 4 and so on.
    If any order is deleted then it will be reused. Like if 3 is deleted then next created order will be 3 instead of 5.
    """
    if not instance.pk:  # Only generate order for new instances
        if instance.order is None:
            deleted_orders = Skill.objects.filter(order__isnull=False).values_list('order', flat=True)
            max_order = Skill.objects.aggregate(Max('order')).get('order__max')

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
