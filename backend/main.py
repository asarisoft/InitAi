import os
import re
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="InitAI Backend API & Idea Enrichment Engine",
    description="Intelligent Conversational AI Backend with Proactive Idea Enrichment & Tool Calling Architecture",
    version="2.0.0"
)

# Enable CORS for local & containerized frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Data Models (Pydantic v2) -----------------

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

class ChatMessage(BaseModel):
    role: str
    content: str
    step: Optional[int] = 1

class ChatRequest(BaseModel):
    message: str
    step: int = 1  # 1: PRD Interview, 2: Design Ref, 3: Skills, 4: Done
    interview_turn: int = 1
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
    project_name: str = "My Project"
    prd_summary: str
    target_users: Optional[str] = "Full-Stack Developers, Product Managers, and AI Engineers"
    tech_stack: Optional[str] = "React 18, FastAPI, Docker, TailwindCSS"
    design_references: Optional[str] = "Modern Dark/Light SaaS Studio (Pacdora/Figma style)"
    selected_skills: List[SkillItem] = Field(default_factory=list)
    design_images: Optional[List[Dict[str, Any]]] = Field(default_factory=list)

class GenerateFilesResponse(BaseModel):
    prd_md: str
    list_skills_md: str
    systemdesign_md: str

# ----------------- Dataset & Tool Calling Registry -----------------

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

# ----------------- Idea Enrichment & Tool Functions -----------------

def enrich_user_idea(user_input: str) -> List[SuggestedOption]:
    """
    Analyzes user idea and proactively generates 3-4 high-value feature & architecture variations.
    Provides clickable options for aspects the user might not have thought of yet.
    """
    clean = user_input.lower()

    if any(k in clean for k in ["ecommerce", "toko", "shop", "marketplace", "retail"]):
        return [
            SuggestedOption(
                id="opt-ecom-1",
                title="B2C Personalized AI Shopping Studio",
                description="Katalog produk dengan rekomendasi visual AI, keranjang instan, & checkout Stripe.",
                prompt_payload="Fokuskan target pada Pembeli Online (B2C) dengan fitur kunci AI Recommendation Engine, Cart Caching Redis, dan Payment Gateway terintegrasi.",
                badge="B2C Flow"
            ),
            SuggestedOption(
                id="opt-ecom-2",
                title="Multi-Vendor Marketplace & Vendor Hub",
                description="Dashboard merchant mandiri, manajemen inventori real-time, dan split payment.",
                prompt_payload="Fokuskan pada Multi-Tenant Marketplace untuk Vendor UMKM dengan fitur Dashboard Analitik Penjualan dan Real-time Stock Sync.",
                badge="Multi-Vendor"
            ),
            SuggestedOption(
                id="opt-ecom-3",
                title="AI Social Commerce & Automated Live Chat",
                description="Chatbot penjualan cerdas terintegrasi WhatsApp & Instagram API.",
                prompt_payload="Targetkan Social Commerce dengan fitur AI Sales Assistant, WhatsApp CRM webhook, dan One-click Checkout.",
                badge="Conversational"
            )
        ]

    elif any(k in clean for k in ["saas", "agent", "ai", "studio", "packag", "cad", "design"]):
        return [
            SuggestedOption(
                id="opt-saas-1",
                title="B2B Pro Studio with Real-time Collaboration",
                description="Kanvas interaktif dengan multi-cursor CRDT (Figma style), Web Worker, dan export 8K.",
                prompt_payload="Target Pengguna: Tim Desainer & Product Engineer B2B. Fitur Kunci: Real-time Multi-cursor Collab, WASM Geometry Kernel, dan Export Multi-format (PDF/PNG/DXF).",
                badge="Enterprise B2B"
            ),
            SuggestedOption(
                id="opt-saas-2",
                title="Developer-First Platform with API & Webhooks",
                description="Headless architecture dengan REST & WebSocket API, CLI tool, dan SDK embeddable.",
                prompt_payload="Target Pengguna: Full-Stack Developers & AI Engineers. Fitur Kunci: Headless API, Embeddable SDK, dan Webhook Dispatcher untuk CI/CD pipeline.",
                badge="Developer Tool"
            ),
            SuggestedOption(
                id="opt-saas-3",
                title="Self-Hosted / Zero-Cloud Privacy Edition",
                description="Berjalan 100% lokal di browser client / local Docker tanpa ketergantungan external cloud.",
                prompt_payload="Target Pengguna: Perusahaan dengan standar privasi tinggi. Fitur Kunci: 100% Offline Local Inference, Client-side Blob generation, dan Zero-Data-Logging.",
                badge="High Privacy"
            )
        ]

    else:
        return [
            SuggestedOption(
                id="opt-gen-1",
                title="Opsi A: SaaS Web App Terintegrasi (Recommended MVP)",
                description="Fokus pada alur pengguna intuitif, auth berbasis JWT/OAuth, dan dashboard analitik.",
                prompt_payload=f"Targetkan Developer & Tim Bisnis untuk {user_input} dengan fitur Authenticated Dashboard, Role-Based Access Control, dan Event Webhooks.",
                badge="SaaS MVP"
            ),
            SuggestedOption(
                id="opt-gen-2",
                title="Opsi B: Real-time Collaborative Engine",
                description="Arsitektur event-driven dengan WebSocket broker untuk kerja tim simultan.",
                prompt_payload=f"Targetkan Tim Kolaboratif untuk {user_input} dengan fitur Live Multi-user Presence, Activity Audit Log, dan Instant Notification.",
                badge="Real-time Team"
            ),
            SuggestedOption(
                id="opt-gen-3",
                title="Opsi C: AI-Powered Autonomous Automation",
                description="Fokus pada otomasi workflow mandiri dengan scheduled background workers & task queues.",
                prompt_payload=f"Targetkan Otomasi Alur Kerja untuk {user_input} dengan fitur Asynchronous Task Queue (Celery/Redis), Webhook Triggers, dan Auto-reporting Markdown.",
                badge="AI Automation"
            )
        ]

