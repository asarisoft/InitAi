from fastapi import APIRouter
from app.schemas.models import LLMVerifyRequest, LLMStatusResponse
from app.services.llm_manager import llm_manager

router = APIRouter(prefix="/llm", tags=["Multi-Provider LLM Management"])

@router.get("/status", response_model=LLMStatusResponse)
async def get_llm_status():
    """
    Returns active LLM provider (Gemini / OpenAI / Local), connection state, and model.
    """
    status_data = await llm_manager.get_status()
    return LLMStatusResponse(**status_data)

@router.post("/verify", response_model=LLMStatusResponse)
async def verify_llm_key(payload: LLMVerifyRequest):
    """
    Actively tests an API key live for a specific provider (Gemini or OpenAI).
    """
    result = await llm_manager.verify_provider(
        provider=payload.provider,
        api_key=payload.api_key,
        model=payload.model
    )
    return LLMStatusResponse(**result)
