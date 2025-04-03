from rest_framework import serializers
from grabit.models import DownloadRequest


class DownloadRequestSerializer(serializers.ModelSerializer):
    download_path = serializers.CharField(max_length=500, required=False, allow_blank=True, read_only=True)
    raw_data = serializers.JSONField(required=True, allow_null=True)

    class Meta:
        model = DownloadRequest
        fields = (
            'id', 'slug', 'status', 'url', 'media_type', 'media_format', 'download_path', 'raw_data'
        )
        read_only_fields = ('id', 'status', 'created_at', 'updated_at', 'slug')

    def create(self, validated_data):
        # Remove 'download_path' from validated_data as it's not part of the model
        validated_data.pop('download_path', None)

        # Extract raw_data before passing to the model, as it's not part of the model
        raw_data = validated_data.pop('raw_data', None)
        
        # Create and return the DownloadRequest instance
        download_request = super().create(validated_data)
        
        # Handle raw_data separately, e.g., store it in a custom field or perform additional logic
        if raw_data:
            download_request.raw_data = raw_data  # Assuming 'raw_data' is a field in the model
            download_request.save()

        return download_request
