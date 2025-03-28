import yt_dlp
from grabit.models import DownloadRequest
import json


def fetch_media_info(url):
    """Fetches the media details from the provided URL using yt-dlp and integrates with the DownloadRequest model."""
    with yt_dlp.YoutubeDL() as ydl:
        info_dict = ydl.extract_info(url, download=False)

        # Initialize a dictionary to store the media info
        media_info = {
            "title": info_dict.get("title", ""),
            # Filtered video and audio formats (separated by type)
            "formats_filtered": {
                "best_video": next(
                    {
                        "format": "video",
                        "format_id": f.get("format_id", ""),
                        "extension": f.get("ext", ""),
                        "quality": f.get("format_note", "Unknown"),
                        "filesize": f.get(
                            "filesize", f.get("filesize_approx", "")
                        ),  # Size in bytes
                        "url": f.get("url", ""),  # Direct URL to the video stream
                        "resolution": f.get("resolution", ""),
                        "has_audio": bool(f.get("audio_channels")),
                        "format_details": f.get("format", ""),
                        # "others": f,
                    }
                    for f in info_dict.get("formats", [])[::-1]
                    if f["vcodec"] != "none" and f["acodec"] == "none"
                ),
                "best_audio": next(
                    {
                        "format": "audio",
                        "format_id": f.get("format_id", ""),
                        "extension": f.get("ext", ""),
                        "quality": f.get("format_note", "Unknown"),
                        "filesize": f.get(
                            "filesize", f.get("filesize_approx", "")
                        ),  # Size in bytes
                        "url": f.get("url", ""),  # Direct URL to the audio stream
                        "resolution": f.get("resolution", ""),
                        "format_details": f.get("format", ""),
                        # "others": f,
                    }
                    for f in info_dict.get("formats", [])[::-1]
                    if f["vcodec"] == "none" and f["acodec"] != "none"
                ),
                "videos_with_audio": [
                    {
                        "format": "video",
                        "format_id": f.get("format_id", ""),
                        "extension": f.get("ext", ""),
                        "quality": f.get("format_note", "Unknown"),
                        "filesize": f.get(
                            "filesize", f.get("filesize_approx", "")
                        ),  # Size in bytes
                        "url": f.get("url", ""),  # Direct URL to the video stream
                        "resolution": f.get("resolution", ""),
                        "has_audio": bool(f.get("audio_channels")),
                        "format_details": f.get("format", ""),
                        # "others": f,
                    }
                    for f in info_dict.get("formats", [])
                    if f["vcodec"] != "none" and f["acodec"] != "none"
                ],
                "video_formats": [
                    {
                        "format": "video",
                        "format_id": f.get("format_id", ""),
                        "extension": f.get("ext", ""),
                        "quality": f.get("format_note", "Unknown"),
                        "filesize": f.get(
                            "filesize", f.get("filesize_approx", "")
                        ),  # Size in bytes
                        "url": f.get("url", ""),  # Direct URL to the video stream
                        "resolution": f.get("resolution", ""),
                        "has_audio": bool(f.get("audio_channels")),
                        "format_details": f.get("format", ""),
                        # "others": f,
                    }
                    for f in info_dict.get("formats", [])[::-1]
                    if f.get("video_ext") != "none"
                    and f.get("vcodec")
                    != "none"  # Only include video formats with non-empty video_ext and valid vcodec
                    and f.get("format_note")
                    and "sb"
                    not in f.get(
                        "format_id", ""
                    )  # Exclude storyboard formats (sb0, sb1, etc.)
                ],
                "audio_formats": [
                    {
                        "format": "audio",
                        "format_id": f.get("format_id", ""),
                        "extension": f.get("ext", ""),
                        "quality": f.get("format_note", "Unknown"),
                        "filesize": f.get(
                            "filesize", f.get("filesize_approx", "")
                        ),  # Size in bytes
                        "url": f.get("url", ""),  # Direct URL to the audio stream
                        "resolution": f.get("resolution", ""),
                        "format_details": f.get("format", ""),
                        # "others": f,
                    }
                    for f in info_dict.get("formats", [])[::-1]
                    if f.get("audio_ext") != "none"
                    and f.get("acodec")
                    != "none"  # Only include audio formats with non-empty audio_ext and valid acodec
                    and f.get("format_note")
                    and bool(f.get("audio_channels"))
                    and "sb"
                    not in f.get(
                        "format_id", ""
                    )  # Exclude storyboard formats (sb0, sb1, etc.)
                ],
            },
            # All formats (merged video and audio)
            # "formats": [
            #     {
            #         "format": "video" if f.get("vcodec") != "none" else "audio",  # Determine if it's video or audio
            #         "extension": f.get("video_ext") if f.get("vcodec") != "none" else f.get("audio_ext") if f.get("acodec") != "none" else "Unknown",
            #         "quality": f.get("format_note", "Unknown"),  # Quality is the resolution or audio quality (e.g., 720p, 320kbps)
            #         "filesize": f.get("filesize", f.get("filesize_approx", "")),  # Size in bytes
            #         "url": f.get("url", ""),  # Direct URL to the video/audio stream
            #         "video_ext": f.get("video_ext", ""),
            #         "audio_ext": f.get("audio_ext", ""),
            #         "resolution": f.get("resolution", ""),
            #         "format_details": f.get("format", ""),
            #     }
            #     for f in info_dict.get("formats", [])
            #     if (f.get("vcodec") != "none" or f.get("acodec") != "none")  # Only include video/audio formats
            #     and 'sb' not in f.get("format_id", "")  # Exclude storyboard formats (sb0, sb1, etc.)
            # ],
            "description": info_dict.get("description", ""),
            "uploader": info_dict.get("uploader", ""),
            "upload_date": info_dict.get("upload_date", ""),
            "duration": info_dict.get("duration", 0),
            "resolution": info_dict.get("resolution", ""),
            "fps": info_dict.get("fps", ""),
            "aspect_ratio": info_dict.get("aspect_ratio", ""),
            # Additional metadata
            "thumbnail": info_dict.get("thumbnail", ""),
            "categories": info_dict.get("categories", []),
            "channel": info_dict.get("channel", ""),
            "tags": info_dict.get("tags", []),
            "view_count": info_dict.get("view_count", 0),
            "like_count": info_dict.get("like_count", 0),
            "dislike_count": info_dict.get("dislike_count", 0),
            "average_rating": info_dict.get("average_rating", 0),
            "source": info_dict.get("extractor_key", "Unknown"),
        }

        return media_info



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
        video_raw_data = request.data.get("video_raw_data", {})
        audio_raw_data = request.data.get("audio_raw_data", {})

        try:
            # Attempt download or conversion based on user's choice
            file_path = self.download_media(
                download_request, video_url, selected_media_format, video_raw_data, audio_raw_data, download_path, 
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

    def download_media(self, download_request, video_url, selected_media_format, video_raw_data, audio_raw_data, download_path):
        """Download media and convert if necessary based on selected format"""

        def format_selector(ctx):
            """Select the best video and the best audio that won't result in an mkv."""
            best_video = video_raw_data
            if not best_video:
                raise Exception("No suitable video format found.")

            # Find a compatible audio format
            audio_ext_map = {'mp4': 'm4a', 'webm': 'webm'}
            audio_ext = audio_ext_map.get(best_video['ext'], None)
            if not audio_ext:
                raise Exception(f"No suitable audio format found for video extension: {best_video['ext']}")

            best_audio = audio_raw_data
            if not best_audio:
                raise Exception("No suitable audio format found.")

            return {
                'format_id': f'{best_video["format_id"]}+{best_audio["format_id"]}',
                'ext': best_video['ext'],
                'requested_formats': [best_video, best_audio],
                'protocol': f'{best_video["protocol"]}+{best_audio["protocol"]}'
            }
    
        with yt_dlp.YoutubeDL() as ydl:
            # Extract info without downloading
            info_dict = ydl.extract_info(video_url, download=False)

            # Print detailed info about the formats
            print(f"Available formats for {video_url}:")
            for format in available_formats:
                # Display information about each format
                print(f"Format ID: {format.get('format_id')}, Extension: {format.get('ext')}, Height: {format.get('height')}, Protocol: {format.get('protocol')}")

        video_title = info_dict.get("title", "Video").replace(" ", "_")
        original_ext = info_dict.get("ext", "mp4")  # Default to MP4 if no extension found
        final_ext = selected_media_format or original_ext  # Use user format or original

        # Prepare download path and ensure it exists
        download_path = os.path.expanduser(download_path)
        os.makedirs(download_path, exist_ok=True)

        # Generate unique filename for the original file
        original_filename = os.path.join(download_path, f"{video_title}_{random_string_generator()}.{original_ext}")

        # ydl_format_options = {
        #     'format_id': f'{video_raw_data["format_id"]}+{audio_raw_data["format_id"]}',
        #     'ext': video_raw_data['ext'],
        #     'requested_formats': [video_raw_data, audio_raw_data],
        #     # Must be + separated list of protocols
        #     'protocol': f'{video_raw_data["protocol"]}+{audio_raw_data["protocol"]}'
        # }

        # Configure yt-dlp options
        # ydl_opts = {
        #     "format": format_selector,
        #     "outtmpl": original_filename,
        #     "noplaylist": True,
        #     "quiet": False,  # Enable progress messages
        # }

        # Configure yt-dlp options
        ydl_opts = {
            "format": f'135+248',
            "outtmpl": original_filename,
            "noplaylist": True,
            "quiet": False,  # Enable progress messages
        }
        
        # If the selected format and original format are the same, download directly
        if original_ext == final_ext:
            # Download the media in original format
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([video_raw_data.get("url", video_url)])

        # If the selected format differs from the original, convert the video
        else:
            converted_filename = os.path.join(download_path, f"{video_title}_{random_string_generator()}")  # removed extension for duplicate extension bug
            postprocessor_opts = {
                "key": "FFmpegVideoConvertor",
                "preferedformat": final_ext,  # Convert to user-defined format
            }

            # Configure yt-dlp to convert after download
            ydl_opts["postprocessors"] = [postprocessor_opts]
            ydl_opts["outtmpl"] = converted_filename  # Output converted filename
            # Download and convert the video to the selected format
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([video_raw_data.get("url", video_url)])
            
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
