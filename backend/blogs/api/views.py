from rest_framework import permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Count, Sum, Case, When, IntegerField
from utils.helpers import custom_response_wrapper, ResponseWrapper, handle_invalid_serializer
from utils.snippets import get_client_ip
from blogs.models import Blog, BlogComment, BlogViewIP
from blogs.api.serializers import BlogSerializer, BlogCommentSerializer, BlogViewIPSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


@custom_response_wrapper
class BlogViewset(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Blog.objects.filter(status="Published")
    serializer_class = BlogSerializer
    lookup_field = 'slug'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.annotate(
            view_ips_count=Count('view_ips'),
            view_ips_likes_sum=Sum(
                Case(
                    When(view_ips__liked=True, then=1),
                    default=0,
                    output_field=IntegerField()
                )
            )
        )

        # NOTE: When use the `annotate` method to add extra fields to queryset,
        # it might override the existing ordering specified in the model's `Meta` class.
        # So explicitly Chain the `order_by` method to maintain ordering
        queryset = queryset.order_by('-order', '-created_at')

        limit = self.request.query_params.get('_limit')

        if limit:
            try:
                limit = int(limit)
                queryset = queryset[:limit]
            except ValueError:
                pass

        return queryset


@custom_response_wrapper
class BlogCommentViewset(GenericViewSet, CreateModelMixin, ListModelMixin):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BlogCommentSerializer
    lookup_field = 'slug'

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('slug', openapi.IN_QUERY, description='Slug of the blog', type=openapi.TYPE_STRING)
        ]
    )
    def list(self, request, *args, **kwargs):
        slug = request.query_params.get('slug')
        queryset = BlogComment.objects.filter(blog__slug=slug, is_approved=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(data=serializer.data, status=200)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('slug', openapi.IN_QUERY, description='Slug of the blog', type=openapi.TYPE_STRING)
        ]
    )
    def create(self, request, *args, **kwargs):
        slug = request.query_params.get('slug')
        blog = get_object_or_404(Blog, slug=slug)

        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return handle_invalid_serializer(e, message="Failed to place comment! Please try again letter.")

        # Add the blog to the validated data
        serializer.validated_data['blog'] = blog

        try:
            self.perform_create(serializer)
        except Exception as e:
            return ResponseWrapper(data=serializer.data, message="Failed to add comment!", error_message=str(e), status=400)

        return Response(data=serializer.data, status=200)


class BlogViewIPViewset(GenericViewSet, CreateModelMixin):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BlogViewIPSerializer
    lookup_field = 'slug'

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('slug', openapi.IN_QUERY, description='Slug of the blog', type=openapi.TYPE_STRING)
        ]
    )
    def create(self, request, *args, **kwargs):
        slug = request.query_params.get('slug')
        blog = get_object_or_404(Blog, slug=slug)
        ip_address = get_client_ip(request)

        existing_record_qs = BlogViewIP.objects.filter(blog=blog, ip_address__iexact=ip_address)
        if existing_record_qs.exists():
            existing_record = existing_record_qs.first()
            existing_record.last_visited_at = timezone.now()
            existing_record.save()

            total_qs = BlogViewIP.objects.filter(blog__slug=slug)

            return ResponseWrapper(
                data={
                    "total_views": total_qs.count(),
                    "total_likes": total_qs.filter(liked=True).count(),
                    "liked": existing_record.liked,
                    "last_visit": existing_record.last_visited_at.strftime("%Y-%m-%d %H:%M:%S")
                },
                message="Existing record updated!", status=200
            )

        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return handle_invalid_serializer(e, message="Failed to add ip.")

        # Add the blog and ip address to the validated data
        serializer.validated_data['blog'] = blog
        serializer.validated_data['ip_address'] = ip_address

        try:
            self.perform_create(serializer)
        except Exception as e:
            return ResponseWrapper(data=serializer.data, message="Failed to add ip.", error_message=str(e), status=400)

        total_qs = BlogViewIP.objects.filter(blog__slug=slug)

        return ResponseWrapper(
            data={
                "total_views": total_qs.count(),
                "total_likes": total_qs.filter(liked=True).count(),
                "liked": False,
                "last_visit": timezone.now().strftime("%Y-%m-%d %H:%M:%S")
            },
            message="New record created!", status=200
        )

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('slug', openapi.IN_QUERY, description='Slug of the blog', type=openapi.TYPE_STRING)
        ]
    )
    @action(detail=False, methods=['get'], url_path='total-views')
    def total_views(self, request):
        slug = request.query_params.get('slug')
        total_views = BlogViewIP.objects.filter(blog__slug=slug).count()
        return ResponseWrapper(data={"total_views": total_views})

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('slug', openapi.IN_QUERY, description='Slug of the blog', type=openapi.TYPE_STRING)
        ]
    )
    @action(detail=False, methods=['post'])
    def like(self, request):
        ip_address = get_client_ip(request)
        slug = request.query_params.get('slug')
        blog_view = get_object_or_404(BlogViewIP, ip_address=ip_address, blog__slug=slug)
        blog_view.liked = not blog_view.liked  # Toggle the liked field
        blog_view.save()

        if blog_view.liked:
            message = "Added a like!"
        else:
            message = "Removed like!"
        return ResponseWrapper(data={"liked": blog_view.liked}, message=message, status=200)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('slug', openapi.IN_QUERY, description='Slug of the blog', type=openapi.TYPE_STRING)
        ]
    )
    @action(detail=False, methods=['get'], url_path='total-likes')
    def total_likes(self, request):
        slug = request.query_params.get('slug')
        total_likes = BlogViewIP.objects.filter(blog__slug=slug, liked=True).count()
        return ResponseWrapper(data={"total_likes": total_likes})
