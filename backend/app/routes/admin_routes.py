from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from app.extensions.db import mongo
from bson import ObjectId
from app.utils.decorators import role_required

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

@admin_bp.route("/stats", methods=["GET"])
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
