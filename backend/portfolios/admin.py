from django.contrib import admin
from django.db import models
from utils.mixins import CustomModelAdminMixin
from portfolios.models import (
    ProfessionalExperience, Skill, Education, EducationMedia, Certification, CertificationMedia, Project, ProjectMedia, Interest, Movie
)
from tinymce.widgets import TinyMCE


# ----------------------------------------------------
# *** Professional Experience ***
# ----------------------------------------------------

class ProfessionalExperienceAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    formfield_overrides = {
        models.TextField: {'widget': TinyMCE()},
    }
    class Meta:
        model = ProfessionalExperience

admin.site.register(ProfessionalExperience, ProfessionalExperienceAdmin)


# ----------------------------------------------------
# *** Skill ***
# ----------------------------------------------------

class SkillAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    class Meta:
        model = Skill

admin.site.register(Skill, SkillAdmin)


# ----------------------------------------------------
# *** Education ***
# ----------------------------------------------------

class EducationMediaAdmin(admin.StackedInline):
    model = EducationMedia


class EducationAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    inlines = [EducationMediaAdmin]

    class Meta:
        model = Education

admin.site.register(Education, EducationAdmin)


# ----------------------------------------------------
# *** Certification ***
# ----------------------------------------------------

class CertificationMediaAdmin(admin.StackedInline):
    model = CertificationMedia


class CertificationAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    inlines = [CertificationMediaAdmin]

    class Meta:
        model = Certification

admin.site.register(Certification, CertificationAdmin)


# ----------------------------------------------------
# *** Project ***
# ----------------------------------------------------

class ProjectMediaAdmin(admin.StackedInline):
    model = ProjectMedia


class ProjectAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    inlines = [ProjectMediaAdmin]
    formfield_overrides = {
        models.TextField: {'widget': TinyMCE()},
    }

    class Meta:
        model = Project

admin.site.register(Project, ProjectAdmin)


# ----------------------------------------------------
# *** Interest ***
# ----------------------------------------------------

class InterestAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    class Meta:
        model = Interest

admin.site.register(Interest, InterestAdmin)


# ----------------------------------------------------
# *** Movie ***
# ----------------------------------------------------

class MovieAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    class Meta:
        model = Movie

admin.site.register(Movie, MovieAdmin)
