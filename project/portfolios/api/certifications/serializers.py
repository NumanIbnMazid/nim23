from rest_framework import serializers
from portfolios.models import Certification, CertificationMedia


class CertificationMediaSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()
    class Meta:
        model = CertificationMedia
        fields = ("id", "title", "slug", "file", "description")
        read_only_fields = ("id", "slug")

    def get_file(self, obj):
        return obj.get_file()


class CertificationSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    certification_media = CertificationMediaSerializer(many=True, read_only=True)
    issue_date = serializers.SerializerMethodField()
    expiration_date = serializers.SerializerMethodField()

    class Meta:
        model = Certification
        fields = "__all__"
        read_only_fields = ("id", "slug", "created_at", "updated_at")

    def get_image(self, obj):
        return obj.get_image()

    def get_issue_date(self, obj):
        return obj.get_issue_date()

    def get_expiration_date(self, obj):
        return obj.get_expiration_date()
