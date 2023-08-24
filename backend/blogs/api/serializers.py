from rest_framework import serializers
from blogs.models import Blog, BlogCategory, BlogComment, BlogViewIP
from utils.snippets import get_client_ip


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = "__all__"


class BlogSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer()
    image = serializers.SerializerMethodField()
    table_of_contents = serializers.SerializerMethodField()
    total_views = serializers.IntegerField(read_only=True, source='view_ips_count')
    total_likes = serializers.IntegerField(read_only=True, source='view_ips_likes_sum')
    user_liked = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = "__all__"
        read_only_fields = ("id", "slug", "created_at", "updated_at")

    def get_image(self, obj):
        return obj.get_image()

    def get_table_of_contents(self, obj):
        return obj.get_table_of_contents()

    def get_user_liked(self, obj):
        user_ip = get_client_ip(self.context['request'])
        blog_view_ip = obj.view_ips.filter(ip_address=user_ip).first()
        if blog_view_ip:
            return blog_view_ip.liked
        return False


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
        fields = []
        read_only_fields = ("id", "slug", "created_at", "updated_at")
