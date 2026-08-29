from typing import List
from app.schemas.models import SuggestedOption

def enrich_user_idea(user_input: str) -> List[SuggestedOption]:
    """
    Analyzes user idea and proactively generates 3-4 high-value feature & architecture variations.
    Provides clickable options for aspects the user might not have thought of yet.
    """
    clean = user_input.lower()

    if any(k in clean for k in ["ecommerce", "toko", "shop", "marketplace", "retail"]):
        return [
            SuggestedOption(
                id="opt-ecom-1",
                title="B2C Personalized AI Shopping Studio",
                description="Katalog produk dengan rekomendasi visual AI, keranjang instan, & checkout Stripe.",
                prompt_payload="Target Pengguna: Pembeli Online (B2C). Fitur Kunci: AI Recommendation Engine, Cart Caching Redis, dan Payment Gateway terintegrasi.",
                badge="B2C Flow"
            ),
            SuggestedOption(
                id="opt-ecom-2",
                title="Multi-Vendor Marketplace & Vendor Hub",
                description="Dashboard merchant mandiri, manajemen inventori real-time, dan split payment.",
                prompt_payload="Target Pengguna: Vendor UMKM & Marketplace Admin. Fitur Kunci: Dashboard Analitik Penjualan, Real-time Stock Sync, dan Role-Based Access.",
                badge="Multi-Vendor"
            ),
            SuggestedOption(
                id="opt-ecom-3",
                title="AI Social Commerce & Automated Live Chat",
                description="Chatbot penjualan cerdas terintegrasi WhatsApp & Instagram API.",
                prompt_payload="Target Pengguna: Pelanggan Social Media. Fitur Kunci: AI Sales Assistant, WhatsApp CRM webhook, dan One-click Checkout.",
                badge="Conversational"
            )
        ]

    elif any(k in clean for k in ["saas", "agent", "ai", "studio", "packag", "cad", "design"]):
        return [
            SuggestedOption(
                id="opt-saas-1",
                title="B2B Pro Studio with Real-time Collaboration",
                description="Kanvas interaktif dengan multi-cursor CRDT (Figma style), Web Worker, dan export 8K.",
                prompt_payload="Target Pengguna: Tim Desainer & Product Engineer B2B. Fitur Kunci: Real-time Multi-cursor Collab, WASM Geometry Kernel, dan Export Multi-format (PDF/PNG/DXF).",
                badge="Enterprise B2B"
            ),
            SuggestedOption(
                id="opt-saas-2",
                title="Developer-First Platform with API & Webhooks",
                description="Headless architecture dengan REST & WebSocket API, CLI tool, dan SDK embeddable.",
                prompt_payload="Target Pengguna: Full-Stack Developers & AI Engineers. Fitur Kunci: Headless API, Embeddable SDK, dan Webhook Dispatcher untuk CI/CD pipeline.",
                badge="Developer Tool"
            ),
            SuggestedOption(
                id="opt-saas-3",
                title="Self-Hosted / Zero-Cloud Privacy Edition",
                description="Berjalan 100% lokal di browser client / local Docker tanpa ketergantungan external cloud.",
                prompt_payload="Target Pengguna: Perusahaan dengan standar privasi tinggi. Fitur Kunci: 100% Offline Local Inference, Client-side Blob generation, dan Zero-Data-Logging.",
                badge="High Privacy"
            )
        ]

    else:
        return [
            SuggestedOption(
                id="opt-gen-1",
                title="Opsi A: SaaS Web App Terintegrasi (Recommended MVP)",
                description="Fokus pada alur pengguna intuitif, auth berbasis JWT/OAuth, dan dashboard analitik.",
                prompt_payload=f"Targetkan Developer & Tim Bisnis untuk {user_input} dengan fitur Authenticated Dashboard, Role-Based Access Control, dan Event Webhooks.",
                badge="SaaS MVP"
            ),
            SuggestedOption(
                id="opt-gen-2",
                title="Opsi B: Real-time Collaborative Engine",
                description="Arsitektur event-driven dengan WebSocket broker untuk kerja tim simultan.",
                prompt_payload=f"Targetkan Tim Kolaboratif untuk {user_input} dengan fitur Live Multi-user Presence, Activity Audit Log, dan Instant Notification.",
                badge="Real-time Team"
            ),
            SuggestedOption(
                id="opt-gen-3",
                title="Opsi C: AI-Powered Autonomous Automation",
                description="Fokus pada otomasi workflow mandiri dengan scheduled background workers & task queues.",
                prompt_payload=f"Targetkan Otomasi Alur Kerja untuk {user_input} dengan fitur Asynchronous Task Queue (Celery/Redis), Webhook Triggers, dan Auto-reporting Markdown.",
                badge="AI Automation"
            )
        ]
