from project.router import router
from blogs.api.views import BlogViewset, BlogCommentViewset, BlogViewViewset


router.register("blogs", BlogViewset, basename="blogs")
router.register("blog-comments", BlogCommentViewset, basename="blog_comments")
router.register("blog-views", BlogViewViewset, basename="blog_views")
