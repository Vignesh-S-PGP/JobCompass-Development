import json
from openai import OpenAI
import os

# ---------------- CONFIG ----------------
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("❌ GROQ_API_KEY not found. Did you load .env?")

client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)

MODEL = "llama-3.1-8b-instant"


def calculate_ats_score(job_desc: str, resume_text: str):
    """
    AI → ONLY skill extraction
    Python → scoring, summary, recommendations
    """

    prompt = f"""
You are a strict information extraction engine.

TASK:
1. Extract ONLY REQUIRED or MUST-HAVE technical skills from the Job Description.
2. Ignore soft skills, responsibilities, tools mentioned as optional, or nice-to-have.
3. Extract ONLY skills that are explicitly mentioned in the Resume.

RULES:
- Output ONLY valid JSON
- No explanations
- No markdown
- No opinions
- No scoring
- No summaries
- Skills must be short canonical names (e.g., "React", "TypeScript", "REST API")

JOB DESCRIPTION:
{job_desc}

RESUME:
{resume_text}

RETURN JSON ONLY:
{{
  "required_skills": [],
  "resume_skills": []
}}
"""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You extract structured technical data only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.0,
            max_tokens=600,
        )

        raw = response.choices[0].message.content.strip()
        print("\n🔥 RAW GROQ RESPONSE 🔥\n", raw)

        start = raw.find("{")
        end = raw.rfind("}")

        if start == -1 or end == -1:
            raise ValueError("No JSON object returned")

        extracted = json.loads(raw[start:end + 1])

        # ---------------- NORMALIZATION ----------------
        required = sorted(set(s.strip() for s in extracted.get("required_skills", [])))
        resume = sorted(set(s.strip() for s in extracted.get("resume_skills", [])))

        # ---------------- MATCHING ----------------
        matched = sorted(set(required).intersection(resume))
        missing = sorted(set(required) - set(matched))

        # ---------------- SCORING (MORE REALISTIC) ----------------
        if not required:
            score = 0
        else:
            base_score = (len(matched) / len(required)) * 100

            # Penalty for weak coverage
            if len(matched) / len(required) < 0.7:
                base_score -= 10

            score = round(max(0, min(100, base_score)))

        # ---------------- SUMMARY (PERCENT-AWARE) ----------------
        if score >= 85:
            summary = f"Strong alignment: the resume matches most of the required skills, scoring {score} out of 100."
        elif score >= 60:
            summary = f"Moderate alignment: the resume meets several key requirements but misses some important skills, scoring {score} out of 100."
        elif score > 0:
            summary = f"Low alignment: the resume matches only a small portion of the required skills, resulting in a score of {score} out of 100."
        else:
            summary = "No meaningful alignment detected between the resume and job requirements."

        # ---------------- RECOMMENDATIONS (DATA-DRIVEN) ----------------
        recommendations = []
        for skill in missing[:3]:
            recommendations.append(
                f"Build or highlight hands-on experience with {skill} to improve alignment with this role."
            )

        if not recommendations:
            recommendations.append(
                "Your skill set aligns well with the role. Focus on deepening expertise and showcasing impact."
            )

        return {
            "required_skills": required,
            "resume_skills": resume,
            "matched_skills": matched,
            "missing_skills": missing,
            "score": score,                     # ✅ clearly out of 100
            "summary": summary,                 # ✅ score-aware explanation
            "recommendations": recommendations  # ✅ derived, not hallucinated
        }

    except Exception as e:
        print("❌ ATS AI ERROR:", e)
        return {
            "required_skills": [],
            "resume_skills": [],
            "matched_skills": [],
            "missing_skills": [],
            "score": 0,
            "summary": "ATS analysis failed.",
            "recommendations": ["Please try again later."]
        }