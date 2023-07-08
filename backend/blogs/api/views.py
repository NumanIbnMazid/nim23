from rest_framework import permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from utils.helpers import custom_response_wrapper
from blogs.models import Blog
from blogs.api.serializers import BlogSerializer


@custom_response_wrapper
class BlogViewset(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Blog.objects.filter(status="Published")
    serializer_class = BlogSerializer
    lookup_field = 'slug'

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
