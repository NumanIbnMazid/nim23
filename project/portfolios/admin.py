from django.contrib import admin
from django.db import models
from utils.mixins import CustomModelAdminMixin
from portfolios.models import (
    ProfessionalExperience,
)
from ckeditor.widgets import CKEditorWidget


# ----------------------------------------------------
# *** Professional Experience ***
# ----------------------------------------------------

class ProfessionalExperienceAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget},
    }
    class Meta:
        model = ProfessionalExperience


admin.site.register(ProfessionalExperience, ProfessionalExperienceAdmin)
