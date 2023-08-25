from django.contrib import admin
from django.db import models
from blogs.models import BlogCategory, Blog, BlogViewIP, BlogComment
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
# *** Blog ***
# ----------------------------------------------------

class BlogAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.TextField: {'widget': TinyMCE()},
    }

    list_display = (
        'title', 'category', 'image', 'overview', 'author', 'tags', 'status', 'order', 'get_table_of_contents'
    )

    def get_table_of_contents(self, obj):
        return obj.get_table_of_contents()

    get_table_of_contents.short_description = 'Table of Contents'

    class Meta:
        model = Blog


admin.site.register(Blog, BlogAdmin)


# ----------------------------------------------------
# *** BlogViewIP ***
# ----------------------------------------------------

class BlogViewIPAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    class Meta:
        model = BlogViewIP


admin.site.register(BlogViewIP, BlogViewIPAdmin)


# ----------------------------------------------------
# *** BlogComment ***
# ----------------------------------------------------

class BlogCommentAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    class Meta:
        model = BlogComment


admin.site.register(BlogComment, BlogCommentAdmin)
