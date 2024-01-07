from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import pre_save
from django.db.models import Max
from django.utils.translation import gettext_lazy as _
from utils.mixins import ModelMediaMixin, DurationMixin
from utils.snippets import autoslugFromField, autoSlugFromUUID, image_as_base64, get_static_file_path
from utils.image_upload_helpers import (
    get_professional_experience_company_image_path, get_skill_image_path,
    get_education_school_image_path, get_education_media_path,
    get_certification_image_path, get_certification_media_path, get_project_image_path, get_project_media_path,
    get_interest_image_path, get_movie_image_path
)


""" *************** Professional Experience *************** """


@autoslugFromField(fieldname="company")
class ProfessionalExperience(models.Model, DurationMixin):
    """
    Professional Experience model.
    Details: Includes Job Experiences and other professional experiences.
    """
    class JobType(models.TextChoices):
        FULL_TIME = 'Full Time', _('Full Time')
        PART_TIME = 'Part Time', _('Part Time')
        CONTRACTUAL = 'Contractual', _('Contractual')

    class JobLocationType(models.TextChoices):
        ONSITE = 'Onsite', _('Onsite')
        REMOTE = 'Remote', _('Remote')
        HYBRID = 'Hybrid', _('Hybrid')

    company = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    company_image = models.ImageField(upload_to=get_professional_experience_company_image_path, blank=True, null=True)
    company_url = models.URLField(blank=True, null=True)
    address = models.CharField(max_length=254, blank=True, null=True)
    designation = models.CharField(max_length=150)
    job_type = models.CharField(max_length=20, choices=JobType.choices, default=JobType.FULL_TIME)
    job_location_type = models.CharField(max_length=20, choices=JobLocationType.choices, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    present = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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


@autoslugFromField(fieldname="title")
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
    level = models.CharField(max_length=2, choices=Level.choices, default=None, blank=True, null=True)
    order = models.PositiveIntegerField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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
def generate_skill_order(sender, instance, **kwargs):
    """
    This method will generate order for new instances only.
    Order will be generated automatically like 1, 2, 3, 4 and so on.
    If any order is deleted then it will be reused. Like if 3 is deleted then next created order
    will be 3 instead of 5.
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


@autoslugFromField(fieldname="school")
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


@autoslugFromField(fieldname="title")
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


@autoslugFromField(fieldname="title")
class Project(models.Model, DurationMixin):
    title = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    image = models.ImageField(upload_to=get_project_image_path, blank=True, null=True)
    short_description = models.CharField(max_length=254)
    technology = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    present = models.BooleanField(default=False)
    preview_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'project'
        verbose_name = _('Project')
        verbose_name_plural = _('Projects')
        ordering = ('order', '-created_at')
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
def generate_project_order(sender, instance, **kwargs):
    """
    This method will generate order for new instances only.
    Order will be generated automatically like 1, 2, 3, 4 and so on.
    If any order is deleted then it will be reused. Like if 3 is deleted then next created order
    will be 3 instead of 5.
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


""" *************** Interest *************** """


@autoslugFromField(fieldname="title")
class Interest(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    icon = models.ImageField(upload_to=get_interest_image_path, blank=True, null=True)
    order = models.PositiveIntegerField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'interest'
        verbose_name = _('Interest')
        verbose_name_plural = _('Interests')
        ordering = ('order', '-created_at')
        get_latest_by = "created_at"

    def __str__(self):
        return self.title

    def get_icon(self):
        if self.icon:
            icon_path = settings.MEDIA_ROOT + self.icon.url.lstrip("/media/")
        else:
            icon_path = get_static_file_path("icons/interest.png")
        return image_as_base64(icon_path)


# Signals

@receiver(pre_save, sender=Interest)
def generate_interest_order(sender, instance, **kwargs):
    """
    This method will generate order for new instances only.
    Order will be generated automatically like 1, 2, 3, 4 and so on.
    If any order is deleted then it will be reused. Like if 3 is deleted then next created order
    will be 3 instead of 5.
    """
    if not instance.pk:  # Only generate order for new instances
        if instance.order is None:
            deleted_orders = Interest.objects.filter(order__isnull=False).values_list('order', flat=True)
            max_order = Interest.objects.aggregate(Max('order')).get('order__max')

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


""" *************** Movie *************** """


@autoslugFromField(fieldname="name")
class Movie(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    image = models.ImageField(upload_to=get_movie_image_path, blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    year = models.PositiveIntegerField(blank=True, null=True)
    watched = models.BooleanField(default=True)
    rating = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'movie'
        verbose_name = _('Movie')
        verbose_name_plural = _('Movies')
        ordering = ('-updated_at',)
        get_latest_by = "created_at"

    def __str__(self):
        return self.name

    def get_image(self):
        if self.image:
            image_path = settings.MEDIA_ROOT + self.image.url.lstrip("/media/")
        else:
            image_path = get_static_file_path("icons/movie.png")
        return image_as_base64(image_path)
