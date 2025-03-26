from django.contrib import admin
from django.forms import Textarea
from blogs.models import BlogCategory, BlogSubCategory, Blog, BlogView, BlogComment
from utils.mixins import CustomModelAdminMixin
from tinymce.widgets import TinyMCE


# ----------------------------------------------------
# *** BlogCategory ***
# ----------------------------------------------------

class BlogCategoryAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    class Meta:
        model = BlogCategory


admin.site.register(BlogCategory, BlogCategoryAdmin)


# ----------------------------------------------------
# *** BlogSubCategory ***
# ----------------------------------------------------

class BlogSubCategoryAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    class Meta:
        model = BlogSubCategory


admin.site.register(BlogSubCategory, BlogSubCategoryAdmin)


# ----------------------------------------------------
# *** Blog ***
# ----------------------------------------------------

class BlogAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'category', 'sub_category', 'image', 'slug', 'overview', 'tags', 'status', 'order', 
        #'get_table_of_contents'
    )

    # def get_table_of_contents(self, obj):
    #     return obj.get_table_of_contents()
    
    # get_table_of_contents.short_description = 'Table of Contents'

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name in ["content", "overview"]:
            kwargs["widget"] = TinyMCE()  # Apply TinyMCE
        elif db_field.name == "content_in_markdown":
            kwargs["widget"] = Textarea(attrs={"cols": 123, "rows": 10})  # Force plain textarea
        return super().formfield_for_dbfield(db_field, request, **kwargs)


admin.site.register(Blog, BlogAdmin)


# ----------------------------------------------------
# *** BlogView ***
# ----------------------------------------------------

class BlogViewAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    class Meta:
        model = BlogView


admin.site.register(BlogView, BlogViewAdmin)


# ----------------------------------------------------
# *** BlogComment ***
# ----------------------------------------------------

class BlogCommentAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    class Meta:
        model = BlogComment


admin.site.register(BlogComment, BlogCommentAdmin)
