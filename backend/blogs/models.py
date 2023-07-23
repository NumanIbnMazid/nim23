from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import pre_save
from django.db.models import Max
from utils.snippets import autoslugFromField, autoSlugFromUUID, get_static_file_path, image_as_base64, random_number_generator
from utils.image_upload_helpers import (
    get_blog_image_path,
)
import math
from bs4 import BeautifulSoup
import re


""" *************** Blog Category *************** """


@autoslugFromField(fieldname="name")
class BlogCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'blog_category'
        verbose_name = _('Blog Category')
        verbose_name_plural = _('Blog Categories')
        ordering = ('-created_at',)
        get_latest_by = "created_at"

    def __str__(self):
        return self.name


""" *************** Blog *************** """


@autoslugFromField(fieldname="title")
class Blog(models.Model):
    class Status(models.TextChoices):
        PUBLISHED = 'Published', _('Published')
        DRAFT = 'Draft', _('Draft')
        ARCHIVED = 'Archived', _('Archived')

    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    category = models.ForeignKey(BlogCategory, on_delete=models.CASCADE, related_name='blogs', blank=True, null=True)
    image = models.ImageField(upload_to=get_blog_image_path, blank=True, null=True)
    overview = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField()
    author = models.CharField(max_length=100, default="Numan Ibn Mazid", blank=True)
    tags = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PUBLISHED)
    order = models.PositiveIntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'blog'
        verbose_name = _('Blog')
        verbose_name_plural = _('Blogs')
        ordering = ('order', '-created_at')
        get_latest_by = "created_at"

    def __str__(self):
        return self.title

    def get_image(self):
        if self.image:
            image_path = settings.MEDIA_ROOT + self.image.url.lstrip("/media/")
        else:
            image_path = get_static_file_path("icons/blog.png")
        return image_as_base64(image_path)

    def get_total_words(self):
        content = self.content
        # Remove HTML tags from content
        soup = BeautifulSoup(content, 'html.parser')
        text = soup.get_text(separator=' ')
        word_count = len(text.split())
        return word_count

    def get_reading_time(self):
        words_per_minute = settings.BLOG_WORDS_PER_MINUTE
        total_words = self.get_total_words()
        minutes = math.ceil(total_words / words_per_minute)

        if minutes < 60:
            reading_time = f"{minutes} minute{'s' if minutes > 1 else ''}"
        else:
            hours = minutes // 60
            remaining_minutes = minutes % 60

            if remaining_minutes == 0:
                reading_time = f"{hours} hour{'s' if hours > 1 else ''}"
            else:
                reading_time = f"{hours} hour{'s' if hours > 1 else ''} {remaining_minutes} minute{'s' if remaining_minutes > 1 else ''}"

        return reading_time

    def get_table_of_contents(self):
        content = self.content
        soup = BeautifulSoup(content, 'html.parser')

        # Find all heading elements (h1, h2, h3, etc.)
        headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

        table_of_contents = []

        # Extract the text, level and id of each heading
        for heading in headings:
            text = heading.get_text()
            level = int(heading.name[1])
            match = re.search(r'id="([^"]+)"', str(heading))
            if match:
                heading_id = match.group(1)
                table_of_contents.append({'heading': text, 'level': level, 'id': heading_id})

        return table_of_contents

# Signals

@receiver(pre_save, sender=Blog)
def generate_order(sender, instance, **kwargs):
    """
    This method will generate order for new instances only.
    Order will be generated automatically like 1, 2, 3, 4 and so on.
    If any order is deleted then it will be reused. Like if 3 is deleted then next created order will be 3 instead of 5.
    """
    if not instance.pk:  # Only generate order for new instances
        if instance.order is None:
            deleted_orders = Blog.objects.filter(order__isnull=False).values_list('order', flat=True)
            max_order = Blog.objects.aggregate(Max('order')).get('order__max')

            if deleted_orders:
                deleted_orders = sorted(deleted_orders)
                reused_order = None
                for i in range(1, max_order + 2):
                    if i not in deleted_orders:
                        reused_order = i
                        break
                if reused_order is not None:
                    instance.order = reused_order
            else:
                instance.order = max_order + 1 if max_order is not None else 1


@receiver(pre_save, sender=Blog)
def add_unique_ids_to_content_headings(sender, instance, **kwargs):
    content = instance.content
    soup = BeautifulSoup(content, 'html.parser')

    headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

    for heading in headings:
        heading_id = re.sub(r'\W+', '-', heading.text.lower())
        heading['id'] = heading_id + '-' + random_number_generator(size=3)
        heading_string = str(heading)
        content = content.replace(heading_string, f'<{heading_string} id="{heading_id}">')

    instance.content = str(soup)


""" *************** Blog View IP *************** """


@autoSlugFromUUID()
class BlogViewIP(models.Model):
    ip_address = models.CharField(max_length=255, unique=True)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='view_ips')
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    first_visited_at = models.DateTimeField(auto_now_add=True)
    last_visited_at = models.DateTimeField(auto_now=True)
    liked = models.BooleanField(default=False)

    class Meta:
        db_table = 'blog_view_ip'
        verbose_name = _('Blog View IP')
        verbose_name_plural = _('Blog View IPs')
        ordering = ('-last_visited_at',)
        get_latest_by = "created_at"

    def __str__(self):
        return self.ip_address


""" *************** Blog Comment *************** """


@autoSlugFromUUID()
class BlogComment(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    comment = models.TextField()
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'blog_comment'
        verbose_name = _('Blog Comment')
        verbose_name_plural = _('Blog Comments')
        ordering = ('-created_at',)
        get_latest_by = "created_at"

    def __str__(self):
        return f"{self.name} :- {self.blog.title}"
