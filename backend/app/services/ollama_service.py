import requests
import json
import re

OLLAMA_URL = "http://localhost:11434/api/generate"

def extract_json(text):
    """
    Extract first valid JSON object from text
    """
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError("No JSON found in response")
    return json.loads(match.group())

def analyze_resume_ats(resume_text):
    prompt = f"""
You are an ATS scoring engine.

Return ONLY valid JSON with EXACT fields:

{{
  "atsScore": <integer between 0 and 100>,
  "strengths": [string],
  "missingSkills": [string],
  "suggestions": [string],
  "detectedSkills": [string]
}}

Rules:
- atsScore MUST be an INTEGER (not null, not percentage, not decimal)
- Do NOT explain anything
- Do NOT add extra text

Resume:
\"\"\"
{resume_text}
\"\"\"
"""


    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "mistral",
            "prompt": prompt,
            "stream": False
        },
        timeout=120
    )

    data = response.json()
    raw_text = data.get("response", "")

    try:
        return extract_json(raw_text)
    except Exception as e:
        return {
            "error": "Invalid JSON from Ollama",
            "raw": raw_text
        }
