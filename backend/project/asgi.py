from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from config import config
import os
import django

if config.MODE == "PRODUCTION":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings.production")
else:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings.development")

django.setup()

import project.routing

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(project.routing.websocket_urlpatterns)
        ),
    }
)
