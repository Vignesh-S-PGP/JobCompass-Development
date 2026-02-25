from flask import Blueprint, request

from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions.db import mongo
from app.utils.decorators import role_required
from bson import ObjectId
from datetime import datetime

from flask_jwt_extended import jwt_required, get_jwt
from app.extensions.db import mongo
from bson import ObjectId
from app.utils.decorators import role_required


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
@jwt_required()
@role_required("admin")
def get_stats():
    users_count = mongo.db.users.count_documents({})
    jobs_count = mongo.db.jobs.count_documents({})
    applications_count = mongo.db.applications.count_documents({})
    companies_count = mongo.db.companies.count_documents({})

    return {
        "users": users_count,
        "jobs": jobs_count,
        "applications": applications_count,
        "companies": companies_count
    }, 200

@admin_bp.route("/users", methods=["GET"])
@jwt_required()
@role_required("admin")
def list_users():
    users = list(mongo.db.users.find({}, {"passwordHash": 0}))
    for u in users:
        u["_id"] = str(u["_id"])
    return {"users": users}, 200

@admin_bp.route("/users/<user_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_user(user_id):
    mongo.db.users.delete_one({"_id": ObjectId(user_id)})
    # Also delete related profiles
    mongo.db.jobseeker_profiles.delete_one({"userId": ObjectId(user_id)})
    mongo.db.recruiter_profiles.delete_one({"userId": ObjectId(user_id)})
    return {"message": "User deleted"}, 200

@admin_bp.route("/jobs", methods=["GET"])
@jwt_required()
@role_required("admin")
def list_jobs():
    jobs = list(mongo.db.jobs.find())
    for j in jobs:
        j["_id"] = str(j["_id"])
        j["createdBy"] = str(j["createdBy"])
        if "companyId" in j:
            j["companyId"] = str(j["companyId"])
    return {"jobs": jobs}, 200

@admin_bp.route("/jobs/<job_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_job(job_id):
    mongo.db.jobs.delete_one({"_id": ObjectId(job_id)})
    # Also delete applications for this job
    mongo.db.applications.delete_many({"jobId": ObjectId(job_id)})
    return {"message": "Job deleted"}, 200
