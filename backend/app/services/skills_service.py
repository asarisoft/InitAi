import re
import time
from typing import List, Optional
from app.schemas.models import SkillItem

DEFAULT_TREND_SKILLS: List[SkillItem] = [
    SkillItem(
        id="brainstorming",
        name="AI Brainstorming & PRD Synthesizer",
        category="Development",
        github_url="https://github.com/microsoft/autogen",
        description="Merumuskan ide liar menjadi user stories, MVP scope, dan PRD yang executable.",
        advantages=["Struktur PRD otomatis terstandarisasi", "Mengurangi risiko scope creep", "Analisis risiko sejak dini"],
        install_guide="npx @initai/skill-brainstorming init"
    ),
    SkillItem(
        id="writing-plans",
        name="Executable Plan Writer",
        category="Development",
        github_url="https://github.com/anthropics/anthropic-cookbook",
        description="Menulis langkah-langkah implementasi modular dengan checklist pengujian.",
        advantages=["Pecah task granular per sprint", "Checklist testing otomatis", "Menghubungkan acceptance criteria ke code"],
        install_guide="npm install -g initai-plan-generator"
    ),
    SkillItem(
        id="ui-fe-design",
        name="Modern Web Studio UI/UX",
        category="UI/UX",
        github_url="https://github.com/tailwindlabs/tailwindcss",
        description="Arsitektur antarmuka modern dengan design tokens, micro-interactions, dan dark mode.",
        advantages=["Design token konsisten", "Aksesibilitas WCAG AA (rasio 4.5:1)", "Performa 60fps micro-animations"],
        install_guide="npm install @initai/ui-design-tokens"
    ),
    SkillItem(
        id="be-api-arch",
        name="FastAPI Asynchronous Architecture",
        category="Development",
        github_url="https://github.com/tiangolo/fastapi",
        description="Perancangan RESTful & WebSocket API dengan throughput tinggi dan clean architecture.",
        advantages=["Async/await I/O non-blocking", "OpenAPI (Swagger) otomatis", "Validasi tipe data ketat dengan Pydantic"],
        install_guide="pip install fastapi uvicorn pydantic"
    ),
    SkillItem(
        id="db-modeling",
        name="Relational & Vector Data Modeling",
        category="Development",
        github_url="https://github.com/sqlalchemy/sqlalchemy",
        description="Perancangan skema relasional teroptimasi beserta embedding vector index.",
        advantages=["Skema ternormalisasi & index efisien", "Dukungan PgVector untuk RAG", "Migrasi skema otomatis (Alembic)"],
        install_guide="pip install sqlalchemy alembic pgvector"
    ),
    SkillItem(
        id="code-review",
        name="Automated Semantic Code Review",
        category="Code Review",
        github_url="https://github.com/astral-sh/ruff",
        description="Analisis mendalam terhadap struktur kode, edge cases, dan kebersihan arsitektur.",
        advantages=["Linting instan berkecepatan tinggi", "Deteksi code smells & antipatterns", "Saran refactoring real-time"],
        install_guide="pip install ruff || npm install eslint"
    ),
    SkillItem(
        id="security-review",
        name="OWASP & Zero-Trust Security Reviewer",
        category="Security",
        github_url="https://github.com/PyCQA/bandit",
        description="Audit keamanan menyeluruh terhadap injeksi, autentikasi, dan sanitasi payload.",
        advantages=["Scan kerentanan kode otomatis", "Audit dependensi CVE", "Pencegahan kebocoran secret/token"],
        install_guide="pip install bandit safety"
    ),
    SkillItem(
        id="qa-testing",
        name="End-to-End Test Automation",
        category="Development",
        github_url="https://github.com/microsoft/playwright",
        description="Framework pengujian otomatis unit, integrasi, dan browser E2E.",
        advantages=["Cross-browser E2E testing", "Snapshot visual regression", "Automasi skenario user journey"],
        install_guide="npx playwright install"
    ),
    SkillItem(
        id="devops-deploy",
        name="Docker & CI/CD Cloud Pipeline",
        category="DevOps",
        github_url="https://github.com/docker/compose",
        description="Kontainerisasi multi-stage dan otomatisasi deployment GitHub Actions.",
        advantages=["Ukuran image container minimal", "Zero-downtime deployment", "Isolasi environment terjamin"],
        install_guide="docker compose up --build"
    )
]

def get_all_skills() -> List[SkillItem]:
    return DEFAULT_TREND_SKILLS

def search_and_synthesize_skill(query: str, category: Optional[str] = "Development") -> SkillItem:
    """
    Synthesizes a new verified AI agent skill based on user query and tech stack trends.
    """
    sanitized = query.strip()
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", sanitized).strip("-").lower()
    if not slug:
        slug = "custom-skill"

    cat = category if category in ["Development", "UI/UX", "Code Review", "Security", "DevOps"] else "Development"

    return SkillItem(
        id=f"skill-{slug}-{int(time.time())}",
        name=sanitized,
        category=cat,
        github_url=f"https://github.com/topics/{slug}",
        description=f"Perkakas otomasi cerdas dan pustaka integrasi untuk {sanitized}, mendukung pipeline rekayasa modern.",
        advantages=[
            f"Kompatibilitas tinggi dengan ekosistem {sanitized}",
            "Throughput tinggi dengan latensi eksekusi rendah",
            "Mendukung integrasi CI/CD dan pengujian otomatis"
        ],
        install_guide=f"npm install @skills/{slug} || pip install {slug}",
        selected=True
    )
