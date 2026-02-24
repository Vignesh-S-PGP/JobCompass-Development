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
    tokens = login_user(data["email"], data["password"])

    if not tokens:
        return {"error": "Invalid credentials"}, 401

    return tokens


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
