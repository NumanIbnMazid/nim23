from project.router import router
from code_snippets.api.views import CodeSnippetViewset, CodeSnippetCommentViewset, CodeSnippetViewViewset


router.register("code-snippets", CodeSnippetViewset, basename="code_snippets")
router.register("code-snippet-comments", CodeSnippetCommentViewset, basename="code_snippet_comments")
router.register("code-snippet-views", CodeSnippetViewViewset, basename="code_snippet_views")
