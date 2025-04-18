import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
from django.core.cache import cache


logger = logging.getLogger("recommendr")


class LogConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.info("🟢 WebSocket connected (LogConsumer)")
        await self.channel_layer.group_add("log_group", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        logger.info(f"🔴 WebSocket disconnected (code: {close_code})")
        await self.channel_layer.group_discard("log_group", self.channel_name)

    async def send_log(self, event):
        logger.info(f"Sending log message: {event['message']}")
        await self.send(text_data=json.dumps({"message": event["message"]}))

    async def receive(self, text_data):
        data = json.loads(text_data)
        logger.info(f"Received message: {data}")
        if data.get("type") == "ready":
            # Mark this client/user/request as ready
            # You can use a session key, user ID, or IP as identifier
            ip = self.scope["client"][0]
            cache.set(f"ws_ready_{ip}", True, timeout=60)
            logger.info(f"✅ WebSocket ready flag set for {ip}")
        if data.get("type") == "ping":
            await self.send(text_data=json.dumps({"type": "pong"}))
        # Echo message back for test
        await self.send(text_data=json.dumps({"message": data}))
