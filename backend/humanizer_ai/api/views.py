from rest_framework import status, permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from humanizer_ai.api.serializers import HumanizerRequestSerializer
from utils.helpers import custom_response_wrapper, ResponseWrapper
import os
from openai import OpenAI
import anthropic
from dotenv import load_dotenv
import json


@custom_response_wrapper
class HumanizerAiViewset(GenericViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = HumanizerRequestSerializer

    def get_client(self, client_name):
        """
        Get the appropriate client based on the client name.
        """
        if client_name == "anthropic":
            ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
            client = anthropic.Anthropic(
                api_key=ANTHROPIC_API_KEY,
            )
            return client
        elif client_name == "openrouter":
            OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
            client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=OPENROUTER_API_KEY,
            )
            return client
        else:
            raise ValueError("Invalid client name")

    def get_response(self, client_name, client, model, messages):
        """
        Get the response from the client.
        """
        if client_name == "anthropic":
            response = client.messages.create(
                model=model,
                max_tokens=1024,
                messages=messages,
            )
            # TODO: Remove after testing
            print(f"\n\n🔥🔥🔥Response:🔥🔥🔥\n {response} \n\n")
            
            if response.content:
                humanized_text = response.content
                return ResponseWrapper(
                    data={"humanized_text": humanized_text}, status=status.HTTP_200_OK
                )
            elif response.error:
                error_message = response.error.get("message")
                try:
                    error_message = json.loads(
                        response.error.get("metadata").get("raw")
                    ).get("error")
                except Exception as e:
                    pass

                return ResponseWrapper(
                    message=f"Failed to humanize text! Please try again later.",
                    error_message=error_message,
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return response

        elif client_name == "openrouter":
            response = client.chat.completions.create(
                model=model,
                temperature=1,
                messages=messages,
            )
            # TODO: Remove after testing
            print(f"\n\n🔥🔥🔥Response:🔥🔥🔥\n {response} \n\n")

            if response.choices:
                humanized_text = response.choices[0].message.content
                return ResponseWrapper(
                    data={"humanized_text": humanized_text}, status=status.HTTP_200_OK
                )
            elif response.error:
                error_message = response.error.get("message")
                try:
                    error_message = json.loads(
                        response.error.get("metadata").get("raw")
                    ).get("error")
                except Exception as e:
                    pass

                return ResponseWrapper(
                    message=f"Failed to humanize text! Please try again later.",
                    error_message=error_message,
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return response
        else:
            raise ValueError("Invalid client name")

    @swagger_auto_schema(
        method="post",
        request_body=HumanizerRequestSerializer,
        responses={200: openapi.Response("AI-humanized text")},
    )
    @action(detail=False, methods=["post"], url_path="humanize")
    def humanize_text(self, request):
        """
        Humanize AI-generated or robotic text using OpenRouter API
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        input_text = serializer.validated_data["input_text"]

        # Load environment variables
        load_dotenv()
        client_name = os.getenv("HUMANIZER_AI_CLIENT")
        client = self.get_client(client_name)
        MODEL = os.getenv("HUMANIZER_AI_MODEL")

        try:
            humanized_text = ""
            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are a professional writing assistant. Rephrase the following text to sound "
                        "more natural, fluent, and human-written — without changing the original meaning "
                        "or adding or removing anything. Only return the rephrased text. Do not add any introduction, explanation, or comments. "
                    ),
                },
                {"role": "user", "content": input_text},
            ]
            response = self.get_response(client_name, client, MODEL, messages)

            return response

        except Exception as e:
            return ResponseWrapper(
                message="Failed to humanize text!",
                error_message=str(e),
                status=status.HTTP_400_BAD_REQUEST,
            )
