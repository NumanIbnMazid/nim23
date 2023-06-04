from knox.auth import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet
from django.views.generic import TemplateView
from utils.helpers import custom_response_wrapper
from rest_framework.response import Response


class IndexView(TemplateView):
    template_name = "index.html"


@custom_response_wrapper
class ExampleView(ViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def list(self, request):
        # return ResponseWrapper({"Demo": "Hello, world! This is LIST action"})
        return Response({"Demo": "Hello, world! This is LIST action"})

    def create(self, request):
        return Response({"Demo": "Hello, world! This is CREATE action"})

    def retrieve(self, request, pk=None):
        return Response({"Demo": "Hello, world! This is RETRIEVE action"})

    def update(self, request, pk=None):
        return Response({"Demo": "Hello, world! This is UPDATE action"})

    def partial_update(self, request, pk=None):
        return Response({"Demo": "Hello, world! This is PARTIAL UPDATE action"})

    def destroy(self, request, pk=None):
        return Response({"Demo": "Hello, world! This is DESTROY action"})
