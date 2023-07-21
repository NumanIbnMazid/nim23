from django.db import models
from utils.snippets import autoSlugFromUUID
from django.utils.translation import gettext_lazy as _


""" *************** Newsletter Subscription *************** """

@autoSlugFromUUID()
class NewsletterSubscription(models.Model):
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'newsletter_subscription'
        verbose_name = _('Newsletter Subscription')
        verbose_name_plural = _('Newsletter Subscriptions')
        ordering = ('-created_at',)
        get_latest_by = "created_at"

    def __str__(self):
        return self.email
