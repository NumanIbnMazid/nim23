import yt_dlp


def fetch_media_info(url, detailed=False):
    """Fetches the media details from the provided URL using yt-dlp and integrates with the DownloadRequest model."""

    def get_format_info(f, format_type):
        data = {
            "format": format_type,
            "format_id": f.get("format_id"),
            "ext": f.get("ext"),
            "quality": f.get("format_note"),
            "bitrate": f.get("tbr"),  # Bitrate in kbps
            "filesize": f.get("filesize", f.get("filesize_approx")),  # Size in bytes
            "url": f.get("url"),  # Direct URL to the video/audio stream
            "resolution": f.get("resolution"),
            "protocol": f.get("protocol"),
            "has_audio": bool(f.get("audio_channels")),
            "format_details": f.get("format"),
        }
        if detailed:
            data["original_data"] = f
        return data
    
    ydl_opts = {
        "quiet": True,
        "skip_download": True,
        "extractor-args": "youtube:player_client=android_vr"
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=False)
        if not info_dict:
            return {}

        # Initialize a dictionary to store the media info
        media_info = {
            "title": info_dict.get("title"),
            # Filtered video and audio formats (separated by type)
            "formats_filtered": {
                "best_video": next(
                    get_format_info(f, "video")
                    for f in info_dict.get("formats", [])[::-1]
                    if f.get("vcodec") != "none" and f.get("acodec") == "none"
                ),
                "best_audio": next(
                    get_format_info(f, "audio")
                    for f in info_dict.get("formats", [])[::-1]
                    if f.get("vcodec") == "none" and f.get("acodec") != "none"
                ),
                "videos_with_audio": [
                    get_format_info(f, "video")
                    for f in info_dict.get("formats", [])
                    if f.get("vcodec") != "none" and f.get("acodec") != "none"
                ],
                "video_formats": [
                    get_format_info(f, "video")
                    for f in info_dict.get("formats", [])[::-1]
                    if f.get("video_ext") != "none"
                    and f.get("vcodec")
                    != "none"  # Only include video formats with non-empty video_ext and valid vcodec
                    and f.get("format_note")
                    and "sb" not in f.get("format_id")
                ],
                "audio_formats": [
                    get_format_info(f, "audio")
                    for f in info_dict.get("formats", [])[::-1]
                    if f.get("audio_ext") != "none"
                    and f.get("acodec")
                    != "none"  # Only include audio formats with non-empty audio_ext and valid acodec
                    and f.get("format_note")
                    and bool(f.get("audio_channels"))
                    and "sb" not in f.get("format_id")
                ],
            },
            "description": info_dict.get("description"),
            "uploader": info_dict.get("uploader"),
            "upload_date": info_dict.get("upload_date"),
            "duration": info_dict.get("duration", 0),
            "resolution": info_dict.get("resolution"),
            "fps": info_dict.get("fps"),
            "aspect_ratio": info_dict.get("aspect_ratio"),
            # Additional metadata
            "thumbnail": info_dict.get("thumbnail"),
            "categories": info_dict.get("categories", []),
            "channel": info_dict.get("channel"),
            "tags": info_dict.get("tags", []),
            "view_count": info_dict.get("view_count", 0),
            "like_count": info_dict.get("like_count", 0),
            "dislike_count": info_dict.get("dislike_count", 0),
            "average_rating": info_dict.get("average_rating", 0),
            "source": info_dict.get("extractor_key", "Unknown"),
        }

        return media_info
