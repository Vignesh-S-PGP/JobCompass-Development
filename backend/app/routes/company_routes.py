from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions.db import mongo
from bson import ObjectId
from datetime import datetime

company_bp = Blueprint("companies", __name__, url_prefix="/api/companies")


@company_bp.route("", methods=["GET"])
@jwt_required()
def list_companies():

    companies = list(mongo.db.companies.find())

    for c in companies:
        c["_id"] = str(c["_id"])

    return {"companies": companies}, 200


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
                "logo": data.get("logo"),
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


@company_bp.route("/<company_id>/follow", methods=["POST"])
@jwt_required()
def toggle_follow_company(company_id):

    user_id = ObjectId(get_jwt_identity())

    existing = mongo.db.company_followers.find_one({
        "userId": user_id,
        "companyId": ObjectId(company_id)
    })

    if existing:
        mongo.db.company_followers.delete_one({"_id": existing["_id"]})
        return {"followed": False}, 200

    mongo.db.company_followers.insert_one({
        "userId": user_id,
        "companyId": ObjectId(company_id),
        "createdAt": datetime.utcnow()
    })

    return {"followed": True}, 201


@company_bp.route("/followed/ids", methods=["GET"])
@jwt_required()
def followed_company_ids():

    user_id = ObjectId(get_jwt_identity())

    ids = mongo.db.company_followers.find(
        {"userId": user_id},
        {"companyId": 1}
    )

    return {"ids": [str(i["companyId"]) for i in ids]}, 200

@company_bp.route("/<company_id>", methods=["GET"])
def get_company_profile(company_id):

    company = mongo.db.companies.find_one({
        "_id": ObjectId(company_id)
    })

    if not company:
        return {"error": "Company not found"}, 404

    jobs = list(
        mongo.db.jobs.find({
            "companyId": ObjectId(company_id),
            "status": "active"
        })
    )

    company["_id"] = str(company["_id"])

    for j in jobs:
        j["_id"] = str(j["_id"])
        j["company"] = {
            "name": company.get("name"),
            "logo": company.get("logo"),
            "industry": company.get("industry"),
            "website": company.get("website")
        }

    return {
        "company": company,
        "jobs": jobs
    }, 200