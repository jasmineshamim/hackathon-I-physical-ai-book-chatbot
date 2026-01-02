import requests
import json
from typing import List, Dict, Any
from app.config.settings import settings


class OpenRouterService:
    def __init__(self):
        if not settings.openrouter_api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is not set")

        self.api_key = settings.openrouter_api_key
        self.base_url = settings.openrouter_base_url
        # Use the model from .env if available, otherwise default
        self.model = getattr(settings, 'openrouter_model_name', settings.openrouter_model)

    def generate_response(self, messages: List[Dict[str, str]], context: str = None) -> str:
        """
        Generate response using OpenRouter API
        """
        try:
            # If context is provided, add it to the messages
            if context:
                context_message = {
                    "role": "system",
                    "content": f"Use the following context to answer the user's question:\n\n{context}"
                }
                messages = [context_message] + messages

            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            data = {
                "model": self.model,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 1000,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0
            }

            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                data=json.dumps(data)
            )

            if response.status_code != 200:
                raise Exception(f"OpenRouter API error: {response.status_code} - {response.text}")

            response_data = response.json()

            if "choices" not in response_data or len(response_data["choices"]) == 0:
                raise Exception(f"Invalid response from OpenRouter: {response_data}")

            return response_data["choices"][0]["message"]["content"]
        except Exception as e:
            raise Exception(f"Error generating response with OpenRouter: {str(e)}")