from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from app.extensions.db import mongo
from app.utils.decorators import role_required

applicant_profile_bp = Blueprint(
    "applicant_profile",
    __name__,
    url_prefix="/api/applicants"
)

@applicant_profile_bp.route("/<application_id>/profile", methods=["GET"])
@jwt_required()
@role_required("recruiter")
def view_applicant_profile(application_id):
    try:
        application = mongo.db.applications.find_one(
            {"_id": ObjectId(application_id)}
        )
        if not application:
            return {"error": "Application not found"}, 404

        user_id = application["userId"]

        # user (email)
        user = mongo.db.users.find_one(
            {"_id": ObjectId(user_id)},
            {"email": 1}
        )

        # jobseeker profile
        profile = mongo.db.jobseeker_profiles.find_one(
            {"userId": ObjectId(user_id)},
            {"_id": 0}
        )

        # resume
        resume = mongo.db.resumes.find_one(
            {"_id": ObjectId(application["resumeId"])},
            {"filename": 1, "title": 1}
        )

        return {
            "profile": profile,
            "email": user.get("email"),
            "applicationId": application_id,
            "resume": {
                "id": str(resume["_id"]),
                "title": resume.get("title"),
                "filename": resume.get("filename")
            } if resume else None
        }, 200

    except Exception as e:
        print("Applicant profile error:", e)
        return {"error": "Server error"}, 500