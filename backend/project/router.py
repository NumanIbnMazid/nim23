from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

router = None

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()
