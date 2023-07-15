from django.views.generic import TemplateView
from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin


class IndexView(LoginRequiredMixin, TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Backend Base URL
        context["backend_base_url"] = settings.BACKEND_BASE_URL

        # Frontend Base URL=
        context["frontend_base_url"] = settings.FRONTEND_BASE_URL
        return context
