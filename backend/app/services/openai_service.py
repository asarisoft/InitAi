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
    Supports GPT-4o, GPT-4o-mini, custom base URLs (Ollama, OpenRouter, Azure),
    active token verification, and structured JSON output.
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
        Executes real OpenAI reasoning for architectural interview with structured JSON options.
        """
        if not self.is_available():
            return None

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
                        "Kembalikan output WAJIB dalam format JSON murni dengan schema:\n"
                        "{\n"
                        "  \"reply\": \"Teks analisis dan pertanyaan pemantik berbobot dalam markdown\",\n"
                        "  \"suggested_options\": [\n"
                        "    {\"id\": \"opt-1\", \"title\": \"Judul Konsep 1\", \"description\": \"Penjelasan 1-2 kalimat\", \"prompt_payload\": \"Payload spesifikasi prompt jika user memilih opsi ini\", \"badge\": \"Kategori\"},\n"
                        "    {\"id\": \"opt-2\", \"title\": \"Judul Konsep 2\", \"description\": \"Penjelasan 1-2 kalimat\", \"prompt_payload\": \"Payload spesifikasi prompt jika user memilih opsi ini\", \"badge\": \"Kategori\"},\n"
                        "    {\"id\": \"opt-3\", \"title\": \"Judul Konsep 3\", \"description\": \"Penjelasan 1-2 kalimat\", \"prompt_payload\": \"Payload spesifikasi prompt jika user memilih opsi ini\", \"badge\": \"Kategori\"}\n"
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

                # Step 1 Turn 2: Synthesize PRD
                elif step == 1 and turn >= 2:
                    prompt = (
                        f"Ide Awal: {project_data.get('coreIdea', '')}\n"
                        f"Jawaban Detail User: {user_message}\n\n"
                        "Sintesis informasi di atas menjadi kesimpulan PRD yang matang. "
                        "Konfirmasikan bahwa spesifikasi sudah sangat matang, lalu persilakan user masuk ke Tahap 2 (Referensi Desain Visual & UI/UX)."
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

                # Step 2: Design Reference Analysis
                elif step == 2:
                    prompt = (
                        f"User memberikan panduan visual & referensi UI: '{user_message}'\n\n"
                        "Analisis gaya visual ini (misal: palette, layout topology, micro-interactions, WCAG AA contrast). "
                        "Jelaskan bagaimana desain ini akan diimplementasikan ke dalam arsitektur SaaS studio modern, lalu persilakan user ke Tahap 3 (Kurasi Skill Agen AI)."
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
