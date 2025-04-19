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

from langchain.agents import initialize_agent, Tool
from langchain.agents.agent_types import AgentType
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.tools import DuckDuckGoSearchResults

from google import genai
from googleapiclient.discovery import build
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from imdb import Cinemagoer

import os
import json
import random
import logging


logger = logging.getLogger("recommendr")


load_dotenv()
RECOMMENDR_MODEL = os.getenv("RECOMMENDR_AI_MODEL")
YOUTUBE_API_KEY = os.getenv("GOOGLE_API_KEY")
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

# Spotify instance
spotify = spotipy.Spotify(
    auth_manager=SpotifyClientCredentials(
        client_id=SPOTIFY_CLIENT_ID, client_secret=SPOTIFY_CLIENT_SECRET
    )
)


@custom_response_wrapper
class RecommendationViewSet(GenericViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RecommendationRequestSerializer

    def get_gemini_client(self):
        load_dotenv()
        return genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    def get_prompt(self):
        system_prompt = RecommendrUtils.objects.first().system_prompt
        if not system_prompt:
            raise ValueError("System prompt is empty")
        return system_prompt

    def update_data_with_imdb(self, resultObj, index, title, media_type):
        if media_type in ["movie", "tv_show", "web series", "documentary"]:
            ia = Cinemagoer()
            results = ia.search_movie(title)
            logger.info(f"🔍 Searching for `{title}` in IMDB...")
            send_log_message(
                f"🔍 Searching for `{title}` in IMDB...", module="recommendr"
            )

            if results:
                # Get detailed info from first match
                movie = results[0]
                logger.info(f"✅ Found `{title}` in IMDB with ID: {movie.movieID}")
                send_log_message(
                    f"✅ Found `{title}` in IMDB with ID: {movie.movieID}",
                    module="recommendr",
                )
                ia.update(movie)
                resultObj[index]["title"] = movie.get("title")
                resultObj[index]["cover_url"] = movie.get("cover url")
                resultObj[index]["year"] = movie.get("year")
                resultObj[index]["genres"] = movie.get("genres")
                resultObj[index][
                    "review_link"
                ] = f"https://www.imdb.com/title/tt{movie.movieID}/"
                resultObj[index]["rating"] = movie.get("rating")
                resultObj[index]["languages"] = movie.get("languages")
                resultObj[index]["description"] = movie.get("plot")
                resultObj[index]["cast"] = movie.get("cast")
                resultObj[index]["director"] = movie.get("director")
                resultObj[index]["producer"] = movie.get("producer")
                resultObj[index]["writer"] = movie.get("writer")
                return resultObj
            else:
                logger.info(f"⚠️ No results found for `{title}` in IMDB.")
                send_log_message(
                    f"⚠️ No results found for `{title}` in IMDB.", module="recommendr"
                )
                return resultObj
        return resultObj

    def get_youtube_link(self, query):
        logger.info(f"🔍 Searching for `{query}` in YouTube...")
        send_log_message(
            f"🔍 Searching for `{query}` in YouTube...", module="recommendr"
        )
        youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
        request = youtube.search().list(
            q=query, part="snippet", maxResults=1, type="video"
        )
        response = request.execute()
        if response["items"]:
            video_id = response["items"][0]["id"]["videoId"]
            logger.info(f"✅ Found `{query}` in YouTube with ID: {video_id}")
            send_log_message(
                f"✅ Found `{query}` in YouTube with ID: {video_id}",
                module="recommendr",
            )
            return f"https://www.youtube.com/watch?v={video_id}"
        return ""

    def get_spotify_track(self, query):
        logger.info(f"🔍 Searching for `{query}` in Spotify...")
        send_log_message(
            f"🔍 Searching for `{query}` in Spotify...", module="recommendr"
        )
        results = spotify.search(q=query, limit=1, type="track")
        tracks = results.get("tracks", {}).get("items", [])
        if tracks:
            logger.info(f"✅ Found `{query}` in Spotify with ID: {tracks[0]['id']}")
            send_log_message(
                f"✅ Found `{query}` in Spotify with ID: {tracks[0]['id']}",
                module="recommendr",
            )
            return tracks[0]
        return

    def generate_recommendation(self, input_data):
        phrasing_variants = [
            "Can you recommend 5 amazing",
            "Suggest 5 interesting",
            "What are your top 5 picks for",
            "Give me 5 great",
        ]
        input_data["random_intro"] = random.choice(phrasing_variants)

        prompt_template = self.get_prompt()
        user_prompt = prompt_template.format(**input_data)

        # TODO: Remove after testing
        # print(f"\n\n🔥🔥🔥User Prompt:🔥🔥🔥\n {user_prompt} \n\n")

        if not RECOMMENDR_MODEL:
            raise ValueError("RECOMMENDR_AI_MODEL not found in environment variables")

        # Step 1: Initialize Gemini (ChatGoogleGenerativeAI)
        llm = ChatGoogleGenerativeAI(
            model=RECOMMENDR_MODEL, api_key=os.getenv("GEMINI_API_KEY"), temperature=0.3
        )

        # Step 2: Add a search tool (e.g. DuckDuckGoSearchRun or SerpAPI)
        search = DuckDuckGoSearchResults()

        # Step 3: Define tools
        tools = [
            Tool(
                name="search",
                func=search.run,
                description="Useful for searching for real-time data like ratings, descriptions, or links for movies, shows, or music.",
            ),
        ]

        # Step 4: Initialize agent with tools
        agent = initialize_agent(
            tools=tools,
            llm=llm,
            agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True,
            handle_parsing_errors=True,
            max_iterations=50,
        )

        query = user_prompt

        # Showing Logs
        media_type_name_plural = input_data.get("media_type")
        if input_data.get("media_type") in [
            "movie",
            "tv_show",
            "music",
            "podcast",
            "audiobook",
        ]:
            media_type_name_plural = f"{media_type_name_plural}s"
        elif input_data.get("media_type") == "web series":
            media_type_name_plural = "web series"
        elif input_data.get("media_type") == "documentary":
            media_type_name_plural = "documentaries"
        send_log_message(
            f"Finding best {media_type_name_plural} for you...",
            module="recommendr",
        )

        # Step 5: Use it!
        response = agent.invoke(query)

        # Check if we have a valid response with the movie recommendations
        output = response.get("output")

        # logger.info(f"🔥🔥🔥Response:🔥🔥🔥\n {output} \n\n")

        # If the output contains multiple movie recommendations, return those
        if isinstance(output, list):
            return output  # Returning the list of movie recommendations directly
        else:
            # If no valid list is found, we can fallback to a default or empty response
            return []
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
            send_log_message(f"Generating recommendations...", module="recommendr")
            logger.info(f"\n\n🔥 Request data:🔥\n\n {serializer.validated_data}\n\n")
            result = self.generate_recommendation(serializer.validated_data)

            if not result:
                return ResponseWrapper(
                    message="No recommendations found",
                    status=status.HTTP_404_NOT_FOUND,
                )
            if isinstance(result, str):
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

                # ATTACH IMDB DATA
                if media_type in ["movie", "tv_show", "web series", "documentary"]:
                    try:
                        filtered_result = self.update_data_with_imdb(
                            result, index, title, media_type
                        )
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
                if media_type in ["music", "podcast", "audiobook"]:
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
            raise e
            logger.error(f"⚠️ Error: {e}")
            return ResponseWrapper(
                message="Recommendation failed",
                error_message=str(e),
                status=status.HTTP_400_BAD_REQUEST,
            )

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
