from flask import Blueprint, request
from app.services.auth_service import register_user, login_user
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.decorators import role_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

from flask_jwt_extended import create_access_token

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    user, error = register_user(data)

    if error:
        return {"error": error}, 400

    token = create_access_token(identity=str(user["_id"]))

    return {
        "accessToken": token,
        "role": user["role"]
    }, 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    token, error = login_user(data["email"], data["password"])

    if error:
        return {"error": error}, 401
    if not token:
        return {"error": "Invalid credentials"}, 401

    # Need to fetch user to get role for frontend convenience
    from app.models.user_model import find_by_email
    user = find_by_email(data["email"])

    return {
        "accessToken": token,
        "role": user["role"]
    }

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    return {
        "userId": get_jwt_identity()
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

    print(f"DEBUG: Password reset token for {email}: {token}")

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

@auth_bp.route("/delete-account", methods=["DELETE"])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"isActive": False, "deletedAt": datetime.utcnow()}}
    )
    return {"message": "Account deactivated"}, 200