from app.services.ollama_service import analyze_resume_ats

text = """
Vignesh
Python Developer with Flask and MongoDB experience.
Skills: Python, Flask, REST APIs, MongoDB, Git
"""

result = analyze_resume_ats(text)
print(result)
