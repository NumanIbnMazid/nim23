from project.router import router
from portfolios.api.professional_experiences.views import ProfessionalExperienceViewset


router.register("professional-experiences", ProfessionalExperienceViewset, basename="professional_experiences")
