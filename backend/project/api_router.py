from .router import router
# Users
from users.api.routers import *
# Portfolios
from portfolios.api.professional_experiences.routers import *
from portfolios.api.skills.routers import *
from portfolios.api.educations.routers import *
from portfolios.api.certifications.routers import *
from portfolios.api.projects.routers import *
from portfolios.api.interests.routers import *
from portfolios.api.movies.routers import *
# Code Snippets
from code_snippets.api.routers import *
# Blogs
from blogs.api.routers import *
# Others
# Newsletter
from others.api.routers import *

# ----------------------------------------------------
# *** Grabit ***
# ----------------------------------------------------
from grabit.api.routers import *

# ----------------------------------------------------
# *** humanizer AI ***
# ----------------------------------------------------
from humanizer_ai.api.routers import *

# ----------------------------------------------------
# *** AI Text Detector ***
# ----------------------------------------------------
from detect_ai.api.routers import *


app_name = "nim23_backend_api"
urlpatterns = router.urls
