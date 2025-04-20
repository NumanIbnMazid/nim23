from django.core.cache import cache
from django.conf import settings

RECOMMENDATION_CACHE_TIMEOUT = getattr(
    settings, "RECOMMENDATION_CACHE_TIMEOUT", 600
)  # in seconds


def get_cache_key(client_id: str, media_type: str) -> str:
    return f"recommendations:{client_id}:{media_type.lower().strip()}"


def extract_titles_by_type(recommendation_response: list) -> dict:
    """
    Extracts titles grouped by media_type from the LLM response.
    Example:
    {
        "movie": ["Inception", "Raavanan"],
        "music": ["Blinding Lights"]
    }
    """
    result = {}
    for item in recommendation_response:
        media_type = item.get("media_type", "").lower().strip()
        title = item.get("title", "").strip()
        if media_type and title:
            result.setdefault(media_type, []).append(title)
    return result


def save_recommendations(client_id: str, media_type: str, titles: list):
    """
    Save new titles under a specific media type for a client.
    Merges with previous ones.
    """
    key = get_cache_key(client_id, media_type)
    existing = set(cache.get(key, []))
    updated = list(existing.union(set(titles)))
    cache.set(key, updated, timeout=RECOMMENDATION_CACHE_TIMEOUT)


def get_previous_titles(client_id: str, media_type: str) -> list:
    """
    Get previously recommended titles for a given media type.
    """
    key = get_cache_key(client_id, media_type)
    return cache.get(key, [])


def clear_recommendations(client_id: str, media_type: str = None):
    """
    Clears recommendations for the given client.
    If media_type is None, clears all types.
    """
    if media_type:
        cache.delete(get_cache_key(client_id, media_type))
    else:
        # You can maintain a known media_types list or keep it simple if used infrequently
        for type_guess in ["movie", "music", "tv show", "web series", "documentary"]:
            cache.delete(get_cache_key(client_id, type_guess))
