from app.extensions.db import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

def create_user(data):
    data["password"] = generate_password_hash(data["password"])
    data["createdAt"] = datetime.utcnow()
    data["updatedAt"] = datetime.utcnow()
    return mongo.db.users.insert_one(data)

def find_by_email(email):
    return mongo.db.users.find_one({"email": email})
