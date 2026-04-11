from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions.db import mongo
from bson import ObjectId
import re

job_feed_bp = Blueprint("job_feed", __name__, url_prefix="/api/job-feed")


# ---------------- HELPER ----------------

def tokenize(text):
    if not text:
        return []
    return re.findall(r'\w+', text.lower())


def extract_profile_keywords(profile):

    keywords = set()

    # skills
    for s in profile.get("skills", []):
        keywords.add(s.lower())

    # headline
    keywords.update(tokenize(profile.get("headline", "")))

    # bio
    keywords.update(tokenize(profile.get("bio", "")))

    # experience
    for exp in profile.get("detailedExperience", []):
        keywords.update(tokenize(exp.get("role", "")))
        keywords.update(tokenize(exp.get("description", "")))

    return keywords


def extract_job_keywords(job):

    keywords = set()

    # title
    keywords.update(tokenize(job.get("title", "")))

    # description
    keywords.update(tokenize(job.get("description", "")))

    # skills
    for s in job.get("skillsRequired", []):
        keywords.add(s.lower())

    return keywords


# ---------------- MAIN ROUTE ----------------

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

    # ---------------- NO PROFILE ----------------

    if not profile:
        return {
            "recommended": [],
            "all": all_jobs
        }, 200

    # ---------------- PROFILE DATA ----------------

    user_keywords = extract_profile_keywords(profile)
    user_skills = set([s.lower() for s in profile.get("skills", [])])
    user_location = profile.get("location", "").lower()
    user_headline = profile.get("headline", "").lower()
    user_experience = int(profile.get("experience", 0) or 0)

    scored_jobs = []

    # ---------------- SCORING ----------------

    for job in all_jobs:

        score = 0

        job_keywords = extract_job_keywords(job)
        job_skills = set([s.lower() for s in job.get("skillsRequired", [])])

        job_title = (job.get("title") or "").lower()
        job_desc = (job.get("description") or "").lower()
        job_location = (job.get("location") or "").lower()
        job_exp = int(job.get("experience") or 0) if str(job.get("experience")).isdigit() else 0

        # 1. SKILL MATCH
        skill_matches = user_skills & job_skills
        score += len(skill_matches) * 5

        # 2. TITLE MATCH
        if any(word in job_title for word in user_headline.split()):
            score += 10

        # 3. KEYWORD MATCH (bio + description)
        keyword_matches = user_keywords & job_keywords
        score += len(keyword_matches) * 2

        # 4. EXPERIENCE MATCH
        if job_exp and user_experience >= job_exp:
            score += 5

        # 5. LOCATION MATCH
        if user_location and user_location == job_location:
            score += 3

        # ONLY KEEP RELEVANT JOBS
        if score > 5:
            scored_jobs.append((score, job))

    # ---------------- SORT ----------------

    scored_jobs.sort(key=lambda x: x[0], reverse=True)

    recommended = [job for score, job in scored_jobs[:20]]

    return {
        "recommended": recommended,
        "all": all_jobs
    }, 200