import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import logging

load_dotenv()

app = FastAPI()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageRequest(BaseModel):
    text: str

DALL_E_API_URL = "https://api.openai.com/v1/images/generations"
API_KEY = os.getenv("OPENAI_API_KEY")

@app.post("/generate-image")
async def generate_image(request: ImageRequest):
    try:
        logging.info(f"Received text for image generation: {request.text}")

        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        }

        payload = {
            "prompt": request.text,
            "n": 1,
            "size": "512x512",
        }

        logging.info(f"Payload sent to OpenAI API: {payload}")

        response = requests.post(DALL_E_API_URL, json=payload, headers=headers)

        logging.info(f"Response from OpenAI API: {response.status_code} - {response.text}")

        if response.status_code == 200:
            data = response.json()
            image_url = data["data"][0]["url"]
            logging.info(f"Generated image URL: {image_url}")
            return {"image_url": image_url}
        else:
            logging.error(f"Error from OpenAI API: {response.text}")
            raise HTTPException(status_code=response.status_code, detail=f"Failed to generate image. OpenAI API error: {response.text}")
    
    except Exception as e:
        logging.error(f"Error generating image: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
