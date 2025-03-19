from django.contrib import admin
from others.models import NewsletterSubscription, UploadedFile
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
    list_display = ('file_name', 'file_type', 'folder_path', 'slug', 'file_url', 'created_at')
    search_fields = ('file_name', 'slug', 'file_type', 'file_url')
    list_filter = ('file_type', 'created_at')
    readonly_fields = ('created_at', )
    ordering = ('-created_at',)

admin.site.register(UploadedFile, UploadedFileAdmin)
