import requests
import json
import re

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "phi3:mini"

def calculate_ats_score(job_desc: str, resume_text: str, job_skills: list = None, profile_data: dict = None):
    job_skills_str = ", ".join(job_skills) if job_skills else "Not specified"

    profile_str = ""
    if profile_data:
        profile_str = f"""
Applicant Profile Info:
- Skills: {", ".join(profile_data.get("skills", []))}
- Experience: {profile_data.get("experience", "Not specified")} years
- Education: {json.dumps(profile_data.get("education", []))}
- Bio: {profile_data.get("bio", "Not specified")}
"""

    prompt = f"""
You are a highly advanced Applicant Tracking System (ATS) Expert. Your goal is to provide a precise and objective evaluation of a candidate based on multiple data points.

SCORING GUIDELINES (Total 100 points):
1. Skill Match (40 pts): Compare resume and profile skills against job requirements.
2. Experience Relevance (30 pts): Evaluate years and quality of experience.
3. Educational Alignment (20 pts): Check if education meets industry standards for the role.
4. Overall Profile Strength (10 pts): Bio, headline, and consistency.

Job Description:
{job_desc}

Required Skills:
{job_skills_str}

Resume Content:
{resume_text}

{profile_str}

Analyze the data and return a JSON object with:
- "score": (integer 0-100)
- "matched_skills": List of skills found in both requirements and candidate data.
- "missing_skills": List of required skills not found in candidate data.
- "reason": A detailed breakdown of the score based on the guidelines above.

Return ONLY valid JSON.
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

