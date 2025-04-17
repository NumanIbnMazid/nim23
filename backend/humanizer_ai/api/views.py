from rest_framework import status, permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.conf import settings

from others.models import HumanizerAiUtils

from humanizer_ai.api.serializers import HumanizerRequestSerializer
from utils.helpers import custom_response_wrapper, ResponseWrapper
import os
from openai import OpenAI
import anthropic
from google import genai
from google.genai import types
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
        elif client_name == "gemini":
            GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
            client = genai.Client(api_key=GEMINI_API_KEY)
            return client
        else:
            raise ValueError("Invalid client name")

    def get_response(self, client_name, client, model, system_prompt, user_prompt):
        """
        Get the response from the client.
        """
        messages = [
            {
                "role": "system",
                "content": system_prompt,
            },
            {"role": "user", "content": user_prompt},
        ]
        if client_name == "anthropic":
            response = client.messages.create(
                model=model,
                max_tokens=1024,
                messages=messages,
            )
            # TODO: Remove after testing
            # print(f"\n\n🔥🔥🔥Response:🔥🔥🔥\n {response} \n\n")

            if response.content:
                humanized_text = response.content
                return ResponseWrapper(
                    data={"humanized_text": humanized_text}, status=status.HTTP_200_OK
                )
            elif response.error:
                error_message = response.error.get("message")
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
            # print(f"\n\n🔥🔥🔥Response:🔥🔥🔥\n {response} \n\n")

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
        elif client_name == "gemini":
            response = client.models.generate_content(
                model=model,
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    temperature=1.0,
                    max_output_tokens=8192,
                    system_instruction=system_prompt,
                ),
            )
            # TODO: Remove after testing
            # print(f"\n\n🔥🔥🔥Response:🔥🔥🔥\n {response} \n\n")

            if response:
                humanized_text = response.text
                return ResponseWrapper(
                    data={"humanized_text": humanized_text}, status=status.HTTP_200_OK
                )
            elif response.error:
                error_message = response.error.get("message")
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
            system_prompt = HumanizerAiUtils.objects.first().system_prompt
            if not system_prompt:
                raise ValueError("System prompt is empty")
            # print(f"\n\n🔥🔥🔥System Prompt:🔥🔥🔥\n {system_prompt} \n\n")
            # print(f"\n\n🔥🔥🔥Input Text:🔥🔥🔥\n {input_text} \n\n")
            response = self.get_response(
                client_name, client, MODEL, system_prompt, input_text
            )

            return response

        except Exception as e:
            return ResponseWrapper(
                message="Failed to humanize text!",
                error_message=str(e),
                status=status.HTTP_400_BAD_REQUEST,
            )
