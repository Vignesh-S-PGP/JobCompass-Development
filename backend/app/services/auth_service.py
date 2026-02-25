from app.models.user_model import create_user, find_by_email
from app.utils.security import verify_password
from flask_jwt_extended import create_access_token, create_refresh_token
from datetime import timedelta

from werkzeug.security import generate_password_hash
from datetime import datetime
from app.extensions.db import mongo

def register_user(data):
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password or not role:
        return None, "Missing required fields"

    if role not in ["job_seeker", "recruiter", "admin"]:
        return None, "Invalid role"

    if mongo.db.users.find_one({"email": email}):
        return None, "Email already registered"

    user = {
        "email": email,
        "passwordHash": generate_password_hash(password),
        "role": role,
        "isActive": True,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
        "jobSeekerProfile": {} if role == "job_seeker" else None,
        "recruiterProfile": {} if role == "recruiter" else None,
    }

    user_id = create_user(user)
    user["_id"] = user_id
    return user, None

def login_user(email, password):
    user = find_by_email(email)
    if not user or not verify_password(password, user["passwordHash"]):
        return None

    token = create_access_token(

    access_token = create_access_token(
        identity=str(user["_id"]),
        additional_claims={"role": user["role"]},
        expires_delta=timedelta(days=1)
    )
    refresh_token = create_refresh_token(
        identity=str(user["_id"]),
        additional_claims={"role": user["role"]},
        expires_delta=timedelta(days=30)
    )
    return {
        "accessToken": access_token,
        "refreshToken": refresh_token,
        "role": user["role"],
    }
