# Initai Web Agent Implementation Plan

Aplikasi "Initai" akan dibangun sebagai AI Web Agent interaktif dengan gaya UI "SaaS Web Studio" (terinspirasi dari Pacdora/Figma) sesuai dengan referensi desain Anda.

## Goal Description

Membangun aplikasi web dengan arsitektur Full-Stack (Frontend ReactJS + Backend FastAPI) yang dikemas menggunakan Docker. Aplikasi ini berfungsi sebagai agen AI yang akan melakukan wawancara tiga langkah secara berurutan:
1. Mengambil Deskripsi & PRD proyek.
2. Mengambil Referensi Desain/UI.
3. Konfirmasi Skill (dengan mock simulasi pencarian web) dan menyetujui daftar skill akhir.

Pada akhir sesi, frontend akan meng-generate dan menampilkan tombol download untuk 3 buah file markdown: `prd.md`, `list_skills.md`, dan `systemdesign.md`.
Untuk iterasi awal, backend akan menggunakan **Fungsi Mock LLM** agar kita bisa fokus merapikan UI dan alur (UX) dengan cepat.

## Proposed Changes

### Infrastructure
- **docker-compose.yml**: File konfigurasi Docker untuk menjalankan container Frontend dan Backend secara bersamaan.

### Backend (FastAPI)
- **backend/Dockerfile**: Dockerfile untuk menjalankan FastAPI menggunakan Uvicorn.
- **backend/requirements.txt**: Dependensi Python (FastAPI, uvicorn, pydantic).
- **backend/main.py**: Aplikasi utama FastAPI yang menyediakan endpoint `/chat` dengan implementasi mock LLM. Endpoint ini akan merespons sesuai urutan state percakapan (1, 2, 3) dan mengembalikan respons format JSON yang berisi state dan teks balasan AI.

### Frontend (ReactJS + Vite)
- **frontend/Dockerfile**: Dockerfile untuk mem-build dan menjalankan ReactJS.
- **frontend/package.json**: Konfigurasi Node.js dan dependensi React.
- **frontend/src/App.jsx**: Komponen utama aplikasi dengan UI bergaya Web Studio (Sidebar, Main Chat Panel).
- **frontend/src/components/ChatBox.jsx**: Komponen untuk merender percakapan antara User dan AI.
- **frontend/src/utils/markdownParser.js**: Fungsi utility untuk memecah respons markdown terakhir dari AI dan men-generate Blob URL untuk file `prd.md`, `list_skills.md`, dan `systemdesign.md` sehingga dapat diunduh.
- **frontend/src/index.css**: Styling utama menggunakan Vanilla CSS dengan estetika modern, mode gelap, palet warna elegan, dan transisi halus (SaaS look).

## Verification Plan

### Manual Verification
1. Menjalankan `docker-compose up --build`.
2. Mengakses frontend di browser.
3. Melakukan simulasi obrolan 3 tahap dengan AI Agent.
4. Memverifikasi bahwa antarmuka terlihat elegan dan profesional (SaaS style).
5. Memverifikasi bahwa di tahap akhir, 3 tombol download muncul dan berfungsi.
