from rest_framework import permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from utils.helpers import custom_response_wrapper
from portfolios.models import Project
from portfolios.api.projects.serializers import ProjectSerializer


@custom_response_wrapper
class ProjectViewset(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'slug'
