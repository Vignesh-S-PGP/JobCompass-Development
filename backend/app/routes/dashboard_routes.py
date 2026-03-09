from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions.db import mongo
from bson import ObjectId

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.route("", methods=["GET"])
@jwt_required()
def get_dashboard():

    user_id = ObjectId(get_jwt_identity())

    applications = list(
        mongo.db.applications.find({"userId": user_id})
    )

    applied = len(applications)
    shortlisted = len([a for a in applications if a.get("status") == "shortlisted"])
    rejected = len([a for a in applications if a.get("status") == "rejected"])

    saved = mongo.db.saved_jobs.count_documents({
        "userId": user_id
    })

    recent_apps = sorted(
        applications,
        key=lambda x: x.get("createdAt"),
        reverse=True
    )[:5]

    for a in recent_apps:
        a["_id"] = str(a["_id"])
        a["jobId"] = str(a["jobId"])

    return {
        "stats": {
            "applied": applied,
            "shortlisted": shortlisted,
            "rejected": rejected,
            "saved": saved
        },
        "recentApplications": recent_apps
    }, 200