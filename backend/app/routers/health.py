from fastapi import APIRouter
from app.schemas.models import HealthResponse
from app.core.config import settings
from app.services.llm_manager import llm_manager

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
async def health_check():
    status_data = await llm_manager.get_status()
    is_llm_valid = status_data.get("valid", False)
    provider_name = status_data.get("provider", "local")
    model_name = status_data.get("model")

    if is_llm_valid:
        llm_status_text = f"Connected ({provider_name.upper()} Live: {model_name})"
    else:
        llm_status_text = f"Disconnected ({provider_name.upper()}): {status_data.get('message', 'No active token')}"

    return HealthResponse(
        status="ok",
        app=settings.PROJECT_NAME,
        version=settings.VERSION,
        provider=provider_name,
        llm_connected=is_llm_valid,
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
