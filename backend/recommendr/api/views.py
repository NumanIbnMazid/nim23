from rest_framework import permissions, status
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.conf import settings
from dotenv import load_dotenv
from recommendr.api.serializers import RecommendationRequestSerializer
from recommendr.models import RecommendrUtils
from utils.throttles import RecommendrRateThrottle
from utils.helpers import custom_response_wrapper, ResponseWrapper, send_log_message
from django.conf import settings

from google import genai
from googleapiclient.discovery import build
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from imdb import Cinemagoer
from imdb.Person import Person
from omdb import OMDBClient
from pydantic import BaseModel

import os
import json
import logging
from typing import List


logger = logging.getLogger("recommendr")


load_dotenv()
RECOMMENDR_MODEL = os.getenv("RECOMMENDR_AI_MODEL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
YOUTUBE_API_KEY = os.getenv("GOOGLE_API_KEY")
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
OMDB_API_KEY = os.getenv("OMDB_API_KEY")

# Spotify Client
spotify_client = spotipy.Spotify(
    auth_manager=SpotifyClientCredentials(
        client_id=SPOTIFY_CLIENT_ID, client_secret=SPOTIFY_CLIENT_SECRET
    )
)
# YouTube Client
youtube_client = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
# OMDB Client
omdb_client = OMDBClient(apikey="6da2e614")
# IMDB Client
imdb_client = Cinemagoer()


class MediaRecommendation(BaseModel):
    title: str
    artist: List[str]
    media_type: str
    description: str
    languages: List[str]
    genres: List[str]
    category_tags: List[str]
    release_year: str
    imdb_rating: str
    review_link: str
    youtube_link: str
    spotify_link: str


@custom_response_wrapper
class RecommendationViewSet(GenericViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RecommendationRequestSerializer

    @swagger_auto_schema(
        method="get", responses={200: openapi.Response("Available preferences")}
    )
    @action(detail=False, methods=["get"], url_path="preferences")
    def get_preferences(self, request):
        data_path = os.path.join(settings.BASE_DIR, "recommendr/api/data")

        def load_json(file):
            with open(os.path.join(data_path, file), "r") as f:
                return json.load(f)

        preferences = {
            "media_types": load_json("media_types.json"),
            "mood": load_json("moods.json"),
            "language": load_json("languages.json"),
            "occasion": load_json("occasions.json"),
            "genres": load_json("genres.json"),
            "media_age": load_json("media_age.json"),
            "rating": load_json("ratings.json"),
            "categories": load_json("categories.json"),
        }

        return ResponseWrapper(data=preferences, status=status.HTTP_200_OK)

    def get_gemini_client(self):
        return genai.Client(api_key=GEMINI_API_KEY)

    def get_client(self, client_name):
        """
        Get the appropriate client based on the client name.
        """
        if client_name == "gemini":
            return self.get_gemini_client()
        else:
            raise ValueError("Invalid client name")

    def get_response(self, client, model, system_prompt, user_prompt):
        """
        Get the response from the client.
        """
        response = client.models.generate_content(
            model=model,
            contents=user_prompt,
            config=genai.types.GenerateContentConfig(
                temperature=1.0,
                max_output_tokens=8192,
                system_instruction=system_prompt,
                response_mime_type="application/json",
                response_schema=list[MediaRecommendation],
            ),
        )
        # TODO: Remove after testing
        # print(f"\n\n🔥🔥🔥Response:🔥🔥🔥\n {response} \n\n")
        return response.text

    def get_prompt(self):
        system_prompt = RecommendrUtils.objects.first().system_prompt
        if not system_prompt:
            raise ValueError("System prompt is empty")
        return system_prompt

    def update_data_with_omdb(self, resultObj, index):
        title = resultObj[index].get("title")
        logger.info(f"🔍 Searching for `{title}` in OMDB...")
        send_log_message(
            f"🔍 Searching for `{title}` in Movie Database...",
            module="recommendr",
            scope="get-recommendation",
        )
        result = omdb_client.request(
            t=resultObj[index].get("title"),
            y=resultObj[index].get("release_year"),
            plot="short",
            r="json",
        )
        result_byte_data = result.content
        decoded_str = result_byte_data.decode("utf-8")
        json_data = json.loads(decoded_str)
        if json_data.get("Response") == "True":
            logger.info(f"✅ Found `{title}` in OMDB")
            send_log_message(
                f"✅ Found `{title}` in Movie Database.",
                module="recommendr",
                scope="get-recommendation",
            )
            # Update Data
            resultObj[index]["title"] = json_data.get("Title")
            resultObj[index]["data_source"] = "OMDB"
            resultObj[index]["cover_url"] = json_data.get("Poster")
            resultObj[index]["year"] = json_data.get("Year")
            resultObj[index]["genres"] = json_data.get("Genre").split(", ")
            resultObj[index][
                "review_link"
            ] = f"https://www.imdb.com/title/{json_data.get('imdbID')}/"
            resultObj[index]["imdb_id"] = json_data.get("imdbID")
            resultObj[index]["imdb_rating"] = json_data.get("imdbRating")
            resultObj[index]["languages"] = json_data.get("Language").split(", ")
            resultObj[index]["countries"] = json_data.get("Country").split(", ")
            resultObj[index]["description"] = json_data.get("Plot")
            resultObj[index]["cast"] = json_data.get("Actors").split(", ")[:7]
            resultObj[index]["director"] = json_data.get("Director").split(", ")[:7]
            resultObj[index]["writer"] = json_data.get("Writer").split(", ")[:7]
            return True
        else:
            logger.info(f"❌ Could not find `{title}` in OMDB")
        return False

    def update_data_with_imdb(self, resultObj, index):

        def extract_names_from_field(
            data: dict, field: str, max_count: int = 7
        ) -> list[str]:
            """
            Efficiently extracts up to `max_count` names from a field in the given dictionary.
            Handles IMDbPy Person objects, dicts with 'name', and plain strings.

            Args:
                data (dict): The dictionary containing the target field.
                field (str): The field name to extract names from (e.g., 'director').
                max_count (int): Maximum number of names to return.

            Returns:
                list[str]: List of extracted names.
            """
            items = data.get(field, [])
            names = []
            count = 0

            for item in items:
                if count >= max_count:
                    break

                if isinstance(item, Person):
                    name = item.get("name")
                    if name:
                        names.append(name)
                        count += 1

                elif isinstance(item, dict):
                    name = item.get("name")
                    if name:
                        names.append(name)
                        count += 1

                elif isinstance(item, str):
                    names.append(item)
                    count += 1

            return names

        title = resultObj[index].get("title")
        logger.info(f"🔍 Searching for `{title}` in IMDB...")
        send_log_message(
            f"🔍 Searching for `{title}` in IMDB...",
            module="recommendr",
            scope="get-recommendation",
        )
        results = imdb_client.search_movie(title)
        if results:
            # Get detailed info from first match
            movie = results[0]
            movieID = movie.movieID
            logger.info(f"✅ Found `{title}` in IMDB with ID: {movie.movieID}")
            send_log_message(
                f"✅ Found `{title}` in IMDB with ID: {movieID}",
                module="recommendr",
                scope="get-recommendation",
            )
            imdb_client.update(movie)
            resultObj[index]["title"] = movie.get("title")
            resultObj[index]["data_source"] = "IMDB"
            resultObj[index]["cover_url"] = movie.get("cover url")
            resultObj[index]["year"] = movie.get("year")
            resultObj[index]["genres"] = movie.get("genres")
            resultObj[index]["review_link"] = f"https://www.imdb.com/title/tt{movieID}/"
            resultObj[index]["imdb_id"] = movieID
            resultObj[index]["imdb_rating"] = movie.get("rating")
            resultObj[index]["languages"] = movie.get("languages")
            resultObj[index]["countries"] = movie.get("countries")
            resultObj[index]["description"] = movie.get("plot", [])[:1]
            resultObj[index]["cast"] = extract_names_from_field(movie, "cast")
            resultObj[index]["director"] = extract_names_from_field(
                movie, "director", max_count=7
            )
            resultObj[index]["producer"] = extract_names_from_field(movie, "producer")
            resultObj[index]["writer"] = extract_names_from_field(movie, "writer")
            return True
        else:
            logger.info(f"⚠️ No results found for `{title}` in IMDB.")
            send_log_message(
                f"⚠️ No results found for `{title}` in IMDB.",
                module="recommendr",
                scope="get-recommendation",
            )
        return False

    def get_youtube_link(self, query):
        logger.info(f"🔍 Searching for `{query}` in YouTube...")
        send_log_message(
            f"🔍 Searching for `{query}` in YouTube...",
            module="recommendr",
            scope="get-recommendation",
        )
        request = youtube_client.search().list(
            q=query, part="snippet", maxResults=1, type="video"
        )
        response = request.execute()
        if response["items"]:
            video_id = response["items"][0]["id"]["videoId"]
            logger.info(f"✅ Found `{query}` in YouTube with ID: {video_id}")
            send_log_message(
                f"✅ Found `{query}` in YouTube with ID: {video_id}",
                module="recommendr",
                scope="get-recommendation",
            )
            return f"https://www.youtube.com/watch?v={video_id}"
        return ""

    def get_spotify_track(self, query):
        logger.info(f"🔍 Searching for `{query}` in Spotify...")
        send_log_message(
            f"🔍 Searching for `{query}` in Spotify...",
            module="recommendr",
            scope="get-recommendation",
        )
        results = spotify_client.search(q=query, limit=1, type="track")
        tracks = results.get("tracks", {}).get("items", [])
        if tracks:
            logger.info(f"✅ Found `{query}` in Spotify with ID: {tracks[0]['id']}")
            send_log_message(
                f"✅ Found `{query}` in Spotify with ID: {tracks[0]['id']}",
                module="recommendr",
                scope="get-recommendation",
            )
            return tracks[0]
        return

    def generate_recommendation(self, input_data):
        prompt_template = self.get_prompt()
        system_prompt = prompt_template.format(**input_data)

        # TODO: Remove after testing
        # print(f"\n\n🔥🔥🔥User Prompt:🔥🔥🔥\n {system_prompt} \n\n")

        if not RECOMMENDR_MODEL:
            raise ValueError("RECOMMENDR_AI_MODEL not found in environment variables")

        # Initialize LLM Client
        client = self.get_client("gemini")

        # Showing Logs
        media_type_name_plural = input_data.get("media_type")
        if input_data.get("media_type") in ["Movie", "TV Show", "Music"]:
            media_type_name_plural = f"{media_type_name_plural}s"
        elif input_data.get("media_type") == "Documentary":
            media_type_name_plural = "Documentaries"
        send_log_message(
            f"Finding best {media_type_name_plural} for you...",
            module="recommendr",
            scope="get-recommendation",
        )

        # Generate the response
        output = self.get_response(
            client=client,
            model=RECOMMENDR_MODEL,
            system_prompt=system_prompt,
            user_prompt="Please give me a list of 5 recommendations",
        )

        # TODO: Remove after testing
        # print(f"\n\n🔥🔥🔥 Response: 🔥🔥🔥\n {output} \n\n")

        # If the output contains multiple movie recommendations, return those
        # if isinstance(output, list):
        #     return output  # Returning the list of movie recommendations directly
        # else:
        #     # If no valid list is found, we can fallback to a default or empty response
        #     return []
        return output

    @swagger_auto_schema(
        method="post",
        request_body=RecommendationRequestSerializer,
        responses={200: openapi.Response("Recommended content")},
        throttle_classes=[RecommendrRateThrottle],
    )
    @action(detail=False, methods=["post"], url_path="recommend")
    def recommend(self, request):
        # TODO: Remove this dummy data after testing
        # Thread(target=long_running_task).start()
        # with open(os.path.join(settings.BASE_DIR, "utils/tester.json"), "r") as f:
        #     data = json.load(f)["data"]
        # return ResponseWrapper(message="Recommendation successful", data=data)

        # Configurations
        ATTACH_YOUTUBE_LINK = False

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            send_log_message(
                f"Generating recommendations...",
                module="recommendr",
                scope="get-recommendation",
            )
            logger.info(f"\n\n🔥 Request data:🔥\n\n {serializer.validated_data}\n\n")

            # Generate recommendations
            result = self.generate_recommendation(serializer.validated_data)

            if not result:
                return ResponseWrapper(
                    message="No recommendations found",
                    status=status.HTTP_404_NOT_FOUND,
                )
            if isinstance(result, str):
                # Clean markdown if present
                result = result.strip()
                if result.startswith("```json"):
                    result = result.lstrip("```json").rstrip("```").strip()
                elif result.startswith("```"):
                    result = result.strip("```").strip()
                result = json.loads(result)

            filtered_result = [
                item for item in result if item.get("title") and item["title"].strip()
            ]

            media_type = serializer.validated_data.get("media_type")

            # Update METADATA
            for index, data in enumerate(filtered_result):

                title = data.get("title")

                if not title or title.strip() == "":
                    del filtered_result[index]
                    continue

                # ATTACH HARD CODED MEDIA TYPE
                filtered_result[index]["media_type"] = media_type

                # ATTACH IMDB DATA
                if media_type in ["Movie", "TV Show", "Web Series", "Documentary"]:
                    try:
                        is_omdb_update_success = self.update_data_with_omdb(
                            filtered_result, index
                        )
                    except Exception as e:
                        logger.error(f"Error updating data with OMDB: {e}")
                        is_omdb_update_success = False
                    if not is_omdb_update_success:
                        logger.info("Trying to update data with IMDB...")
                        try:
                            self.update_data_with_imdb(filtered_result, index)
                        except Exception as e:
                            logger.error(f"Error updating data with IMDB: {e}")

                # ATTACH YOUTUBE, SPOTIFY LINK
                query = f"{title} {media_type}"
                if media_type == "music":
                    artist_list = data.get("artist", [])
                    query = f"{title}" + (
                        f" artist:{', '.join(artist_list)}" if artist_list else ""
                    )
                # SPOTIFY
                if media_type in ["Music"]:
                    try:
                        spotify_track = self.get_spotify_track(query)
                        if spotify_track:
                            filtered_result[index]["spotify_link"] = spotify_track[
                                "external_urls"
                            ]["spotify"]
                            filtered_result[index]["cover_url"] = spotify_track[
                                "album"
                            ]["images"][0]["url"]
                    except Exception as e:
                        logger.error(f"Error fetching Spotify link: {e}")

                if ATTACH_YOUTUBE_LINK == True:
                    # YOUTUBE
                    try:
                        filtered_result[index]["youtube_link"] = self.get_youtube_link(
                            query
                        )
                    except Exception as e:
                        logger.error(f"Error fetching YouTube link: {e}")

            # logger.info(f"\n\n🔥 Final Result:\n {filtered_result} \n\n")

            return ResponseWrapper(
                data={"recommendations": filtered_result}, status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"⚠️ Error generating recommendations: {e}")
            return ResponseWrapper(
                message="Generating recommendation failed!",
                error_message=str(e),
                status=status.HTTP_400_BAD_REQUEST,
            )
