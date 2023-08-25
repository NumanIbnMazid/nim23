from django.contrib import admin
from django.db import models
from code_snippets.models import CodeSnippet, CodeSnippetViewIP, CodeSnippetComment
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


# ----------------------------------------------------
# *** CodeSnippetViewIP ***
# ----------------------------------------------------

class CodeSnippetViewIPAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    class Meta:
        model = CodeSnippetViewIP


admin.site.register(CodeSnippetViewIP, CodeSnippetViewIPAdmin)


# ----------------------------------------------------
# *** CodeSnippetComment ***
# ----------------------------------------------------

class CodeSnippetCommentAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    class Meta:
        model = CodeSnippetComment


admin.site.register(CodeSnippetComment, CodeSnippetCommentAdmin)
