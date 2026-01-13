from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions.db import mongo
from datetime import datetime
from bson import ObjectId

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")


@profile_bp.route("", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()

    profile = mongo.db.jobseeker_profiles.find_one(
        {"userId": ObjectId(user_id)},
        {"_id": 0}
    )

    return {"profile": profile}, 200


@profile_bp.route("", methods=["PUT"])
@jwt_required()
def save_profile():
    user_id = get_jwt_identity()
    data = request.json

    if not data.get("skills") or not isinstance(data["skills"], list):
        return {"error": "Skills must be an array"}, 400

    mongo.db.jobseeker_profiles.update_one(
        {"userId": ObjectId(user_id)},
        {
            "$set": {
                "fullName": data.get("fullName"),
                "headline": data.get("headline"),
                "location": data.get("location"),
                "experience": data.get("experience"),
                "skills": data.get("skills"),
                "bio": data.get("bio"),
                "updatedAt": datetime.utcnow()
            },
            "$setOnInsert": {
                "userId": ObjectId(user_id),
                "createdAt": datetime.utcnow()
            }
        },
        upsert=True
    )

    return {"message": "Profile saved successfully"}, 200
