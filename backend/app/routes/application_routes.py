from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions.db import mongo
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

application_bp = Blueprint("applications", __name__, url_prefix="/api/applications")


# 1️⃣ Apply for job
@application_bp.route("/apply", methods=["POST"])
@jwt_required()
def apply_job():
    user_id = get_jwt_identity()
    data = request.json

    if not data.get("jobId") or not data.get("resumeId"):
        return {"error": "Missing data"}, 400

    app = {
        "jobId": ObjectId(data["jobId"]),
        "userId": ObjectId(user_id),
        "resumeId": ObjectId(data["resumeId"]),
        "status": "applied",
        "createdAt": datetime.utcnow()
    }

    mongo.db.applications.insert_one(app)
    return {"message": "Applied successfully"}, 201


# 2️⃣ Get applicants by job
@application_bp.route("/job/<job_id>", methods=["GET"])
@jwt_required()
def get_applicants(job_id):
    try:
        job_oid = ObjectId(job_id)
    except InvalidId:
        return {"applications": []}, 200

    apps = mongo.db.applications.find({"jobId": job_oid})

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
            "user": user,
            "resume": resume
        })

    return {"applications": result}, 200


# 3️⃣ Update application status
@application_bp.route("/<app_id>/status", methods=["PUT"])
@jwt_required()
def update_status(app_id):
    status = request.json.get("status")

    mongo.db.applications.update_one(
        {"_id": ObjectId(app_id)},
        {"$set": {"status": status}}
    )

    return {"message": "Status updated"}, 200
