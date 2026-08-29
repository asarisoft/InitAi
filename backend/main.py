from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

app = FastAPI(
    title="InitAI Backend API",
    description="Backend API for InitAI AI Agent Web Studio",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Data Models -----------------

class SkillItem(BaseModel):
    id: str
    name: str
    category: str
    github_url: str
    description: str
    advantages: List[str]
    install_guide: Optional[str] = None
    selected: bool = True

class ChatMessage(BaseModel):
    role: str
    content: str
    step: Optional[int] = 1

class ChatRequest(BaseModel):
    message: str
    step: int = 1 # 1: PRD Interview, 2: Design Ref, 3: Skills, 4: Done
    interview_turn: int = 1
    conversation_history: List[ChatMessage] = []
    selected_skills: Optional[List[SkillItem]] = None
    project_data: Optional[Dict[str, Any]] = Field(default_factory=dict)

class ChatResponse(BaseModel):
    reply: str
    next_step: int
    interview_turn: int
    is_step_complete: bool
    data_extracted: Optional[Dict[str, Any]] = None
    suggested_skills: Optional[List[SkillItem]] = None

class GenerateFilesRequest(BaseModel):
    project_name: str = "My Project"
    prd_summary: str
    target_users: Optional[str] = "Developers and Designers"
    tech_stack: Optional[str] = "ReactJS, FastAPI, Docker, TailwindCSS"
    design_references: Optional[str] = "Modern Dark/Light SaaS Studio (Pacdora/Figma style)"
    selected_skills: List[SkillItem] = []

class GenerateFilesResponse(BaseModel):
    prd_md: str
    list_skills_md: str
    systemdesign_md: str

# ----------------- Mock Data & Helpers -----------------

DEFAULT_TREND_SKILLS: List[SkillItem] = [
    SkillItem(
        id="brainstorming",
        name="AI Brainstorming & PRD Synthesizer",
        category="Development",
        github_url="https://github.com/microsoft/autogen",
        description="Merumuskan ide liar menjadi user stories, MVP scope, dan PRD yang executable.",
        advantages=["Struktur PRD otomatis terstandarisasi", "Mengurangi risiko scope creep", "Analisis risiko sejak dini"],
        install_guide="npx @initai/skill-brainstorming init"
    ),
    SkillItem(
        id="writing-plans",
        name="Executable Plan Writer",
        category="Development",
        github_url="https://github.com/anthropics/anthropic-cookbook",
        description="Menulis langkah-langkah implementasi modular dengan checklist pengujian.",
        advantages=["Pecah task granular per sprint", "Checklist testing otomatis", "Menghubungkan acceptance criteria ke code"],
        install_guide="npm install -g initai-plan-generator"
    ),
    SkillItem(
        id="ui-fe-design",
        name="Modern Web Studio UI/UX",
        category="UI/UX",
        github_url="https://github.com/tailwindlabs/tailwindcss",
        description="Arsitektur antarmuka modern dengan design tokens, micro-interactions, dan dark mode.",
        advantages=["Design token konsisten", "Aksesibilitas WCAG AA (rasio 4.5:1)", "Performa 60fps micro-animations"],
        install_guide="npm install @initai/ui-design-tokens"
    ),
    SkillItem(
        id="be-api-arch",
        name="FastAPI Asynchronous Architecture",
        category="Development",
        github_url="https://github.com/tiangolo/fastapi",
        description="Perancangan RESTful & WebSocket API dengan throughput tinggi dan clean architecture.",
        advantages=["Async/await I/O non-blocking", "OpenAPI (Swagger) otomatis", "Validasi tipe data ketat dengan Pydantic"],
        install_guide="pip install fastapi uvicorn pydantic"
    ),
    SkillItem(
        id="db-modeling",
        name="Relational & Vector Data Modeling",
        category="Development",
        github_url="https://github.com/sqlalchemy/sqlalchemy",
        description="Perancangan skema relasional teroptimasi beserta embedding vector index.",
        advantages=["Skema ternormalisasi & index efisien", "Dukungan PgVector untuk RAG", "Migrasi skema otomatis (Alembic)"],
        install_guide="pip install sqlalchemy alembic pgvector"
    ),
    SkillItem(
        id="code-review",
        name="Automated Semantic Code Review",
        category="Code Review",
        github_url="https://github.com/astral-sh/ruff",
        description="Analisis mendalam terhadap struktur kode, edge cases, dan kebersihan arsitektur.",
        advantages=["Linting instan berkecepatan tinggi", "Deteksi code smells & antipatterns", "Saran refactoring real-time"],
        install_guide="pip install ruff || npm install eslint"
    ),
    SkillItem(
        id="security-review",
        name="OWASP & Zero-Trust Security Reviewer",
        category="Security",
        github_url="https://github.com/PyCQA/bandit",
        description="Audit keamanan menyeluruh terhadap injeksi, autentikasi, dan sanitasi payload.",
        advantages=["Scan kerentanan kode otomatis", "Audit dependensi CVE", "Pencegahan kebocoran secret/token"],
        install_guide="pip install bandit safety"
    ),
    SkillItem(
        id="qa-testing",
        name="End-to-End Test Automation",
        category="Development",
        github_url="https://github.com/microsoft/playwright",
        description="Framework pengujian otomatis unit, integrasi, dan browser E2E.",
        advantages=["Cross-browser E2E testing", "Snapshot visual regression", "Automasi skenario user journey"],
        install_guide="npx playwright install"
    ),
    SkillItem(
        id="devops-deploy",
        name="Docker & CI/CD Cloud Pipeline",
        category="DevOps",
        github_url="https://github.com/docker/compose",
        description="Kontainerisasi multi-stage dan otomatisasi deployment GitHub Actions.",
        advantages=["Ukuran image container minimal", "Zero-downtime deployment", "Isolasi environment terjamin"],
        install_guide="docker compose up --build"
    )
]

# ----------------- Endpoints -----------------

@app.get("/health")
def health_check():
    return {"status": "ok", "app": "InitAI Backend", "version": "1.0.0"}

@app.get("/skills", response_model=List[SkillItem])
def get_skills():
    return DEFAULT_TREND_SKILLS

@app.post("/chat", response_model=ChatResponse)
def handle_chat(req: ChatRequest):
    step = req.step
    user_input = req.message.strip()
    turn = req.interview_turn

    # Step 1: PRD Interview Loop
    if step == 1:
        if turn == 1:
            # First turn: AI asks follow-up on target audience & key MVP features
            reply = (
                f"💡 **Ide Proyek Diterima:** *\"{user_input}\"*\n\n"
                "Untuk menyusun `prd.md` yang kaya dan *executable*, mari pertegas 2 poin berikut:\n"
                "1. **Target Pengguna Utama:** Siapa yang akan paling sering memakai produk ini?\n"
                "2. **Fitur Kunci MVP (Fase 1):** Apa 2-3 fitur wajib yang harus ada di versi perdana?\n\n"
                "*(Jawab singkat saja, AI akan merangkum seluruh spesifikasinya.)*"
            )
            return ChatResponse(
                reply=reply,
                next_step=1,
                interview_turn=2,
                is_step_complete=False,
                data_extracted={"core_idea": user_input}
            )
        else:
            # Second turn: Info is sufficient! Transition to Step 2
            reply = (
                "✅ **Informasi PRD Sudah Cukup Lengkap & Matang!**\n\n"
                "Spesifikasi inti, target persona, dan batasan MVP telah berhasil dirumuskan ke dalam draf `prd.md`.\n\n"
                "--- \n\n"
                "### 🎨 **Tahap 2: Referensi Desain & UI/UX**\n"
                "Silakan masukkan **URL referensi visual** (misal: *pacdora.com*, *figma.com*, *linear.app*) atau **deskripsi gaya visual** yang diinginkan (contoh: *Dark mode elegan, clean SaaS Web Studio, glassmorphism, accent purple glow*)."
            )
            return ChatResponse(
                reply=reply,
                next_step=2,
                interview_turn=1,
                is_step_complete=True,
                data_extracted={"prd_details": user_input}
            )

    # Step 2: Design References Analysis
    elif step == 2:
        reply = (
            f"🎯 **Analisis Gaya Desain Berhasil!**\n\n"
            f"Referensi visual *\"{user_input}\"* telah dipetakan ke dalam panduan arsitektur UI:\n"
            "• **Theme Palette:** Modern Dark/Light SaaS Studio (Deep slate background + Neon emerald / Indigo accents)\n"
            "• **Layout Structure:** Collapsible Sidebar Navigation + Workspace Chat Panel + Interactive Inspector Grid\n"
            "• **Design Tokens:** Standar WCAG AA (kontras > 4.5:1), smooth 60fps micro-animations, dan modular responsive layout.\n\n"
            "Data ini siap disematkan ke dalam rancangan `systemdesign.md`.\n\n"
            "--- \n\n"
            "### ⚡ **Tahap 3: Konfirmasi Skill & Rekomendasi Tren AI (Web Search Simulation)**\n"
            "Sistem telah melakukan penelusuran tren teknologi terbaru. Berikut daftar 9 skill agen standar yang disarankan untuk proyek Anda.\n\n"
            "Silakan tinjau kartu skill di bawah ini. Anda dapat **menambah skill custom**, **memilih/menghapus skill**, atau klik **'Selesai & Generate Files'** jika sudah sesuai."
        )
        return ChatResponse(
            reply=reply,
            next_step=3,
            interview_turn=1,
            is_step_complete=True,
            data_extracted={"design_guidelines": user_input},
            suggested_skills=DEFAULT_TREND_SKILLS
        )

    # Step 3: Skills Confirmation & Completion
    elif step == 3:
        skills_count = len(req.selected_skills) if req.selected_skills else len(DEFAULT_TREND_SKILLS)
        reply = (
            f"🎉 **Semua 3 Tahapan Selesai! {skills_count} Skill Siap Dikonfigurasi.**\n\n"
            "Seluruh artefak markdown telah berhasil di-generate secara lengkap dan siap Anda unduh:\n"
            "1. `prd.md` — Product Requirements Document yang *executable*.\n"
            "2. `list_skills.md` — Daftar skill pilihan lengkap dengan link GitHub & keunggulan.\n"
            "3. `systemdesign.md` — Arsitektur sistem, skema database, dan panduan desain UI SaaS Studio.\n\n"
            "Silakan klik tombol unduh pada panel file di bawah ini."
        )
        return ChatResponse(
            reply=reply,
            next_step=4,
            interview_turn=1,
            is_step_complete=True
        )

    else:
        return ChatResponse(
            reply="Proses konfigurasi telah selesai. Anda dapat mendownload seluruh file artefak di bawah.",
            next_step=4,
            interview_turn=1,
            is_step_complete=True
        )

@app.post("/generate-files", response_model=GenerateFilesResponse)
def generate_files(payload: GenerateFilesRequest):
    # 1. Generate prd.md
    prd_content = f"""# Product Requirements Document (PRD) — {payload.project_name}

## 1. Executive Summary
{payload.prd_summary}

## 2. Target Users & Personas
- **Primary Users:** {payload.target_users}
- **Need:** Memerlukan platform otomasi cerdas yang modular, cepat, dan mudah dioperasikan.

## 3. Core MVP Features
- [x] **Interactive AI Interview Wizard:** 3-step dynamic conversation loop with completeness checks.
- [x] **Real-time Skill Customization:** Categorized skill grid with live trend recommendations.
- [x] **Zero-Friction Markdown Artifact Generator:** Auto-packaging PRD, Skills, and System Architecture into downloadable files.

## 4. Technical Stack Recommendation
- **Frontend:** {payload.tech_stack.split(',')[0].strip() if ',' in payload.tech_stack else payload.tech_stack} (Vite + ReactJS)
- **Backend:** FastAPI (Python 3.11+, Asynchronous, Uvicorn)
- **Containerization:** Docker & Docker Compose
- **Design Tokens:** Modern SaaS Studio Theme (WCAG AA Compliant)

## 5. Acceptance Criteria
- [x] Web client renders with zero console errors.
- [x] All 3 markdown files export successfully with valid Blob payloads.
- [x] Responsive layout with instant Light/Dark mode switching.
"""

    # 2. Generate list_skills.md
    skills = payload.selected_skills if payload.selected_skills else DEFAULT_TREND_SKILLS
    skills_lines = []
    for s in skills:
        adv_bullets = "\n".join([f"    - {a}" for a in s.advantages])
        install = s.install_guide if s.install_guide else "Lihat dokumentasi repositori GitHub."
        skills_lines.append(f"""### 🔹 {s.name} (`{s.category}`)
- **Repository:** [{s.github_url}]({s.github_url})
- **Deskripsi:** {s.description}
- **Keunggulan & Fitur Utama:**
{adv_bullets}
- **Panduan Instalasi:** `{install}`
""")

    skills_content = f"""# Approved AI Agent Skills & Toolchain

Daftar skill dan perkakas terverifikasi untuk proyek **{payload.project_name}**:

{"".join(skills_lines)}

---
*Dihasilkan secara otomatis oleh InitAI Agent Studio.*
"""

    # 3. Generate systemdesign.md
    sysdesign_content = f"""# System Design & Architecture — {payload.project_name}

## 1. High-Level Architecture Overview
Sistem dibangun mengadopsi arsitektur **Web Studio SaaS** (terinspirasi dari Pacdora/Figma) yang memisahkan client presentation tier dan asynchronous backend service.

```
┌─────────────────────────────────────────────────────────┐
│              Client Browser (React 18 + Vite)           │
│  - Modern SaaS Studio Layout (Sidebar + Chat + Grid)     │
│  - Zero-Backend Mock Fallback Engine                    │
│  - Client-Side Markdown & Blob Stream Exporter          │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTP REST / WebSocket
┌───────────────────────────▼─────────────────────────────┐
│              FastAPI Asynchronous Backend Tier          │
│  - Multi-turn Conversational Interview Handler          │
│  - Live AI Skill Recommendation & Trend Search Engine   │
│  - OpenAPI & Pydantic Data Contract Validation          │
└─────────────────────────────────────────────────────────┘
```

## 2. Design System & UI Specifications
- **Style Archetype:** {payload.design_references}
- **Color Palette:**
  - Dark Mode Background: `#0B0F19` (Deep Obsidian Canvas)
  - Card & Surface: `#111827` / `#1F2937` with `rgba(255,255,255,0.06)` subtle border
  - Brand Accent: `#6366F1` (Indigo Glow) & `#10B981` (Emerald Success)
  - Text Contrast: Minimum 4.5:1 ratio compliant with WCAG 2.1 AA
- **Micro-Interactions:** 60fps CSS GPU-accelerated transitions for hover, typing shimmer, and dialog presentation.

## 3. Data Flow & State Machine
1. **Turn 1 (PRD Gathering):** Captures user problem statement & value proposition.
2. **Turn 2 (UI/Design Ref):** Analyzes visual inspirations and extracts design tokens.
3. **Turn 3 (Skill Selection):** Curates dynamic skill matrix with search trends.
4. **Turn 4 (Artifact Packaging):** Produces downloadable `prd.md`, `list_skills.md`, and `systemdesign.md`.

---
*Dokumen arsitektur ini siap digunakan sebagai acuan pengembangan tim engineering.*
"""

    return GenerateFilesResponse(
        prd_md=prd_content,
        list_skills_md=skills_content,
        systemdesign_md=sysdesign_content
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
