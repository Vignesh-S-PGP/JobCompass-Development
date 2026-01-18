from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions.db import mongo
from bson import ObjectId

job_feed_bp = Blueprint("job_feed", __name__, url_prefix="/api/job-feed")

@job_feed_bp.route("", methods=["GET"])
@jwt_required()
def job_feed():
    user_id = get_jwt_identity()

    profile = mongo.db.jobseeker_profiles.find_one(
        {"userId": ObjectId(user_id)}
    )

    if not profile:
        return {"jobs": []}

    skills = profile.get("skills", [])
    location = profile.get("location")

    query = {
        "$or": [
            {"skillsRequired": {"$in": skills}},
            {"location": location}
        ],
        "status": "active"
    }

    jobs = list(
        mongo.db.jobs.find(query).limit(50)
    )

    # remove ObjectId
    for j in jobs:
        j["_id"] = str(j["_id"])
        j["companyId"] = str(j["companyId"])

    return {"jobs": jobs}
