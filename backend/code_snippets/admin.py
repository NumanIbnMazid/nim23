from django.contrib import admin
from django.forms import Textarea
from code_snippets.models import CodeSnippet, CodeSnippetView, CodeSnippetComment
from utils.mixins import CustomModelAdminMixin
from tinymce.widgets import TinyMCE


# ----------------------------------------------------
# *** CodeSnippet ***
# ----------------------------------------------------

class CodeSnippetAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name in ["content", "overview"]:
            kwargs["widget"] = TinyMCE()  # Apply TinyMCE
        elif db_field.name == "content_in_markdown":
            kwargs["widget"] = Textarea(attrs={"cols": 123, "rows": 10})  # Force plain textarea
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    class Meta:
        model = CodeSnippet


admin.site.register(CodeSnippet, CodeSnippetAdmin)


# ----------------------------------------------------
# *** CodeSnippetView ***
# ----------------------------------------------------

class CodeSnippetViewAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    class Meta:
        model = CodeSnippetView


admin.site.register(CodeSnippetView, CodeSnippetViewAdmin)


# ----------------------------------------------------
# *** CodeSnippetComment ***
# ----------------------------------------------------

class CodeSnippetCommentAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    class Meta:
        model = CodeSnippetComment


admin.site.register(CodeSnippetComment, CodeSnippetCommentAdmin)
