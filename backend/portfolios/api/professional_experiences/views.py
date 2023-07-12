from rest_framework import permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin
from utils.helpers import custom_response_wrapper
from portfolios.models import ProfessionalExperience
from portfolios.api.professional_experiences.serializers import ProfessionalExperienceSerializer


@custom_response_wrapper
class ProfessionalExperienceViewset(GenericViewSet, ListModelMixin):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = ProfessionalExperience.objects.all()
    serializer_class = ProfessionalExperienceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        limit = self.request.query_params.get('_limit')

        if limit:
            try:
                limit = int(limit)
                queryset = queryset[:limit]
            except ValueError:
                pass

        return queryset
