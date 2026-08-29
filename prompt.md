Bertindaklah sebagai Expert Full-Stack Developer. Tugas Anda adalah membuatkan saya source code lengkap untuk aplikasi web bernama "Initai". 

Tech Stack yang digunakan:
- Frontend: ReactJS (Functional components, modern Hooks, desain modern dan minimalis).
- Backend: FastAPI (Python, Asynchronous).
- Infrastruktur: Docker (docker-compose untuk menjalankan FE dan BE secara bersamaan).

FUNGSI UTAMA APLIKASI (INITAI):
Aplikasi ini adalah AI Web Agent. Frontend berupa antarmuka chat/wizard interaktif. Backend akan memanggil LLM (buatkan mock function atau integrasi API) untuk mewawancarai user secara berurutan.

ALUR LOGIKA CHAT YANG HARUS ADA DI BACKEND/FRONTEND:
LLM di dalam aplikasi harus diprogram untuk melakukan 3 tahap ini satu per satu (menunggu balasan user sebelum lanjut ke pertanyaan berikutnya):
1. Menanyakan Deskripsi & PRD: "Apa ide utama dari proyek ini? Saya akan merancang 'prd.md' yang bersifat executable."
2. Menanyakan Referensi Desain: "Berikan URL referensi atau panduan gaya visual UI proyek ini."
3. Konfirmasi Skill (Dengan simulasi Web Search): Sistem memberitahu bahwa proyek akan dibekali dengan daftar skill agen AI standar berikut: 
   [Brainstorming, Writing Plans, UI/FE Design, BE/API Architecture, Database Modeling, Code Review, Security Review, QA/Testing Automation, DevOps/Deployment]. 
   Lalu, AI (seolah-olah setelah melakukan pencarian web untuk tren terbaru tahun ini) menawarkan 1-2 skill/tools hype tambahan, lalu menanyakan: "Apakah ada skill tambahan yang ingin dimasukkan atau ada skill standar yang ingin dihapus?"

FITUR DOWNLOAD FILE:
Setelah tahap 3 selesai, LLM akan menghasilkan teks markdown. Frontend ReactJS harus memiliki fungsi parsing untuk memecah teks tersebut dan memunculkan tombol "Download File" untuk 3 file berikut:
- prd.md (Berisi Product Requirements dan Acceptance Criteria yang executable untuk AI).
- list_skills.md (Berisi daftar skill yang disetujui beserta tautan referensi ke tools/framework terkait).
- systemdesign.md (Berisi rancangan arsitektur, database, dan standar UI).

YANG HARUS ANDA BUAT:
1. Struktur folder (Tree) dari keseluruhan project Initai.
2. File `docker-compose.yml` dan `Dockerfile` (untuk FE dan BE).
3. Kode backend FastAPI (`main.py` dan konfigurasi routing/LLM chat handling).
4. Kode frontend ReactJS (Komponen Chat interface, fungsi penangkap markdown, dan fungsi download file).

Berikan kode yang rapi, modular, dan siap dijalankan.