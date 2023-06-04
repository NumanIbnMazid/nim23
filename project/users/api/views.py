from rest_framework import permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from django.contrib.auth import login
from drf_yasg.utils import swagger_auto_schema
from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet
from .serializers import UserSerializer
from utils.helpers import custom_response_wrapper
from rest_framework.decorators import action
from rest_framework.response import Response


class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    @swagger_auto_schema(request_body=AuthTokenSerializer)
    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        return super(LoginView, self).post(request, format=None)


@custom_response_wrapper
class UserViewset(ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    pagination_class = None
    lookup_field = "slug"


    @action(detail=False, methods=['get'])
    def get_portfolio_user(self, request):
        user_qs = get_user_model().objects.filter(is_portfolio_user=True)
        if user_qs.exists():
            user = user_qs.first()
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        return Response({"message": "No portfolio user found!"}, status=404)
