from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.extensions.db import mongo
from app.utils.decorators import role_required
from bson import ObjectId
from datetime import datetime

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


# =====================
# ADMIN STATS
# =====================
@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
@role_required("admin")
def admin_stats():
    return {
        "users": mongo.db.users.count_documents({}),
        "jobs": mongo.db.jobs.count_documents({}),
        "applications": mongo.db.applications.count_documents({}),
        "companies": mongo.db.companies.count_documents({}),
    }, 200


# =====================
# USERS
# =====================
@admin_bp.route("/users", methods=["GET"])
@jwt_required()
@role_required("admin")
def admin_list_users():
    role = request.args.get("role")
    query = {"role": role} if role else {}

    users = list(mongo.db.users.find(query, {"passwordHash": 0}))
    for u in users:
        u["_id"] = str(u["_id"])
        if "createdAt" in u:
            u["createdAt"] = u["createdAt"].isoformat()

    return {"users": users}, 200


@admin_bp.route("/users/<user_id>/status", methods=["PATCH"])
@jwt_required()
@role_required("admin")
def admin_update_user_status(user_id):
    is_active = request.json.get("isActive")

    mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"isActive": is_active, "updatedAt": datetime.utcnow()}}
    )

    return {"message": "User status updated"}, 200


@admin_bp.route("/users/<user_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def admin_soft_delete_user(user_id):
    mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "isActive": False,
            "deletedAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }}
    )

    return {"message": "User soft-deleted"}, 200


# =====================
# JOBS
# =====================
@admin_bp.route("/jobs", methods=["GET"])
@jwt_required()
@role_required("admin")
def admin_list_jobs():
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
def admin_delete_job(job_id):
    mongo.db.jobs.delete_one({"_id": ObjectId(job_id)})
    mongo.db.applications.delete_many({"jobId": ObjectId(job_id)})

    return {"message": "Job deleted"}, 200


# =====================
# ATS MONITORING
# =====================
@admin_bp.route("/ats-monitoring", methods=["GET"])
@jwt_required()
@role_required("admin")
def admin_ats_monitoring():
    pipeline = [
        {
            "$group": {
                "_id": {
                    "$subtract": ["$atsScore", {"$mod": ["$atsScore", 10]}]
                },
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"_id": 1}}
    ]

    distribution = list(mongo.db.applications.aggregate(pipeline))
    return {"distribution": distribution}, 200


@admin_bp.route("/theme", methods=["GET", "POST"])
def admin_theme_management():
    if request.method == "POST":
        # Check for admin role if it's a POST
        from flask_jwt_extended import get_jwt
        @jwt_required()
        @role_required("admin")
        def update_theme():
            theme = request.json.get("theme")
            if not theme:
                return {"error": "Theme is required"}, 400

            mongo.db.settings.update_one(
                {"key": "global_theme"},
                {"$set": {"value": theme, "updatedAt": datetime.utcnow()}},
                upsert=True
            )
            return {"message": "Global theme updated"}, 200

        return update_theme()

    # GET
    setting = mongo.db.settings.find_one({"key": "global_theme"})
    theme = setting["value"] if setting else "indigo"
    return {"theme": theme}, 200