import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_resume_ats(resume_text):
    prompt = f"""
You are an ATS (Applicant Tracking System).

Analyze the resume below and return STRICT JSON ONLY with:
- atsScore (0-100)
- strengths (array of strings)
- missingSkills (array of strings)
- suggestions (array of strings)
- detectedSkills (array of strings)

Resume:
\"\"\"
{resume_text}
\"\"\"
"""

    response = client.chat.completions.create(
        model="gpt-5-nano",
        temperature=0.2,
        messages=[
            {"role": "system", "content": "You are an ATS resume analyzer. Return only valid JSON."},
            {"role": "user", "content": prompt}
        ]
    )

    content = response.choices[0].message.content.strip()

    try:
        return json.loads(content)
    except Exception:
        return {
            "error": "AI response was not valid JSON",
            "raw": content
        }
