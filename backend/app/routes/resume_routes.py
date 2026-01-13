from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.resume_service import upload_resume, fetch_user_resumes
from app.extensions.db import mongo
from bson import ObjectId

resume_bp = Blueprint("resumes", __name__, url_prefix="/api/resumes")

@resume_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload():
    file = request.files.get("resume")

    success, error = upload_resume(file)

    if error:
        return {"error": error}, 400

    return {"message": "Resume uploaded successfully"}, 201


@resume_bp.route("", methods=["GET"])
@jwt_required()
def list_resumes():
    resumes = fetch_user_resumes()
    return {"resumes": resumes}, 200
