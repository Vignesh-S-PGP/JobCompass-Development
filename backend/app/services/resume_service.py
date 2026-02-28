import os
from bson import ObjectId
from werkzeug.utils import secure_filename
from flask_jwt_extended import get_jwt_identity
from app.models.resume_model import create_resume, get_resumes_by_user
from app.utils.pdf_extractor import extract_text_from_pdf
from datetime import datetime
from app.extensions.db import mongo   

UPLOAD_FOLDER = "uploads/resumes"

def upload_resume(file, title=None):
    if not file:
        return False, "No file provided"

    if not file.filename.lower().endswith(".pdf"):
        return False, "Only PDF files are allowed"

    user_id = get_jwt_identity()

    filename = secure_filename(file.filename)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    raw_text = extract_text_from_pdf(file_path)

    resume_doc = {
        "userId": ObjectId(user_id),
        "filename": filename,
        "title": title,              
        "filePath": file_path,
        "rawText": raw_text,
        "analysis": {},
        "uploadedAt": datetime.utcnow()
    }

    mongo.db.resumes.insert_one(resume_doc)
    return True, None


def fetch_user_resumes():
    user_id = get_jwt_identity()
    resumes = list(
        mongo.db.resumes.find(
            {"userId": ObjectId(user_id)},
            {"rawText": 0}
        )
    )

    for r in resumes:
        r["_id"] = str(r["_id"])

        if "uploadedAt" in r and r["uploadedAt"]:
            r["uploadedAt"] = r["uploadedAt"].isoformat()

    return resumes


