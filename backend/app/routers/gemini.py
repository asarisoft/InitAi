from fastapi import APIRouter
from app.schemas.models import GeminiVerifyRequest, GeminiStatusResponse
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/gemini", tags=["Gemini Token Quota Verification"])

@router.get("/status", response_model=GeminiStatusResponse)
def get_gemini_status():
    """
    Returns current live connection status and token quota of the backend GEMINI_API_KEY.
    """
    result = gemini_service.verify_token_quota()
    return GeminiStatusResponse(**result)

@router.post("/verify", response_model=GeminiStatusResponse)
def verify_gemini_key(payload: GeminiVerifyRequest):
    """
    Actively tests an API key live with a real Gemini request to verify token quota.
    """
    result = gemini_service.verify_token_quota(api_key=payload.api_key)
    return GeminiStatusResponse(**result)
