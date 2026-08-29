from typing import List
from fastapi import APIRouter
from app.schemas.models import SkillItem
from app.services.skills_service import get_all_skills

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("", response_model=List[SkillItem])
def list_skills():
    return get_all_skills()
