import os
import yt_dlp
from rest_framework import permissions, status
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin
from grabit.models import DownloadRequest
from grabit.api.serializers import DownloadRequestSerializer
from utils.helpers import custom_response_wrapper, ResponseWrapper
from utils.grabit_utils import fetch_media_info
from utils.snippets import random_string_generator
import re


@custom_response_wrapper
class FetchMediaInfoViewSet(GenericViewSet, RetrieveModelMixin):
    permission_classes = (permissions.AllowAny,)

    @action(detail=False, methods=['get'])
    def retrieve_media_info(self, request):
        """
        Retrieve media information (formats, quality) based on the provided URL in query parameter.
        """
        url = request.query_params.get("url")
        if not url:
            return ResponseWrapper(message="URL is required", status=400)

        try:
            media_info = fetch_media_info(url)
            return ResponseWrapper(data={"media_info": media_info}, status=status.HTTP_200_OK)
        except Exception as e:
            return ResponseWrapper(
                message="Failed to get media formats!",
                error_message=str(e),
                status=status.HTTP_400_BAD_REQUEST,
            )


class DownloadViewset(GenericViewSet, CreateModelMixin, RetrieveModelMixin):
    permission_classes = (permissions.AllowAny,)
    queryset = DownloadRequest.objects.all()
    serializer_class = DownloadRequestSerializer

    def create(self, request, *args, **kwargs):
        """Override create to return a custom response"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        download_request = serializer.save()

        # Get user-selected media format and path, and the raw data provided by the user
        video_url = request.data.get("url")
        selected_media_format = request.data.get("media_format")
        download_path = request.data.get("download_path", "~/Downloads")
        raw_data = request.data.get("raw_data", {})

        try:
            # Attempt download or conversion based on user's choice
            file_path = self.download_media(
                download_request, video_url, selected_media_format, raw_data, download_path, 
            )
            download_request.file_path = file_path
            download_request.status = DownloadRequest.Status.COMPLETED
            download_request.save()

            return ResponseWrapper(
                data=serializer.data,
                message="Downloaded successfully.",
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            download_request.status = DownloadRequest.Status.FAILED
            download_request.save()

            return ResponseWrapper(
                data=serializer.data,
                message="Download failed!",
                error_message=str(e),
                status=status.HTTP_400_BAD_REQUEST,
            )

    def download_media(self, download_request, video_url, selected_media_format, raw_data, download_path):
        """Download media and convert if necessary based on selected format"""

        def clean_filename(filename: str) -> str:
            # Remove any invalid characters (non-alphanumeric, non-hyphen, non-underscore, non-period)
            filename = re.sub(r'[^a-zA-Z0-9-_\.]', '_', filename)
            # Replace multiple consecutive underscores with a single underscore
            filename = re.sub(r'_+', '_', filename)
            # Ensure it does not start or end with an underscore or hyphen
            filename = filename.strip('_-')
            # Limit filename length to a max of 100 characters
            max_length = 100
            if len(filename) > max_length:
                filename = filename[:max_length]
            return filename

        def get_format_id(dl_info):
            """Select the best video and the best audio that won't result in an mkv."""
            best_video = raw_data
            if not best_video:
                raise Exception("No suitable video format found.")

            # Find a compatible audio format
            # Select the best m4a and webm audio formats using reverse sorting in a single list comprehension
            m4a_audio_formats = [
                f for f in dl_info.get("formats", [])[::-1]
                if f.get("ext") == "m4a" and f.get("height") is None
            ]
            best_m4a = m4a_audio_formats[0] if m4a_audio_formats else None

            webm_audio_formats = [
                f for f in dl_info.get("formats", [])[::-1]
                if f.get("ext") == "webm" and f.get("height") is None
            ]
            best_webm = webm_audio_formats[0] if webm_audio_formats else None

            selected_audio = best_m4a if best_video['ext'] == 'mp4' else best_webm

            best_audio = selected_audio
            if not best_audio:
                raise Exception("No suitable audio format found.")
            return f'{best_video["format_id"]}+{best_audio["format_id"]}'
    

        with yt_dlp.YoutubeDL() as ydl:
            # Extract info without downloading
            info_dict = ydl.extract_info(video_url, download=False)

        video_title = info_dict.get("title", "Video").replace(" ", "_")
        original_ext = info_dict.get("ext", "mp4")  # Default to MP4 if no extension found
        final_ext = selected_media_format or original_ext  # Use user format or original

        # Prepare download path and ensure it exists
        download_path = os.path.expanduser(download_path)
        os.makedirs(download_path, exist_ok=True)

        # Generate unique filename for the original file
        original_filename = os.path.join(download_path, f"{clean_filename(video_title)}_{random_string_generator()}.{original_ext}")

        # Configure yt-dlp options
        ydl_opts = {
            "format": get_format_id(info_dict),
            "outtmpl": original_filename,
            "noplaylist": True,
            "quiet": False,  # Enable progress messages
        }
        
        # If the selected format and original format are the same, download directly
        if original_ext == final_ext:
            # Download the media in original format
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([video_url])

        # If the selected format differs from the original, convert the video
        else:
            converted_filename = os.path.join(download_path, f"{clean_filename(video_title)}_{random_string_generator()}")  # removed extension for duplicate extension bug
            postprocessor_opts = {
                "key": "FFmpegVideoConvertor",
                "preferedformat": final_ext,  # Convert to user-defined format
            }

            # Configure yt-dlp to convert after download
            ydl_opts["postprocessors"] = [postprocessor_opts]
            ydl_opts["outtmpl"] = converted_filename  # Output converted filename
            # Download and convert the video to the selected format
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([video_url])
            
            # Delete the original file after conversion
            if os.path.exists(original_filename):
                os.remove(original_filename)
                
            return converted_filename  # Return the converted file path

        return original_filename

    def progress_hook(self, d):
        """Progress hook to track download progress"""
        if d["status"] == "downloading":
            percent = d.get("downloaded_bytes", 0) / d.get("total_bytes", 1) * 100
            print(f"Download progress: {percent:.2f}%")
