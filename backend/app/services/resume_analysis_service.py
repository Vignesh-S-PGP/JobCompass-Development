from app.services.ollama_service import analyze_resume_ats


from app.models.resume_model import update_resume_analysis

def run_ats_analysis(resume_id, raw_text):
    analysis = analyze_resume_ats(raw_text)

    cleaned_analysis = {
        "atsScore": normalize_ats_score(analysis.get("atsScore")),
        "strengths": analysis.get("strengths", []),
        "missingSkills": analysis.get("missingSkills", []),
        "suggestions": analysis.get("suggestions", []),
        "detectedSkills": analysis.get("detectedSkills", [])
    }

    update_resume_analysis(resume_id, cleaned_analysis)
    return cleaned_analysis


def normalize_ats_score(score):
    if score is None:
        return 0

    # if AI returns 0.85 → convert to 85
    if isinstance(score, float) and score <= 1:
        return int(score * 100)

    # if AI returns "85%" → convert
    if isinstance(score, str):
        score = score.replace("%", "").strip()
        if score.isdigit():
            return int(score)

    if isinstance(score, int):
        return min(max(score, 0), 100)

    return 0
