from rest_framework import permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from utils.helpers import custom_response_wrapper
from code_snippets.models import CodeSnippet
from code_snippets.api.serializers import CodeSnippetSerializer


@custom_response_wrapper
class CodeSnippetViewset(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = CodeSnippet.objects.all()
    serializer_class = CodeSnippetSerializer
    lookup_field = 'slug'
