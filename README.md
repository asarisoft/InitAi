# InitAI — AI Agent Studio & System Architect

<div align="center">

![InitAI Banner](https://img.shields.io/badge/InitAI-Studio%20v2.0-6366F1?style=for-the-badge&logo=rocket&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20Async-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Docker](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![WCAG](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-10B981?style=for-the-badge)

**Platform SaaS Web Studio Cerdas untuk Otomasi Pembuatan PRD, Kurasi Skill Agen AI, dan Blueprint Arsitektur Sistem dalam 3 Berkas Markdown Siap Pakai.**

[Panduan Memulai](#-panduan-menjalankan-aplikasi) • [Fitur Utama](#-fitur-utama) • [Arsitektur Sistem](#-arsitektur-sistem) • [Pengujian](#-pengujian-otomatis)

</div>

---

## 🌟 Ikhtisar Proyek

**InitAI** dirancang sebagai *Architectural Copilot* bergaya **SaaS Web Studio** (terinspirasi dari platform modern seperti *Pacdora*, *Figma*, dan *Linear*). InitAI memandu pengguna melalui wawancara interaktif multi-turn untuk mengubah ide produk yang masih abstrak menjadi spesifikasi teknis tingkat produksi (*production-grade*), lengkap dengan dokumen arsitektur dan matriks perkakas (*toolchain*).

---

## ✨ Fitur Utama

### 1. 💡 Proactive Idea Enrichment Engine
* AI tidak hanya mencatat input user, melainkan secara aktif membedah problem statement dan menawarkan **3-4 variasi konsep produk & arsitektur MVP** yang bisa langsung diklik pengguna.
* Mengajukan pertanyaan pemantik berbobot untuk aspek kritis yang sering terlewatkan (Target Persona, Edge Cases, Data Model).

### 2. 🎨 In-Chat Visual Reference & Image Uploader (Tahap 2)
* Panel dropzone interaktif **langsung di dalam riwayat chat**.
* Mendukung upload screenshot mockups, wireframe Figma, moodboard, dan color palette (PNG, JPG, WebP, SVG).
* Dilengkapi *Thumbnail Gallery*, *Modal Zoom Preview*, dan preset gaya arsitektur populer (*Pacdora 3D Studio, Linear Minimalist, Raycast Glassmorphism*).

### 3. ⚡ Curated Agent Skill Matrix & Trend Search (Tahap 3)
* Grid kartu interaktif dengan 9 skill rekayasa perangkat lunak standar (Brainstorming, Architecture, Code Review, Security, dsb.).
* Filter kategori instan (*Development, UI/UX, Code Review, Security, DevOps*).
* Penambahan skill kustom dengan simulasi penelusuran tren teknologi terbaru.
* Tautan repositori GitHub resmi dan daftar keunggulan fitur pada setiap kartu.

### 4. 📦 Zero-Friction Markdown Artifact Deliverables (Tahap 4)
Menghasilkan 3 berkas artefak markdown yang dapat diunduh langsung via in-memory Blob URL atau disalin dengan 1-klik:
* **`prd.md`:** Executive Summary, User Personas, MVP Scope, dan Acceptance Criteria.
* **`list_skills.md`:** Daftar skill terverifikasi lengkap dengan link GitHub, keunggulan, dan panduan instalasi.
* **`systemdesign.md`:** Cetak biru arsitektur sistem, UI Design Tokens, dan diagram aliran data.

### 5. 🛡️ Zero-Backend Standalone Capability
* Dilengkapi **Mock AI Engine cerdas di sisi browser**, memungkinkan aplikasi berjalan 100% secara lokal tanpa ketergantungan koneksi backend saat diperlukan.

---

## 📐 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                 Client Browser (React 18 + Vite)            │
│  - SaaS Studio Layout: Stepper Sidebar + Canvas + Grid      │
│  - In-Chat Dropzone (Visual Image & Mockup Upload)          │
│  - Zero-Backend Fallback Engine (Local Intelligent Mock)    │
│  - In-Memory Blob Stream Exporter & Modal Code Viewer       │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / JSON (HTTP & CORS)
┌──────────────────────────────▼──────────────────────────────┐
│                 FastAPI Asynchronous Backend                │
│  - Proactive Idea Enrichment & Multi-turn Conversational    │
│  - AI Skill Trend Synthesizer & Tool Calling Registry       │
│  - Pydantic v2 Schema Contract Validation                   │
│  - Swagger UI Documentation (`/docs`)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Panduan Menjalankan Aplikasi

### Opsi 1: Menggunakan Launcher Script (`run.sh` — Paling Praktis)
Tersedia script launcher interaktif satu-perintah:
```bash
./run.sh
```
Pilih opsi:
* `1` — **Frontend Standalone** (Paling cepat, hanya butuh Node.js).
* `2` — **Full-Stack Lokal** (FastAPI Backend + React Frontend dengan *graceful shutdown* `Ctrl+C`).
* `3` — **Docker Compose** (Containerized Frontend & Backend).

---

### Opsi 2: Menjalankan Frontend Standalone
```bash
cd frontend
npm install
npm run dev
```
Buka di browser: 👉 **`http://localhost:5173`**

---

### Opsi 3: Menjalankan Full-Stack Lokal secara Manual

#### 1. Jalankan Backend (FastAPI):
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
* API Docs (Swagger): `http://localhost:8000/docs`
* Health Check: `http://localhost:8000/health`

#### 2. Jalankan Frontend (React):
```bash
cd frontend
npm install
npm run dev
```
* Frontend Studio: `http://localhost:5173`

---

### Opsi 4: Menjalankan dengan Docker Compose
```bash
docker compose up --build
```

---

## 🧪 Pengujian Otomatis

Backend dilengkapi unit & integration test suite berbasis `pytest`:

```bash
cd backend
./venv/bin/pytest -v test_backend.py
```

### Hasil Pengujian (100% Lulus):
```text
test_backend.py::test_health_check PASSED                                [ 14%]
test_backend.py::test_get_skills PASSED                                  [ 28%]
test_backend.py::test_chat_step_1_idea_enrichment PASSED                 [ 42%]
test_backend.py::test_chat_step_1_turn_2_completion PASSED               [ 57%]
test_backend.py::test_chat_step_2_design_reference PASSED                [ 71%]
test_backend.py::test_chat_step_3_skill_confirmation PASSED              [ 85%]
test_backend.py::test_generate_files PASSED                              [100%]
========================= 7 passed in 0.21s =========================
```

---

## 📁 Struktur Direktori Proyek

```
INITAI/
├── run.sh                          # Interactive multi-mode launcher
├── docker-compose.yml              # Docker multi-service composition
├── README.md                       # Dokumentasi resmi proyek
├── prompt.md                       # Spesifikasi dasar kebutuhan sistem
├── systemdesign.md                 # Standar arsitektur & design tokens
├── backend/
│   ├── Dockerfile                  # Container definition Python 3.11
│   ├── requirements.txt            # Dependensi backend & testing
│   ├── main.py                     # Core FastAPI app, routers, & enrichment logic
│   └── test_backend.py             # Automated pytest suite
└── frontend/
    ├── Dockerfile                  # Container definition Node.js / Vite
    ├── package.json                # React 18 & Vite configuration
    ├── vite.config.js              # Vite server & build settings
    ├── index.html                  # HTML entry with Plus Jakarta Sans & JetBrains Mono
    └── src/
        ├── App.jsx                 # Studio layout state orchestrator
        ├── main.jsx                # React DOM entry
        ├── index.css               # SaaS Studio Design Tokens (Dark/Light Mode)
        ├── components/
        │   ├── Header.jsx          # Studio header bar with breadcrumb & theme toggle
        │   ├── Sidebar.jsx         # Vertical track stepper & session summary
        │   ├── ChatBox.jsx         # Conversation timeline & embedded panels
        │   ├── MessageItem.jsx     # Markdown renderer with Idea Enrichment cards
        │   ├── ChatInput.jsx       # Autosize prompt composer & action pills
        │   ├── DesignRefUploader.jsx# In-chat screenshot upload & visual presets
        │   ├── SkillGrid.jsx       # Interactive skill matrix & trend search
        │   ├── DownloadSection.jsx # Artifact delivery cards & live preview modal
        │   ├── ThemeToggle.jsx     # Instant Light/Dark switcher
        │   └── Icons.jsx           # Clean bespoke SVG icon library
        ├── services/
        │   ├── mockLlmService.js   # Client-side standalone intelligent engine
        │   └── apiService.js       # Resilient REST API client with auto-fallback
        └── utils/
            ├── defaultSkills.js    # 9 curated AI agent engineering skills
            └── markdownParser.js   # Production-grade markdown generator & blob exporter
```

---

## 📄 Lisensi & Kontributor
Dikembangkan untuk repositori [asarisoft/InitAi](https://github.com/asarisoft/InitAi) oleh **ImamAsari** ([@asarisoft](https://github.com/asarisoft)).
