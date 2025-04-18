from rest_framework.throttling import SimpleRateThrottle

class MediaInfoRateThrottle(SimpleRateThrottle):
    scope = 'grabit_rate_limit'

    def get_cache_key(self, request, view):
        # Use IP address for anonymous users
        return self.get_ident(request)


class RecommendrRateThrottle(SimpleRateThrottle):
    scope = 'recommendr_rate_limit'

    def get_cache_key(self, request, view):
        # Use IP address for anonymous users
        return self.get_ident(request)
