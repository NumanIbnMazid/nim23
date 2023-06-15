from utils.helpers import custom_response_wrapper, ProjectGenericModelViewset
from portfolios.models import (
    ProfessionalExperience,
)
from portfolios.api.professional_experiences.serializers import (
    ProfessionalExperienceSerializer
)


@custom_response_wrapper
class ProfessionalExperienceViewset(ProjectGenericModelViewset):
    queryset = ProfessionalExperience.objects.all()
    serializer_class = ProfessionalExperienceSerializer
