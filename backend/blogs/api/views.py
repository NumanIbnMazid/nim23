from rest_framework import permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from utils.helpers import custom_response_wrapper
from blogs.models import Blog
from blogs.api.serializers import BlogSerializer


@custom_response_wrapper
class BlogViewset(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Blog.objects.filter(status="Published")
