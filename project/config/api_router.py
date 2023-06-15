from .views import ExampleView
from .router import router
from users.api.routers import *
from portfolios.api.professional_experiences.routers import *


router.register("example", ExampleView, basename="example")

app_name = "api"
urlpatterns = router.urls
