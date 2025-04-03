from pytubefix import YouTube
from pytubefix.cli import on_progress
import json


def fetch_media_info(url, detailed=False):
    """Fetches the media details from the provided URL using pytube."""

    try:
        yt = YouTube(url, client='WEB', on_progress_callback=on_progress)

        # TODO: Filter only mp4 videos (Normally there are two formas, mp4 and webm)
        # yt.streams.filter(only_video=True, file_extension="mp4")

        # Fetch the highest quality video and audio streams
        best_video = (
            yt.streams.filter(only_video=True,)
            .order_by("resolution")
            .desc()
            .first()
        )
        best_audio = (
            yt.streams.filter(only_audio=True,)
            .order_by("abr")
            .desc()
            .first()
        )

        def get_format_info(stream, format_type):
            if not stream:
                return None

            data = {
                "format": format_type,
                "format_id": stream.itag,
                "ext": stream.mime_type.split("/")[-1],
                "quality": stream.resolution if format_type == "video" else stream.abr,
                "bitrate": None,  # Pytube does not expose this directly
                "filesize": stream.filesize,  # Size in bytes
                "url": stream.url,  # Direct URL to the stream
                "resolution": stream.resolution if format_type == "video" else None,
                "protocol": "https",
                "has_audio": stream.includes_audio_track
            }

            if detailed:
                data["original_data"] = str(stream)
            return data

        media_info = {
            "title": yt.title,
            "formats_filtered": {
                "best_video": get_format_info(best_video, "video"),
                "best_audio": get_format_info(best_audio, "audio"),
                "videos_with_audio": [
                    get_format_info(s, "video")
                    for s in yt.streams.filter(progressive=True,)
                ],
                "video_formats": [
                    get_format_info(s, "video")
                    for s in yt.streams.filter(only_video=True,)
                ],
                "audio_formats": [
                    get_format_info(s, "audio")
                    for s in yt.streams.filter(only_audio=True,)
                ],
            },
            "description": yt.description,
            "author": yt.author,
            "upload_date": (
                yt.publish_date.strftime("%Y-%m-%d") if yt.publish_date else None
            ),
            "duration": yt.length,
            "resolution": best_video.resolution if best_video else None,
            # "fps": None,  # Pytube does not provide FPS info
            # "aspect_ratio": None,  # Pytube does not expose aspect ratio
            "thumbnail": yt.thumbnail_url,
            "categories": [],  # Pytube does not expose categories
            "channel": yt.channel_url,
            "tags": yt.keywords,
            "view_count": yt.views,
            # "like_count": None,  # Pytube does not expose like counts
            # "dislike_count": None,
            "average_rating": yt.rating if yt.rating else None,
            "source": "YouTube",
        }

        return media_info

    except Exception as e:
        print(f"Error fetching media info: {e}")
        return {}


# data = fetch_media_info("https://www.youtube.com/watch?v=dtyhP4gX68E&ab_channel=%D1%95%D1%82%CE%B9%CE%B7gGs")
# # print in json format indented with 4 spaces
# print(json.dumps(data, indent=4))
