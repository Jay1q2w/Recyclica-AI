from fastapi import APIRouter, UploadFile, File
from app.services.gemini_service import describe_image_with_gemini

router = APIRouter()

@router.post("/describe-image")
async def describe_image(file: UploadFile = File(...)):
    return await describe_image_with_gemini(file)
