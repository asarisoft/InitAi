from fastapi import APIRouter
from app.schemas.models import HealthResponse
from app.core.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="ok",
        app=settings.PROJECT_NAME,
        version=settings.VERSION,
        features=[
            "Proactive Idea Enrichment",
            "Modular Clean Architecture",
            "4 Markdown Deliverables",
            "Tool Calling Specs",
            "Pydantic v2 Contracts"
        ]
    )
