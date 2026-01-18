from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions.db import mongo
from bson import ObjectId
from datetime import datetime

job_bp = Blueprint("jobs", __name__, url_prefix="/api/jobs")

@job_bp.route("", methods=["POST"])
@jwt_required()
def create_job():
    user_id = get_jwt_identity()
    data = request.json

    # 🔥 find company owned by recruiter
    company = mongo.db.companies.find_one(
        {"ownerId": ObjectId(user_id)}
    )

    if not company:
        return {"error": "Company not found. Create company first."}, 400

    job = {
        "title": data.get("title"),
        "description": data.get("description"),
        "skillsRequired": data.get("skillsRequired", []),
        "experience": data.get("experience"),
        "location": data.get("location"),
        "jobType": data.get("jobType"),
        "salaryRange": data.get("salaryRange"),
        "companyId": company["_id"],
        "createdBy": ObjectId(user_id),
        "createdAt": datetime.utcnow(),
        "status": "active"
    }

    mongo.db.jobs.insert_one(job)

    return {"message": "Job created successfully"}, 201


@job_bp.route("", methods=["GET"])
def list_jobs():
    jobs = list(mongo.db.jobs.find({}, {"_id": 0}))
    return {"jobs": jobs}, 200

@job_bp.route("/recommended", methods=["GET"])
@jwt_required()
def recommended_jobs():
    user_id = get_jwt_identity()

    profile = mongo.db.jobseeker_profiles.find_one({"userId": ObjectId(user_id)})
    if not profile:
        return {"jobs": []}

    # 🔥 Normalize profile skills
    profile_skills = []
    for s in profile.get("skills", []):
        profile_skills.extend([x.strip().lower() for x in s.split(",")])

    matched = []

    for job in mongo.db.jobs.find({"status": "active"}):
        job_skills = []
        for s in job.get("skillsRequired", []):
            job_skills.extend([x.strip().lower() for x in s.split(",")])

        if set(profile_skills) & set(job_skills):
            job["_id"] = str(job["_id"])
            matched.append(job)

    return {"jobs": matched}, 200

