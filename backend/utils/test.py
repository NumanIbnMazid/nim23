import os
import json
from dotenv import load_dotenv
from typing import List, Dict, Any, Type

# Langchain components
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import AgentExecutor, create_react_agent, Tool
from langchain.prompts import PromptTemplate
from langchain import hub  # To pull base react prompt

# API Clients
from tmdbv3api import TMDb, Movie, TV, Discover
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# Pydantic for input validation (good practice)
from pydantic import BaseModel, Field

# --- Configuration ---
load_dotenv()
# Load API Keys securely
GEMINI_API_KEY = "VALUE"
TMDB_API_KEY = "VALUE"
SPOTIPY_CLIENT_ID = "VALUE"
SPOTIPY_CLIENT_SECRET = "VALUE"
RECOMMENDR_MODEL = "gemini-2.0-flash"  # Provide default

# --- API Client Setup ---

# TMDB
tmdb = TMDb()
tmdb_api_key = TMDB_API_KEY
if not tmdb_api_key:
    raise ValueError("TMDB_API_KEY not found in environment variables.")
tmdb.api_key = tmdb_api_key
tmdb.language = os.getenv("TMDB_LANGUAGE", "en-US")  # Default language
tmdb_movie = Movie()
tmdb_tv = TV()
tmdb_discover = Discover()

# Spotify
spotify_client_id = SPOTIPY_CLIENT_ID
spotify_client_secret = SPOTIPY_CLIENT_SECRET
if not spotify_client_id or not spotify_client_secret:
    raise ValueError("SPOTIPY_CLIENT_ID or SPOTIPY_CLIENT_SECRET not found.")

try:
    spotify = spotipy.Spotify(
        client_credentials_manager=SpotifyClientCredentials(
            client_id=spotify_client_id, client_secret=spotify_client_secret
        )
    )
    # Test connection
    spotify.search(q="test", type="track", limit=1)
    print("Successfully connected to Spotify API.")
except Exception as e:
    print(f"Error connecting to Spotify API: {e}")
    # Consider raising an error or handling it gracefully
    spotify = None  # Set to None if connection fails

# --- Langchain LLM Setup ---
gemini_api_key = GEMINI_API_KEY
if not gemini_api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment variables.")

# Adjust model name if needed (e.g., "gemini-1.5-flash")
llm = ChatGoogleGenerativeAI(model=RECOMMENDR_MODEL, google_api_key=gemini_api_key)
print("Successfully initialized Gemini LLM.")

# --- Define Tool Functions ---


# Pydantic models for Tool inputs (improves clarity and validation)
class TMDBSearchInput(BaseModel):
    query: str = Field(
        description="Keywords or phrases describing the movie or TV show to search for. Include details like genre, mood, actors, year if relevant."
    )
    media_type: str = Field(description="Specify 'movie' or 'tv' (for web series).")
    # Note: Advanced filtering (mood, language, rating) within TMDB API via basic search is limited.
    # The agent should incorporate these into the 'query' string.


class SpotifySearchInput(BaseModel):
    query: str = Field(
        description="Keywords or phrases describing the song or artist to search for. Include details like genre, mood, year if relevant."
    )
    # Note: Spotify search can filter by genre, year etc., but we'll keep it simple here
    # and let the agent craft the query string.


