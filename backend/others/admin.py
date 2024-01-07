from django.contrib import admin
from others.models import NewsletterSubscription
from utils.mixins import CustomModelAdminMixin


# ----------------------------------------------------
# *** NewsletterSubscription ***
# ----------------------------------------------------

class NewsletterSubscriptionAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    class Meta:
        model = NewsletterSubscription

admin.site.register(NewsletterSubscription, NewsletterSubscriptionAdmin)
