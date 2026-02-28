from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions.db import mongo
from bson import ObjectId
from datetime import datetime

recruiter_profile_bp = Blueprint(
    "recruiter_profile",
    __name__,
    url_prefix="/api/recruiter/profile"
)

@recruiter_profile_bp.route("", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()

    profile = mongo.db.recruiter_profiles.find_one(
        {"userId": ObjectId(user_id)},
        {"_id": 0}
    )

    return {"profile": profile}, 200


@recruiter_profile_bp.route("", methods=["POST"])
@jwt_required()
def save_profile():
    user_id = get_jwt_identity()
    data = request.json

    mongo.db.recruiter_profiles.update_one(
        {"userId": ObjectId(user_id)},
        {
            "$set": {
                **data,
                "updatedAt": datetime.utcnow()
            },
            "$setOnInsert": {
                "userId": ObjectId(user_id),
                "createdAt": datetime.utcnow()
            }
        },
        upsert=True
    )

    return {"message": "Recruiter profile saved"}, 200
