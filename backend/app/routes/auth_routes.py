from flask import Blueprint, request
from app.services.auth_service import register_user, login_user
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.decorators import role_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    user, error = register_user(data)

    if error:
        return {"error": error}, 400

    return {"message": "User registered successfully"}

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    token = login_user(data["email"], data["password"])

    if not token:
        return {"error": "Invalid credentials"}, 401

    return {"accessToken": token}

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