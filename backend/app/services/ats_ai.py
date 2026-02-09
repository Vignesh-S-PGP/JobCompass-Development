import requests
import json
import re

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "phi3:mini"


def calculate_ats_score(job_desc: str, resume_text: str):
    prompt = f"""
You are an ATS system.
Return ONLY valid JSON.

Job Description:
{job_desc}

Resume:
{resume_text}

JSON format:
{{
  "score": number between 0 and 100,
  "reason": "short explanation"
}}
"""

    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False
    }

    try:
        res = requests.post(OLLAMA_URL, json=payload, timeout=120)
        data = res.json()

        raw = data.get("response", "")

        # 🔥 extract JSON from text
        match = re.search(r"\{.*\}", raw, re.S)
        if not match:
            raise ValueError("No JSON found in response")

        ats = json.loads(match.group())
        return ats

    except Exception as e:
        print("❌ ATS AI ERROR:", e)
        return {
            "score": 0,
            "reason": "AI scoring failed"
        }
