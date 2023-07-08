from config.router import router
from portfolios.api.educations.views import EducationViewset


router.register("educations", EducationViewset, basename="educations")
