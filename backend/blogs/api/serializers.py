from rest_framework import serializers
from blogs.models import Blog, BlogCategory


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = "__all__"


class BlogSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer()
    image = serializers.SerializerMethodField()
    reading_time = serializers.SerializerMethodField()
    total_words = serializers.SerializerMethodField()
    table_of_contents = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = "__all__"
        read_only_fields = ("id", "slug", "created_at", "updated_at")

    def get_image(self, obj):
        return obj.get_image()

    def get_reading_time(self, obj):
        return obj.get_reading_time()

    def get_total_words(self, obj):
        return obj.get_total_words()

    def get_table_of_contents(self, obj):
        return obj.get_table_of_contents()