from project.router import router
from recommendr.api.views import RecommendationViewSet

router.register("recommendr", RecommendationViewSet, basename="recommendr")
