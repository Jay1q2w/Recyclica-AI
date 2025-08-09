from fastapi import FastAPI
from app.api.routes import router
from dotenv import load_dotenv

load_dotenv()  # Load env vars from .env

app = FastAPI(
    title="Gemini Vision API",
    description="Upload an image and get a text description",
    version="1.0.0"
)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)
