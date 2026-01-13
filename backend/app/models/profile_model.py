from app.extensions.db import mongo
from datetime import datetime

def get_profile_by_user(user_id):
    return mongo.db.jobseeker_profiles.find_one({"userId": user_id})

def upsert_profile(user_id, data):
    mongo.db.jobseeker_profiles.update_one(
        {"userId": user_id},
        {
            "$set": {
                "fullName": data.get("fullName"),
                "headline": data.get("headline"),
                "location": data.get("location"),
                "experience": data.get("experience"),  # years
                "skills": data.get("skills", []),       # ARRAY
                "bio": data.get("bio"),
                "updatedAt": datetime.utcnow()
            },
            "$setOnInsert": {
                "createdAt": datetime.utcnow()
            }
        },
        upsert=True
    )
