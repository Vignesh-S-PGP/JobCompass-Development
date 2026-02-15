from flask import Blueprint, request, send_file
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token,
    decode_token
)
from app.services.resume_service import upload_resume, fetch_user_resumes
from app.extensions.db import mongo
from bson import ObjectId
from datetime import datetime, timedelta
import os

# =========================
# 🔗 Blueprint
# =========================
resume_bp = Blueprint("resumes", __name__, url_prefix="/api/resumes")


# =========================
# 📤 Upload Resume
# =========================
@resume_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload():
    file = request.files.get("resume")

    success, error = upload_resume(file)
    if error:
        return {"error": error}, 400

    return {"message": "Resume uploaded successfully"}, 201


# =========================
# 📃 List User Resumes
# =========================
@resume_bp.route("", methods=["GET"])
@jwt_required()
def list_resumes():
    resumes = fetch_user_resumes()
    return {"resumes": resumes}, 200


# =========================
# 🔐 Generate Short-Lived View Token
# =========================
@resume_bp.route("/view-token/<resume_id>", methods=["GET"])
@jwt_required()
def generate_view_token(resume_id):
    try:
        resume = mongo.db.resumes.find_one(
            {"_id": ObjectId(resume_id)}
        )
    except Exception:
        return {"error": "Invalid resume id"}, 400

    if not resume:
        return {"error": "Resume not found"}, 404

    token = create_access_token(
        identity=str(resume["_id"]),
        expires_delta=timedelta(minutes=5)
    )

    return {"token": token}, 200


# =========================
# 🔓 Public Resume Stream (NO JWT)
# =========================
@resume_bp.route("/stream/<token>", methods=["GET"])
def stream_resume(token):
    try:
        decoded = decode_token(token)
        resume_id = decoded["sub"]
    except Exception:
        return {"error": "Invalid or expired token"}, 401

    resume = mongo.db.resumes.find_one(
        {"_id": ObjectId(resume_id)}
    )
    if not resume:
        return {"error": "Resume not found"}, 404

    file_path = resume.get("filePath")
    if not file_path:
        return {"error": "File path missing"}, 404

    # 🔥 NORMALIZE PATH (CRITICAL FIX)
    file_path = file_path.replace("\\", "/")

    project_root = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../../")
    )

    full_path = os.path.normpath(
        os.path.join(project_root, file_path)
    )

    print("📄 STREAMING RESUME FROM:", full_path)

    if not os.path.exists(full_path):
        return {
            "error": "Resume file missing on server",
            "path": full_path
        }, 404

    return send_file(
        full_path,
        mimetype="application/pdf",
        as_attachment=False
    )


# =========================
# 🗑 Delete Resume
# =========================
@resume_bp.route("/<resume_id>", methods=["DELETE"])
@jwt_required()
def delete_resume(resume_id):
    user_id = get_jwt_identity()

    try:
        resume = mongo.db.resumes.find_one(
            {"_id": ObjectId(resume_id)}
        )
    except Exception:
        return {"error": "Invalid resume id"}, 400

    if not resume:
        return {"error": "Resume not found"}, 404

    # 🔐 Owner check
    if str(resume.get("userId")) != user_id:
        return {"error": "Unauthorized"}, 403

    file_path = resume.get("filePath")
    if file_path:
        file_path = file_path.replace("\\", "/")

        project_root = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../../")
        )

        full_path = os.path.normpath(
            os.path.join(project_root, file_path)
        )

        if os.path.exists(full_path):
            os.remove(full_path)

    mongo.db.resumes.delete_one(
        {"_id": ObjectId(resume_id)}
    )

    return {"message": "Resume deleted successfully"}, 200
