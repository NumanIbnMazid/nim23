{random_intro} {media_type} recommendations based on the following user preferences:

- Mood: {mood}
- Occasion: {occasion}
- Preferred Genres: {genres}
- Language: {language}
- Age Preference (Release Year): {media_age}
- Rating Importance: {rating}
- Special Categories: {categories}
- Other Preferences: {other_preferences}

---

## 🔍 STEP 1: Discover titles

If the Age Preference (release year) is after 2023, start by using the `search` tool to find candidate titles.

Use queries like:
- “Top {language} {genres} {media_type} releasing in {media_age}”
- Include keywords such as: top rated, new, trending, popular, 2025, etc.

Select at least **5 media items** that are **most relevant** to the user’s preferences.

If a particular piece of metadata is not available, leave that field as an empty string (`""`) — **do not invent or guess**. Do not hasitate to keep them blank but you must return the result.

If search results are too broad, use the `search` tool to refine the search to narrow down the results.

---

## ✅ FINAL RESPONSE FORMAT

When all metadata is gathered, respond in the exact format below:

```json
{{
  "action": "Final Answer",
  "action_input": [
    {{
      "title": "string",
      "media_type": {media_type},
      "description": "string",
      "languages": ["string"],
      "genres": ["string"],
      "category_tags": ["string"],
      "release_year": "string",
      "rating": "string",
      "review_link": "string",
      "youtube_link": "string",
      "music_spotify_link": "string",
      "music_soundcloud_link": "string",
      "music_youtube_link": "string"
    }}
    // ... total of 5 items
  ]
}}

(Just search for and provide title, media_type, description, generes, release_year if available. Keep others blank.)
