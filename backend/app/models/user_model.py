from app.extensions.db import mongo

def create_user(data):
    result = mongo.db.users.insert_one(data)
    return result.inserted_id

def find_by_email(email):
    return mongo.db.users.find_one({"email": email})
