import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "InitAI Backend API & Idea Enrichment Engine"
    VERSION: str = "2.0.0"
    DESCRIPTION: str = "Modular Conversational AI Architecture with Proactive Idea Enrichment & Tool Calling"
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    CORS_ORIGINS: list[str] = ["*"]

settings = Settings()
