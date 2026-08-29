from fastapi import APIRouter
from app.schemas.models import HealthResponse
from app.core.config import settings
from app.services.llm_manager import llm_manager

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
async def health_check():
    active_provider = llm_manager.get_active_provider_name()
    is_llm_connected = active_provider in ["gemini", "openai"]
    
    if active_provider == "gemini":
        from app.services.gemini_service import gemini_service
        model_name = gemini_service.model_name
        llm_status_text = f"Connected (Google Gemini Live: {model_name})"
    elif active_provider == "openai":
        from app.services.openai_service import openai_service
        model_name = openai_service.model_name
        llm_status_text = f"Connected (OpenAI Live: {model_name})"
    else:
        model_name = None
        llm_status_text = "Disconnected (Local Mock Fallback Mode - No API Key Set)"

    return HealthResponse(
        status="ok",
        app=settings.PROJECT_NAME,
        version=settings.VERSION,
        provider=active_provider,
        llm_connected=is_llm_connected,
        llm_status=llm_status_text,
        llm_model=model_name,
        features=[
            "Multi-Provider LLM (Gemini + OpenAI)",
            "Proactive Idea Enrichment",
            "Modular Clean Architecture",
            "4 Markdown Deliverables",
            "Tool Calling Specs",
            "Active LLM Health Monitoring",
            "Pydantic v2 Contracts"
        ]
    )
