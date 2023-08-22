from rest_framework import serializers
from blogs.models import Blog, BlogCategory, BlogComment, BlogViewIP


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = "__all__"


class BlogSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer()
    image = serializers.SerializerMethodField()
    table_of_contents = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = "__all__"
        read_only_fields = ("id", "slug", "created_at", "updated_at")

    def get_image(self, obj):
        return obj.get_image()

    def get_table_of_contents(self, obj):
        return obj.get_table_of_contents()


class BlogCommentSerializer(serializers.ModelSerializer):
    timestamp = serializers.SerializerMethodField()
    class Meta:
        model = BlogComment
        fields = ("name", "email", "comment", "timestamp")
        read_only_fields = ("id", "slug", "created_at", "updated_at")

    def get_timestamp(self, obj):
        return obj.get_timestamp()


class BlogViewIPSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogViewIP
        fields = ("ip_address",)
        read_only_fields = ("id", "slug", "created_at", "updated_at")
