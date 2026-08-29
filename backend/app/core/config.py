import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables from .env file if present
load_dotenv()

raw_cors = os.getenv("CORS_ORIGINS", "*").strip()
if raw_cors == "*" or not raw_cors:
    parsed_cors = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]
else:
    parsed_cors = [origin.strip() for origin in raw_cors.split(",") if origin.strip()]

class Settings(BaseModel):
    PROJECT_NAME: str = "InitAI Backend API & Idea Enrichment Engine"
    VERSION: str = "2.0.0"
    DESCRIPTION: str = "Modular Conversational AI Architecture with Proactive Idea Enrichment & Tool Calling"
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    # LLM Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash").strip()
    GEMINI_TEMPERATURE: float = float(os.getenv("GEMINI_TEMPERATURE", "0.7"))
    GEMINI_TOP_P: float = float(os.getenv("GEMINI_TOP_P", "0.95"))
    GEMINI_MAX_OUTPUT_TOKENS: int = int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS", "4096"))
    
    # CORS
    CORS_ORIGINS: list[str] = parsed_cors

settings = Settings()