# ----------------- Core API Endpoints -----------------

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "app": "InitAI Backend",
        "version": "2.0.0",
        "features": ["Idea Enrichment", "Tool Calling Architecture", "Pydantic v2 Contracts"]
    }

@app.get("/skills", response_model=List[SkillItem])
def get_skills():
    return DEFAULT_TREND_SKILLS

@app.post("/chat", response_model=ChatResponse)
def handle_chat(req: ChatRequest):
    step = req.step
    user_input = req.message.strip()
    turn = req.interview_turn

    # ----------------- Step 1: PRD Interview & Proactive Idea Enrichment -----------------
    if step == 1:
        if turn == 1:
            # Proactively enrich user idea and propose 3 clickable options
            suggested_opts = enrich_user_idea(user_input)
            
            reply = (
                f"💡 **Ide Dasar Diterima:** *\"{user_input}\"*\n\n"
                "Saya telah menganalisis konsep ini dan menyusun **3 alternatif arah produk & arsitektur** yang dapat memperkaya ide Anda (klik salah satu opsi di bawah atau ketik kustomisasi Anda):\n\n"
                "--- \n"
                "🔍 **Aspek Penting yang Perlu Dipertegas:**\n"
                "1. **Target Persona Utama:** Siapa pemakai yang paling krusial?\n"
                "2. **Fitur Kunci MVP (Fase 1):** Apa 2-3 kapabilitas inti yang wajib ada?\n"
                "3. **Arsitektur Data:** Apakah memerlukan integrasi real-time / AI vector store?"
            )
            return ChatResponse(
                reply=reply,
                next_step=1,
                interview_turn=2,
                is_step_complete=False,
                data_extracted={"core_idea": user_input},
                suggested_options=suggested_opts
            )
        else:
            # Step 1 Turn 2: Information is now mature & complete!
            reply = (
                "✅ **Informasi PRD Sudah Sangat Lengkap & Terstruktur!**\n\n"
                "Spesifikasi inti, persona pengguna, dan batasan cakupan MVP telah berhasil disintesis ke dalam rancangan `prd.md`.\n\n"
                "--- \n\n"
                "### 🎨 **Tahap 2: Referensi Desain & UI/UX System Specification**\n"
                "Silakan unggah **screenshot referensi UI / mockup**, masukkan **URL referensi visual** (*pacdora.com, figma.com, linear.app*), atau pilih preset gaya visual pada panel interaktif di bawah."
            )
            return ChatResponse(
                reply=reply,
                next_step=2,
                interview_turn=1,
                is_step_complete=True,
                data_extracted={"prd_details": user_input}
            )

    # ----------------- Step 2: Visual Design System & Image References -----------------
    elif step == 2:
        reply = (
            f"🎯 **Analisis Gaya Desain Berhasil Dipetakan!**\n\n"
            f"Panduan visual *\"{user_input}\"* telah diekstrak ke dalam arsitektur antarmuka:\n"
            "• **Design Archetype:** Modern SaaS Web Studio (Deep Obsidian Canvas + Electric Indigo Accent)\n"
            "• **Layout Topology:** Collapsible Nav Sidebar + Main Workspace Canvas + Embedded Inspector Grid\n"
            "• **Design Tokens:** Standar WCAG 2.1 AA (kontras > 4.5:1), 60fps CSS hardware-accelerated micro-interactions.\n\n"
            "Spesifikasi ini siap disematkan ke dalam cetak biru `systemdesign.md`.\n\n"
            "--- \n\n"
            "### ⚡ **Tahap 3: Kurasi Skill Agen AI (Simulasi Penelusuran Tren GitHub)**\n"
            "Sistem telah menjalankan penelusuran tren perkakas terbaru. Berikut matriks 9 skill standar beserta repositori GitHub & keunggulannya.\n\n"
            "Silakan tinjau kartu skill di bawah. Anda dapat **mengaktifkan/menonaktifkan skill**, **menambah skill custom**, atau klik **'Setujui Skill & Generate Artifacts'**."
        )
        return ChatResponse(
            reply=reply,
            next_step=3,
            interview_turn=1,
            is_step_complete=True,
            data_extracted={"design_guidelines": user_input},
            suggested_skills=DEFAULT_TREND_SKILLS
        )

    # ----------------- Step 3: Skill Confirmation & Readiness -----------------
    elif step == 3:
        skills_count = len(req.selected_skills) if req.selected_skills else len(DEFAULT_TREND_SKILLS)
        reply = (
            f"🎉 **Semua 3 Tahap Selesai! {skills_count} Skill Siap Dikonfigurasi.**\n\n"
            "Seluruh artefak markdown siap diunduh:\n"
            "1. `prd.md` — Product Requirements Document yang kaya & executable.\n"
            "2. `list_skills.md` — Matriks skill pilihan dengan tautan repositori GitHub & keunggulan.\n"
            "3. `systemdesign.md` — Arsitektur sistem, skema data flow, dan design tokens UI.\n\n"
            "Silakan klik tombol unduh pada panel di bawah."
        )
        return ChatResponse(
            reply=reply,
            next_step=4,
            interview_turn=1,
            is_step_complete=True
        )

    # ----------------- Step 4: Completed -----------------
    else:
        return ChatResponse(
            reply="Proyek telah selesai diinisiasi! Seluruh berkas artefak markdown dapat diunduh pada panel di atas.",
            next_step=4,
            interview_turn=1,
            is_step_complete=True
        )

