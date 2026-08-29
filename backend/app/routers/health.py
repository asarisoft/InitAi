from fastapi import APIRouter
from app.schemas.models import HealthResponse
from app.core.config import settings
from app.services.gemini_service import gemini_service

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def health_check():
    is_llm_connected = gemini_service.is_available()
    llm_status_text = (
        "Connected (Google Gemini Live LLM Active)"
        if is_llm_connected
        else "Disconnected (Local Mock Fallback Mode - No API Key Set)"
    )

    return HealthResponse(
        status="ok",
        app=settings.PROJECT_NAME,
        version=settings.VERSION,
        llm_connected=is_llm_connected,
        llm_status=llm_status_text,
        llm_model=gemini_service.model_name if is_llm_connected else None,
        features=[
            "Proactive Idea Enrichment",
            "Modular Clean Architecture",
            "4 Markdown Deliverables",
            "Tool Calling Specs",
            "Active LLM Health Monitoring",
            "Pydantic v2 Contracts"
        ]
    )
