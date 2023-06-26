from rest_framework import permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin
from utils.helpers import custom_response_wrapper
from portfolios.models import Movie
from portfolios.api.movies.serializers import MovieSerializer


@custom_response_wrapper
class MovieViewset(GenericViewSet, ListModelMixin):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
