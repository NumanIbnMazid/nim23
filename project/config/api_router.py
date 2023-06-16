from .router import router
from users.api.routers import *
from portfolios.api.professional_experiences.routers import *
from portfolios.api.skills.routers import *


app_name = "api"
urlpatterns = router.urls
