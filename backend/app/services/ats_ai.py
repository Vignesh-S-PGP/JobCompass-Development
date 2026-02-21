import requests
import json
import re

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "phi3:mini"

def calculate_ats_score(job_desc: str, resume_text: str):
    prompt = f"""
You are a strict Applicant Tracking System (ATS).

You MUST calculate a NUMERIC score.
Different resumes MUST produce different scores.

SCORING RULES:
- Start from 100
- Deduct points for:
  - Missing required skills (10–20 each)
  - Weak experience (5–15)
  - Irrelevant content (5–10)
- Final score MUST reflect deductions

Job Description:
{job_desc}

Resume:
{resume_text}

Return ONLY valid JSON in this format:

{{
  "score": <integer between 0 and 100>,
  "matched_skills": ["..."],
  "missing_skills": ["..."],
  "reason": "Explain deductions clearly"
}}
"""

    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.1,
            "top_p": 0.9
        }
    }

    try:
        res = requests.post(OLLAMA_URL, json=payload, timeout=300)
        data = res.json()

        raw = data.get("response", "")
        print("\nRAW AI RESPONSE:\n", raw)

        match = re.search(r"\{.*\}", raw, re.S)
        if not match:
            raise ValueError("No JSON found")

        ats = json.loads(match.group())
        ats["score"] = max(0, min(100, int(ats["score"])))

        return ats

    except Exception as e:
        print("TS AI ERROR:", e)
        return {
            "score": 0,
            "reason": "AI scoring failed"
        }

