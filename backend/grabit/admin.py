from django.contrib import admin
from grabit.models import DownloadRequest


# ----------------------------------------------------
# *** DownloadRequest ***
# ----------------------------------------------------

class DownloadRequestAdmin(admin.ModelAdmin):
    list_display = (
        'url', 'media_type', 'media_format', 'quality', 'status', 'created_at'
    )

admin.site.register(DownloadRequest, DownloadRequestAdmin)
