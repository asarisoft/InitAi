from typing import List
from fastapi import APIRouter
from app.schemas.models import SkillItem, SkillSearchRequest
from app.services.skills_service import get_all_skills, search_and_synthesize_skill

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("", response_model=List[SkillItem])
def list_skills():
    return get_all_skills()

@router.post("/search", response_model=SkillItem)
def search_skill(req: SkillSearchRequest):
    return search_and_synthesize_skill(query=req.query, category=req.category)
