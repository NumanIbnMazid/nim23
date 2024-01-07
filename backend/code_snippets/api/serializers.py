from rest_framework import serializers
from code_snippets.models import CodeSnippet, CodeSnippetComment, CodeSnippetView


class CodeSnippetSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    total_views = serializers.IntegerField(read_only=True, source='views_count')
    total_likes = serializers.IntegerField(read_only=True, source='views_likes_sum')
    user_liked = serializers.SerializerMethodField()

    class Meta:
        model = CodeSnippet
        fields = "__all__"
        read_only_fields = ("id", "slug", "created_at", "updated_at")

    def get_image(self, obj):
        return obj.get_image()

    def get_user_liked(self, obj):
        clientID = self.context['request'].headers.get('ClientID', None)
        if clientID:
            code_snippet_view = obj.views.filter(clientID__iexact=clientID).first()
            if code_snippet_view:
                return code_snippet_view.liked
        return False


class CodeSnippetCommentSerializer(serializers.ModelSerializer):
    timestamp = serializers.SerializerMethodField()

    class Meta:
        model = CodeSnippetComment
        fields = ("name", "email", "comment", "timestamp")
        read_only_fields = ("id", "slug", "created_at", "updated_at")

    def get_timestamp(self, obj):
        return obj.get_timestamp()


class CodeSnippetViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSnippetView
        fields = ["clientID"]
        read_only_fields = ("id", "slug", "created_at", "updated_at")
