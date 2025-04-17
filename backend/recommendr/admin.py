from django.contrib import admin
from recommendr.models import RecommendrUtils

# ----------------------------------------------------
# *** RecommendrUtils ***
# ----------------------------------------------------


@admin.register(RecommendrUtils)
class RecommendrUtilsAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "system_prompt", "created_at", "updated_at")

    def has_add_permission(self, request):
        # Prevent adding new entries if one already exists
        if RecommendrUtils.objects.count() >= 1:
            return False
        return super().has_add_permission(request)
