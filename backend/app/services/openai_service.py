import json
import logging
from typing import Optional, Dict, Any, List
from app.core.config import settings
from app.schemas.models import SuggestedOption

logger = logging.getLogger(__name__)

FALLBACK_OPENAI_MODELS = ["gpt-4o-mini", "gpt-4o", "o3-mini", "gpt-3.5-turbo"]

class OpenAIService:
    """
    OpenAI Native LLM & Tool Calling Service.
    Features proactive Idea Enrichment, Deep Architectural Interrogations,
    Active Token Verification, and Structured JSON Options.
    """

    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.model_name = settings.OPENAI_MODEL or "gpt-4o-mini"
        self.base_url = settings.OPENAI_BASE_URL
        self.temperature = settings.OPENAI_TEMPERATURE
        self.max_tokens = settings.OPENAI_MAX_TOKENS
        self.client = None
        self._init_client(self.api_key, self.base_url)

    def _init_client(self, api_key: str, base_url: Optional[str] = None):
        self.api_key = api_key.strip() if api_key else ""
        self.base_url = base_url.strip() if (base_url and base_url.strip()) else None
        if self.api_key:
            try:
                from openai import AsyncOpenAI
                self.client = AsyncOpenAI(
                    api_key=self.api_key,
                    base_url=self.base_url
                )
                logger.info(f"Initialized OpenAI Client successfully (Model: {self.model_name}).")
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI Client: {e}")
                self.client = None
        else:
            self.client = None

    def is_available(self) -> bool:
        return self.client is not None

    def _get_candidate_models(self) -> List[str]:
        candidates = [self.model_name]
        for m in FALLBACK_OPENAI_MODELS:
            if m not in candidates:
                candidates.append(m)
        return candidates

    async def verify_token_quota(self, api_key: Optional[str] = None, model: Optional[str] = None) -> Dict[str, Any]:
        """
        Actively tests if the OpenAI API key is valid, model is available, and has quota.
        """
        key_to_test = api_key.strip() if api_key else self.api_key
        if not key_to_test:
            return {
                "provider": "openai",
                "status": "missing_key",
                "valid": False,
                "model": self.model_name,
                "message": "OPENAI_API_KEY belum dikonfigurasi di backend (.env). Masukkan API Key agar analisis AI berjalan secara live."
            }

        target_model = model.strip() if model else self.model_name

        try:
            from openai import AsyncOpenAI
            test_client = AsyncOpenAI(api_key=key_to_test, base_url=self.base_url)

            response = await test_client.chat.completions.create(
                model=target_model,
                messages=[{"role": "user", "content": "Halo! Jawab 'OK' jika token aktif."}],
                max_tokens=10
            )

            if response and response.choices and len(response.choices) > 0:
                self.model_name = target_model
                if api_key:
                    self._init_client(api_key, self.base_url)
                return {
                    "provider": "openai",
                    "status": "active",
                    "valid": True,
                    "model": self.model_name,
                    "message": f"Token OpenAI Aktif & Siap Digunakan (Model: {self.model_name})."
                }

        except Exception as e:
            err_str = str(e).lower()
            if "insufficient_quota" in err_str or "quota" in err_str or "429" in err_str:
                return {
                    "provider": "openai",
                    "status": "quota_exhausted",
                    "valid": False,
                    "model": self.model_name,
                    "message": "Kuota Token OpenAI Habis (429 Insufficient Quota). Silakan gunakan API Key baru."
                }
            elif "invalid_api_key" in err_str or "401" in err_str or "incorrect api key" in err_str:
                return {
                    "provider": "openai",
                    "status": "invalid_key",
                    "valid": False,
                    "model": self.model_name,
                    "message": "API Key OpenAI Tidak Valid (401 Unauthorized). Periksa kembali token Anda."
                }
            elif "model_not_found" in err_str or "404" in err_str or "does not exist" in err_str:
                return {
                    "provider": "openai",
                    "status": "invalid_model",
                    "valid": False,
                    "model": self.model_name,
                    "message": f"Model '{target_model}' tidak ditemukan atau akun tidak memiliki akses. Coba ganti ke 'gpt-4o-mini'."
                }
            else:
                return {
                    "provider": "openai",
                    "status": "error",
                    "valid": False,
                    "model": self.model_name,
                    "message": f"Gagal terhubung ke OpenAI: {str(e)[:180]}"
                }

        return {
            "provider": "openai",
            "status": "error",
            "valid": False,
            "model": self.model_name,
            "message": "Koneksi OpenAI tidak mengembalikan respons yang valid."
        }

    async def generate_live_chat_response(
        self,
        step: int,
        turn: int,
        user_message: str,
        project_data: Dict[str, Any],
        conversation_history: List[Any]
    ) -> Optional[Dict[str, Any]]:
        """
        Executes real OpenAI reasoning for architectural interview with deep idea enrichment & structured options.
        """
        if not self.is_available():
            return None

        system_instruction = (
            "Anda adalah InitAI Principal Architect & Chief Product Strategist kelas dunia. "
            "Tugas Anda BUKAN sekadar mengulang perkataan user atau memberi template statis. "
            "Tugas Anda adalah MEMPERKAYA ide user, menantang asumsi produk secara kritis, menemukan blindspot teknis, "
            "dan mengajukan 4-5 pertanyaan mendalam yang sangat spesifik untuk domain produk user. "
            "Gunakan bahasa Indonesia yang profesional, berwawasan luas, dan format Markdown yang rapi."
        )

        candidate_models = self._get_candidate_models()

        for model_candidate in candidate_models:
            try:
                # Step 1 Turn 1: Proactive Deep Idea Enrichment & Probing Questions
                if step == 1 and turn == 1:
                    prompt = (
                        f"User mengajukan ide inisiasi produk software:\n\"\"\"{user_message}\"\"\"\n\n"
                        "Lakukan analisis mendalam dan perkaya ide ini. Susun respon dengan format Markdown:\n"
                        "### 💡 **1. Analisis Visi & Peluang Unik**\n"
                        "Jelaskan analisis tajam mengenai potensi pasar, diferensiasi nilai produk, dan arsitektur solusinya.\n\n"
                        "### ⚠️ **2. Blindspots & Risiko Tersembunyi**\n"
                        "Uraikan 3 risiko teknis, edge case data, integrasi pihak ketiga, atau friksi operasional yang mungkin belum terpikirkan oleh inisiator proyek.\n\n"
                        "### ❓ **3. 5 Pertanyaan Kritis untuk Menajamkan PRD**\n"
                        "Buat 5 pertanyaan berbobot dan sangat spesifik terhadap domain ide user (misal: model monetisasi, integrasi API khusus, regulasi, beban concurrency, penanganan anomali).\n\n"
                        "Usulkan juga **3 alternatif konsep arsitektur & MVP** yang konkret dengan tech stack berbeda (misal: Lean MVP, Real-time Collaborative, Enterprise Scale).\n\n"
                        "Kembalikan output WAJIB dalam format JSON murni:\n"
                        "{\n"
                        "  \"reply\": \"Teks ulasan lengkap markdown sesuai struktur di atas\",\n"
                        "  \"suggested_options\": [\n"
                        "    {\"id\": \"opt-1\", \"title\": \"Judul Konsep 1\", \"description\": \"Penjelasan strategi & tech stack\", \"prompt_payload\": \"Payload jawaban lengkap jika opsi ini dipilih\", \"badge\": \"Lean MVP\"},\n"
                        "    {\"id\": \"opt-2\", \"title\": \"Judul Konsep 2\", \"description\": \"Penjelasan strategi & tech stack\", \"prompt_payload\": \"Payload jawaban lengkap jika opsi ini dipilih\", \"badge\": \"Full-Scale\"},\n"
                        "    {\"id\": \"opt-3\", \"title\": \"Judul Konsep 3\", \"description\": \"Penjelasan strategi & tech stack\", \"prompt_payload\": \"Payload jawaban lengkap jika opsi ini dipilih\", \"badge\": \"Enterprise\"}\n"
                        "  ]\n"
                        "}"
                    )

                    response = await self.client.chat.completions.create(
                        model=model_candidate,
                        messages=[
                            {"role": "system", "content": system_instruction},
                            {"role": "user", "content": prompt}
                        ],
                        response_format={"type": "json_object"},
                        temperature=self.temperature,
                        max_tokens=self.max_tokens
                    )

                    content = response.choices[0].message.content
                    if content:
                        self.model_name = model_candidate
                        data = json.loads(content)
                        options = [SuggestedOption(**opt) for opt in data.get("suggested_options", [])]
                        return {
                            "reply": data.get("reply", ""),
                            "suggested_options": options,
                            "data_extracted": {"core_idea": user_message}
                        }

                # Step 1 Turn 2: Synthesize PRD Architecture & Scope
                elif step == 1 and turn >= 2:
                    prompt = (
                        f"Ide Awal Proyek:\n\"\"\"{project_data.get('coreIdea', '')}\"\"\"\n\n"
                        f"Jawaban Detail & Pilihan Spesifikasi User:\n\"\"\"{user_message}\"\"\"\n\n"
                        "Sintesiskan seluruh keputusan di atas menjadi **Ringkasan Eksekutif PRD yang Matang & Komprehensif**:\n"
                        "• **Executive Summary:** Ringkasan nilai produk.\n"
                        "• **User Personas & Primary Use Cases:** Siapa pemakai utama dan workflow-nya.\n"
                        "• **MVP Scope (Fase 1 vs Fase 2):** Batasan fitur inti yang harus dirilis pertama.\n"
                        "• **Technical Acceptance Criteria:** Syarat teknis minimum yang harus dipenuhi.\n\n"
                        "Akhiri dengan konfirmasi bahwa PRD telah terkunci dan persilakan user masuk ke **Tahap 2: Referensi Desain Visual & UI/UX Specification**."
                    )

                    response = await self.client.chat.completions.create(
                        model=model_candidate,
                        messages=[
                            {"role": "system", "content": system_instruction},
                            {"role": "user", "content": prompt}
                        ],
                        temperature=self.temperature,
                        max_tokens=self.max_tokens
                    )

                    content = response.choices[0].message.content
                    if content:
                        self.model_name = model_candidate
                        return {
                            "reply": content,
                            "data_extracted": {"prd_details": user_message}
                        }

                # Step 2: Visual Design System & UI Tokens
                elif step == 2:
                    prompt = (
                        f"User memberikan panduan visual & referensi UI:\n\"\"\"{user_message}\"\"\"\n\n"
                        "Lakukan analisis mendalam terhadap estetika antarmuka ini:\n"
                        "• **Design Archetype:** Pola visual (misal: Modern Dark Studio, Linear-minimalist, Glassmorphism).\n"
                        "• **Color Tokens & WCAG Contrast:** Rekomendasi palet warna (Obsidian, Indigo, Emerald) dengan standar aksesibilitas WCAG 2.1 AA.\n"
                        "• **Layout Topology & Micro-interactions:** Tata letak kanvas workspace dan transisi 60fps.\n\n"
                        "Konfirmasikan bahwa panduan desain telah dipetakan ke dalam `systemdesign.md`, lalu persilakan user masuk ke **Tahap 3: Kurasi Matriks Skill Agen AI**."
                    )

                    response = await self.client.chat.completions.create(
                        model=model_candidate,
                        messages=[
                            {"role": "system", "content": system_instruction},
                            {"role": "user", "content": prompt}
                        ],
                        temperature=self.temperature,
                        max_tokens=self.max_tokens
                    )

                    content = response.choices[0].message.content
                    if content:
                        self.model_name = model_candidate
                        return {
                            "reply": content,
                            "data_extracted": {"design_guidelines": user_message}
                        }

            except Exception as e:
                logger.warning(f"Candidate OpenAI model '{model_candidate}' failed: {e}")
                continue

        return None

openai_service = OpenAIService()
