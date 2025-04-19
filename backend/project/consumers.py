import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
from django.core.cache import cache
import asyncio


logger = logging.getLogger("recommendr")


class LogConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.info("🟢 WebSocket connected (LogConsumer)")
        await self.channel_layer.group_add("log_group", self.channel_name)
        await self.accept()
        # Start a background task for keep-alive (pinging)
        self.keep_alive_task = asyncio.create_task(self.keep_alive())

    async def disconnect(self, close_code):
        if hasattr(self, "keep_alive_task"):
            self.keep_alive_task.cancel()
        logger.info(f"🔴 WebSocket disconnected (code: {close_code})")
        await self.channel_layer.group_discard("log_group", self.channel_name)

    async def keep_alive(self):
        logger.info("🟢 Keep-alive started")
        try:
            while True:
                await asyncio.sleep(20)  # Adjust ping interval as needed
                await self.send(text_data="ping")
        except asyncio.CancelledError:
            pass

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
