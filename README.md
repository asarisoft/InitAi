# InitAI — AI Agentic Project Architect & Studio

<div align="center">

![InitAI Banner](https://img.shields.io/badge/InitAI-Studio%20v2.0-6366F1?style=for-the-badge&logo=rocket&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20Async-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![License](https://img.shields.io/badge/License-MIT%20(100%25%20Free)-10B981?style=for-the-badge&logo=open-source-initiative&logoColor=white)
![WCAG](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-purple?style=for-the-badge)

**Platform SaaS Studio Cerdas untuk Otomasi Pembuatan PRD, Kurasi Skill Agen AI, dan Blueprint Arsitektur Sistem dalam 4 Berkas Markdown Siap Pakai.**

[Panduan Memulai](#-panduan-menjalankan-aplikasi) • [Fitur Utama](#-fitur-utama) • [Alur Wizard](#-alur-kerja-3-tahap-interaktif) • [Arsitektur Sistem](#-arsitektur-sistem) • [Lisensi](#-lisensi--dukungan)

</div>

---

> ⭐ **Dukungan Anda Sangat Berharga!**  
> Jika project ini bermanfaat bagi Anda, jangan lupa berikan **Star (⭐)** di repositori GitHub [asarisoft/InitAi](https://github.com/asarisoft/InitAi) sebelum melakukan **Fork** atau **Clone** untuk mendukung pengembangan ekosistem open-source ini!

---

## 🌟 Ikhtisar Proyek

**InitAI** adalah *Agentic Architectural Copilot* berbasis web yang dirancang untuk mengeliminasi friksi dalam memulai pengembangan aplikasi perangkat lunak (*software initiation*). Melalui wawancara interaktif berbasis AI, InitAI memandu pengguna menyusun spesifikasi teknis tingkat produksi (*production-grade*), mengekstrak panduan desain antarmuka, mengurasi kemampuan agen cerdas, dan langsung mengekspor **4 berkas artefak markdown lengkap**.

---

## ✨ Fitur Utama

### 1. 💡 Proactive Idea Enrichment Engine
* AI menganalisis ide produk secara proaktif dan menyajikan **3-4 variasi konsep arsitektur & MVP** dalam bentuk kartu interaktif yang bisa langsung diklik.
* Mempertegas target persona (B2B, B2C, DevTools, Enterprise), batasan cakupan MVP, dan arsitektur data.

### 2. 🎨 In-Chat Design Reference & Visual Asset Dropzone (Tahap 2)
* Panel dropzone terintegrasi **langsung di dalam percakapan chat**.
* Unggah screenshot mockups, wireframe, atau moodboard desain visual (PNG, JPG, WebP, SVG).
* Dilengkapi *Gallery Preview*, modal zoom resolusi penuh, dan pilihan preset token desain modern.

### 3. ⚡ Matriks Skill Agen AI & Penelusuran Tren GitHub (Tahap 3)
* Katalog 9 skill rekayasa perangkat lunak standar (Brainstorming, Architecture, Code Review, Security, dsb.).
* Filter kategori instan (*Development, UI/UX, Code Review, Security, DevOps*).
* Penambahan skill kustom secara live dengan sintesis tren repositori GitHub langsung dari backend.

### 4. 📦 4 Berkas Artefak Deliverables (Tahap 4)
Menghasilkan 4 berkas markdown terstruktur yang dapat diunduh langsung via Blob URL atau disalin dengan 1-klik:
* **`prd.md`:** Executive Summary, User Personas, MVP Scope, dan Acceptance Criteria.
* **`list_skills.md`:** Matriks skill pilihan dengan tautan repositori GitHub & panduan instalasi.
* **`systemdesign.md`:** Cetak biru arsitektur sistem, UI Design Tokens, dan diagram aliran data.
* **`readme.md`:** Dokumentasi utama proyek, ringkasan tech stack, dan panduan deployment.

### 5. 🛡️ Dual-Mode Hybrid Architecture
* **Online Mode:** Terhubung langsung ke **FastAPI Backend** dengan dukungan integrasi Tool Calling Google Gemini.
* **Offline / Standalone Fallback:** Berjalan 100% di browser dengan *Intelligent Local Mock Engine* jika backend offline.

---

## 🔄 Alur Kerja 3 Tahap Interaktif

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  TAHAP 1: PRD INTERVIEW & IDEA ENRICHMENT                                      │
│  User input konsep ──► AI mengusulkan 3 variasi MVP ──► PRD matang tersintesis │
└──────────────────────────────────────┬─────────────────────────────────────────┘
                                       ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│  TAHAP 2: VISUAL DESIGN REFERENCE & UI TOKENS                                  │
│  Unggah screenshot mockup / URL referensi ──► Ekstraksi Design Tokens WCAG AA  │
└──────────────────────────────────────┬─────────────────────────────────────────┘
                                       ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│  TAHAP 3: CURATED AGENT SKILL MATRIX                                           │
│  Pilih / filter 9 skill standar + Tambah skill kustom tren GitHub live         │
└──────────────────────────────────────┬─────────────────────────────────────────┘
                                       ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│  TAHAP 4: DELIVERABLE ARTIFACT EXPORT                                          │
│  Download 4 Berkas: prd.md • list_skills.md • systemdesign.md • readme.md      │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Panduan Menjalankan Aplikasi

> 💡 *Sebelum clone atau fork, pastikan Anda telah menekan tombol ⭐ **Star** di pojok kanan atas repositori [asarisoft/InitAi](https://github.com/asarisoft/InitAi).*

### Opsi 1: Menggunakan Launcher Script (`./run.sh` — Direkomendasikan)
```bash
./run.sh
```
Pilihan menu:
* `1` — **Frontend Standalone** (Jalankan client React di `http://localhost:5173`).
* `2` — **Full-Stack Local** (Jalankan FastAPI Backend + React Frontend secara simultan).
* `3` — **Docker Compose** (Jalankan seluruh service dalam container Docker).

---

### Opsi 2: Menjalankan Full-Stack Lokal secara Manual

#### 1. Jalankan Backend (FastAPI):
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
* **API Docs (Swagger UI):** `http://localhost:8000/docs`
* **Health Check:** `http://localhost:8000/health`

#### 2. Jalankan Frontend (React 18 + Vite):
```bash
cd frontend
npm install
npm run dev
```
* **Frontend Web Studio:** `http://localhost:5173`

---

### Opsi 3: Menjalankan dengan Docker Compose
```bash
docker compose up --build
```

---

## 🔑 Konfigurasi Environment (`.env`)

Backend menyediakan file konfigurasi template `.env.example`:
```bash
cp backend/.env.example backend/.env
```

| Variabel | Deskripsi | Default |
| :--- | :--- | :--- |
| `HOST` | Host binding untuk FastAPI | `0.0.0.0` |
| `PORT` | Port server backend | `8000` |
| `GEMINI_API_KEY` | *(Opsional)* API Key Google Gemini untuk Tool Calling native | *(Kosong)* |
| `CORS_ORIGINS` | Daftar domain origin yang diizinkan | `*` |

> *Catatan: Jika `GEMINI_API_KEY` tidak diisi, InitAI secara otomatis beralih ke Intelligent Local Engine tanpa ada error.*

---

## 🧪 Pengujian Otomatis

Backend dilengkapi test suite berbasis `pytest` dengan 8 skenario pengujian unit & integrasi:

```bash
cd backend
./venv/bin/pytest -v test_backend.py
```

### Hasil Test Suite:
```text
test_backend.py::test_health_check PASSED                    [ 12%]
test_backend.py::test_get_skills PASSED                      [ 25%]
test_backend.py::test_search_skill PASSED                    [ 37%]
test_backend.py::test_chat_step_1_idea_enrichment PASSED     [ 50%]
test_backend.py::test_chat_step_1_turn_2_completion PASSED   [ 62%]
test_backend.py::test_chat_step_2_design_reference PASSED    [ 75%]
test_backend.py::test_chat_step_3_skill_confirmation PASSED  [ 87%]
test_backend.py::test_generate_files PASSED                  [100%]
========================= 8 passed in 0.19s =========================
```

---

## 📁 Struktur Direktori Proyek

```
INITAI/
├── run.sh                          # Interactive multi-mode launcher
├── docker-compose.yml              # Docker multi-service composition
├── LICENSE                         # MIT License (100% Free & Open-Source)
├── README.md                       # Dokumentasi resmi proyek
├── .env.example                    # Template environment variables
├── backend/
│   ├── Dockerfile                  # Container definition Python 3.11
│   ├── requirements.txt            # Dependensi backend & testing
│   ├── test_backend.py             # Automated pytest suite (8 tests)
│   ├── main.py                     # Entrypoint & Application Factory
│   └── app/
│       ├── core/config.py          # App settings & dotenv loader
│       ├── schemas/models.py       # Pydantic v2 data models
│       ├── services/
│       │   ├── enrichment.py       # Proactive idea enrichment logic
│       │   ├── gemini_service.py   # Google Gemini Tool Calling integration
│       │   ├── skills_service.py   # Skill dataset & live search synthesis
│       │   └── generator.py        # 4 markdown files generator
│       └── routers/
│           ├── health.py           # GET /health
│           ├── skills.py           # GET /skills, POST /skills/search
│           ├── chat.py             # POST /chat
│           └── files.py            # POST /generate-files
└── frontend/
    ├── package.json                # React 18 & Vite configuration
    ├── vite.config.js              # Vite server & build settings
    ├── index.html                  # HTML entry with custom typography
    └── src/
        ├── App.jsx                 # Studio layout state orchestrator
        ├── index.css               # SaaS Studio Design Tokens (Dark/Light Mode)
        ├── components/
        │   ├── Header.jsx          # Studio header bar with live status indicator
        │   ├── Sidebar.jsx         # Stepper track & project summary
        │   ├── ChatBox.jsx         # Conversation timeline & embedded panels
        │   ├── MessageItem.jsx     # Markdown renderer with Idea Enrichment cards
        │   ├── ChatInput.jsx       # Autosize prompt composer & action pills
        │   ├── DesignRefUploader.jsx# In-chat screenshot upload & visual presets
        │   ├── SkillGrid.jsx       # Interactive skill matrix & live search
        │   ├── DownloadSection.jsx # 4 Artifact delivery cards & live preview
        │   ├── ThemeToggle.jsx     # Instant Light/Dark switcher
        │   └── Icons.jsx           # Clean bespoke SVG icon library
        ├── services/
        │   ├── apiService.js       # Live REST API client with auto-fallback
        │   └── mockLlmService.js   # Client-side standalone intelligent engine
        └── utils/
            ├── defaultSkills.js    # 9 curated AI agent engineering skills
            └── markdownParser.js   # 4 Markdown deliverables & Blob exporter
```

---

## 📄 Lisensi & Dukungan

Project ini dirilis secara **100% Gratis dan Open-Source** di bawah naungan **[MIT License](LICENSE)**. Anda bebas menggunakan, memodifikasi, dan mendistribusikannya untuk kebutuhan personal maupun komersial.

🌟 **Dukung Pengembang:**  
Jangan lupa berikan **Star (⭐)** pada repositori [asarisoft/InitAi](https://github.com/asarisoft/InitAi) untuk mendukung update dan fitur-fitur keren selanjutnya!

Dikembangkan dengan dedikasi oleh **Imam Asari** ([@asarisoft](https://github.com/asarisoft)).
