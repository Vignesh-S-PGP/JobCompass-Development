from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.extensions.db import mongo
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from app.services.ats_ai import calculate_ats_score
from app.services.notification_service import create_notification


application_bp = Blueprint("applications", __name__, url_prefix="/api/applications")

@application_bp.route("/apply", methods=["POST"])
@jwt_required()
def apply_job():
    user_id = get_jwt_identity()
    data = request.json

    if not data.get("jobId") or not data.get("resumeId"):
        return {"error": "Missing data"}, 400


    job = mongo.db.jobs.find_one({"_id": ObjectId(data["jobId"])})
    resume = mongo.db.resumes.find_one({"_id": ObjectId(data["resumeId"])})
    profile = mongo.db.jobseeker_profiles.find_one({"userId": ObjectId(user_id)})

    try:
        job_oid = ObjectId(data["jobId"])
        resume_oid = ObjectId(data["resumeId"])
        user_oid = ObjectId(user_id)
    except Exception:
        return {"error": "Invalid ids"}, 400

    existing = mongo.db.applications.find_one({"jobId": job_oid, "userId": user_oid})
    if existing:
        return {"error": "You have already applied to this job"}, 409

    job = mongo.db.jobs.find_one({"_id": job_oid})
    resume = mongo.db.resumes.find_one({"_id": resume_oid, "userId": user_oid})

    if not job or not resume:
        return {"error": "Invalid job or resume"}, 400

    # STRICTURE: One application per job
    existing = mongo.db.applications.find_one({
        "jobId": ObjectId(data["jobId"]),
        "userId": ObjectId(user_id)
    })
    if existing:
        return {"error": "Already applied to this job"}, 400

    if job.get("status") in {"closed", "paused"}:
        return {"error": "This job is not accepting applications"}, 400

    ats = calculate_ats_score(
        job_desc=job.get("description", ""),
        resume_text=resume.get("rawText", ""),
        job_skills=job.get("skillsRequired", []),
        profile_data=profile
    )

    app = {
        "jobId": job_oid,
        "userId": user_oid,
        "resumeId": resume_oid,
        "status": "applied",
        "atsScore": ats["score"],
        "matchedCount": len(ats.get("matched_skills", [])),
        "missingCount": len(ats.get("missing_skills", [])),
        "ats": ats,
        "createdAt": datetime.utcnow()
    }

    mongo.db.applications.insert_one(app)

    return {
    "message": "Applied successfully",
    "atsScore": ats["score"],
    "ats": {
        "score": ats["score"],
        "matched_skills": ats.get("matched_skills", []),
        "missing_skills": ats.get("missing_skills", []),
        "reason": ats.get("reason", "")
    }
}, 201


@application_bp.route("/job/<job_id>", methods=["GET"])
@jwt_required()
def get_applicants(job_id):
    try:
        job_oid = ObjectId(job_id)
    except InvalidId:
        return {"applications": []}, 200

    # Applicants must be sorted by priority using:
    # 1. ATS Score (DESC)
    # 2. Matched skills count (DESC)
    # 3. Missing skills count (ASC)
    # 4. Applied date (ASC)

    apps = list(mongo.db.applications.find({"jobId": job_oid}))

    def sort_key(a):
        ats = a.get("ats", {})
        score = a.get("atsScore", 0)
        matched_count = len(ats.get("matched_skills", []))
        missing_count = len(ats.get("missing_skills", []))
        created_at = a.get("createdAt", datetime.utcnow())

        # Using a tuple for sorting. Python sorts tuples element by element.
        # We use negative for DESC sorting.
        return (-score, -matched_count, missing_count, created_at)

    apps = mongo.db.applications.find(
        {"jobId": job_oid}
    ).sort([
        ("atsScore", -1),
        ("matchedCount", -1),
        ("missingCount", 1),
        ("createdAt", 1)
    ])
    user_id = get_jwt_identity()
    claims = get_jwt()
    job = mongo.db.jobs.find_one({"_id": job_oid})
    if not job:
        return {"applications": []}, 200

    if claims.get("role") != "admin" and job.get("createdBy") != ObjectId(user_id):
        return {"error": "Forbidden"}, 403

    apps = list(mongo.db.applications.find({"jobId": job_oid}))

    def sort_key(application):
        ats = application.get("ats", {})
        matched_skills = len(ats.get("matched_skills", []))
        missing_skills = len(ats.get("missing_skills", []))
        created_at = application.get("createdAt") or datetime.max
        return (
            -application.get("atsScore", 0),
            -matched_skills,
            missing_skills,
            created_at,
        )


    apps.sort(key=sort_key)

    result = []
    for a in apps:
        user = mongo.db.users.find_one(
            {"_id": a["userId"]},
            {"passwordHash": 0}
        )
        resume = mongo.db.resumes.find_one({"_id": a["resumeId"]})

        result.append({
            "applicationId": str(a["_id"]),
            "status": a["status"],
            "atsScore": a.get("atsScore", 0),
            "ats": a.get("ats", {}),
            "user": user,
            "resume": resume
        })

    return {"applications": result}, 200

