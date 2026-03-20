from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions.db import mongo
from bson import ObjectId
from datetime import datetime
from app.services.notification_service import create_notification

job_bp = Blueprint("jobs", __name__, url_prefix="/api/jobs")

@job_bp.route("", methods=["POST"])
@jwt_required()
def create_job():

    user_id = get_jwt_identity()
    data = request.json


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

    result = mongo.db.jobs.insert_one(job)

    job_id = result.inserted_id

    followers = mongo.db.company_followers.find({
        "companyId": company["_id"]
    })


    for follower in followers:

        try:

            create_notification(
                user_id=follower["userId"],
                title=f"{company['name']} posted a new job",
                message=job["title"],
                type="company_job_posted",
                meta={
                    "jobId": str(job_id),
                    "companyId": str(company["_id"])
                }
            )

        except Exception as e:
            print("Notification error:", e)


    return {"message": "Job created successfully"}, 201


@job_bp.route("", methods=["GET"])
def list_jobs():
    jobs = list(mongo.db.jobs.find({}, {"_id": 0}))
    return {"jobs": jobs}, 200

@job_bp.route("/<job_id>/status", methods=["PATCH"])
@jwt_required()
def update_job_status(job_id):
    user_id = get_jwt_identity()
    status = request.json.get("status")

    if status not in ["active", "closed", "paused"]:
        return {"error": "Invalid status"}, 400

    result = mongo.db.jobs.update_one(
        {"_id": ObjectId(job_id), "createdBy": ObjectId(user_id)},
        {"$set": {"status": status, "updatedAt": datetime.utcnow()}}
    )

    if result.matched_count == 0:
        return {"error": "Job not found or unauthorized"}, 404

    return {"message": "Job status updated"}, 200

@job_bp.route("/<job_id>", methods=["PUT"])
@jwt_required()
def update_job(job_id):
    user_id = get_jwt_identity()
    data = request.json

    update_data = {
        "title": data.get("title"),
        "description": data.get("description"),
        "skillsRequired": data.get("skillsRequired", []),
        "experience": data.get("experience"),
        "location": data.get("location"),
        "jobType": data.get("jobType"),
        "salaryRange": data.get("salaryRange"),
        "updatedAt": datetime.utcnow()
    }

    result = mongo.db.jobs.update_one(
        {"_id": ObjectId(job_id), "createdBy": ObjectId(user_id)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        return {"error": "Job not found or unauthorized"}, 404

    return {"message": "Job updated successfully"}, 200

@job_bp.route("/<job_id>", methods=["DELETE"])
@jwt_required()
def delete_job(job_id):
    user_id = get_jwt_identity()

    result = mongo.db.jobs.delete_one(
        {"_id": ObjectId(job_id), "createdBy": ObjectId(user_id)}
    )

    if result.deleted_count == 0:
        return {"error": "Job not found or unauthorized"}, 404

    return {"message": "Job deleted successfully"}, 200

@job_bp.route("/recommended", methods=["GET"])
@jwt_required()
def recommended_jobs():
    user_id = get_jwt_identity()

    profile = mongo.db.jobseeker_profiles.find_one({"userId": ObjectId(user_id)})
    if not profile:
        return {"jobs": []}

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

@job_bp.route("/recruiter", methods=["GET"])
@jwt_required()
def recruiter_jobs():
    user_id = get_jwt_identity()

    jobs = list(mongo.db.jobs.find({"createdBy": ObjectId(user_id)}))

    # Calculate some stats for the recruiter dashboard
    total_applicants = 0
    total_shortlisted = 0

    for j in jobs:
        j["_id"] = str(j["_id"])
        j["companyId"] = str(j["companyId"])

        # Count applicants for each job
        app_stats = list(mongo.db.applications.aggregate([
            {"$match": {"jobId": j["_id"] if isinstance(j["_id"], ObjectId) else ObjectId(j["_id"])}},
            {"$group": {
                "_id": "$status",
                "count": {"$sum": 1}
            }}
        ]))

        j["applicantCount"] = sum(item["count"] for item in app_stats)
        total_applicants += j["applicantCount"]
        total_shortlisted += next((item["count"] for item in app_stats if item["_id"] == "shortlisted"), 0)

    # Get new messages count (unread logic not fully implemented, so just total for now or mock)
    # For now let's just return the sums

    return {
        "jobs": jobs,
        "stats": {
            "totalApplicants": total_applicants,
            "totalShortlisted": total_shortlisted,
            "activeJobs": len([j for j in jobs if j.get("status") == "active"])
        }
    }, 200

@job_bp.route("/<job_id>", methods=["GET"])
@jwt_required()
def get_job_detail(job_id):
    user_id = ObjectId(get_jwt_identity())

    job = mongo.db.jobs.find_one({
        "_id": ObjectId(job_id),
        "createdBy": user_id   # 🔐 OWNER CHECK
    })

    if not job:
        return {"error": "Job not found or unauthorized"}, 404

    job["_id"] = str(job["_id"])
    job["companyId"] = str(job["companyId"])
    job["createdBy"] = str(job["createdBy"])
    job["createdAt"] = job["createdAt"].isoformat()

    return {"job": job}, 200

