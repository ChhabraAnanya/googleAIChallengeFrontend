import os
import requests

# Load API key from the environment (ensure you have the key set in your environment or .env file)
API_KEY = os.getenv("OPENAI_API_KEY")

# OpenAI DALL-E endpoint
DALL_E_API_URL = "https://api.openai.com/v1/images/generations"

# Input text for image generation
text = "A beautiful sunset over the mountains"  # Example prompt; you can change this to whatever you want

# Request headers
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

# Request payload
payload = {
    "prompt": text,
    "n": 1,
    "size": "512x512",  # You can change the image size if needed
}

# Send the request to the OpenAI API
response = requests.post(DALL_E_API_URL, json=payload, headers=headers)

# Check if the response is successful (HTTP status code 200)
if response.status_code == 200:
    data = response.json()
    print("Generated Image URL:", data["data"][0]["url"])  # The URL of the generated image
else:
    print(f"Error: {response.status_code}, {response.text}")
