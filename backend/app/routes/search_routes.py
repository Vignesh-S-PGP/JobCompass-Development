from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from bson import ObjectId
from app.extensions.db import mongo

search_bp = Blueprint("search", __name__, url_prefix="/api/search")
@search_bp.route("", methods=["GET"])
@jwt_required()
def search_all():

    q = request.args.get("q", "").strip()

    if not q:
        return {"jobs": [], "companies": []}, 200

    regex = {"$regex": q, "$options": "i"}

    jobs_cursor = mongo.db.jobs.find({
        "status": "active",
        "$or": [
            {"title": regex},
            {"location": regex},
            {"skillsRequired": {"$elemMatch": regex}}
        ]
    }).limit(20)

    jobs = []

    for j in jobs_cursor:
        jobs.append({
            "_id": str(j["_id"]),
            "title": j["title"],
            "location": j.get("location"),
            "jobType": j.get("jobType"),
            "companyId": str(j["companyId"])
        })


    companies_cursor = mongo.db.companies.find({
        "$or": [
            {"name": regex},
            {"industry": regex},
            {"location": regex}
        ]
    }).limit(20)

    companies = []

    for c in companies_cursor:
        companies.append({
            "_id": str(c["_id"]),
            "name": c["name"],
            "industry": c.get("industry"),
            "logo": c.get("logo")
        })

    return {
        "jobs": jobs,
        "companies": companies
    }, 200
# -------------------------------------------------
# LIVE SEARCH SUGGESTIONS
# -------------------------------------------------

@search_bp.route("/suggest", methods=["GET"])
@jwt_required()
def search_suggestions():

    q = request.args.get("q", "").strip()

    if not q:
        return {"jobs": [], "companies": []}, 200

    regex = {"$regex": q, "$options": "i"}

    # JOB SUGGESTIONS
    jobs_cursor = mongo.db.jobs.find(
        {"title": regex, "status": "active"},
        {"title": 1}
    ).limit(5)

    jobs = []

    for j in jobs_cursor:
        jobs.append({
            "_id": str(j["_id"]),
            "title": j["title"]
        })


    # COMPANY SUGGESTIONS
    companies_cursor = mongo.db.companies.find(
        {"name": regex},
        {"name": 1, "logo": 1}
    ).limit(5)

    companies = []

    for c in companies_cursor:
        companies.append({
            "_id": str(c["_id"]),
            "name": c["name"],
            "logo": c.get("logo")
        })


    return {
        "jobs": jobs,
        "companies": companies
    }, 200

# -------------------------------------------------
# RECRUITER SEARCH JOB SEEKERS
# -------------------------------------------------

@search_bp.route("/candidates", methods=["GET"])
@jwt_required()
def search_candidates():

    q = request.args.get("q", "").strip()

    if not q:
        return {"candidates": []}, 200

    regex = {"$regex": q, "$options": "i"}

    cursor = mongo.db.jobseeker_profiles.find({
        "$or": [
            {"fullName": regex},
            {"headline": regex},
            {"location": regex},
            {"skills": {"$elemMatch": regex}}
        ]
    }).limit(20)

    candidates = []

    for c in cursor:

        candidates.append({
            "_id": str(c["_id"]),
            "userId": str(c["userId"]),
            "fullName": c.get("fullName"),
            "headline": c.get("headline"),
            "location": c.get("location"),
            "profileImage": c.get("profileImage"),
            "experience": c.get("experience")
        })

    return {"candidates": candidates}, 200

# -------------------------------------------------
# RECRUITER SUGGESTIONS
# -------------------------------------------------

@search_bp.route("/candidates/suggest", methods=["GET"])
@jwt_required()
def suggest_candidates():

    q = request.args.get("q", "").strip()

    if not q:
        return {"candidates": []}, 200

    regex = {"$regex": q, "$options": "i"}

    cursor = mongo.db.jobseeker_profiles.find(
        {
            "$or": [
                {"fullName": regex},
                {"headline": regex},
                {"skills": {"$elemMatch": regex}}
            ]
        },
        {"fullName": 1, "headline": 1, "profileImage": 1}
    ).limit(5)

    candidates = []

    for c in cursor:

        candidates.append({
            "_id": str(c["_id"]),
            "fullName": c.get("fullName"),
            "headline": c.get("headline"),
            "profileImage": c.get("profileImage")
        })

    return {"candidates": candidates}, 200