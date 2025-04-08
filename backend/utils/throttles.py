from rest_framework.throttling import SimpleRateThrottle

class MediaInfoRateThrottle(SimpleRateThrottle):
    scope = 'media_info'

    def get_cache_key(self, request, view):
        # Use IP address for anonymous users
        return self.get_ident(request)
