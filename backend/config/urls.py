"""Project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from .views import IndexView
from users.api.views import LoginView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from knox import views as knox_views
from django.conf import settings
from filebrowser.sites import site
from django.views import defaults as default_views


# Yet Another Swagger Schema View
schema_view = get_schema_view(
    openapi.Info(
        title="Numan Ibn Mazid's Portfolio API",
        default_version="v1",
        description="API Documentation for Numan Ibn Mazid's Portfolio Project's Backend",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="numanibnmazid@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)


THIRD_PARTY_URLS = [
    # ----------------------------------------------------
    # *** REST FRMAEWORK API URLs ***
    # ----------------------------------------------------
    path("api/", include("config.api_router")),
    # ----------------------------------------------------
    # *** Knox URLs ***
    # ----------------------------------------------------
    # path(r'api/auth/', include('knox.urls')),
    path(r"api/auth/login/", LoginView.as_view(), name="knox_login"),
    path(r"api/auth/logout/", knox_views.LogoutView.as_view(), name="knox_logout"),
    path(
        r"api/auth/logoutall/",
        knox_views.LogoutAllView.as_view(),
        name="knox_logoutall",
    ),
    # ----------------------------------------------------
    # *** Swagger URLs ***
    # ----------------------------------------------------
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    re_path(
        r"^swagger/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),
    # ----------------------------------------------------
    # *** CKEDITOR URLs ***
    # ----------------------------------------------------
    path('ckeditor/', include('ckeditor_uploader.urls')),
    # ----------------------------------------------------
    # *** TinyMCE URLs ***
    # ----------------------------------------------------
    path('tinymce/', include('tinymce.urls')),
]

urlpatterns = [
    # ----------------------------------------------------
    # *** Django Filebrowser URLs (Needs to be placed before Django Admin Urls) ***
    # ----------------------------------------------------
    path('admin/filebrowser/', site.urls),
    path('grappelli/', include('grappelli.urls')),
    # ----------------------------------------------------
    # *** Django Admin URLs ***
    # ----------------------------------------------------
    path("admin/", admin.site.urls),
    # ----------------------------------------------------
    # *** Project URLs ***
    # ----------------------------------------------------
    path("", IndexView.as_view(), name="index"),
] + THIRD_PARTY_URLS


if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see how these error pages look like.
    urlpatterns += [
        path(
            "400/",
            default_views.bad_request,
            kwargs={"exception": Exception("Bad Request!")},
        ),
        path(
            "403/",
            default_views.permission_denied,
            kwargs={"exception": Exception("Permission Denied")},
        ),
        path(
            "404/",
            default_views.page_not_found,
            kwargs={"exception": Exception("Page not Found")},
        ),
        path("500/", default_views.server_error),
    ]
    # if "debug_toolbar" in settings.INSTALLED_APPS:
    #     import debug_toolbar

    #     urlpatterns = [
    #         path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
