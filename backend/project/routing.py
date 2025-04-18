from django.urls import path
from project.consumers import LogConsumer


# ----------------------------------------------------
# *** Websocket URLs ***
# ----------------------------------------------------
websocket_urlpatterns = [
    path("ws/logs/", LogConsumer.as_asgi()),
]
