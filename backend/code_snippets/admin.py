from django.contrib import admin
from django.db import models
from code_snippets.models import CodeSnippet
from utils.mixins import CustomModelAdminMixin
from tinymce.widgets import TinyMCE


# ----------------------------------------------------
# *** CodeSnippet ***
# ----------------------------------------------------

class CodeSnippetAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    formfield_overrides = {
        models.TextField: {'widget': TinyMCE()},
    }
    class Meta:
        model = CodeSnippet

admin.site.register(CodeSnippet, CodeSnippetAdmin)

