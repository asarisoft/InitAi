import { INITIAL_SKILLS } from '../utils/defaultSkills';

export class MockLlmService {
  constructor() {
    this.skills = JSON.parse(JSON.stringify(INITIAL_SKILLS));
  }

  async processMessage({ message, step, interviewTurn, projectData }) {
    await new Promise((resolve) => setTimeout(resolve, 380));

    const trimmed = message.trim();
    const clean = trimmed.toLowerCase();

    // Step 1: PRD Interview Loop & Idea Enrichment
    if (step === 1) {
      if (interviewTurn === 1) {
        let suggestedOptions = [];

        if (clean.includes("ecom") || clean.includes("toko") || clean.includes("shop") || clean.includes("wedding") || clean.includes("pasar")) {
          suggestedOptions = [
            {
              id: "opt-1",
              title: "B2C Interactive Hub & Instant Checkout",
              description: "Pengalaman pengguna interaktif dengan katalog dinamis, integrasi QRIS, dan WhatsApp notifications.",
              promptPayload: `Target Pengguna: Konsumen B2C untuk ${trimmed}. Fitur Kunci: Dynamic Booking/Catalog, Real-time QRIS Payment, dan Automated Order Notifications.`,
              badge: "B2C Flow"
            },
            {
              id: "opt-2",
              title: "Multi-Vendor Marketplace & Partner Portal",
              description: "Portal mandiri untuk mitra/vendor, manajemen komisi otomatis, dan analitik performa.",
              promptPayload: `Target Pengguna: Vendor Mitra & Admin. Fitur Kunci: Vendor Self-service Dashboard, Commission Split Engine, dan Role-Based Access Control.`,
              badge: "Multi-Vendor"
            },
            {
              id: "opt-3",
              title: "AI-Powered Conversational Assistant",
              description: "Asisten cerdas untuk memandu rekomendasi produk, kustomisasi pesanan, dan customer care 24/7.",
              promptPayload: `Target Pengguna: Pengguna Digital. Fitur Kunci: AI Recommendation Agent, Natural Language Search, dan WhatsApp CRM Webhooks.`,
              badge: "AI Commerce"
            }
          ];
        } else {
          suggestedOptions = [
            {
              id: "opt-1",
              title: "Lean SaaS Studio MVP (Recommended)",
              description: "Fokus pada alur pengguna inti, otentikasi aman JWT/OAuth, dan dashboard analitik cepat.",
              promptPayload: `Target Pengguna: Tim Profesional & Developer untuk ${trimmed}. Fitur Kunci: Core Workflow Automation, Analytics Dashboard, dan Webhooks.`,
              badge: "Lean MVP"
            },
            {
              id: "opt-2",
              title: "Real-time Collaborative Engine (Figma/Linear Style)",
              description: "Arsitektur event-driven dengan WebSocket / CRDT untuk kerja tim simultan multi-user.",
              promptPayload: `Target Pengguna: Tim Kolaboratif. Fitur Kunci: Real-time Multi-cursor Collab, Live State Sync, dan Activity Audit Logs.`,
              badge: "Real-time Team"
            },
            {
              id: "opt-3",
              title: "Enterprise Multi-Tenant & Autonomous Agent",
              description: "Skala enterprise dengan isolasi tenant, queue background workers, dan audit compliance.",
              promptPayload: `Target Pengguna: Enterprise Scale. Fitur Kunci: Multi-tenancy Architecture, Asynchronous Background Queue (Celery/Redis), dan Security Compliance.`,
              badge: "Enterprise"
            }
          ];
        }

        const replyText = 
          `### 💡 **1. Analisis Visi & Peluang Unik**\n` +
          `Ide *"${trimmed}"* memiliki proposisi nilai yang sangat menarik untuk mengotomatisasi alur kerja manual dan memusatkan interaksi pengguna ke dalam satu studio terintegrasi.\n\n` +
          `### ⚠️ **2. Blindspots & Risiko Tersembunyi**\n` +
          `1. **Lonjakan Trafik & Concurrency Spike:** Penanganan akses simultan pada momen puncak (misal saat event atau peluncuran).\n` +
          `2. **Inkonsistensi Integrasi Pihak Ketiga:** Sinkronisasi API pembayaran atau data eksternal dengan mekanisme retry/idempotency.\n` +
          `3. **Proteksi & Isolasi Data Privasi:** Kebijakan otorisasi data (RBAC) dan kepatuhan standar keamanan data transaksi.\n\n` +
          `### ❓ **3. 5 Pertanyaan Kritis untuk Menajamkan PRD**\n` +
          `1. Siapa segmen pengguna utama yang paling diprioritaskan pada peluncuran perdana (MVP)?\n` +
          `2. Apa 2-3 fitur inti yang paling krusial dan tidak boleh ditunda ke Fase 2?\n` +
          `3. Bagaimana model transaksi/monetisasi yang direncanakan (komisi, subscription, atau one-time)?\n` +
          `4. Apakah sistem memerlukan sinkronisasi data real-time (WebSocket) atau cukup request berbasis REST API?\n` +
          `5. Bagaimana penanganan skenario anomali (misal: pembatalan mendadak atau kegagalan webhook)?\n\n` +
          `*Pilih salah satu kartu konsep arsitektur di bawah atau ketik kustomisasi Anda untuk melanjutkan ke sintesis PRD.*`;

        return {
          reply: replyText,
          nextStep: 1,
          nextInterviewTurn: 2,
          isStepComplete: false,
          extractedData: { coreIdea: trimmed },
          suggestedOptions
        };
      } else {
        return {
          reply: "✅ **Informasi PRD Sudah Sangat Lengkap & Terstruktur!**\n\n" +
            "Spesifikasi inti, batasan cakupan MVP, dan profil pengguna telah berhasil disintesis ke dalam rancangan `prd.md`.\n\n" +
            "---\n\n" +
            "### 🎨 **Tahap 2: Referensi Desain & UI/UX System Specification**\n" +
            "Silakan unggah **screenshot referensi UI / mockup**, masukkan **URL referensi visual** (*figma.com, linear.app, raycast.com*), atau pilih preset gaya visual pada panel di bawah.",
          nextStep: 2,
          nextInterviewTurn: 1,
          isStepComplete: true,
          extractedData: { prdDetails: trimmed }
        };
      }
    }

    // Step 2: Visual Design System
    if (step === 2) {
      return {
        reply: `🎯 **Analisis Desain UI Berhasil Diekstrak!**\n\n` +
          `Panduan visual *"${trimmed}"* telah dipetakan ke dalam arsitektur antarmuka:\n` +
          `• **Design Archetype:** Modern SaaS Studio (Obsidian Canvas + Electric Indigo Accent)\n` +
          `• **Layout Topology:** Collapsible Nav Sidebar + Workspace Canvas + Inspector Grid\n` +
          `• **Design Tokens:** Standar WCAG 2.1 AA (kontras > 4.5:1), 60fps hardware-accelerated micro-interactions.\n\n` +
          `Spesifikasi ini siap disematkan ke dalam cetak biru \`systemdesign.md\`.\n\n` +
          `---\n\n` +
          `### ⚡ **Tahap 3: Kurasi Skill Agen AI**\n` +
          `Sistem telah memuat 9 skill rekayasa standar. Tinjau kartu skill di bawah dan klik **'Setujui Skill & Generate Artifacts'**.`,
        nextStep: 3,
        nextInterviewTurn: 1,
        isStepComplete: true,
        extractedData: { designGuidelines: trimmed },
        suggestedSkills: this.skills
      };
    }

    // Step 3: Confirm Skills
    if (step === 3) {
      return {
        reply: `🎉 **Semua Tahap Selesai! Seluruh 4 Berkas Artefak Markdown Siap Diunduh.**\n\n` +
          `1. \`prd.md\` — Product Requirements Document yang kaya & executable.\n` +
          `2. \`list_skills.md\` — Matriks skill pilihan dengan tautan repositori GitHub & keunggulan.\n` +
          `3. \`systemdesign.md\` — Arsitektur sistem, skema data flow, dan design tokens UI.\n` +
          `4. \`readme.md\` — Dokumentasi proyek, tech stack, dan panduan instalasi/setup.\n\n` +
          `Silakan klik tombol download di panel bawah.`,
        nextStep: 4,
        nextInterviewTurn: 1,
        isStepComplete: true
      };
    }

    return {
      reply: "Proyek telah selesai diinisiasi! Seluruh berkas artefak markdown dapat diunduh di atas.",
      nextStep: 4,
      nextInterviewTurn: 1,
      isStepComplete: true
    };
  }
}

export const mockLlmService = new MockLlmService();
