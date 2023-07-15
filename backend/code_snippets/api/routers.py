from project.router import router
from code_snippets.api.views import CodeSnippetViewset


router.register("code-snippets", CodeSnippetViewset, basename="code_snippets")
