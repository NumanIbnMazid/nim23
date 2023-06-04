from django.shortcuts import render
from knox.auth import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet
from utils.helpers import ResponseWrapper
from django.views.generic import TemplateView


class IndexView(TemplateView):
    template_name = "index.html"


class ExampleView(ViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def list(self, request):
        return ResponseWrapper({"Demo": "Hello, world! This is LIST action"})

    def create(self, request):
        return ResponseWrapper({"Demo": "Hello, world! This is CREATE action"})

    def retrieve(self, request, pk=None):
        return ResponseWrapper({"Demo": "Hello, world! This is RETRIEVE action"})

    def update(self, request, pk=None):
        return ResponseWrapper({"Demo": "Hello, world! This is UPDATE action"})

    def partial_update(self, request, pk=None):
        return ResponseWrapper({"Demo": "Hello, world! This is PARTIAL UPDATE action"})

    def destroy(self, request, pk=None):
        return ResponseWrapper({"Demo": "Hello, world! This is DESTROY action"})
