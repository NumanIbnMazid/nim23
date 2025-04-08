from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.renderers import JSONRenderer
from rest_framework import permissions
from django.db import models
from django.http import Http404
from django.utils.translation import gettext_lazy as _
from functools import wraps
from utils.snippets import markdown_to_html, html_to_markdown


class ResponseWrapper(Response):
    def __init__(
        self,
        data=None,
        error_code=None,
        content_type=None,
        error_message=None,
        message=None,
        response_success=True,
        status=None,
        data_type=None,
    ):
        """
        Custom response wrapper for standardized API responses.
        """

        status_by_default_for_gz = 200
        if error_code is None and status is not None:
            if status > 299 or status < 200:
                error_code = status
                response_success = False
            else:
                status_by_default_for_gz = status
        if error_code is not None:
            status_by_default_for_gz = error_code
            response_success = False

        # Manipulate dynamic messages
        message_map = {
            "list": ("List retrieved successfully!", "Failed to retrieve the list!"),
            "create": ("Created successfully!", "Failed to create!"),
            "update": ("Updated successfully!", "Failed to update!"),
            "partial_update": ("Updated successfully!", "Failed to update!"),
            "destroy": ("Deleted successfully!", "Failed to delete!"),
            "retrieve": ("Object retrieved successfully!", "Failed to retrieve the object!"),
        }

        if message:
            message = message_map.get(message.lower(), (message, message))[0 if response_success else 1]
        else:
            message = "SUCCESS!" if response_success else "FAILED!"

        output_data = {
            "success": response_success,
            "status_code": error_code if error_code else status_by_default_for_gz,
            "data": data,
            "message": message,
            "error": {"code": error_code, "error_details": error_message},
        }
        if data_type is not None:
            output_data["type"] = data_type

        super().__init__(
            data=output_data, status=status_by_default_for_gz, content_type=content_type
        )


def custom_response_wrapper(viewset_cls):
    """
    Custom decorator to wrap the `finalize_response` method of a ViewSet
    with the ResponseWrapper functionality.
    """
    original_finalize_response = viewset_cls.finalize_response

    @wraps(original_finalize_response)
    def wrapped_finalize_response(self, request, response, *args, **kwargs):
        # Ensure DRF's response attributes exist before wrapping
        if not hasattr(response, 'accepted_renderer'):
            response.accepted_renderer = request.accepted_renderer
            response.accepted_media_type = request.accepted_media_type
            response.renderer_context = {}

        if isinstance(response, ResponseWrapper):
            return response

        # Create wrapped response after DRF has set attributes
        wrapped_response = ResponseWrapper(
            data=response.data, 
            message=self.action, 
            status=response.status_code
        )

        # Preserve DRF-required attributes
        wrapped_response.accepted_renderer = response.accepted_renderer
        wrapped_response.accepted_media_type = response.accepted_media_type
        wrapped_response.renderer_context = response.renderer_context

        return original_finalize_response(self, request, wrapped_response, *args, **kwargs)

    viewset_cls.finalize_response = wrapped_finalize_response
    return viewset_cls


def handle_invalid_serializer(exception_obj, message=None):
    error_messages = []
    for field, errors in exception_obj.detail.items():
        field_errors = [str(error) for error in errors]
        error_messages.append(f"{field}: {' '.join(field_errors)}")

    response_message = " ".join(error_messages)

    return ResponseWrapper(
        message=message,
        error_message=response_message,
        status=400
    )


class CustomModelManager(models.Manager):
    """
    Custom Model Manager
    actions: all(), get_by_id(id), get_by_slug(slug)
    """
    def all(self):
        return self.get_queryset()

    def get_by_id(self, id):
        try:
            return self.get(id=id)
        except self.model.DoesNotExist:
            raise Http404(_("Not Found !!!"))
        except self.model.MultipleObjectsReturned:
            return self.get_queryset().filter(id=id).first()
        except Exception:
            raise Http404(_("Something went wrong !!!"))

    def get_by_slug(self, slug):
        try:
            return self.get(slug=slug)
        except self.model.DoesNotExist:
            raise Http404(_("Not Found !!!"))
        except self.model.MultipleObjectsReturned:
            return self.get_queryset().filter(id=id).first()
        except Exception:
            raise Http404(_("Something went wrong !!!"))


class ProjectGenericModelViewset(ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = None
    lookup_field = "slug"


    def get_queryset(self):
        queryset = super().get_queryset()
        limit = self.request.GET.get('_limit')
        if limit:
            queryset = queryset[:int(limit)]
        return queryset


def sync_markdown_html_fields(instance, markdown_field_name, html_field_name):
    """
    Synchronizes Markdown and HTML fields in a model instance.

    Args:
        instance: The model instance being saved.
        markdown_field_name: The name of the field containing Markdown text.
        html_field_name: The name of the field containing HTML text.
    """
    if instance.pk is None:  # First time creation
        markdown_content = getattr(instance, markdown_field_name)
        html_content = getattr(instance, html_field_name)

        if html_content and not markdown_content:
            setattr(instance, markdown_field_name, html_to_markdown(html_content))
        elif markdown_content and not html_content:
            setattr(instance, html_field_name, markdown_to_html(markdown_content))
    else:  # Updating existing instance
        model_class = instance.__class__  # Dynamically get the model class
        old_instance = model_class.objects.get(pk=instance.pk)  # Access objects using the model class

        markdown_content = getattr(instance, markdown_field_name)
        html_content = getattr(instance, html_field_name)
        old_markdown_content = getattr(old_instance, markdown_field_name)
        old_html_content = getattr(old_instance, html_field_name)


        if old_html_content != html_content:
            # HTML content updated
            setattr(instance, markdown_field_name, html_to_markdown(html_content))
        elif old_markdown_content != markdown_content:
            # Markdown content updated
            setattr(instance, html_field_name, markdown_to_html(markdown_content))