@application_bp.route("/my", methods=["GET"])
@jwt_required()
def my_applications():
    user_id = get_jwt_identity()

    try:
        user_obj_id = ObjectId(user_id)
    except Exception:
        return {"applications": []}, 200

    applications = list(
        mongo.db.applications.find({"userId": user_obj_id})
    )

    result = []

    for app in applications:
    
        job = mongo.db.jobs.find_one(
            {"_id": ObjectId(app["jobId"])}
        )

        company = None
        if job and job.get("companyId"):
            company = mongo.db.companies.find_one(
                {"_id": ObjectId(job["companyId"])}
            )

        result.append({
            "applicationId": str(app["_id"]),
            "status": app.get("status", "applied"),
            "atsScore": app.get("atsScore"),
            "ats": app.get("ats"),
            "appliedAt": app.get("createdAt").isoformat() if app.get("createdAt") else None,

        
            "resumeId": str(app.get("resumeId")) if app.get("resumeId") else None,

        
            "job": {
                "id": str(job["_id"]) if job else None,
                "title": job.get("title") if job else None,
                "location": job.get("location") if job else None,
                "experience": job.get("experience") if job else None,
            } if job else None,

           
            "company": {
            "_id": str(company["_id"]),
            "name": company.get("name"),
            "logo": company.get("logo"),
            "location": company.get("location"),
            "industry": company.get("industry"),
            } if company else None,
        })

    return {"applications": result}, 200

from bson import ObjectId

@application_bp.route("/<application_id>", methods=["GET"])
@jwt_required()
def get_application_detail(application_id):
    user_id = get_jwt_identity()

    try:
        application_obj_id = ObjectId(application_id)
        user_obj_id = ObjectId(user_id)
    except Exception:
        return {"error": "Invalid id"}, 400

    application = mongo.db.applications.find_one({
        "_id": application_obj_id,
        "userId": user_obj_id
    })

    if not application:
        return {"error": "Application not found"}, 404

    job = mongo.db.jobs.find_one(
    {"_id": ObjectId(application["jobId"])},
    {
        "title": 1,
        "description": 1,
        "location": 1,
        "jobType": 1,
        "companyId": 1   # 🔥 REQUIRED
    }
)

    company = None
    if job and job.get("companyId"):
        company = mongo.db.companies.find_one(
            {"_id": ObjectId(job["companyId"])},
            {"name": 1, "logo": 1, "location": 1}
        )

    resume = None
    if application.get("resumeId"):
        resume = mongo.db.resumes.find_one(
    {"_id": ObjectId(application["resumeId"])},
    {
        "filename": 1,
        "title": 1      # 🔥 THIS WAS MISSING
    }
)

    return {
        "application": {
            "id": str(application["_id"]),
            "status": application.get("status"),
            "atsScore": application.get("atsScore"),
            "ats": application.get("ats", {}),
            "appliedAt": application.get("createdAt"),

            "job": {
                "_id": str(job["_id"]),
                "title": job.get("title"),
                "description": job.get("description"),
                "location": job.get("location"),
                "jobType": job.get("jobType")
            } if job else None,

            "company": {
            "_id": str(company["_id"]),
            "name": company.get("name"),
            "logo": company.get("logo"),
            "location": company.get("location"),
            "industry": company.get("industry"),
            } if company else None,

            "resume": {
            "_id": str(resume["_id"]),
            "title": resume.get("title"),
            "filename": resume.get("filename")
            } if resume else None
        }
    }, 200

@application_bp.route("/<application_id>/status", methods=["PATCH"])
@jwt_required()
def update_application_status(application_id):
    data = request.json
    status = data.get("status")

    if status not in ["shortlisted", "rejected"]:
        return {"error": "Invalid status"}, 400

    # 🔹 Fetch application FIRST
    application = mongo.db.applications.find_one({
        "_id": ObjectId(application_id)
    })

    if not application:
        return {"error": "Application not found"}, 404

    recruiter_id = get_jwt_identity()
    claims = get_jwt()
    job = mongo.db.jobs.find_one({"_id": application.get("jobId")})
    if not job:
        return {"error": "Job not found"}, 404

    if claims.get("role") != "admin" and job.get("createdBy") != ObjectId(recruiter_id):
        return {"error": "Forbidden"}, 403

    # 🔹 Update status
    mongo.db.applications.update_one(
        {"_id": ObjectId(application_id)},
        {
            "$set": {
                "status": status,
                "updatedAt": datetime.utcnow()
            }
        }
    )

    # 🔔 Create notification
    create_notification(
        user_id=str(application["userId"]),
        title="Application Status Updated",
        message=f"Your application has been {status}",
        type="application_status",
        meta={"applicationId": application_id}
    )

    return {"message": "Status updated"}, 200