def search_tmdb(query: str, media_type: str) -> str:
    """
    Searches The Movie Database (TMDB) for movies or TV shows based on a query.
    Formats results focusing on relevance to typical recommendation needs.
    """
    print(f"\n--- Executing TMDB Search ---")
    print(f"Query: {query}")
    print(f"Media Type: {media_type}")
    results = []
    try:
        search_func = tmdb_movie.search if media_type == "movie" else tmdb_tv.search
        # Use discover for potentially better filtering in future, but search is simpler for keywords
        # For now, basic search based on agent's generated query
        search_results = search_func(query)

        count = 0
        for item in search_results:
            if count >= 10:  # Limit raw results sent back to LLM
                break
            details = {
                "id": item.id,
                "title": item.title if media_type == "movie" else item.name,
                "overview": item.overview,
                "release_date": (
                    str(item.release_date)
                    if media_type == "movie"
                    else str(item.first_air_date)
                ),
                "rating": item.vote_average,
                "popularity": item.popularity,
                "media_type": media_type,
            }
            # Basic check if overview seems relevant to the query keywords (simple heuristic)
            # This helps filter out less relevant results from broad searches
            query_keywords = query.lower().split()
            overview_lower = details["overview"].lower()
            if any(
                keyword in overview_lower for keyword in query_keywords[:3]
            ):  # Check first few keywords
                results.append(details)
                count += 1
            elif (
                count < 5
            ):  # Add some less directly matching ones if we don't have enough
                results.append(details)
                count += 1

        if not results:
            return "No relevant results found on TMDB for that query."

        # Return results as a JSON string for the agent
        print(f"TMDB Raw Results Found: {len(results)}")
        return json.dumps(results, indent=2)

    except Exception as e:
        print(f"Error during TMDB search: {e}")
        return f"Error searching TMDB: {e}"


def search_spotify(query: str) -> str:
    """
    Searches Spotify for tracks based on a query.
    Formats results including track name, artists, album, and Spotify URL.
    """
    print(f"\n--- Executing Spotify Search ---")
    print(f"Query: {query}")
    if not spotify:
        return "Spotify client not initialized. Cannot search."
    results = []
    try:
        # Search tracks - usually most relevant for song recommendations
        search_results = spotify.search(
            q=query, type="track", limit=15
        )  # Get a few more to allow filtering

        if not search_results or not search_results.get("tracks", {}).get("items"):
            return "No relevant tracks found on Spotify for that query."

        for item in search_results["tracks"]["items"]:
            details = {
                "id": item["id"],
                "name": item["name"],
                "artists": [artist["name"] for artist in item["artists"]],
                "album": item["album"]["name"],
                "release_date": item["album"]["release_date"],
                "popularity": item["popularity"],  # 0-100 score
                "url": item["external_urls"].get("spotify", "No URL available"),
                "media_type": "music",
            }
            results.append(details)

        if not results:
            return "No relevant tracks found on Spotify for that query."

        print(f"Spotify Raw Results Found: {len(results)}")
        return json.dumps(results, indent=2)  # Return as JSON string

    except Exception as e:
        print(f"Error during Spotify search: {e}")
        return f"Error searching Spotify: {e}"


# --- Create Langchain Tools ---

tools = [
    Tool(
        name="SearchTMDB",
        func=search_tmdb,
        description="Use this tool to search for MOVIE or WEB SERIES (TV show) recommendations on The Movie Database. Provide a descriptive query based on user preferences (mood, genre, language, actors, plot hints, year, etc.) and specify the media_type ('movie' or 'tv').",
        args_schema=TMDBSearchInput,
    ),
    Tool(
        name="SearchSpotify",
        func=search_spotify,
        description="Use this tool to search for MUSIC (song) recommendations on Spotify. Provide a descriptive query based on user preferences (mood, genre, language, artists, year, etc.).",
        args_schema=SpotifySearchInput,
    ),
]

# --- Define User Preferences (Hardcoded) ---

user_preferences = {
    "media_type": "movie",  # Options: "movie", "music", "web_series"
    "mood": "uplifting and heartwarming",
    "language": "English",
    "categories": ["based on true story", "inspirational"],
    "media_age": "released after 2010",  # Becomes part of the search query
    "occasion": "casual watching alone",
    "rating": "highly rated",  # Agent needs to interpret this (e.g., include in query)
    "other_details": "Something similar to 'The Intouchables' or 'Forrest Gump'.",  # Add specific hints
}

# --- Create Prompt Template ---

# Pull a base ReAct prompt template
# You can customize this significantly for better control
prompt_template = hub.pull(
    "hwchase17/react-json"
)  # Uses JSON structure for thoughts/actions

# Customize the instructions within the template if needed, or add context here
# This example focuses on crafting the input to guide the standard template.

