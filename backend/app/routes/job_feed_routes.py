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

    jobs_cursor = mongo.db.jobs.find({"status": "active"})
    all_jobs = []

    for job in jobs_cursor:
        company = mongo.db.companies.find_one(
            {"_id": job["companyId"]},
            {"_id": 0}
        )

        all_jobs.append({
            "_id": str(job["_id"]),
            "title": job.get("title"),
            "description": job.get("description"),
            "skillsRequired": job.get("skillsRequired", []),
            "experience": job.get("experience"),
            "location": job.get("location"),
            "jobType": job.get("jobType"),
            "salaryRange": job.get("salaryRange"),
            "company": company  
        })

    if not profile:
        return {
            "recommended": [],
            "all": all_jobs
        }, 200

    skills = [s.lower() for s in profile.get("skills", [])]
    location = profile.get("location")

    recommended = []

    for job in all_jobs:
        job_skills = [s.lower() for s in job.get("skillsRequired", [])]
        if set(skills) & set(job_skills) or job.get("location") == location:
            recommended.append(job)

    return {
        "recommended": recommended,
        "all": all_jobs
    }, 200
