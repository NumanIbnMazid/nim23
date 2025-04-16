from rest_framework import permissions, status
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.conf import settings
from dotenv import load_dotenv
from pydantic import BaseModel

from recommendr.api.serializers import RecommendationRequestSerializer
from utils.helpers import custom_response_wrapper, ResponseWrapper

from langchain.agents import initialize_agent, Tool
from langchain.agents.agent_types import AgentType
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.tools import DuckDuckGoSearchResults

from google import genai

from imdb import Cinemagoer

import os
import json
import random


class RecommendationResponseObject(BaseModel):
    title: str
    media_type: str
    description: str
    language: str
    genres: list[str]
    category_tags: list[str]
    release_year: str
    imdb_rating: str
    imdb_link: str
    trailer_youtube_link: str
    music_spotify_link: str
    music_soundcloud_link: str
    music_youtube_link: str


@custom_response_wrapper
class RecommendationViewSet(GenericViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RecommendationRequestSerializer

    def get_gemini_client(self):
        load_dotenv()
        return genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    def load_prompt(self):
        path = os.path.join(
            settings.BASE_DIR, "recommendr/api/prompts/recommendation-prompt.md"
        )
        with open(path, "r") as f:
            return f.read()

    def generate_recommendation(self, input_data):
        phrasing_variants = [
            "Can you recommend 5 amazing",
            "Suggest 5 interesting",
            "What are your top 5 picks for",
            "Give me 5 great",
        ]
        input_data["random_intro"] = random.choice(phrasing_variants)
        prompt_template = self.load_prompt()
        user_prompt = prompt_template.format(**input_data)

        # TODO: Remove after testing
        # print(f"\n\n🔥🔥🔥User Prompt:🔥🔥🔥\n {user_prompt} \n\n")

        # client = self.get_gemini_client()
        load_dotenv()
        model = os.getenv("RECOMMENDR_AI_MODEL")
        if not model:
            raise ValueError("GEMINI model name not found in environment variables")
        # response = client.models.generate_content(
        #     model=model,
        #     contents=user_prompt,
        #     config=types.GenerateContentConfig(
        #         temperature=2,
        #         max_output_tokens=8192,
        #         response_mime_type="application/json",
        #         response_schema=list[RecommendationResponseObject],
        #         system_instruction="You are a helpful recommendation assistant. Provide creative and accurate suggestions with rich metadata.",
        #     ),
        # )

        # Step 1: Initialize Gemini (ChatGoogleGenerativeAI)
        llm = ChatGoogleGenerativeAI(
            model=model, api_key=os.getenv("GEMINI_API_KEY"), temperature=0.3
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
        )

        query = user_prompt

        # Step 5: Use it!
        response = agent.invoke(query)

        # Check if we have a valid response with the movie recommendations
        output = response.get("output")

        print(f"🔥🔥🔥Response:🔥🔥🔥\n {output} \n\n")
        
        #TODO: Uncomment
        # # If the output contains multiple movie recommendations, return those
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
    )
    @action(detail=False, methods=["post"], url_path="recommend")
    def recommend(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            result = self.generate_recommendation(serializer.validated_data)

            # TODO: Remove after testing
            # print(f"\n\n🔥🔥🔥Response:🔥🔥🔥\n {result} \n\n")

            if not result:
                return ResponseWrapper(
                    message="No recommendations found",
                    status=status.HTTP_404_NOT_FOUND,
                )
            if isinstance(result, str):
                result = json.loads(result)
            
            # IMDB SEARCH
            for index, data in enumerate(result):
                title = data.get("title")
                media_type = data.get("media_type")

                if not title or not media_type:
                    return ResponseWrapper(
                        message="Missing 'title' or 'media_type' parameter.",
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if media_type in ["movie", "tv_show", "web series", "documentary"]:
                    ia = Cinemagoer()
                    results = ia.search_movie(title)

                    print(f"Searching for `{title}` in IMDB...")

                    if not results:
                        print(f"No results found for `{title}` in IMDB.")
                        continue

                    # Get detailed info from first match
                    movie = results[0]
                    print(f"Found `{title}` in IMDB with ID: {movie.movieID}")
                    ia.update(movie)
                    result[index]["title"] = movie.get("title")
                    result[index]["cover_url"] = movie.get("cover url")
                    result[index]["year"] = movie.get("year")
                    result[index]["genres"] = movie.get("genres")
                    result[index]["review_link"] = f"https://www.imdb.com/title/tt{movie.movieID}/"
                    result[index]["rating"] = movie.get("rating")
                    result[index]["languages"] = movie.get("languages")
                    result[index]["description"] = movie.get("plot")
                    # TODO: Uncomment
                    # result[index]["director"] = movie.get("director")
                    # result[index]["producer"] = movie.get("producer")
                    # result[index]["writer"] = movie.get("writer")
                    # result[index]["cast"] = movie.get("cast")


            return ResponseWrapper(
                data={"recommendations": result}, status=status.HTTP_200_OK
            )
        except Exception as e:
            # TODO: Remove after testing
            print(f"\n\ERROR:🔥🔥🔥\n {e} \n\n")
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
