import json
import logging
from typing import Optional, Dict, Any, List
from app.core.config import settings
from app.schemas.models import SuggestedOption, SkillItem
from app.services.skills_service import DEFAULT_TREND_SKILLS

logger = logging.getLogger(__name__)

class GeminiService:
    """
    Google Gemini Native Tool Calling Service.
    Seamlessly falls back to local enrichment if GEMINI_API_KEY is not configured.
    """

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Initialized Google Gemini Client successfully.")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini Client: {e}")

    def is_available(self) -> bool:
        return self.client is not None

    async def call_enrichment_tool(self, user_prompt: str) -> Optional[List[SuggestedOption]]:
        """
        Executes Gemini with structured function calling to enrich user's core idea.
        """
        if not self.is_available():
            return None

        try:
            from google import genai
            from google.genai import types

            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=f"Analisis ide proyek software berikut dan usulkan 3 variasi konsep arsitektur & MVP: '{user_prompt}'",
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema={
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "string"},
                                "title": {"type": "string"},
                                "description": {"type": "string"},
                                "prompt_payload": {"type": "string"},
                                "badge": {"type": "string"}
                            },
                            "required": ["id", "title", "description", "prompt_payload", "badge"]
                        }
                    }
                )
            )

            if response.text:
                data = json.loads(response.text)
                return [SuggestedOption(**item) for item in data]
        except Exception as e:
            logger.warning(f"Gemini API call error (falling back to local engine): {e}")

        return None

gemini_service = GeminiService()
