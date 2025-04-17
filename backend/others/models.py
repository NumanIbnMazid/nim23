from django.db import models
from utils.snippets import autoSlugFromUUID
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
import cloudinary
import os
from django.utils.text import slugify
from django.db.models.signals import post_delete
from django.dispatch import receiver


""" *************** Newsletter Subscription *************** """


@autoSlugFromUUID()
class NewsletterSubscription(models.Model):
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "newsletter_subscription"
        verbose_name = _("Newsletter Subscription")
        verbose_name_plural = _("Newsletter Subscriptions")
        ordering = ("-created_at",)
        get_latest_by = "created_at"

    def __str__(self):
        return self.email


""" *************** File Upload *************** """


# Utility function to generate unique filenames
def generate_unique_filename(original_name, folder_path, existing_filenames):
    base_name, ext = os.path.splitext(original_name)
    base_name = slugify(base_name)  # Ensure filename is URL-friendly
    unique_name = base_name
    counter = 1

    while unique_name in existing_filenames:
        unique_name = f"{base_name}_{counter}"
        counter += 1

    existing_filenames.add(unique_name)  # Add to used filenames
    return f"{unique_name}{ext}"


@autoSlugFromUUID()
class UploadedFile(models.Model):
    class FileTypes(models.TextChoices):
        IMAGE = "Image", _("Image")
        VIDEO = "Video", _("Video")
        PDF = "PDF", _("PDF")
        OTHER = "Other", _("Other")

    slug = models.SlugField(max_length=255, unique=True, blank=True)
    file = models.FileField(upload_to="temp/")  # Generic file upload field
    file_name = models.CharField(max_length=255, blank=True)
    folder_path = models.CharField(
        max_length=255, help_text="Path within FILE_UPLOADS/", default="default/"
    )
    file_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    file_type = models.CharField(
        max_length=50, choices=FileTypes.choices, default=FileTypes.IMAGE
    )

    class Meta:
        db_table = "uploaded_files"
        verbose_name = _("Uploaded File")
        verbose_name_plural = _("Uploaded Files")
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.file_name} - {self.file_url}"

    def save(self, *args, **kwargs):
        # Auto-generate file name if not provided
        if not self.file_name and self.file:
            existing_filenames = set(
                UploadedFile.objects.filter(folder_path=self.folder_path).values_list(
                    "file_name", flat=True
                )
            )
            base_name, ext = os.path.splitext(self.file.name)  # Separate extension
            self.file_name = generate_unique_filename(
                base_name, self.folder_path, existing_filenames
            )

        # Upload to Cloudinary if file is present
        if self.file:
            # Cloudinary Path (with `media/` prefix)
            cloudinary_folder = (
                f"media/FILE_UPLOADS/{self.folder_path}"  # Ensure `media/` prefix here
            )
            cloudinary_path = f"{self.file_name}"  # Use only file name here, without duplicating the folder

            # Upload the file using Cloudinary's upload method with various parameters
            upload_result = cloudinary.uploader.upload(
                self.file,
                folder=cloudinary_folder,  # Correct folder path for Cloudinary upload
                public_id=cloudinary_path,  # Use custom file name as public_id
                overwrite=True,  # Overwrite if already exists
                resource_type="auto",  # Automatically determine the file type (image, video, pdf, etc.)
                invalidate=True,  # Invalidate cached versions if any
            )

            # Set Cloudinary file URL (correct URL structure)
            self.file_url = upload_result.get("secure_url")

            # Optionally, delete the local file after uploading to Cloudinary if not needed
            self.file.delete(save=False)

        # Call the parent save() method
        super().save(*args, **kwargs)


@receiver(post_delete, sender=UploadedFile)
def delete_file_from_cloudinary(sender, instance, **kwargs):
    """
    Delete file from Cloudinary when the corresponding model instance is deleted.
    """
    if instance.file_url:
        # Extract the public ID by excluding the version number and file extension
        # Example URL: https://res.cloudinary.com/dup7hapnf/image/upload/v1742423176/media/FILE_UPLOADS/default/background.webp
        public_id = "/".join(
            instance.file_url.split("/")[7:]
        )  # This gets the part after "upload/vXXXXXXXX"
        public_id = public_id.rsplit(".", 1)[
            0
        ]  # Remove the file extension (e.g., .webp, .jpg, etc.)

        try:
            # Deleting file from Cloudinary using the public_id (without extension)
            response = cloudinary.uploader.destroy(
                public_id, invalidate=True
            )  # Invalidate cache
            if response.get("result") == "ok":
                print(f"Deleted file {public_id} from Cloudinary")
            else:
                print(f"Failed to delete file {public_id} from Cloudinary: {response}")
        except Exception as e:
            print(f"Error deleting file from Cloudinary: {e}")


""" *************** Humanizer AI Utils *************** """


@autoSlugFromUUID()
class HumanizerAiUtils(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    system_prompt = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "humanizer_ai_utils"
        verbose_name = _("Humanizer AI Utils")
        verbose_name_plural = _("Humanizer AI Utils")
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.title}"

    def clean(self):
        if HumanizerAiUtils.objects.exclude(pk=self.pk).exists():
            raise ValidationError("Only one PromptConfig instance is allowed.")

    def save(self, *args, **kwargs):
        self.full_clean()  # Triggers the `clean` method above
        super().save(*args, **kwargs)
