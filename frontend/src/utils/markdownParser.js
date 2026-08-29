/**
 * Generates markdown file strings and Blob URLs for downloading.
 */

export function generatePrdMarkdown(projectData) {
  const title = projectData.projectName || "Project InitAI";
  const idea = projectData.coreIdea || "AI Web Agent for automated software development workflow";
  const prdDetails = projectData.prdDetails || "Interactive LLM-guided workflow to generate PRD, skill requirements, and system design.";
  const techStack = projectData.techStack || "ReactJS, FastAPI, Docker, TailwindCSS";
  const targetUsers = projectData.targetUsers || "Full-Stack Developers, Product Managers, and AI Engineers";

  return `# Product Requirements Document (PRD) — ${title}

## 1. Executive Summary & Vision
${idea}

${prdDetails}

## 2. Target Users & Personas
- **Primary Audience:** ${targetUsers}
- **Core Value Proposition:** Menghilangkan friction dalam inisiasi proyek software dengan mengotomatisasi penyusunan PRD, kurasi skill agent, dan cetak biru arsitektur teknis dalam hitungan menit.

## 3. Core Functional Requirements (MVP)
- [x] **Interactive Conversational Wizard (3 Steps):**
  1. *Step 1 (PRD Interview):* Tanya-jawab interaktif berbasis loop kecukupan info.
  2. *Step 2 (Design References):* Ekstraksi token visual dari URL/deskripsi referensi UI.
  3. *Step 3 (Skill Selection):* Kurasi matriks skill AI dengan simulasi tren web terkini.
- [x] **Skill Customization Engine:** Filter kategori (Development, UI/UX, Code Review, Security, DevOps) dan penambahan skill custom.
- [x] **Zero-Friction Artifact Export:** Generator instan 3 file markdown (\`prd.md\`, \`list_skills.md\`, \`systemdesign.md\`).

## 4. Non-Functional Requirements & UX
- **Performance:** Render time < 100ms, first contentful paint < 1.5s, 60fps micro-interactions.
- **Accessibility:** Standar WCAG 2.1 AA dengan rasio kontras teks minimum 4.5:1.
- **Resilience:** Beroperasi mandiri (No-backend local fallback) dengan mock LLM engine cerdas.

## 5. Technical Specifications
- **Frontend:** React 18 + Vite (Functional components & hooks)
- **Backend:** FastAPI (Python 3.11+, Asynchronous, Uvicorn)
- **Infrastructure:** Docker multi-stage & Docker Compose
- **Design Tokens:** Modern SaaS Web Studio (Pacdora/Figma dark-mode aesthetic)

## 6. Acceptance Criteria
- [x] Antarmuka web bebas dari console error.
- [x] Alur 3 tahap selesai dengan konfirmasi eksplisit dari AI.
- [x] Seluruh 3 tombol unduh menghasilkan file valid yang dapat dibaca.
`;
}

export function generateListSkillsMarkdown(projectData, skillsList) {
  const title = projectData.projectName || "Project InitAI";
  const activeSkills = (skillsList && skillsList.length > 0) ? skillsList.filter(s => s.selected !== false) : [];

  const skillEntries = activeSkills.map((s, index) => {
    const advList = Array.isArray(s.advantages) ? s.advantages.map(a => `    - ${a}`).join('\n') : `    - ${s.advantages}`;
    const install = s.installGuide || "Lihat tautan repositori terkait.";
    return `### ${index + 1}. ${s.name} [\`${s.category}\`]
- **GitHub Repository:** [${s.githubUrl}](${s.githubUrl})
- **Deskripsi:** ${s.description}
- **Keunggulan & Fitur Utama:**
${advList}
- **Cara Instalasi / Integrasi:** \`${install}\`
`;
  }).join('\n');

  return `# Approved AI Agent Skills & Toolchain — ${title}

Dokumen ini berisi daftar skill dan perkakas terverifikasi yang dipilih untuk memperkuat agen AI pada proyek **${title}**.

---

${skillEntries}

---

## Ringkasan Matriks Kemampuan
- **Total Skill Terintegrasi:** ${activeSkills.length} Skill
- **Kategori Tercover:** ${Array.from(new Set(activeSkills.map(s => s.category))).join(', ')}
- **Waktu Dibuat:** ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}

*Dihasilkan secara otomatis oleh InitAI Agent Studio.*
`;
}

export function generateSystemDesignMarkdown(projectData) {
  const title = projectData.projectName || "Project InitAI";
  const designRef = projectData.designGuidelines || "Modern Dark/Light SaaS Studio (Pacdora/Figma style, Glassmorphism, 60fps Micro-interactions)";

  return `# System Design & Architecture Blueprint — ${title}

## 1. Architectural Overview
Sistem mengadopsi pola arsitektur **Modern Web Studio SaaS** (terinspirasi dari platform terkemuka seperti Pacdora & Figma) yang menggabungkan rendering antarmuka reaktif di sisi klien dengan engine LLM orkestrasi asinkron di sisi backend.

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                 Browser Client (React 18 + Vite)            │
│  - Studio Layout: Collapsible Sidebar + Chat Canvas + Grid  │
│  - Zero-Backend Fallback Engine (Local Mock LLM)           │
│  - In-Memory Blob Exporter (Multi-file Markdown Generator)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / JSON (Optional)
┌──────────────────────────────▼──────────────────────────────┐
│                 FastAPI Asynchronous Backend                │
│  - Multi-turn Conversational Interview Handler              │
│  - AI Skill Search Trend Synthesizer                        │
│  - Pydantic Schema Validation & OpenAPI Spec                │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## 2. Design System & Visual Specification
- **Design Archetype:** ${designRef}
${projectData.designImages && projectData.designImages.length > 0 ? `- **Attached Visual Assets / Mockups:** ${projectData.designImages.map(img => `\`${img.name}\` (${img.size} KB)`).join(', ')}\n` : ''}- **Design Tokens (CSS Variables):**
  - \`--bg-primary\`: \`#08090D\` (Obsidian Canvas)
  - \`--bg-surface\`: \`#141722\` / \`#1C2030\` (Card & Dialog Panels)
  - \`--accent-primary\`: \`#6366F1\` (Electric Indigo / Primary CTA)
  - \`--accent-success\`: \`#10B981\` (Emerald Verification Badge)
  - \`--text-primary\`: \`#F8FAFC\` (High contrast, WCAG AA compliant)
  - \`--text-secondary\`: \`#94A3B8\`
- **Micro-Interactions:**
  - Shimmer pulse saat AI merespons pertanyaan.
  - Hover glow & scale transition pada skill cards.
  - Smooth tab switching dan modal slide-up.

## 3. Data Flow & State Machine
\`\`\`
[Turn 1: PRD Interview] ──► [Turn 2: Design Reference] ──► [Turn 3: Skill Curation] ──► [Turn 4: Export Artifacts]
       │                              │                              │                            │
       ▼                              ▼                              ▼                            ▼
  prd_summary                   design_tokens                 skill_matrix                Download Blobs
\`\`\`

## 4. Security & Quality Assurance
- **Content Security:** Strict input sanitization against XSS.
- **Zero-Dependency Resilience:** Aplikasi dapat berjalan 100% di browser tanpa koneksi backend bila diperlukan.
- **Deterministic Output:** Validasi file markdown menjamin keterbacaan oleh model AI downstream seperti Claude, Gemini, dan GPT.

---
*Dokumen arsitektur ini disusun sebagai standar baku pengembangan tim.*
`;
}

/**
 * Trigger browser file download from string content
 */
export function downloadMarkdownFile(filename, content) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
