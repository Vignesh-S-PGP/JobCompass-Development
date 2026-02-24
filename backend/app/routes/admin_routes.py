from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions.db import mongo
from app.utils.decorators import role_required
from bson import ObjectId
from datetime import datetime

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

@admin_bp.route("/stats", methods=["GET"])
@role_required("admin")
def get_stats():
    total_users = mongo.db.users.count_documents({})
    total_jobs = mongo.db.jobs.count_documents({})
    total_applications = mongo.db.applications.count_documents({})

    # Simple activity stats
    recent_users = mongo.db.users.count_documents({"createdAt": {"$gte": datetime.utcnow().replace(hour=0, minute=0, second=0)}})

    return {
        "totalUsers": total_users,
        "totalJobs": total_jobs,
        "totalApplications": total_applications,
        "recentUsers": recent_users
    }, 200

@admin_bp.route("/users", methods=["GET"])
@role_required("admin")
def list_users():
    role = request.args.get("role")
    query = {}
    if role:
        query["role"] = role

    users = list(mongo.db.users.find(query, {"passwordHash": 0}))
    for u in users:
        u["_id"] = str(u["_id"])
        if "createdAt" in u:
            u["createdAt"] = u["createdAt"].isoformat()

    return {"users": users}, 200

@admin_bp.route("/users/<user_id>/status", methods=["PATCH"])
@role_required("admin")
def update_user_status(user_id):
    is_active = request.json.get("isActive")
    mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"isActive": is_active, "updatedAt": datetime.utcnow()}}
    )
    return {"message": "User status updated"}, 200

@admin_bp.route("/users/<user_id>", methods=["DELETE"])
@role_required("admin")
def delete_user(user_id):
    # Soft delete
    mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"isActive": False, "deletedAt": datetime.utcnow(), "updatedAt": datetime.utcnow()}}
    )
    return {"message": "User soft-deleted"}, 200

@admin_bp.route("/jobs", methods=["GET"])
@role_required("admin")
def list_all_jobs():
    jobs = list(mongo.db.jobs.find())
    for j in jobs:
        j["_id"] = str(j["_id"])
        j["companyId"] = str(j["companyId"])
        j["createdBy"] = str(j["createdBy"])

    return {"jobs": jobs}, 200

@admin_bp.route("/jobs/<job_id>", methods=["DELETE"])
@role_required("admin")
def delete_job(job_id):
    mongo.db.jobs.delete_one({"_id": ObjectId(job_id)})
    return {"message": "Job deleted"}, 200

@admin_bp.route("/ats-monitoring", methods=["GET"])
@role_required("admin")
def ats_monitoring():
    # Get score distribution
    pipeline = [
        {"$group": {
            "_id": {
                "$subtract": ["$atsScore", {"$mod": ["$atsScore", 10]}]
            },
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    distribution = list(mongo.db.applications.aggregate(pipeline))
    return {"distribution": distribution}, 200
