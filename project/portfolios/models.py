from django.db import models
from django.conf import settings
from django.utils import dateformat
from django.utils.timezone import datetime
from django.db.models.signals import pre_save
from django.db.models import Max
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from utils.helpers import CustomModelManager
from utils.mixins import ModelMediaMixin, DurationMixin
from utils.snippets import autoSlugWithFieldAndUUID, autoSlugFromUUID, image_as_base64, get_static_file_path
from utils.image_upload_helpers import (
    get_professional_experience_company_image_path, get_skill_image_path, get_education_school_image_path, get_education_media_path,
    get_certification_image_path, get_certification_media_path, get_project_image_path, get_project_media_path
)
from ckeditor.fields import RichTextField


""" *************** Professional Experience *************** """


@autoSlugWithFieldAndUUID(fieldname="company")
class ProfessionalExperience(models.Model, DurationMixin):
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
    present = models.BooleanField(default=False)
    description = RichTextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # custom model manager
    objects = CustomModelManager()

    class Meta:
        db_table = 'professional_experience'
        verbose_name = _('Professional Experience')
        verbose_name_plural = _('Professional Experiences')
        ordering = ('-present', '-start_date')
        get_latest_by = "created_at"

    def __str__(self):
        return self.company

    def get_company_image(self):
        if self.company_image:
            image_path = settings.MEDIA_ROOT + self.company_image.url.lstrip("/media/")
        else:
            image_path = get_static_file_path("icons/company.png")
        return image_as_base64(image_path)


""" *************** Skill *************** """


@autoSlugWithFieldAndUUID(fieldname="title")
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


# Signals

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


""" *************** Education *************** """


@autoSlugWithFieldAndUUID(fieldname="school")
class Education(models.Model, DurationMixin):
    school = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    image = models.ImageField(upload_to=get_education_school_image_path, blank=True, null=True)
    degree = models.CharField(max_length=150)
    address = models.CharField(max_length=254, blank=True, null=True)
    field_of_study = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    present = models.BooleanField(default=False)
    grade = models.CharField(max_length=254, blank=True, null=True)
    activities = models.CharField(max_length=254, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # custom model manager
    objects = CustomModelManager()

    class Meta:
        db_table = 'education'
        verbose_name = _('Education')
        verbose_name_plural = _('Educations')
        ordering = ('-end_date', '-created_at')
        get_latest_by = "created_at"

    def __str__(self):
        return self.school

    def get_image(self):
        if self.image:
            image_path = settings.MEDIA_ROOT + self.image.url.lstrip("/media/")
        else:
            image_path = get_static_file_path("icons/school.png")
        return image_as_base64(image_path)


    # def get_duration(self):
    #     if self.end_date is None and not self.current:
    #         raise ValueError(_("End date is required to calculate duration in days. Please provide end date or mark as present."))
    #     if self.current and self.end_date is not None:
    #         raise ValueError(_("End date is not required when marked as present. Please remove end date or mark as not present."))

    #     end_date = None
    #     if self.end_date is not None:
    #         end_date = self.end_date.strftime("%b %Y")
    #     if self.current:
    #         end_date = _("Present")
    #     start_date = self.start_date.strftime("%b %Y")
    #     return f"{start_date} - {end_date}"



@autoSlugFromUUID()
class EducationMedia(ModelMediaMixin):
    education = models.ForeignKey(Education, on_delete=models.CASCADE, related_name="education_media")
    file = models.FileField(upload_to=get_education_media_path)

    class Meta:
        db_table = 'education_media'
        verbose_name = _('Education Media')
        verbose_name_plural = _('Education Media')
        get_latest_by = "created_at"
        order_with_respect_to = 'education'

    def __str__(self):
        return self.education.__str__()


""" *************** Certification *************** """


@autoSlugWithFieldAndUUID(fieldname="title")
class Certification(models.Model):
    title = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    organization = models.CharField(max_length=150)
    address = models.CharField(max_length=254, blank=True, null=True)
    image = models.ImageField(upload_to=get_certification_image_path, blank=True, null=True)
    issue_date = models.DateField()
    expiration_date = models.DateField(blank=True, null=True)
    does_not_expire = models.BooleanField(default=False)
    credential_id = models.CharField(max_length=254, blank=True, null=True)
    credential_url = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # custom model manager
    objects = CustomModelManager()

    class Meta:
        db_table = 'certification'
        verbose_name = _('Certification')
        verbose_name_plural = _('Certifications')
        ordering = ['-issue_date']
        get_latest_by = "created_at"

    def __str__(self):
        return self.title

    def get_image(self):
        if self.image:
            image_path = settings.MEDIA_ROOT + self.image.url.lstrip("/media/")
        else:
            image_path = get_static_file_path("icons/certificate.png")
        return image_as_base64(image_path)

    def get_issue_date(self):
        return self.issue_date.strftime("%-d %B, %Y")

    def get_expiration_date(self):
        if self.does_not_expire:
            return _('Does not expire')
        elif self.expiration_date:
            return self.expiration_date.strftime("%-d %B, %Y")
        return _('Not Specified')


@autoSlugFromUUID()
class CertificationMedia(ModelMediaMixin):
    certification = models.ForeignKey(Certification, on_delete=models.CASCADE, related_name="certification_media")
    file = models.FileField(upload_to=get_certification_media_path)

    class Meta:
        db_table = 'certification_media'
        verbose_name = _('Certification Media')
        verbose_name_plural = _('Certification Media')
        get_latest_by = "created_at"
        order_with_respect_to = 'certification'

    def __str__(self):
        return self.certification.__str__()


""" *************** Project *************** """


@autoSlugWithFieldAndUUID(fieldname="title")
class Project(models.Model, DurationMixin):
    title = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    image = models.ImageField(upload_to=get_project_image_path, blank=True, null=True)
    short_description = models.CharField(max_length=254)
    technology = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    present = models.BooleanField(default=False)
    preview_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    description = RichTextField(blank=True, null=True)
    order = models.PositiveIntegerField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # custom model manager
    objects = CustomModelManager()

    class Meta:
        db_table = 'project'
        verbose_name = _('Project')
        verbose_name_plural = _('Projects')
        ordering = ['order']
        get_latest_by = "created_at"

    def __str__(self):
        return self.title

    def get_image(self):
        if self.image:
            image_path = settings.MEDIA_ROOT + self.image.url.lstrip("/media/")
        else:
            image_path = get_static_file_path("icons/project.png")
        return image_as_base64(image_path)


@autoSlugFromUUID()
class ProjectMedia(ModelMediaMixin):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="project_media")
    file = models.FileField(upload_to=get_project_media_path)

    class Meta:
        db_table = 'project_media'
        verbose_name = _('Project Media')
        verbose_name_plural = _('Project Media')
        get_latest_by = "created_at"
        order_with_respect_to = 'project'

    def __str__(self):
        return self.project.__str__()


# Signals

@receiver(pre_save, sender=Project)
def generate_order(sender, instance, **kwargs):
    """
    This method will generate order for new instances only.
    Order will be generated automatically like 1, 2, 3, 4 and so on.
    If any order is deleted then it will be reused. Like if 3 is deleted then next created order will be 3 instead of 5.
    """
    if not instance.pk:  # Only generate order for new instances
        if instance.order is None:
            deleted_orders = Project.objects.filter(order__isnull=False).values_list('order', flat=True)
            max_order = Project.objects.aggregate(Max('order')).get('order__max')

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
