from fastapi import APIRouter
from app.schemas.models import GenerateFilesRequest, GenerateFilesResponse
from app.services.generator import generate_all_artifacts

router = APIRouter(tags=["Artifact Generator"])

@router.post("/generate-files", response_model=GenerateFilesResponse)
def generate_files_endpoint(payload: GenerateFilesRequest):
    return generate_all_artifacts(payload)
