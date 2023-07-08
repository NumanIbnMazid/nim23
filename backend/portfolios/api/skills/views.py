from rest_framework import permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin
from utils.helpers import custom_response_wrapper
from portfolios.models import Skill
from portfolios.api.skills.serializers import SkillSerializer


@custom_response_wrapper
class SkillViewset(GenericViewSet, ListModelMixin):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
