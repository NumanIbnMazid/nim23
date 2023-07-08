from config.router import router
from portfolios.api.projects.views import ProjectViewset


router.register("projects", ProjectViewset, basename="projects")
