from project.router import router
from humanizer_ai.api.views import HumanizerAiViewset

router.register("humanizer-ai", HumanizerAiViewset, basename="humanizer_ai")
