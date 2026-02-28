import requests
import os
from dotenv import load_dotenv

load_dotenv()

HF_API_TOKEN = os.getenv("HF_API_TOKEN")

API_URL = "https://router.huggingface.co/hf-inference/models/google/flan-t5-large"

headers = {
    "Authorization": f"Bearer {HF_API_TOKEN}",
    "Content-Type": "application/json"
}

def analyze_resume_ats(resume_text):
    prompt = f"""
Return STRICT JSON only.

Analyze the resume and return:
- atsScore (0-100)
- strengths (array)
- missingSkills (array)
- suggestions (array)
- detectedSkills (array)

Resume:
{resume_text}
"""

    response = requests.post(
        API_URL,
        headers=headers,
        json={
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 512,
                "temperature": 0.3
            }
        },
        timeout=90
    )

    if response.status_code != 200:
        return {
            "error": "HF API failed",
            "status": response.status_code,
            "details": response.text
        }

    return response.json()
