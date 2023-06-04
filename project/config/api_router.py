from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter
from users.api.views import LoginView
from knox import views as knox_views
from .views import ExampleView


if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("example", ExampleView, basename="example")


app_name = "api"
urlpatterns = router.urls
