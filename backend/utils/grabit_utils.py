from pytubefix import YouTube
from pytubefix.cli import on_progress
from pytubefix.helpers import reset_cache
from pytubefix import innertube
import yt_dlp
from dotenv import load_dotenv
import os
import time
import re
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
        "visitorData": (
            os.getenv("PYTUBE_VISITOR_DATA")
            if os.getenv("PYTUBE_VISITOR_DATA") != ""
            else None
        ),
        "po_token": (
            os.getenv("PYTUBE_PO_TOKEN") if os.getenv("PYTUBE_PO_TOKEN") != "" else None
        ),
    }

    # Ensure the directory exists
    os.makedirs(TOKEN_DIR, exist_ok=True)

    # Write to tokens.json
    with open(TOKEN_FILE, "w") as f:
        json.dump(tokens, f)


def is_youtube_url(url: str) -> bool:
    # Regular expression to match YouTube video URLs (both HTTP and HTTPS)
    youtube_regex = r"(https?://)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)"
    # Match the URL with the regex pattern
    return bool(re.match(youtube_regex, url))


def fetch_media_info_pytube(url, detailed=False):
    """Fetches the media details from the provided URL using pytube."""
    # TODO: REMOVE TEST CODE
    # fake_data_file = os.path.join(
    #     settings.BASE_DIR, "utils", "tester.json"
    # )
    # with open(fake_data_file, "r") as f:
    #     return json.load(f)["data"]["media_info"]
    # TODO: REMOVE END

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

    info_dict = YouTube(
        url, use_oauth=True, allow_oauth_cache=True, on_progress_callback=on_progress
    )

    # TODO: Filter only mp4 videos (Normally there are two formats, mp4 and webm)
    # info_dict.streams.filter(only_video=True, file_extension="mp4")

    # Fetch the highest quality video and audio streams
    best_video = (
        info_dict.streams.filter(
            only_video=True, file_extension="mp4"
        )
        .order_by("resolution")
        .desc()
        .first()
    )
    best_audio = (
        info_dict.streams.filter(
            only_audio=True,
        )
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
            "bitrate": stream.bitrate if stream.bitrate else None,
            "fps": stream.fps if format_type == "video" else None,
            "filesize": stream.filesize,  # Size in bytes
            "resolution": stream.resolution if format_type == "video" else None,
            "has_audio": stream.includes_audio_track,
            "is_dash": stream.is_dash,
            "url": stream.url,  # Direct URL to the stream
        }

        if detailed:
            data["original_data"] = str(stream)
        return data

    media_info = {
        "title": info_dict.title,
        "formats_filtered": {
            "best_video": get_format_info(best_video, "video"),
            "best_audio": get_format_info(best_audio, "audio"),
            "videos_with_audio": [
                get_format_info(s, "video")
                for s in info_dict.streams.filter(
                    progressive=True,
                )
            ],
            "video_formats": [
                get_format_info(s, "video")
                for s in info_dict.streams.filter(
                    only_video=True, file_extension="mp4"
                )
            ],
            "audio_formats": [
                get_format_info(s, "audio")
                for s in info_dict.streams.filter(
                    only_audio=True,
                )
            ],
        },
        "description": info_dict.description,
        "author": info_dict.author,
        "upload_date": (
            info_dict.publish_date.strftime("%Y-%m-%d")
            if info_dict.publish_date
            else None
        ),
        "duration": info_dict.length,
        "resolution": best_video.resolution if best_video else None,
        "thumbnail": info_dict.thumbnail_url,
        "categories": [],
        "channel": info_dict.channel_url,
        "tags": info_dict.keywords,
        "view_count": info_dict.views,
        "average_rating": info_dict.rating if info_dict.rating else None,
        "source": "YouTube",
    }

    return media_info


def fetch_media_info_yt_dlp(url, detailed=False):
    """Fetches the media details from the provided URL using yt_dlp."""
    # TODO: REMOVE TEST CODE
    # fake_data_file = os.path.join(
    #     settings.BASE_DIR, "utils", "tester.json"
    # )
    # with open(fake_data_file, "r") as f:
    #     return json.load(f)["data"]["media_info"]
    # TODO: REMOVE END

    info_dict = {}

    ydl_opts = {"quiet": True, "skip_download": True}

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=False)
        if not info_dict:
            return {}
    # Fetch the highest quality video and audio streams
    best_video = next(
        f
        for f in info_dict.get("formats", [])[::-1]
        if f.get("vcodec") != "none" and f.get("acodec") == "none" and f.get("ext") == "mp4"
    )
    best_audio = next(
        f
        for f in info_dict.get("formats", [])[::-1]
        if f.get("vcodec") == "none" and f.get("acodec") != "none"
    )

    def get_format_info(stream, format_type):
        if not stream:
            return None

        data = {
            "format": format_type,
            "format_id": stream.get("format_id"),
            "ext": stream.get("ext"),
            "quality": stream.get("format_note"),
            "bitrate": stream.get("tbr"),
            "filesize": stream.get(
                "filesize", stream.get("filesize_approx")
            ),  # Size in bytes
            "resolution": stream.get("resolution"),
            "has_audio": bool(stream.get("audio_channels")),
            "is_dash": stream.get("is_dash_periods"),
            "url": stream.get("url"),  # Direct URL to the stream
        }

        if detailed:
            data["original_data"] = stream
        return data

    media_info = {
        "title": info_dict.get("title"),
        "formats_filtered": {
            "best_video": get_format_info(best_video, "video"),
            "best_audio": get_format_info(best_audio, "audio"),
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
                # and f.get("ext") == "mp4"
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
        "author": info_dict.get("uploader"),
        "upload_date": info_dict.get("upload_date"),
        "duration": info_dict.get("duration", 0),
        "resolution": info_dict.get("resolution"),
        "thumbnail": info_dict.get("thumbnail"),
        "categories": info_dict.get("categories", []),
        "channel": info_dict.get("channel"),
        "tags": info_dict.get("tags", []),
        "view_count": info_dict.get("view_count", 0),
        "average_rating": info_dict.get("average_rating", 0),
        "source": info_dict.get("extractor_key", "Unknown"),
    }

    return media_info


def fetch_media_info(url, detailed=False):
    """Fetches the media details from the provided URL."""
    if is_youtube_url(url):
        print("Fetching media info from pytube...")
        return fetch_media_info_pytube(url, detailed)
    else:
        print("Fetching media info from yt_dlp...")
        return fetch_media_info_yt_dlp(url, detailed)


# data = fetch_media_info("https://www.youtube.com/watch?v=dtyhP4gX68E&ab_channel=%D1%95%D1%82%CE%B9%CE%B7gGs")
# # print in json format indented with 4 spaces
# print(json.dumps(data, indent=4))
