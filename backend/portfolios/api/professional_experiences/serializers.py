from rest_framework import serializers
from portfolios.models import ProfessionalExperience


class ProfessionalExperienceSerializer(serializers.ModelSerializer):
    company_image = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    duration_in_days = serializers.SerializerMethodField()

    class Meta:
        model = ProfessionalExperience
        fields = "__all__"
        read_only_fields = ("id", "slug", "created_at", "updated_at")

    def get_company_image(self, obj):
        return obj.get_company_image()

    def get_duration(self, obj):
        return obj.get_duration()

    def get_duration_in_days(self, obj):
        return obj.get_duration_in_days()
