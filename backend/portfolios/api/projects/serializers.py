from rest_framework import serializers
from portfolios.models import Project, ProjectMedia


class ProjectMediaMediaSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()
    class Meta:
        model = ProjectMedia
        fields = ("id", "title", "slug", "file", "description")
        read_only_fields = ("id", "slug")

    def get_file(self, obj):
        return obj.get_file()


class ProjectSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    duration_in_days = serializers.SerializerMethodField()
    project_media = ProjectMediaMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = ("id", "slug", "created_at", "updated_at")

    def get_image(self, obj):
        return obj.get_image()

    def get_duration(self, obj):
        return obj.get_duration()

    def get_duration_in_days(self, obj):
        return obj.get_duration_in_days()