# ----------------- File Generation Endpoint -----------------

@app.post("/generate-files", response_model=GenerateFilesResponse)
def generate_files(payload: GenerateFilesRequest):
    # 1. Generate prd.md
    prd_content = f"""# Product Requirements Document (PRD) — {payload.project_name}

## 1. Executive Summary & Problem Statement
{payload.prd_summary}

## 2. Target Users & Persona Specifications
- **Primary Audience:** {payload.target_users}
- **Value Proposition:** Mengeliminasi friksi inisiasi software melalui panduan interview interaktif, kurasi toolchain cerdas, dan arsitektur modular terverifikasi.

## 3. Core Functional MVP Capabilities
- [x] **Interactive Conversational Wizard (3 Steps):**
  1. *Step 1 (PRD Interview):* Proactive Idea Enrichment loop with multi-option suggestions.
  2. *Step 2 (Design References):* UI token extraction from reference URLs and attached mockups.
  3. *Step 3 (Skill Selection):* Curated AI agent skill matrix with trend search capabilities.
- [x] **Skill Customization Engine:** Filter kategori (Development, UI/UX, Code Review, Security, DevOps) dan penambahan skill custom.
- [x] **Zero-Friction Artifact Export:** In-memory generator untuk 3 file markdown (`prd.md`, `list_skills.md`, `systemdesign.md`).

## 4. Technical Architecture Recommendation
- **Frontend Framework:** {payload.tech_stack.split(',')[0].strip() if ',' in payload.tech_stack else payload.tech_stack}
- **Backend Architecture:** FastAPI (Python 3.11+, Asynchronous, Uvicorn)
- **Infrastructure:** Multi-stage Docker & Docker Compose
- **Design Tokens:** Modern SaaS Web Studio Theme (WCAG AA Compliant)

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

    skills_content = f"""# Approved AI Agent Skills & Toolchain — {payload.project_name}