# Construct the input string for the agent
input_prompt = f"""
You are a helpful recommendation assistant. Your goal is to find the 5 best media recommendations based on the user's preferences.

User Preferences:
- Media Type: {user_preferences['media_type']}
- Mood: {user_preferences['mood']}
- Language: {user_preferences['language']}
- Categories: {', '.join(user_preferences['categories'])}
- Media Age: {user_preferences['media_age']}
- Occasion: {user_preferences['occasion']}
- Desired Rating: {user_preferences['rating']}
- Other Details: {user_preferences['other_details']}

Available Tools:
- SearchTMDB: For finding movies or web series (use 'tv' for web series).
- SearchSpotify: For finding music tracks.

Instructions:
1. Determine the correct tool to use based on the 'Media Type' preference ('movie' or 'web_series' -> SearchTMDB, 'music' -> SearchSpotify).
2. Craft a concise and effective search query for the chosen tool, incorporating the user's preferences (mood, language, categories, age, rating hints, other details). Be specific! For example, instead of just 'happy movie', search for 'uplifting heartwarming english movie based on true story after 2010 highly rated'.
3. Execute the search using the chosen tool.
4. Analyze the search results returned by the tool.
5. Select the **top 5** recommendations that best match ALL the user's preferences. Consider relevance, rating/popularity, and how well they fit the mood, categories, and other details.
6. Format your final answer as a single JSON object containing a single key "recommendations". This key should hold a list of exactly 5 recommendation objects.
7. Each recommendation object in the list must include: 'title' (for movies/tv) or 'name' (for music), 'media_type', 'year' (or release_date), 'description' (overview for TMDB, artists/album for Spotify), and 'source_id' (TMDB id or Spotify id). Include 'rating' or 'popularity' if available.

Example JSON output structure:
{{
  "recommendations": [
    {{
      "title": "Example Movie Title",
      "media_type": "movie",
      "year": "2015",
      "description": "A brief overview of the movie...",
      "rating": 8.1,
      "source_id": 12345
    }},
    {{
      "name": "Example Song Name",
      "media_type": "music",
      "year": "2020",
      "description": "Artist Name - Album Name",
      "popularity": 75,
      "source_id": "spotify:track:abcde12345"
    }},
    // ... more recommendations (up to 5 total)
  ]
}}

Begin!
"""

# --- Create Agent ---

# Use the create_react_agent function with the customized prompt logic
# Ensure the prompt template has placeholders for 'input', 'agent_scratchpad', 'tools', 'tool_names'
agent = create_react_agent(llm, tools, prompt_template)

# --- Create Agent Executor ---

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,  # Set to True to see the agent's thought process
    handle_parsing_errors=True,  # Try to recover from LLM mistakes in formatting
    max_iterations=5,  # Prevent runaway agents
)

# --- Run the Agent ---

print("\n--- Invoking Agent ---")
try:
    response = agent_executor.invoke({"input": input_prompt})

    # The final response should be in the 'output' key
    final_output_str = response.get("output", "{}")
    print("\n--- Agent Raw Output ---")
    print(final_output_str)

    # Attempt to parse the final output string as JSON
    print("\n--- Parsing Final Output as JSON ---")
    try:
        recommendations_json = json.loads(final_output_str)
        # Validate the structure (basic check)
        if (
            isinstance(recommendations_json, dict)
            and "recommendations" in recommendations_json
            and isinstance(recommendations_json["recommendations"], list)
        ):
            print("\n--- Final Recommendations (JSON) ---")
            print(json.dumps(recommendations_json, indent=2))
        else:
            print("\n--- WARNING: Agent output is not in the expected JSON format ---")
            print("Raw output was:")
            print(final_output_str)

    except json.JSONDecodeError as json_err:
        print(f"\n--- ERROR: Failed to parse agent's final output as JSON. ---")
        print(f"Error: {json_err}")
        print("Raw output was:")
        print(final_output_str)

except Exception as e:
    print(f"\n--- An error occurred during agent execution: {e} ---")

print("\n--- Script Finished ---")
