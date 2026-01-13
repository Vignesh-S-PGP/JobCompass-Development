from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from app.extensions.db import mongo
from datetime import datetime
from bson import ObjectId

job_bp = Blueprint("jobs", __name__, url_prefix="/api/jobs")
@job_bp.route("", methods=["POST"])
@jwt_required()
def create_job():
    claims = get_jwt()

    if claims.get("role") != "recruiter":
        return {"error": "Unauthorized"}, 403

    data = request.json

    job = {
        "recruiterId": ObjectId(claims["sub"]),
        "companyName": data.get("companyName"),
        "title": data.get("title"),
        "description": data.get("description"),
        "skillsRequired": data.get("skillsRequired", []),
        "experience": data.get("experience"),
        "location": data.get("location"),
        "jobType": data.get("jobType"),
        "salaryRange": data.get("salaryRange"),
        "status": "active",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }

    mongo.db.jobs.insert_one(job)
    return {"message": "Job posted successfully"}, 201
@job_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_jobs():
    claims = get_jwt()

    if claims.get("role") != "recruiter":
        return {"error": "Unauthorized"}, 403

    jobs = list(
        mongo.db.jobs.find(
            {"recruiterId": ObjectId(claims["sub"])},
            {"recruiterId": 0}
        )
    )

    for job in jobs:
        job["_id"] = str(job["_id"])

    return {"jobs": jobs}, 200
@job_bp.route("", methods=["GET"])
@jwt_required(optional=True)
def get_jobs():
    jobs = list(
        mongo.db.jobs.find(
            {"status": "active"},
            {"recruiterId": 0}
        )
    )

    for job in jobs:
        job["_id"] = str(job["_id"])

    return {"jobs": jobs}, 200
