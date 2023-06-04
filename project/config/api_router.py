from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter
from .views import ExampleView
from .router import router
from users.api.routers import *


router.register("example", ExampleView, basename="example")

app_name = "api"
urlpatterns = router.urls
