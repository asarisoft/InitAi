from typing import List, Dict, Any
from app.schemas.models import SkillItem, GenerateFilesRequest, GenerateFilesResponse
from app.services.skills_service import DEFAULT_TREND_SKILLS

def generate_all_artifacts(payload: GenerateFilesRequest) -> GenerateFilesResponse:
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
- [x] **Zero-Friction Artifact Export:** In-memory generator untuk 4 file markdown (`prd.md`, `list_skills.md`, `systemdesign.md`, `readme.md`).

## 4. Technical Architecture Recommendation
- **Frontend Framework:** {payload.tech_stack.split(',')[0].strip() if ',' in payload.tech_stack else payload.tech_stack}
- **Backend Architecture:** FastAPI (Python 3.11+, Asynchronous, Uvicorn)
- **Infrastructure:** Multi-stage Docker & Docker Compose
- **Design Tokens:** Modern SaaS Web Studio Theme (WCAG AA Compliant)

## 5. Acceptance Criteria
- [x] Web client renders with zero console errors.
- [x] All 4 markdown files export successfully with valid Blob payloads.
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
Sistem mengadopsi pola arsitektur **Modern Web Studio SaaS** (terinspirasi dari platform terkemuka seperti Figma & Linear) yang memisahkan client presentation tier dan asynchronous backend service.

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

    # 4. Generate readme.md
    active_skills_summary = "\n".join([f"- **{s.name}** (`{s.category}`): {s.description}" for s in skills])
    fe_tech = payload.tech_stack.split(',')[0].strip() if ',' in payload.tech_stack else payload.tech_stack

    readme_content = f"""# {payload.project_name}

> {payload.prd_summary}

---

## 📖 Ringkasan Proyek
Proyek ini dibangun berdasarkan spesifikasi dan rancangan arsitektur yang dihasilkan dari sesi wawancara AI Web Studio InitAI.

- **Target Persona:** {payload.target_users}
- **Desain UI:** {payload.design_references}

---

## 🛠️ Tech Stack & Arsitektur
- **Frontend Framework:** {fe_tech}
- **Backend Architecture:** FastAPI (Python 3.11+, Asynchronous, Uvicorn)
- **Containerization:** Docker & Docker Compose

---

## ⚡ Skill Agen AI Terintegrasi
{active_skills_summary}

---

## 🚀 Panduan Memulai Cepat

### 1. Menjalankan Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Menjalankan Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 📦 Berkas Artefak Proyek Ini
1. `prd.md` — Product Requirements Document lengkap & executable.
2. `list_skills.md` — Matriks skill pilihan & repositori GitHub terkait.
3. `systemdesign.md` — Cetak biru arsitektur sistem dan spesifikasi visual UI.
4. `readme.md` — Dokumentasi utama dan panduan setup proyek.

---
*Dihasilkan secara otomatis oleh InitAI Studio.*
"""

    return GenerateFilesResponse(
        prd_md=prd_content,
        list_skills_md=skills_content,
        systemdesign_md=sysdesign_content,
        readme_md=readme_content
    )
