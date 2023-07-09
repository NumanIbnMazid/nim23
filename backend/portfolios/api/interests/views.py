from rest_framework import permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin
from utils.helpers import custom_response_wrapper
from portfolios.models import Interest
from portfolios.api.interests.serializers import InterestSerializer


@custom_response_wrapper
class InterestViewset(GenericViewSet, ListModelMixin):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer
