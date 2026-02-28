from flask import Blueprint, request
from app.services.auth_service import register_user, login_user
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token,
    get_jwt,
    create_refresh_token,
)
from app.utils.decorators import role_required
from datetime import datetime
from app.extensions.db import mongo
from google.oauth2 import id_token
from google.auth.transport import requests
from flask import Blueprint, request
from flask_jwt_extended import create_access_token
from datetime import timedelta
from app.extensions.db import mongo
from google.oauth2 import id_token
from google.auth.transport import requests
import os
from flask_mail import Message
from app.extensions.mail import mail

GOOGLE_CLIENT_ID =""

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    user, error = register_user(data)

    if error:
        return {"error": error}, 400

    claims = {"role": user["role"]}
    token = create_access_token(identity=str(user["_id"]), additional_claims=claims)
    refresh_token = create_refresh_token(identity=str(user["_id"]), additional_claims=claims)

    return {
        "accessToken": token,
        "refreshToken": refresh_token,
        "role": user["role"]
    }, 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    tokens = login_user(data.get("email"), data.get("password"))
    if not tokens:
        return {"error": "Invalid credentials"}, 401

    return tokens, 200


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    role = get_jwt().get("role")
    access_token = create_access_token(
        identity=current_user,
        additional_claims={"role": role},
    )
    return {"accessToken": access_token}, 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    return {
        "userId": get_jwt_identity(),
        "role": get_jwt().get("role"),
    }

@auth_bp.route("/jobseeker-only", methods=["GET"])
@role_required("job_seeker")
def jobseeker_only():
    return {"message": "Welcome Job Seeker"}


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    email = request.json.get("email")
    user = mongo.db.users.find_one({"email": email})
    if not user:
        return {"message": "If that email exists, a reset link has been sent."}, 200

    # Generate a simple token (in production, use itsdangerous)
    import secrets
    token = secrets.token_urlsafe(32)
    mongo.db.reset_tokens.insert_one({
        "email": email,
        "token": token,
        "createdAt": datetime.utcnow()
    })

    

    reset_link = f"http://localhost:5173/reset-password?token={token}"

    msg = Message(
    subject="Reset your JobCompass password",
    recipients=[email],
    body=f"Click the link to reset your password:\n{reset_link}"
    )

    mail.send(msg)

    return {"message": "If that email exists, a reset link has been sent."}, 200

@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    token = data.get("token")
    new_password = data.get("password")

    reset_doc = mongo.db.reset_tokens.find_one({"token": token})
    if not reset_doc:
        return {"error": "Invalid or expired token"}, 400

    # Check expiry (e.g., 1 hour)
    if (datetime.utcnow() - reset_doc["createdAt"]).total_seconds() > 3600:
        return {"error": "Token expired"}, 400

    from werkzeug.security import generate_password_hash
    mongo.db.users.update_one(
        {"email": reset_doc["email"]},
        {"$set": {"passwordHash": generate_password_hash(new_password), "updatedAt": datetime.utcnow()}}
    )

    mongo.db.reset_tokens.delete_one({"_id": reset_doc["_id"]})

    return {"message": "Password reset successful"}, 200

@auth_bp.route("/google-login", methods=["POST"])
def google_login():
    token = request.json.get("token")

    try:
        info = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID")
        )

        email = info["email"]

        user = mongo.db.users.find_one({"email": email})

        if not user:
            user = {
                "email": email,
                "passwordHash": None,
                "role": "job_seeker",
                "isActive": True,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
            result = mongo.db.users.insert_one(user)
            user["_id"] = result.inserted_id

        access_token = create_access_token(
            identity=str(user["_id"]),
            additional_claims={"role": user["role"]}
        )

        return {
            "accessToken": access_token,
            "role": user["role"]
        }, 200

    except Exception as e:
        return {"error": "Invalid Google token"}, 401
    
@auth_bp.route("/microsoft-login", methods=["POST"])
def microsoft_login():
    data = request.json
    email = data.get("email")
    microsoft_id = data.get("sub")

    if not email or not microsoft_id:
        return {"error": "Invalid Microsoft token"}, 400

    user = mongo.db.users.find_one({"email": email})

    if not user:
        user = {
            "email": email,
            "role": "job_seeker",
            "provider": "microsoft",
            "providerId": microsoft_id,
            "isActive": True
        }
        mongo.db.users.insert_one(user)

    access_token = create_access_token(
        identity=str(user["_id"]),
        additional_claims={"role": user["role"]}
    )

    return {"accessToken": access_token, "role": user["role"]}, 200

from flask_mail import Message
from app.extensions.mail import mail

def send_reset_email(email, token):
    msg = Message(
        subject="Reset your JobCompass password",
        recipients=[email],
        body=f"Reset link: http://localhost:5173/reset-password?token={token}"
    )
    mail.send(msg)