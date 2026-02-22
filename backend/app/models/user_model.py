from app.extensions.db import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

from app.extensions.db import mongo

def create_user(data):
    mongo.db.users.insert_one(data)

def find_by_email(email):
    return mongo.db.users.find_one({"email": email})
