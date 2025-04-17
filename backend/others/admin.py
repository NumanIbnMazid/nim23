from django.contrib import admin
from others.models import NewsletterSubscription, UploadedFile, HumanizerAiUtils
from utils.mixins import CustomModelAdminMixin


# ----------------------------------------------------
# *** NewsletterSubscription ***
# ----------------------------------------------------


class NewsletterSubscriptionAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    class Meta:
        model = NewsletterSubscription


admin.site.register(NewsletterSubscription, NewsletterSubscriptionAdmin)


# ----------------------------------------------------
# *** UploadedFile ***
# ----------------------------------------------------


class UploadedFileAdmin(admin.ModelAdmin):
    list_display = (
        "file_name",
        "file_type",
        "folder_path",
        "slug",
        "file_url",
        "created_at",
    )
    search_fields = ("file_name", "slug", "file_type", "file_url")
    list_filter = ("file_type", "created_at")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)


admin.site.register(UploadedFile, UploadedFileAdmin)


# ----------------------------------------------------
# *** UploadedFile ***
# ----------------------------------------------------


@admin.register(HumanizerAiUtils)
class PromptConfigAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "system_prompt", "created_at", "updated_at")

    def has_add_permission(self, request):
        # Prevent adding new entries if one already exists
        if HumanizerAiUtils.objects.count() >= 1:
            return False
        return super().has_add_permission(request)
