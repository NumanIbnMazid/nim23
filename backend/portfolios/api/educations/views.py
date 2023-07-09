from rest_framework import permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin
from utils.helpers import custom_response_wrapper
from portfolios.models import Education
from portfolios.api.educations.serializers import EducationSerializer


@custom_response_wrapper
class EducationViewset(GenericViewSet, ListModelMixin):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
