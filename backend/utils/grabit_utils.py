from pytubefix import YouTube
from pytubefix.cli import on_progress
from pytubefix.helpers import reset_cache
from pytubefix import innertube
from dotenv import load_dotenv
import os
import time
import json


# Define the token file path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOKEN_DIR = os.path.join(BASE_DIR, "pytube")
TOKEN_FILE = os.path.join(TOKEN_DIR, "tokens.json")


def is_token_valid(token_data):
    """Check if the access token is still valid."""
    expires_at = token_data.get("expires")
    if not expires_at:
        return False
    return int(expires_at) > int(time.time())

def generate_tokens_json():
    """Creates tokens.json from environment variables if it does not exist."""
    # Load environment variables
    load_dotenv()
    tokens = {
        "access_token": os.getenv("PYTUBE_ACCESS_TOKEN"),
        "refresh_token": os.getenv("PYTUBE_REFRESH_TOKEN"),
        "expires": float(os.getenv("PYTUBE_EXPIRES")),
        "visitorData": os.getenv("PYTUBE_VISITOR_DATA") if os.getenv("PYTUBE_VISITOR_DATA") != "" else None,
        "po_token": os.getenv("PYTUBE_PO_TOKEN") if os.getenv("PYTUBE_PO_TOKEN") != "" else None,
    }
    
    # Ensure the directory exists
    os.makedirs(TOKEN_DIR, exist_ok=True)

    # Write to tokens.json
    with open(TOKEN_FILE, "w") as f:
        json.dump(tokens, f)

def fetch_media_info(url, detailed=False):
    """Fetches the media details from the provided URL using pytube."""

    # Check if tokens.json exists
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "r") as f:
            token_data = json.load(f)

        # Validate token
        # if not is_token_valid(token_data):
        #     raise Exception("OAuth token expired. Please refresh your credentials.")

    else:
        # Reset the cache
        reset_cache()
        # Create tokens.json from environment variables
        generate_tokens_json()

    # Set PyTube token location
    innertube._cache_dir = TOKEN_DIR
    innertube._token_file = TOKEN_FILE

    yt = YouTube(url, use_oauth=True, allow_oauth_cache=True, on_progress_callback=on_progress)

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


# data = fetch_media_info("https://www.youtube.com/watch?v=dtyhP4gX68E&ab_channel=%D1%95%D1%82%CE%B9%CE%B7gGs")
# # print in json format indented with 4 spaces
# print(json.dumps(data, indent=4))
