from config.router import router
from blogs.api.views import BlogViewset


router.register("blogs", BlogViewset, basename="code_snippets")
