from django.views.generic import TemplateView
from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin


class IndexView(LoginRequiredMixin, TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Backend Base URL
        backend_base_url = "http://localhost:8000" if settings.DEBUG else "https://nim23.com/backend"
        context["backend_base_url"] = backend_base_url

        # Frontend Base URL
        frontend_base_url = "http://localhost:3000" if settings.DEBUG else "https://nim23.com"
        context["frontend_base_url"] = frontend_base_url
        return context
