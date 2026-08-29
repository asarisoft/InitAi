import logging
from typing import Optional, Dict, Any, List
from app.core.config import settings
from app.services.gemini_service import gemini_service
from app.services.openai_service import openai_service

logger = logging.getLogger(__name__)

class LLMManager:
    """
    Unified Multi-Provider LLM Orchestrator.
    Dynamically routes requests between Google Gemini, OpenAI, or Local Engine.
    """

    def __init__(self):
        self.preferred_provider = settings.LLM_PROVIDER # 'auto', 'gemini', 'openai'

    def get_active_provider_name(self) -> str:
        """Determines which provider is currently prioritized and available."""
        if self.preferred_provider == "openai":
            return "openai" if openai_service.is_available() else "local"
        elif self.preferred_provider == "gemini":
            return "gemini" if gemini_service.is_available() else "local"
        else: # 'auto'
            if gemini_service.is_available():
                return "gemini"
            elif openai_service.is_available():
                return "openai"
            return "local"

    def is_any_llm_available(self) -> bool:
        return gemini_service.is_available() or openai_service.is_available()

    async def get_status(self) -> Dict[str, Any]:
        """
        Returns the unified status of the active LLM provider.
        """
        active_provider = self.get_active_provider_name()

        if active_provider == "gemini":
            gemini_res = gemini_service.verify_token_quota()
            return {
                "provider": "gemini",
                "status": gemini_res.get("status", "unknown"),
                "valid": gemini_res.get("valid", False),
                "model": gemini_res.get("model", gemini_service.model_name),
                "message": gemini_res.get("message", "")
            }
        elif active_provider == "openai":
            openai_res = await openai_service.verify_token_quota()
            return {
                "provider": "openai",
                "status": openai_res.get("status", "unknown"),
                "valid": openai_res.get("valid", False),
                "model": openai_res.get("model", openai_service.model_name),
                "message": openai_res.get("message", "")
            }
        else:
            return {
                "provider": "local",
                "status": "missing_key",
                "valid": False,
                "model": "local-enrichment-engine",
                "message": "Belum ada API Key (Gemini / OpenAI) yang aktif. Menggunakan Local Intelligent Engine."
            }

    async def verify_provider(
        self,
        provider: str,
        api_key: Optional[str] = None,
        model: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Tests a specific provider key live.
        """
        provider_clean = (provider or "auto").strip().lower()

        if provider_clean == "openai":
            res = await openai_service.verify_token_quota(api_key=api_key, model=model)
            if res.get("valid"):
                self.preferred_provider = "openai"
            return res
        elif provider_clean == "gemini":
            res = gemini_service.verify_token_quota(api_key=api_key)
            if res.get("valid"):
                self.preferred_provider = "gemini"
            return {
                "provider": "gemini",
                **res
            }
        else: # auto
            # Try gemini first, then openai
            if api_key:
                if api_key.startswith("AIzaSy"):
                    return await self.verify_provider("gemini", api_key=api_key)
                elif api_key.startswith("sk-"):
                    return await self.verify_provider("openai", api_key=api_key, model=model)
            return await self.get_status()

    async def generate_live_chat_response(
        self,
        step: int,
        turn: int,
        user_message: str,
        project_data: Dict[str, Any],
        conversation_history: List[Any]
    ) -> Optional[Dict[str, Any]]:
        """
        Routes chat reasoning to the active LLM provider.
        """
        active_provider = self.get_active_provider_name()

        if active_provider == "gemini":
            res = await gemini_service.generate_live_chat_response(
                step=step,
                turn=turn,
                user_message=user_message,
                project_data=project_data,
                conversation_history=conversation_history
            )
            if res:
                return res

        elif active_provider == "openai":
            res = await openai_service.generate_live_chat_response(
                step=step,
                turn=turn,
                user_message=user_message,
                project_data=project_data,
                conversation_history=conversation_history
            )
            if res:
                return res

        return None

llm_manager = LLMManager()
