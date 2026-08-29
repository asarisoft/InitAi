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
        let suggestedOptions = [
          {
            id: "opt-1",
            title: "B2B SaaS Pro Studio (Recommended MVP)",
            description: "Targetkan Tim Engineering & Designer dengan fitur Role-Based Access, Real-time Collab, dan Export Multi-Format.",
            promptPayload: "Target Pengguna: Tim B2B Engineering & Design. Fitur Kunci: Real-time Multi-cursor Collab, Web Worker, dan Export High-Resolution.",
            badge: "B2B Pro"
          },
          {
            id: "opt-2",
            title: "Developer-First Platform with API & SDK",
            description: "Targetkan Full-Stack Developers dengan Headless Architecture, Webhooks, dan Embeddable SDK.",
            promptPayload: "Target Pengguna: Full-Stack Developers. Fitur Kunci: Headless REST/WebSocket API, CLI tooling, dan Webhook Integrations.",
            badge: "Dev Platform"
          },
          {
            id: "opt-3",
            title: "AI-Autonomous Workflow Studio",
            description: "Targetkan Otomasi Mandiri dengan Background Task Queues, Redis Caching, dan Markdown Artifact Exporter.",
            promptPayload: "Target Pengguna: Produktivitas Tim. Fitur Kunci: Asynchronous Task Runner, Redis Cache, dan Automated Markdown Deliverables.",
            badge: "AI Automation"
          }
        ];

        return {
          reply: `💡 **Ide Dasar Diterima:** *"${trimmed}"*\n\n` +
            "Saya telah menganalisis konsep ini dan menyusun **3 alternatif arah produk & arsitektur** yang dapat memperkaya ide Anda (klik salah satu opsi di bawah atau ketik kustomisasi Anda):\n\n" +
            "---\n" +
            "🔍 **Aspek Kunci yang Dipertegas:**\n" +
            "1. **Target Persona Utama:** Siapa pemakai yang paling krusial?\n" +
            "2. **Fitur Kunci MVP:** Apa 2-3 kapabilitas inti yang wajib ada di versi perdana?\n" +
            "3. **Arsitektur Data:** Apakah memerlukan integrasi real-time / AI vector store?",
          nextStep: 1,
          nextInterviewTurn: 2,
          isStepComplete: false,
          extractedData: { coreIdea: trimmed },
          suggestedOptions
        };
      } else {
        return {
          reply: "✅ **Informasi PRD Sudah Sangat Lengkap & Terstruktur!**\n\n" +
            "Spesifikasi inti, batasan MVP, dan profil pengguna telah berhasil dirumuskan ke dalam draf `prd.md`.\n\n" +
            "---\n\n" +
            "### 🎨 **Tahap 2: Referensi Desain & UI/UX System Specification**\n" +
            "Silakan unggah **screenshot referensi UI / mockup**, masukkan **URL referensi visual** (*pacdora.com, figma.com, linear.app*), atau pilih preset gaya visual pada panel interaktif di bawah.",
          nextStep: 2,
          nextInterviewTurn: 1,
          isStepComplete: true,
          extractedData: { prdDetails: trimmed }
        };
      }
    }

    // Step 2: Design References Analysis
    if (step === 2) {
      return {
        reply: `🎯 **Analisis Gaya Desain Berhasil Dipetakan!**\n\n` +
          `Panduan visual *"${trimmed}"* telah diekstrak ke dalam arsitektur antarmuka:\n` +
          "• **Design Archetype:** Modern SaaS Web Studio (Deep Obsidian Canvas + Electric Indigo Accent)\n" +
          "• **Layout Topology:** Collapsible Nav Sidebar + Main Workspace Canvas + Embedded Inspector Grid\n" +
          "• **Design Tokens:** Standar WCAG 2.1 AA (kontras > 4.5:1), 60fps CSS micro-interactions.\n\n" +
          "Spesifikasi ini siap disematkan ke dalam cetak biru `systemdesign.md`.\n\n" +
          "---\n\n" +
          "### ⚡ **Tahap 3: Kurasi Skill Agen AI (Simulasi Penelusuran Tren GitHub)**\n" +
          "Sistem telah melakukan simulasi penelusuran tren teknologi terbaru tahun ini.\n\n" +
          "Berikut daftar skill standar dan rekomendasi tren. Anda dapat **menambah skill custom**, **memilih/menghapus skill**, atau klik **'Setujui Skill & Generate Artifacts'**.",
        nextStep: 3,
        nextInterviewTurn: 1,
        isStepComplete: true,
        extractedData: { designGuidelines: trimmed },
        suggestedSkills: this.skills
      };
    }

    // Step 3: Skills Confirmation & Completion
    if (step === 3) {
      return {
        reply: "🎉 **Semua 3 Tahapan Selesai! Skill & Konfigurasi Telah Disetujui.**\n\n" +
          "Seluruh 4 berkas artefak markdown telah berhasil di-generate secara lengkap dan siap Anda unduh:\n" +
          "1. `prd.md` — Product Requirements Document yang kaya & executable.\n" +
          "2. `list_skills.md` — Daftar skill pilihan lengkap dengan link GitHub & keunggulan.\n" +
          "3. `systemdesign.md` — Arsitektur sistem, skema database, dan panduan desain UI SaaS Studio.\n" +
          "4. `readme.md` — Dokumentasi proyek, tech stack, dan panduan setup.\n\n" +
          "Silakan klik tombol unduh pada panel di bawah ini.",
        nextStep: 4,
        nextInterviewTurn: 1,
        isStepComplete: true
      };
    }

    // Step 4: Finished state
    return {
      reply: "Proses inisiasi proyek telah selesai! Anda dapat mengunduh 4 file markdown di bawah atau mereset wizard untuk proyek baru.",
      nextStep: 4,
      nextInterviewTurn: 1,
      isStepComplete: true
    };
  }

  async searchTrendSkill(customSkillName) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const sanitized = customSkillName.trim();
    const slug = sanitized.toLowerCase().replace(/[^a-z0-9]/g, "-");

    return {
      id: `custom-${slug}-${Date.now()}`,
      name: sanitized,
      category: "Development",
      githubUrl: `https://github.com/topics/${slug}`,
      description: `Perkakas otomatisasi cerdas untuk ${sanitized}, mendukung integrasi pipeline agentik modern.`,
      advantages: [
        `Kompatibilitas tinggi dengan ekosistem ${sanitized}`,
        "Optimasi throughput dan latensi rendah",
        "Dokumentasi API lengkap dengan dukungan komunitas aktif"
      ],
      installGuide: `npm install @skills/${slug} || pip install ${slug}`,
      selected: true
    };
  }
}

export const mockLlmService = new MockLlmService();