Dokumen ini berisi daftar skill dan perkakas terverifikasi untuk proyek **{payload.project_name}**:

{"".join(skills_lines)}

---
## Ringkasan Matriks
- **Total Skill Terintegrasi:** {len(skills)} Skill
- **Status:** Approved for Production Handoff

*Dihasilkan secara otomatis oleh InitAI Agent Studio.*
"""

    # 3. Generate systemdesign.md
    images_ref = ""
    if payload.design_images and len(payload.design_images) > 0:
        names = [f"`{img.get('name', 'image')}`" for img in payload.design_images]
        images_ref = f"- **Attached Visual Assets / Mockups:** {', '.join(names)}\n"

    sysdesign_content = f"""# System Design & Architecture Blueprint — {payload.project_name}

## 1. High-Level Architecture Overview
Sistem mengadopsi pola arsitektur **Modern Web Studio SaaS** (terinspirasi dari platform terkemuka seperti Pacdora & Figma) yang memisahkan client presentation tier dan asynchronous backend service.

```
┌─────────────────────────────────────────────────────────────┐
│                 Browser Client (React 18 + Vite)            │
│  - Studio Layout: Collapsible Sidebar + Chat Canvas + Grid  │
│  - Zero-Backend Fallback Engine (Local Mock LLM)           │
│  - In-Memory Blob Exporter (Multi-file Markdown Generator)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / JSON (Optional)
┌──────────────────────────────▼──────────────────────────────┐
│                 FastAPI Asynchronous Backend                │
│  - Multi-turn Conversational Interview Handler              │
│  - AI Skill Search Trend Synthesizer                        │
│  - Pydantic Schema Validation & OpenAPI Spec                │
└─────────────────────────────────────────────────────────────┘
```

## 2. Design System & Visual Specification
- **Design Archetype:** {payload.design_references}
{images_ref}- **Design Tokens (CSS Variables):**
  - `--bg-primary`: `#08090D` (Obsidian Canvas)
  - `--bg-surface`: `#141722` / `#1C2030` (Card & Dialog Panels)
  - `--accent-primary`: `#6366F1` (Electric Indigo / Primary CTA)
  - `--accent-success`: `#10B981` (Emerald Verification Badge)
  - `--text-primary`: `#F8FAFC` (High contrast, WCAG AA compliant)
  - `--text-secondary`: `#94A3B8`
- **Micro-Interactions:**
  - Shimmer pulse saat AI merespons pertanyaan.
  - Hover glow & scale transition pada skill cards.
  - Smooth tab switching dan modal slide-up.

## 3. Data Flow & State Machine
```
[Turn 1: PRD Interview] ──► [Turn 2: Design Reference] ──► [Turn 3: Skill Curation] ──► [Turn 4: Export Artifacts]
       │                              │                              │                            │
       ▼                              ▼                              ▼                            ▼
  prd_summary                   design_tokens                 skill_matrix                Download Blobs
```

## 4. Security & Quality Assurance
- **Content Security:** Strict input sanitization against XSS.
- **Zero-Dependency Resilience:** Aplikasi dapat berjalan 100% di browser tanpa koneksi backend bila diperlukan.
- **Deterministic Output:** Validasi file markdown menjamin keterbacaan oleh model AI downstream.

---
*Dokumen arsitektur ini disusun sebagai standar baku pengembangan tim.*
"""

    return GenerateFilesResponse(
        prd_md=prd_content,
        list_skills_md=skills_content,
        systemdesign_md=sysdesign_content
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
