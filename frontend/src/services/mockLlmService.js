import { INITIAL_SKILLS } from '../utils/defaultSkills';

/**
 * Client-side Intelligent Mock LLM Engine
 * Simulates a dynamic conversation with state tracking and simulated web trend searching.
 */

export class MockLlmService {
  constructor() {
    this.skills = JSON.parse(JSON.stringify(INITIAL_SKILLS));
  }

  async processMessage({ message, step, interviewTurn, projectData }) {
    // Simulate natural LLM latency (300ms - 600ms)
    await new Promise((resolve) => setTimeout(resolve, 450));

    const trimmed = message.trim();

    // Step 1: PRD Interview Loop
    if (step === 1) {
      if (interviewTurn === 1) {
        return {
          reply: `💡 **Ide Proyek Diterima:** *"${trimmed}"*\n\n` +
            "Untuk menyusun `prd.md` yang kaya dan *executable*, mari pertegas 2 poin berikut:\n" +
            "1. **Target Pengguna Utama:** Siapa yang akan paling sering memakai produk ini?\n" +
            "2. **Fitur Kunci MVP (Fase 1):** Apa 2-3 fitur wajib yang harus ada di versi perdana?\n\n" +
            "*(Jawab secara ringkas, AI akan mensintesis spesifikasi lengkapnya.)*",
          nextStep: 1,
          nextInterviewTurn: 2,
          isStepComplete: false,
          extractedData: { coreIdea: trimmed }
        };
      } else {
        // Step 1 Turn 2: LLM determines that information is now sufficient!
        return {
          reply: "✅ **Informasi PRD Sudah Cukup Lengkap & Matang!**\n\n" +
            "Spesifikasi inti, batasan MVP, dan profil pengguna telah berhasil dirumuskan ke dalam draf `prd.md`.\n\n" +
            "---\n\n" +
            "### 🎨 **Tahap 2: Referensi Desain & UI/UX**\n" +
            "Silakan masukkan **URL referensi visual** (misal: *pacdora.com*, *figma.com*, *linear.app*) atau **deskripsi gaya visual** yang diinginkan (contoh: *Dark mode elegan, clean SaaS Web Studio, glassmorphism, accent purple glow*).",
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
        reply: `🎯 **Analisis Gaya Desain Berhasil!**\n\n` +
          `Referensi visual *"${trimmed}"* telah dipetakan ke dalam arsitektur UI:\n` +
          "• **Theme Palette:** Modern Dark/Light SaaS Studio (Deep obsidian canvas + Indigo/Emerald accents)\n" +
          "• **Layout Structure:** Collapsible Sidebar Navigation + Workspace Chat Panel + Interactive Inspector Grid\n" +
          "• **Design Tokens:** Standar WCAG AA (kontras > 4.5:1), smooth 60fps micro-interactions, dan modular CSS.\n\n" +
          "Data ini siap disematkan ke dalam rancangan `systemdesign.md`.\n\n" +
          "---\n\n" +
          "### ⚡ **Tahap 3: Konfirmasi Skill & Rekomendasi Tren AI (Web Search Simulation)**\n" +
          "Sistem telah melakukan simulasi penelusuran tren teknologi terbaru tahun ini.\n\n" +
          "Berikut daftar skill standar dan rekomendasi tren. Anda dapat **menambah skill custom**, **memilih/menghapus skill**, atau klik **'Selesai & Generate Files'**.",
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
          "Seluruh artefak markdown telah berhasil di-generate secara lengkap dan siap Anda unduh:\n" +
          "1. `prd.md` — Product Requirements Document yang *executable*.\n" +
          "2. `list_skills.md` — Daftar skill pilihan lengkap dengan link GitHub & keunggulan.\n" +
          "3. `systemdesign.md` — Arsitektur sistem, skema database, dan panduan desain UI SaaS Studio.\n\n" +
          "Silakan klik tombol unduh pada panel di bawah ini.",
        nextStep: 4,
        nextInterviewTurn: 1,
        isStepComplete: true
      };
    }

    // Step 4: Finished state
    return {
      reply: "Proses pembuatan proyek telah selesai! Anda dapat mengunduh 3 file markdown di bawah atau mereset wizard untuk proyek baru.",
      nextStep: 4,
      nextInterviewTurn: 1,
      isStepComplete: true
    };
  }

  /**
   * Simulate AI Web Trend Search for custom skill added by user
   */
  async searchTrendSkill(customSkillName) {
    await new Promise((resolve) => setTimeout(resolve, 600));

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
