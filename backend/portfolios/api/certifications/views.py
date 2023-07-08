from rest_framework import permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin
from utils.helpers import custom_response_wrapper
from portfolios.models import Certification
from portfolios.api.certifications.serializers import CertificationSerializer


@custom_response_wrapper
class CertificationViewset(GenericViewSet, ListModelMixin):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer
