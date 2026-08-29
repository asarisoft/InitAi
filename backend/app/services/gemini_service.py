import json
import logging
from typing import Optional, Dict, Any, List
from app.core.config import settings
from app.schemas.models import SuggestedOption, SkillItem

logger = logging.getLogger(__name__)

FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.5-pro", "gemini-1.5-pro"]

class GeminiService:
    """
    Google Gemini Native LLM & Tool Calling Service.
    Includes active token/quota verification, auto-fallback model resolution,
    configurable models & hyperparameters.
    """

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL or "gemini-2.5-flash"
        self.temperature = settings.GEMINI_TEMPERATURE
        self.top_p = settings.GEMINI_TOP_P
        self.max_output_tokens = settings.GEMINI_MAX_OUTPUT_TOKENS
        self.client = None
        self._init_client(self.api_key)

    def _init_client(self, api_key: str):
        self.api_key = api_key.strip() if api_key else ""
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info(f"Initialized Google Gemini Client successfully (Model: {self.model_name}).")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini Client: {e}")
                self.client = None
        else:
            self.client = None

    def is_available(self) -> bool:
        return self.client is not None

    def _get_candidate_models(self) -> List[str]:
        candidates = [self.model_name]
        for m in FALLBACK_MODELS:
            if m not in candidates:
                candidates.append(m)
        return candidates

    def verify_token_quota(self, api_key: Optional[str] = None) -> Dict[str, Any]:
        """
        Actively tests if the Gemini API key is valid, model is available, and has remaining token quota.
        Auto-resolves to working model if a specific model is deprecated.
        """
        key_to_test = api_key.strip() if api_key else self.api_key
        if not key_to_test:
            return {
                "status": "missing_key",
                "valid": False,
                "model": self.model_name,
                "message": "GEMINI_API_KEY belum dikonfigurasi di backend (.env). Masukkan API Key agar analisis AI berjalan secara live."
            }

        last_error = ""
        candidate_models = self._get_candidate_models()

        try:
            from google import genai
            test_client = genai.Client(api_key=key_to_test)

            for model_candidate in candidate_models:
                try:
                    response = test_client.models.generate_content(
                        model=model_candidate,
                        contents="Halo! Jawab 'OK' jika token aktif.",
                    )
                    if response and response.text:
                        self.model_name = model_candidate
                        if api_key:
                            self._init_client(api_key)
                        return {
                            "status": "active",
                            "valid": True,
                            "model": self.model_name,
                            "message": f"Token Gemini Aktif & Siap Digunakan (Model: {self.model_name})."
                        }
                except Exception as model_err:
                    last_error = str(model_err)
                    err_lower = last_error.lower()
                    if "404" in err_lower or "not found" in err_lower or "no longer available" in err_lower:
                        # Try next model candidate
                        continue
                    elif "quota" in err_lower or "429" in err_lower or "resource_exhausted" in err_lower:
                        return {
                            "status": "quota_exhausted",
                            "valid": False,
                            "model": self.model_name,
                            "message": "Kuota Token Gemini Habis (429 Resource Exhausted). Silakan gunakan API Key baru."
                        }
                    elif "api_key_invalid" in err_lower or "invalid" in err_lower or "400" in err_lower or "403" in err_lower:
                        return {
                            "status": "invalid_key",
                            "valid": False,
                            "model": self.model_name,
                            "message": "API Key Gemini Tidak Valid / Akses Ditolak (401/403). Periksa kembali token Anda."
                        }
                    else:
                        break

            return {
                "status": "error",
                "valid": False,
                "model": self.model_name,
                "message": f"Gagal terhubung ke Gemini: {last_error[:180]}"
            }

        except Exception as e:
            return {
                "status": "error",
                "valid": False,
                "model": self.model_name,
                "message": f"Inisialisasi client gagal: {str(e)[:180]}"
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
        Executes real Gemini LLM reasoning using configured model & generation parameters with auto-retry.
        """
        if not self.is_available():
            return None

        from google import genai
        from google.genai import types

        system_instruction = (
            "Anda adalah InitAI Architect, seorang Principal Software Architect & Product Strategist kelas dunia. "
            "Tugas Anda adalah mewawancarai pengguna dalam 3 tahap terstruktur untuk merumuskan PRD, panduan UI/UX, dan arsitektur software. "
            "Berikan respons cerdas, kritis, mendalam, tanpa basa-basi generic AI slop. "
            "Gunakan format Markdown yang rapi dan profesional."
        )

        candidate_models = self._get_candidate_models()

        for model_candidate in candidate_models:
            try:
                # Step 1: Idea Enrichment & Options Generation
                if step == 1 and turn == 1:
                    prompt = (
                        f"User mengajukan ide proyek: '{user_message}'\n\n"
                        "Lakukan analisis mendalam terhadap problem statement ini. Berikan ulasan singkat (2 paragraf), lalu usulkan 3 variasi konsep arsitektur & MVP yang bisa dipilih user.\n"
                        "Kembalikan output dalam format JSON dengan schema:\n"
                        "{\n"
                        "  \"reply\": \"Teks analisis dan pertanyaan pemantik berbobot dalam markdown\",\n"
                        "  \"suggested_options\": [\n"
                        "    {\"id\": \"opt-1\", \"title\": \"Judul Konsep 1\", \"description\": \"Penjelasan 1-2 kalimat\", \"prompt_payload\": \"Payload spesifikasi prompt jika user memilih opsi ini\", \"badge\": \"Kategori\"},\n"
                        "    {\"id\": \"opt-2\", \"title\": \"Judul Konsep 2\", \"description\": \"Penjelasan 1-2 kalimat\", \"prompt_payload\": \"Payload spesifikasi prompt jika user memilih opsi ini\", \"badge\": \"Kategori\"},\n"
                        "    {\"id\": \"opt-3\", \"title\": \"Judul Konsep 3\", \"description\": \"Penjelasan 1-2 kalimat\", \"prompt_payload\": \"Payload spesifikasi prompt jika user memilih opsi ini\", \"badge\": \"Kategori\"}\n"
                        "  ]\n"
                        "}"
                    )

                    response = self.client.models.generate_content(
                        model=model_candidate,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=system_instruction,
                            temperature=self.temperature,
                            top_p=self.top_p,
                            max_output_tokens=self.max_output_tokens,
                            response_mime_type="application/json"
                        )
                    )

                    if response.text:
                        self.model_name = model_candidate
                        data = json.loads(response.text)
                        options = [SuggestedOption(**opt) for opt in data.get("suggested_options", [])]
                        return {
                            "reply": data.get("reply", ""),
                            "suggested_options": options,
                            "data_extracted": {"core_idea": user_message}
                        }

                # Step 1 Turn 2: Synthesize PRD
                elif step == 1 and turn >= 2:
                    prompt = (
                        f"Ide Awal: {project_data.get('coreIdea', '')}\n"
                        f"Jawaban Detail User: {user_message}\n\n"
                        "Sintesis informasi di atas menjadi kesimpulan PRD yang matang. "
                        "Konfirmasikan bahwa spesifikasi sudah sangat matang, lalu persilakan user masuk ke Tahap 2 (Referensi Desain Visual & UI/UX)."
                    )

                    response = self.client.models.generate_content(
                        model=model_candidate,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=system_instruction,
                            temperature=self.temperature,
                            top_p=self.top_p,
                            max_output_tokens=self.max_output_tokens
                        )
                    )

                    if response.text:
                        self.model_name = model_candidate
                        return {
                            "reply": response.text,
                            "data_extracted": {"prd_details": user_message}
                        }

                # Step 2: Design Reference Analysis
                elif step == 2:
                    prompt = (
                        f"User memberikan panduan visual & referensi UI: '{user_message}'\n\n"
                        "Analisis gaya visual ini (misal: palette, layout topology, micro-interactions, WCAG AA contrast). "
                        "Jelaskan bagaimana desain ini akan diimplementasikan ke dalam arsitektur SaaS studio modern, lalu persilakan user ke Tahap 3 (Kurasi Skill Agen AI)."
                    )

                    response = self.client.models.generate_content(
                        model=model_candidate,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=system_instruction,
                            temperature=self.temperature,
                            top_p=self.top_p,
                            max_output_tokens=self.max_output_tokens
                        )
                    )

                    if response.text:
                        self.model_name = model_candidate
                        return {
                            "reply": response.text,
                            "data_extracted": {"design_guidelines": user_message}
                        }

            except Exception as e:
                logger.warning(f"Candidate model '{model_candidate}' failed: {e}")
                continue

        return None

gemini_service = GeminiService()
