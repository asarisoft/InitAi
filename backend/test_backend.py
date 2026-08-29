import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "Proactive Idea Enrichment" in data["features"]

def test_get_skills():
    response = client.get("/skills")
    assert response.status_code == 200
    skills = response.json()
    assert len(skills) >= 9
    assert any(s["id"] == "brainstorming" for s in skills)

def test_chat_step_1_idea_enrichment():
    # Turn 1: User gives a raw idea -> Backend enriches with 3 options
    payload = {
        "message": "Saya ingin membuat aplikasi B2B SaaS 3D Packaging",
        "step": 1,
        "interview_turn": 1,
        "conversation_history": []
    }
    response = client.post("/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["next_step"] == 1
    assert data["interview_turn"] == 2
    assert data["is_step_complete"] is False
    assert data["suggested_options"] is not None
    assert len(data["suggested_options"]) >= 3
    assert data["data_extracted"]["core_idea"] == payload["message"]

def test_chat_step_1_turn_2_completion():
    # Turn 2: User responds -> Backend completes Step 1 and advances to Step 2
    payload = {
        "message": "Target Pengguna: Tim Desainer B2B. Fitur Kunci: Real-time Multi-cursor Collab.",
        "step": 1,
        "interview_turn": 2,
        "conversation_history": []
    }
    response = client.post("/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["next_step"] == 2
    assert data["is_step_complete"] is True
    assert "Tahap 2" in data["reply"]

def test_chat_step_2_design_reference():
    # Step 2: Design reference input
    payload = {
        "message": "pacdora.com and figma dark mode",
        "step": 2,
        "interview_turn": 1,
        "conversation_history": []
    }
    response = client.post("/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["next_step"] == 3
    assert data["is_step_complete"] is True
    assert len(data["suggested_skills"]) >= 9

def test_chat_step_3_skill_confirmation():
    # Step 3: Confirm skills
    payload = {
        "message": "Saya konfirmasi semua skill siap digunakan",
        "step": 3,
        "interview_turn": 1,
        "conversation_history": []
    }
    response = client.post("/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["next_step"] == 4
    assert data["is_step_complete"] is True

def test_generate_files():
    payload = {
        "project_name": "Test Packaging Studio",
        "prd_summary": "High-end 3D CAD packaging web studio",
        "target_users": "Designers and Brands",
        "tech_stack": "React 18, FastAPI, Docker",
        "design_references": "Obsidian canvas with electric indigo",
        "selected_skills": [
            {
                "id": "ui-fe-design",
                "name": "Modern Web Studio UI/UX",
                "category": "UI/UX",
                "github_url": "https://github.com/tailwindlabs/tailwindcss",
                "description": "Arsitektur antarmuka modern",
                "advantages": ["WCAG AA", "60fps"],
                "install_guide": "npm install",
                "selected": True
            }
        ],
        "design_images": [{"name": "mockup_studio.png", "size": "120.5"}]
    }
    response = client.post("/generate-files", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "# Product Requirements Document (PRD)" in data["prd_md"]
    assert "# Approved AI Agent Skills & Toolchain" in data["list_skills_md"]
    assert "# System Design & Architecture Blueprint" in data["systemdesign_md"]
    assert "mockup_studio.png" in data["systemdesign_md"]
    assert "# Test Packaging Studio" in data["readme_md"]
    assert "## 🚀 Panduan Memulai Cepat" in data["readme_md"]
