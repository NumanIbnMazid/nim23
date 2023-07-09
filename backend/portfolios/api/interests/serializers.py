from rest_framework import serializers
from portfolios.models import Interest


class InterestSerializer(serializers.ModelSerializer):
    icon = serializers.SerializerMethodField()

    class Meta:
        model = Interest
        fields = "__all__"
        read_only_fields = ("id", "slug", "created_at", "updated_at")

    def get_icon(self, obj):
        return obj.get_icon()
