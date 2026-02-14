from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions.db import mongo
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from app.services.ats_ai import calculate_ats_score


application_bp = Blueprint("applications", __name__, url_prefix="/api/applications")

@application_bp.route("/apply", methods=["POST"])
@jwt_required()
def apply_job():
    user_id = get_jwt_identity()
    data = request.json

    if not data.get("jobId") or not data.get("resumeId"):
        return {"error": "Missing data"}, 400

    job = mongo.db.jobs.find_one({"_id": ObjectId(data["jobId"])})
    resume = mongo.db.resumes.find_one({"_id": ObjectId(data["resumeId"])})

    if not job or not resume:
        return {"error": "Invalid job or resume"}, 400

    # 🔥 AI CALL
    ats = calculate_ats_score(
        job_desc=job.get("description", ""),
        resume_text=resume.get("rawText", "")
    )

    app = {
        "jobId": ObjectId(data["jobId"]),
        "userId": ObjectId(user_id),
        "resumeId": ObjectId(data["resumeId"]),
        "status": "applied",
        "atsScore": ats["score"],
        "ats": ats,
        "createdAt": datetime.utcnow()
    }

    mongo.db.applications.insert_one(app)

    return {
    "message": "Applied successfully",
    "atsScore": ats["score"],
    "ats": {
        "score": ats["score"],
        "matched_skills": ats.get("matched_skills", []),
        "missing_skills": ats.get("missing_skills", []),
        "reason": ats.get("reason", "")
    }
}, 201



# 2️⃣ GET APPLICANTS (SORTED BY ATS SCORE)
@application_bp.route("/job/<job_id>", methods=["GET"])
@jwt_required()
def get_applicants(job_id):
    try:
        job_oid = ObjectId(job_id)
    except InvalidId:
        return {"applications": []}, 200

    apps = mongo.db.applications.find(
        {"jobId": job_oid}
    ).sort("atsScore", -1)   # 🔥 SORT DESCENDING

    result = []
    for a in apps:
        user = mongo.db.users.find_one(
            {"_id": a["userId"]},
            {"passwordHash": 0}
        )
        resume = mongo.db.resumes.find_one({"_id": a["resumeId"]})

        result.append({
            "applicationId": str(a["_id"]),
            "status": a["status"],
            "atsScore": a.get("atsScore", 0),
            "ats": a.get("ats", {}),
            "user": user,
            "resume": resume
        })

    return {"applications": result}, 200


# 3️⃣ UPDATE STATUS
@application_bp.route("/<app_id>/status", methods=["PUT"])
@jwt_required()
def update_status(app_id):
    mongo.db.applications.update_one(
        {"_id": ObjectId(app_id)},
        {"$set": {"status": request.json.get("status")}}
    )
    return {"message": "Status updated"}, 200
