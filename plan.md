# InitAI Web Agent & Architect Studio Plan

Aplikasi **InitAI** dibangun sebagai AI Agentic Studio interaktif dengan gaya UI "Modern SaaS Web Studio" (terinspirasi dari Linear & Figma) dengan arsitektur produksi yang modular.

## Goal Description

Membangun aplikasi web dengan arsitektur Full-Stack (Frontend React 18 + Backend FastAPI) yang dikemas menggunakan Docker. Aplikasi ini berfungsi sebagai agen AI yang akan memandu pengguna melalui wawancara tiga langkah secara terstruktur:
1. **Tahap 1 (PRD Interview & Idea Enrichment):** Membedah problem statement dan menawarkan 3 opsi konsep MVP.
2. **Tahap 2 (Design Reference & Visual Assets):** Mengekstrak design tokens WCAG AA dari URL referensi dan screenshot.
3. **Tahap 3 (Skill Matrix & Live Search):** Kurasi 9 skill rekayasa perangkat lunak standar + pencarian tren skill live.
4. **Tahap 4 (Deliverable Generation):** Menghasilkan 4 berkas markdown (`prd.md`, `list_skills.md`, `systemdesign.md`, `readme.md`) yang siap diunduh via Blob atau disalin instan.

## Architecture

- **Backend:** FastAPI (Python 3.11+, Asynchronous, Uvicorn, Google Gemini Tool Calling + Local Dynamic Synthesizer).
- **Frontend:** React 18 + Vite (Clean dark/light theme, bespoke SVG icons, collapsible stepper navigation).
- **Testing:** Automated `pytest` suite (8/8 tests).
