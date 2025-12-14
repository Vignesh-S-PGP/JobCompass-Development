from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.services.resume_service import upload_resume, fetch_user_resumes
from app.services.resume_analysis_service import run_ats_analysis
from app.extensions.db import mongo
from bson import ObjectId

resume_bp = Blueprint("resumes", __name__, url_prefix="/api/resumes")

@resume_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload():
    file = request.files.get("resume")
    success, error = upload_resume(file)

    if error:
        print("UPLOAD ERROR:", error)
        return {"error": error}, 400

    return {"message": "Resume uploaded successfully"}

@resume_bp.route("", methods=["GET"])
@jwt_required()
def list_resumes():
    resumes = fetch_user_resumes()
    return {"resumes": resumes}, 200

@resume_bp.route("/<resume_id>/analyze", methods=["POST"])
@jwt_required()
def analyze_resume(resume_id):
    resume = mongo.db.resumes.find_one({"_id": ObjectId(resume_id)})

    if not resume or not resume.get("rawText"):
        return {"error": "Resume text not found"}, 400

    analysis = run_ats_analysis(resume_id, resume["rawText"])

    return {"analysis": analysis}, 200


