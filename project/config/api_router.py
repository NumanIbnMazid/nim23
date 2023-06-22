from .router import router
from users.api.routers import *
from portfolios.api.professional_experiences.routers import *
from portfolios.api.skills.routers import *
from portfolios.api.educations.routers import *
from portfolios.api.certifications.routers import *
from portfolios.api.projects.routers import *


app_name = "api"
urlpatterns = router.urls
