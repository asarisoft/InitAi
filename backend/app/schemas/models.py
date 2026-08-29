from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SuggestedOption(BaseModel):
    id: str
    title: str
    description: str
    prompt_payload: str
    badge: Optional[str] = "Rekomendasi"

class SkillItem(BaseModel):
    id: str
    name: str
    category: str
    github_url: str
    description: str
    advantages: List[str]
    install_guide: Optional[str] = None
    selected: bool = True

class SkillSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=150, description="Nama skill atau perkakas yang dicari")
    category: Optional[str] = Field("Development", max_length=50)

class ChatMessage(BaseModel):
    role: str
    content: str
    step: Optional[int] = 1

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000, description="Pesan / prompt dari user")
    step: int = Field(1, ge=1, le=4, description="Tahapan aktif wizard (1-4)")
    interview_turn: int = Field(1, ge=1, description="Nomor giliran wawancara dalam tahap")
    conversation_history: List[ChatMessage] = Field(default_factory=list)
    selected_skills: Optional[List[SkillItem]] = None
    project_data: Optional[Dict[str, Any]] = Field(default_factory=dict)

class ChatResponse(BaseModel):
    reply: str
    next_step: int
    interview_turn: int
    is_step_complete: bool
    data_extracted: Optional[Dict[str, Any]] = None
    suggested_skills: Optional[List[SkillItem]] = None
    suggested_options: Optional[List[SuggestedOption]] = None

class GenerateFilesRequest(BaseModel):
    project_name: str = Field("My Project", max_length=150)
    prd_summary: str = Field(..., min_length=1, max_length=10000)
    target_users: Optional[str] = Field("Full-Stack Developers, Product Managers, and AI Engineers", max_length=500)
    tech_stack: Optional[str] = Field("React 18, FastAPI, Docker, TailwindCSS", max_length=500)
    design_references: Optional[str] = Field("Modern Dark/Light SaaS Studio (Figma/Linear style)", max_length=1000)
    selected_skills: List[SkillItem] = Field(default_factory=list)
    design_images: Optional[List[Dict[str, Any]]] = Field(default_factory=list)

class GenerateFilesResponse(BaseModel):
    prd_md: str
    list_skills_md: str
    systemdesign_md: str
    readme_md: str

class HealthResponse(BaseModel):
    status: str
    app: str
    version: str
    provider: str = "auto"
    llm_connected: bool
    llm_status: str
    llm_model: Optional[str] = None
    features: List[str]

class LLMVerifyRequest(BaseModel):
    provider: str = Field("auto", description="Provider: 'gemini', 'openai', or 'auto'")
    api_key: Optional[str] = Field(None, max_length=250, description="API Key opsional untuk dites")
    model: Optional[str] = Field(None, max_length=100, description="Model opsional untuk dites")

class LLMStatusResponse(BaseModel):
    provider: str
    status: str
    valid: bool
    model: Optional[str] = None
    message: str

class GeminiVerifyRequest(BaseModel):
    api_key: Optional[str] = Field(None, max_length=200, description="API Key Gemini opsional untuk dites")

class GeminiStatusResponse(BaseModel):
    status: str
    valid: bool
    model: Optional[str] = None
    message: str
