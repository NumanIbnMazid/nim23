from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model


class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "email",
                    "username",
                    "password",
                    "slug",
                    "is_portfolio_user",
                    "name",
                    "nickname",
                    "gender",
                    "image",
                    "dob",
                    "website",
                    "contact",
                    "contact_email",
                    "linkedin",
                    "github",
                    "resume_link",
                    "address",
                    "about",
                    "last_login",
                    "updated_at",
                    "date_joined",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "password1", "password2")}),
    )

    list_display = (
        "id",
        "email",
        "username",
        "is_portfolio_user",
        "slug",
        "get_dynamic_username",
        "name",
        "is_staff",
        "is_superuser",
        "date_joined",
    )
    list_filter = ("is_staff", "is_superuser", "is_active", "is_portfolio_user", "groups")
    search_fields = ("email", "username")
    readonly_fields = (
        "updated_at",
        "date_joined",
    )
    ordering = ("-date_joined",)
    filter_horizontal = (
        "groups",
        "user_permissions",
    )


admin.site.register(get_user_model(), UserAdmin)
