from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.utils import timezone
from django.http import Http404
from utils.snippets import autoSlugFromUUID, generate_unique_username_from_email
from utils.image_upload_helpers import get_user_image_path
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from utils.snippets import image_as_base64, get_static_file_path


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError(_("Users must have an email address"))
        now = timezone.now()
        email = self.normalize_email(email)
        user = self.model(email=email, last_login=now, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("is_staff", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))

        return self._create_user(email, password, **extra_fields)

    def all(self):
        return self.get_queryset()

    def get_by_id(self, id):
        try:
            instance = self.get_queryset().get(id=id)
        except User.DoesNotExist:
            raise Http404(_("User Not Found!"))
        except User.MultipleObjectsReturned:
            qs = self.get_queryset().filter(id=id)
            instance = qs.first()
        except:
            raise Http404(_("Something went wrong!"))
        return instance

    def get_by_slug(self, slug):
        try:
            instance = self.get_queryset().get(slug=slug)
        except User.DoesNotExist:
            raise Http404(_("User Not Found!"))
        except User.MultipleObjectsReturned:
            qs = self.get_queryset().filter(slug=slug)
            instance = qs.first()
        except:
            raise Http404(_("Something went wrong!"))
        return instance


@autoSlugFromUUID()
class User(AbstractBaseUser, PermissionsMixin):
    class Gender(models.TextChoices):
        MALE = "Male", _("Male")
        FEMALE = "Female", _("Female")
        OTHER = "Other", _("Other")
        UNDEFINED = "Do not mention", _("Do not mention")

    email = models.EmailField(max_length=254, unique=True)
    username = models.CharField(max_length=254, unique=True)
    """ Additional Fields Starts """
    name = models.CharField(max_length=100, null=True, blank=True)
    slug = models.SlugField(unique=True, max_length=254)
    updated_at = models.DateTimeField(auto_now=True)
    # Fields for Portfolio
    nickname = models.CharField(max_length=100, null=True, blank=True)
    gender = models.CharField(
        max_length=20, choices=Gender.choices, blank=True, null=True
    )
    image = models.ImageField(upload_to=get_user_image_path, null=True, blank=True)
    dob = models.DateField(null=True, blank=True, verbose_name=_("date of birth"))
    website = models.URLField(null=True, blank=True)
    contact = models.CharField(max_length=30, null=True, blank=True)
    contact_email = models.EmailField(null=True, blank=True)
    linkedin = models.URLField(null=True, blank=True)
    github = models.URLField(null=True, blank=True)
    address = models.CharField(max_length=254, null=True, blank=True)
    about = models.TextField(null=True, blank=True)
    is_portfolio_user = models.BooleanField(default=False)
    resume_link = models.URLField(null=True, blank=True)
    """ Additional Fields Ends """
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-date_joined"]

    def __str__(self):
        return self.get_dynamic_username()

    def get_dynamic_username(self):
        """Get a dynamic username for a specific user instance. if the user has a name then returns the name,
        if the user does not have a name but has a username then return username, otherwise returns email as username
        """
        if self.name:
            return self.name
        elif self.username:
            return self.username
        return self.email

    def get_user_image(self):
        if self.image:
            image_path = settings.MEDIA_ROOT + self.image.url.lstrip("/media/")
        else:
            if self.gender and self.gender == "Male":
                image_path = get_static_file_path("icons/user/avatar-male.png")
            elif self.gender and self.gender == "Female":
                image_path = get_static_file_path("icons/user/avatar-female.png")
            else:
                image_path = get_static_file_path("icons/user/avatar-default.png")

        if image_path:
            return image_as_base64(image_path)

        return


@receiver(pre_save, sender=User)
def update_username_from_email(sender, instance, **kwargs):
    """Generates and updates username from user email on User pre_save hook"""
    if not instance.pk:
        instance.username = generate_unique_username_from_email(instance=instance)
