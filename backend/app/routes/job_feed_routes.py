from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions.db import mongo
from bson import ObjectId

job_feed_bp = Blueprint("job_feed", __name__, url_prefix="/api/job-feed")

@job_feed_bp.route("", methods=["GET"])
@jwt_required()
def job_feed():
    user_id = get_jwt_identity()

    # 🔹 Fetch profile (may or may not exist)
    profile = mongo.db.jobseeker_profiles.find_one(
        {"userId": ObjectId(user_id)}
    )

    # 🔹 ALWAYS fetch all active jobs
    all_jobs = list(
        mongo.db.jobs.find({"status": "active"})
    )

    # Normalize IDs
    for j in all_jobs:
        j["_id"] = str(j["_id"])
        j["companyId"] = str(j["companyId"])

    # 🔹 If no profile → no recommendations
    if not profile:
        return {
            "recommended": [],
            "all": all_jobs
        }, 200

    skills = profile.get("skills", [])
    location = profile.get("location")

    # 🔹 Recommendation logic
    recommended = []

    for job in all_jobs:
        skill_match = any(
            s.lower() in [x.lower() for x in job.get("skillsRequired", [])]
            for s in skills
        )

        location_match = location and job.get("location") == location

        if skill_match or location_match:
            recommended.append(job)

    return {
        "recommended": recommended,
        "all": all_jobs
    }, 200
