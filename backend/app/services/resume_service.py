import os
from bson import ObjectId
from werkzeug.utils import secure_filename
from flask_jwt_extended import get_jwt_identity
from app.models.resume_model import create_resume, get_resumes_by_user
from app.utils.pdf_extractor import extract_text_from_pdf

UPLOAD_FOLDER = "uploads/resumes"


def upload_resume(file):
    if not file or file.filename == "":
        return False, "No file selected"

    if not file.filename.lower().endswith(".pdf"):
        return False, "Only PDF files allowed"

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    user_id = ObjectId(get_jwt_identity())

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    # 1️⃣ Save file
    file.save(file_path)

    # 2️⃣ Extract text
    raw_text = extract_text_from_pdf(file_path)

    resume_doc = {
        "userId": user_id,
        "filename": filename,
        "filePath": file_path,
        "rawText": raw_text,
        "analysis": {}
    }

    create_resume(resume_doc)

    return True, None



def fetch_user_resumes():
    user_id = ObjectId(get_jwt_identity())
    return get_resumes_by_user(user_id)
