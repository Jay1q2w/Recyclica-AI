import aiohttp
import base64
from fastapi import UploadFile
from app.core.config import settings

async def encode_image_base64(file: UploadFile) -> str:
    content = await file.read()
    return base64.b64encode(content).decode("utf-8")

async def describe_image_with_gemini(file: UploadFile):
    image_base64 = await encode_image_base64(file)

    prompt = (
    "You are an expert in sustainable waste management. "
    "Analyze the uploaded image and classify the type of waste (e.g., food peel, paper, plastic, etc.). "
    "If it's organic waste (like fruit peels, vegetable scraps, eggshells, etc.), do the following:\n"
    "1. Clearly state that it's organic waste.\n"
    "2. Identify exactly what it is (e.g., banana peel, orange peel, etc.).\n"
    "3. Provide a short paragraph describing its environmental impact if reused.\n"
    "4. Provide an HTML list of 3–5 clear steps users can follow at home to reuse or compost it — include where (e.g., garden, kitchen, community bin), and how (e.g., bury it, blend into compost, dry and crush, etc.).\n"
    "5. Explain how these steps help the planet (in terms of reducing landfill, improving soil, or reducing methane).\n\n"
    "Format your answer as HTML with:\n"
    "- A <h2> title stating if it’s organic or not\n"
    "- A <p> summary\n"
    "- An <ul> with steps\n"
    "- An optional <p> footer about benefits to the environment"
)


    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt},
                    {
                        "inlineData": {
                            "mimeType": file.content_type,
                            "data": image_base64,
                        }
                    }
                ]
            }
        ]
    }

    headers = {"Content-Type": "application/json"}

    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload, headers=headers) as resp:
            result = await resp.json()
            try:
                return {
                    "html": result["candidates"][0]["content"]["parts"][0]["text"]
                }
            except Exception:
                return {"error": "Gemini response parsing failed", "raw": result}
