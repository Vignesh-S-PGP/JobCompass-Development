from app.models.user_model import create_user, find_by_email
from app.utils.security import hash_password, verify_password
from flask_jwt_extended import create_access_token
from datetime import timedelta

def register_user(data):
    if find_by_email(data["email"]):
        return None, "User already exists"

    user = {
        "email": data["email"],
        "passwordHash": hash_password(data["password"]),
        "role": data["role"],
        "isActive": True,
        "jobSeekerProfile": {},
        "recruiterProfile": {}
    }

    create_user(user)
    return user, None

def login_user(email, password):
    user = find_by_email(email)
    if not user or not verify_password(password, user["passwordHash"]):
        return None

    token = create_access_token(
        identity=str(user["_id"]),
        additional_claims={"role": user["role"]},
        expires_delta=timedelta(days=1)
    )
    return token
