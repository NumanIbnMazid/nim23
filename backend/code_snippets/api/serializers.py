from rest_framework import serializers
from code_snippets.models import CodeSnippet, CodeSnippetComment, CodeSnippetViewIP


class CodeSnippetSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = CodeSnippet
        fields = "__all__"
        read_only_fields = ("id", "slug", "created_at", "updated_at")

    def get_image(self, obj):
        return obj.get_image()


class CodeSnippetCommentSerializer(serializers.ModelSerializer):
    timestamp = serializers.SerializerMethodField()

    class Meta:
        model = CodeSnippetComment
        fields = ("name", "email", "comment", "timestamp")
        read_only_fields = ("id", "slug", "created_at", "updated_at")

    def get_timestamp(self, obj):
        return obj.get_timestamp()


class CodeSnippetViewIPSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSnippetViewIP
        fields = []
        read_only_fields = ("id", "slug", "created_at", "updated_at")
