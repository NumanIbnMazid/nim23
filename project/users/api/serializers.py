from rest_framework import serializers
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = [
            "id",
            "username",
            "email",
            "name",
            "slug",
            "nick_name",
            "gender",
            "image",
            "dob",
            "website",
            "contact",
            "contact_email",
            "address",
            "about",
            "is_portfolio_user",
            "is_active",
            "is_staff",
            "is_superuser",
            "date_joined",
            "last_login",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "username",
            "is_active",
            "slug",
            "updated_at",
            "is_staff",
            "is_superuser",
            "date_joined",
            "last_login",
        ]

    def get_image(self, obj):
        return obj.get_user_image()
