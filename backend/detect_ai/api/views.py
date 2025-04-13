from rest_framework import status, permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from detect_ai.api.serializers import DetectAiRequestSerializer
from utils.helpers import custom_response_wrapper, ResponseWrapper
import os
from openai import OpenAI
from dotenv import load_dotenv
import json


@custom_response_wrapper
class DetectAiViewset(GenericViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = DetectAiRequestSerializer

    @swagger_auto_schema(
        method="post",
        request_body=DetectAiRequestSerializer,
        responses={200: openapi.Response("AI detection result")},
    )
    @action(detail=False, methods=["post"], url_path="detect")
    def detect_ai_text(self, request):
        """
        Detect AI-generated or robotic text
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        input_text = serializer.validated_data["input_text"]

        # Load environment variables
        load_dotenv()
        OPENROUTER_MODEL = os.getenv("AI_DETECTOR_AI_MODEL")
        OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=OPENROUTER_API_KEY,
        )

        try:
            detected_ai_text = ""
            response = client.chat.completions.create(
                model=OPENROUTER_MODEL,
                temperature=0,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an AI content detector. Analyze the following text and respond with only one number "
                            "between 0 and 100 that represents the percentage likelihood that the text was written by AI. "
                            "0 means completely human-written, 100 means completely AI-generated. Respond with only the number."
                        ),
                    },
                    {"role": "user", "content": input_text},
                ],
            )

            if response.choices:
                detected_ai_text = response.choices[0].message.content
                return ResponseWrapper(
                    data={"detected_ai_text": detected_ai_text}, status=status.HTTP_200_OK
                )
            elif response.error:
                return ResponseWrapper(
                    message=f"Failed to detect from text! {response.error.get('message')}",
                    error_message=json.loads(
                        response.error.get("metadata").get("raw")
                    ).get("error"),
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Exception as e:
            return ResponseWrapper(
                message="Failed to Detectt!",
                error_message=str(e),
                status=status.HTTP_400_BAD_REQUEST,
            )
