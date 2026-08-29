export const INITIAL_SKILLS = [
  {
    id: "brainstorming",
    name: "AI Brainstorming & PRD Synthesizer",
    category: "Development",
    githubUrl: "https://github.com/microsoft/autogen",
    description: "Merumuskan ide awal menjadi user stories, MVP scope terukur, dan PRD yang executable.",
    advantages: [
      "Struktur PRD otomatis terstandarisasi",
      "Mengeliminasi risiko scope creep sejak awal",
      "Identifikasi edge cases dan batasan teknis"
    ],
    installGuide: "npx @initai/skill-brainstorming init",
    selected: true
  },
  {
    id: "writing-plans",
    name: "Executable Plan Writer",
    category: "Development",
    githubUrl: "https://github.com/anthropics/anthropic-cookbook",
    description: "Menulis langkah-langkah implementasi modular dengan checklist pengujian per fase.",
    advantages: [
      "Pecah task granular per sprint",
      "Checklist acceptance criteria siap verifikasi",
      "Dependency mapping antar modul"
    ],
    installGuide: "npm install -g initai-plan-generator",
    selected: true
  },
  {
    id: "ui-fe-design",
    name: "Modern Web Studio UI/UX",
    category: "UI/UX",
    githubUrl: "https://github.com/tailwindlabs/tailwindcss",
    description: "Arsitektur antarmuka modern dengan design tokens, micro-interactions, dan dark mode.",
    advantages: [
      "Design token modular (Colors, Typography, Spacing)",
      "Standar Aksesibilitas WCAG AA (rasio kontras 4.5:1)",
      "Animasi smooth 60fps dengan micro-interactions"
    ],
    installGuide: "npm install @initai/ui-design-tokens",
    selected: true
  },
  {
    id: "be-api-arch",
    name: "FastAPI Asynchronous Architecture",
    category: "Development",
    githubUrl: "https://github.com/tiangolo/fastapi",
    description: "Perancangan RESTful & WebSocket API dengan throughput tinggi dan clean architecture.",
    advantages: [
      "Async I/O non-blocking berkecepatan tinggi",
      "Dokumentasi OpenAPI (Swagger) interaktif otomatis",
      "Validasi skema ketat berbasis Pydantic v2"
    ],
    installGuide: "pip install fastapi uvicorn pydantic",
    selected: true
  },
  {
    id: "db-modeling",
    name: "Relational & Vector Data Modeling",
    category: "Development",
    githubUrl: "https://github.com/sqlalchemy/sqlalchemy",
    description: "Perancangan skema relasional teroptimasi beserta embedding vector index untuk AI.",
    advantages: [
      "Normalisasi skema dan indexing efisien",
      "Dukungan PgVector untuk RAG workflow",
      "Migrasi database otomatis via Alembic"
    ],
    installGuide: "pip install sqlalchemy alembic pgvector",
    selected: true
  },
  {
    id: "code-review",
    name: "Automated Semantic Code Review",
    category: "Code Review",
    githubUrl: "https://github.com/astral-sh/ruff",
    description: "Analisis mendalam terhadap struktur kode, edge cases, dan kebersihan arsitektur.",
    advantages: [
      "Linting & formatting ultra cepat",
      "Deteksi antipatterns dan potensi bug logic",
      "Saran refactoring real-time berbasis AI"
    ],
    installGuide: "pip install ruff || npm install eslint",
    selected: true
  },
  {
    id: "security-review",
    name: "OWASP & Zero-Trust Security Reviewer",
    category: "Security",
    githubUrl: "https://github.com/PyCQA/bandit",
    description: "Audit keamanan menyeluruh terhadap injeksi, autentikasi, dan sanitasi payload.",
    advantages: [
      "Scan kerentanan kode otomatis (SAST)",
      "Audit dependensi CVE berkala",
      "Pencegahan kebocoran secret dan access token"
    ],
    installGuide: "pip install bandit safety",
    selected: true
  },
  {
    id: "qa-testing",
    name: "End-to-End Test Automation",
    category: "Development",
    githubUrl: "https://github.com/microsoft/playwright",
    description: "Framework pengujian otomatis unit test, integrasi, dan browser cross-platform E2E.",
    advantages: [
      "Cross-browser E2E testing (Chromium, WebKit, Firefox)",
      "Snapshot visual regression testing",
      "Otomatisasi skenario user journey"
    ],
    installGuide: "npx playwright install",
    selected: true
  },
  {
    id: "devops-deploy",
    name: "Docker & CI/CD Cloud Pipeline",
    category: "DevOps",
    githubUrl: "https://github.com/docker/compose",
    description: "Kontainerisasi multi-stage dan otomatisasi deployment GitHub Actions.",
    advantages: [
      "Ukuran image container minimal & secure",
      "Zero-downtime deployment orchestration",
      "Isolasi environment dev-staging-prod konsisten"
    ],
    installGuide: "docker compose up --build",
    selected: true
  }
];

export const CATEGORIES = ["All", "Development", "UI/UX", "Code Review", "Security", "DevOps"];
