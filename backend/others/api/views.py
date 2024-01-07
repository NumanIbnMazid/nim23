from rest_framework import permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin
from utils.helpers import ResponseWrapper, handle_invalid_serializer
from others.api.serializers import NewsletterSubscriptionSerializer


class NewsletterSubscriptionViewset(GenericViewSet, CreateModelMixin):
    permission_classes = (permissions.AllowAny,)
    serializer_class = NewsletterSubscriptionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return handle_invalid_serializer(e, message="Failed to subscribe nim23's newsletter.")

        self.perform_create(serializer)

        return ResponseWrapper(
            data=serializer.data,
            message="You have successfully subscribed to nim23's newsletter."
        )
