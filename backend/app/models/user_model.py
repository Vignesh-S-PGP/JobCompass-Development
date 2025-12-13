from app.extensions.db import db
from bson import ObjectId
from datetime import datetime

def get_collection():
    return db.users

def create_user(user):
    user["createdAt"] = datetime.utcnow()
    user["updatedAt"] = datetime.utcnow()
    return get_collection().insert_one(user)

def find_by_email(email):
    return get_collection().find_one({"email": email})

def find_by_id(user_id):
    return get_collection().find_one({"_id": ObjectId(user_id)})
