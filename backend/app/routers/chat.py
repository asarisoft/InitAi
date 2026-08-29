from fastapi import APIRouter
from app.schemas.models import ChatRequest, ChatResponse
from app.services.enrichment import enrich_user_idea
from app.services.gemini_service import gemini_service
from app.services.skills_service import DEFAULT_TREND_SKILLS

router = APIRouter(prefix="/chat", tags=["Conversational Wizard"])

@router.post("", response_model=ChatResponse)
async def handle_chat_message(req: ChatRequest):
    step = req.step
    user_input = req.message.strip()
    turn = req.interview_turn
    project_data = req.project_data or {}

    # Try real Gemini LLM live reasoning if token is active
    gemini_live_result = None
    if gemini_service.is_available():
        gemini_live_result = await gemini_service.generate_live_chat_response(
            step=step,
            turn=turn,
            user_message=user_input,
            project_data=project_data,
            conversation_history=req.conversation_history
        )

    # ----------------- Step 1: PRD Interview & Proactive Idea Enrichment -----------------
    if step == 1:
        if turn == 1:
            suggested_opts = gemini_live_result.get("suggested_options") if gemini_live_result else None
            if not suggested_opts:
                suggested_opts = enrich_user_idea(user_input)

            reply = gemini_live_result.get("reply") if (gemini_live_result and gemini_live_result.get("reply")) else (
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
            reply = gemini_live_result.get("reply") if (gemini_live_result and gemini_live_result.get("reply")) else (
                "✅ **Informasi PRD Sudah Sangat Lengkap & Terstruktur!**\n\n"
                "Spesifikasi inti, persona pengguna, dan batasan cakupan MVP telah berhasil disintesis ke dalam rancangan `prd.md`.\n\n"
                "--- \n\n"
                "### 🎨 **Tahap 2: Referensi Desain & UI/UX System Specification**\n"
                "Silakan unggah **screenshot referensi UI / mockup**, masukkan **URL referensi visual** (*figma.com, linear.app, raycast.com*), atau pilih preset gaya visual pada panel interaktif di bawah."
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
        reply = gemini_live_result.get("reply") if (gemini_live_result and gemini_live_result.get("reply")) else (
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
            "Seluruh 4 berkas artefak markdown siap diunduh:\n"
            "1. `prd.md` — Product Requirements Document yang kaya & executable.\n"
            "2. `list_skills.md` — Matriks skill pilihan dengan tautan repositori GitHub & keunggulan.\n"
            "3. `systemdesign.md` — Arsitektur sistem, skema data flow, dan design tokens UI.\n"
            "4. `readme.md` — Dokumentasi proyek, tech stack, dan panduan instalasi/setup.\n\n"
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
            reply="Proyek telah selesai diinisiasi! Seluruh 4 berkas artefak markdown dapat diunduh pada panel di atas.",
            next_step=4,
            interview_turn=1,
            is_step_complete=True
        )
