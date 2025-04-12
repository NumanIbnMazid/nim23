from project.router import router
from detect_ai.api.views import DetectAiViewset

router.register("detect-ai", DetectAiViewset, basename="detect_ai")
