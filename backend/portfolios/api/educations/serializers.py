from rest_framework import serializers
from portfolios.models import Education, EducationMedia


class EducationMediaSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()
    class Meta:
        model = EducationMedia
        fields = ("id", "title", "slug", "file", "description")
        read_only_fields = ("id", "slug")

    def get_file(self, obj):
        return obj.get_file()


class EducationSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    education_media = EducationMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Education
        fields = "__all__"
        read_only_fields = ("id", "slug", "created_at", "updated_at")

    def get_image(self, obj):
        return obj.get_image()

    def get_duration(self, obj):
        return obj.get_duration()
