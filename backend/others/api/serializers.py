from rest_framework import serializers
from others.models import NewsletterSubscription


class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscription
        fields = "__all__"
        read_only_fields = ("id", "slug", "created_at")
