from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions.db import mongo
from bson import ObjectId
from datetime import datetime

company_bp = Blueprint("company", __name__, url_prefix="/api/company")

@company_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_company():
    user_id = get_jwt_identity()

    company = mongo.db.companies.find_one(
        {"ownerId": ObjectId(user_id)},
        {"_id": 0}
    )

    return {"company": company}, 200

@company_bp.route("", methods=["POST"])
@jwt_required()
def create_company():
    user_id = get_jwt_identity()
    data = request.json

    mongo.db.companies.update_one(
        {"ownerId": ObjectId(user_id)},
        {
            "$set": {
                "name": data.get("name"),
                "industry": data.get("industry"),
                "location": data.get("location"),
                "size": data.get("size"),
                "website": data.get("website"),
                "about": data.get("about"),
                "logo": data.get("logo"),   # 🔥 NEW
                "updatedAt": datetime.utcnow()
            },
            "$setOnInsert": {
                "ownerId": ObjectId(user_id),
                "createdAt": datetime.utcnow()
            }
        },
        upsert=True
    )

    return {"message": "Company saved successfully"}, 200
