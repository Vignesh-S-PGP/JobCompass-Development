from datetime import datetime

from bson import ObjectId
from bson.errors import InvalidId
from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions.db import mongo

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")


@chat_bp.route("/my", methods=["GET"])
@jwt_required()
def my_conversations():
    user_id = get_jwt_identity()

    conversations = list(
        mongo.db.conversations.find({"participants": ObjectId(user_id)}).sort("updatedAt", -1)
    )

    for conversation in conversations:
        conversation["_id"] = str(conversation["_id"])
        conversation["applicationId"] = str(conversation["applicationId"])

    return {"conversations": conversations}, 200


@chat_bp.route("/start", methods=["POST"])
@jwt_required()
def start_chat():
    user_id = get_jwt_identity()
    data = request.json or {}
    application_id = data.get("applicationId")

    try:
        application_oid = ObjectId(application_id)
        user_oid = ObjectId(user_id)
    except (InvalidId, TypeError):
        return {"error": "Invalid application"}, 400

    application = mongo.db.applications.find_one({"_id": application_oid})
    if not application:
        return {"error": "Invalid application"}, 400

    job = mongo.db.jobs.find_one({"_id": application.get("jobId")})
    if not job:
        return {"error": "Job not found"}, 404

    recruiter_id = job.get("createdBy")
    job_seeker_id = application.get("userId")

    if user_oid not in {recruiter_id, job_seeker_id}:
        return {"error": "Forbidden"}, 403

    participants = [job_seeker_id, recruiter_id]

    conversation = mongo.db.conversations.find_one({"applicationId": application_oid})
    if not conversation:
        result = mongo.db.conversations.insert_one(
            {
                "participants": participants,
                "applicationId": application_oid,
                "updatedAt": datetime.utcnow(),
            }
        )
        conversation_id = result.inserted_id
    else:
        conversation_id = conversation["_id"]

    return {"conversationId": str(conversation_id)}, 200


@chat_bp.route("/<conversation_id>/messages", methods=["GET"])
@jwt_required()
def get_messages(conversation_id):
    user_id = get_jwt_identity()

    try:
        conversation_oid = ObjectId(conversation_id)
        user_oid = ObjectId(user_id)
    except InvalidId:
        return {"error": "Invalid conversation"}, 400

    conversation = mongo.db.conversations.find_one({"_id": conversation_oid})
    if not conversation or user_oid not in conversation.get("participants", []):
        return {"error": "Forbidden"}, 403

    messages = list(
        mongo.db.messages.find({"conversationId": conversation_oid}).sort("createdAt", 1)
    )

    for message in messages:
        message["_id"] = str(message["_id"])
        message["senderId"] = str(message["senderId"])

    return {"messages": messages}, 200


@chat_bp.route("/<conversation_id>/messages", methods=["POST"])
@jwt_required()
def send_message(conversation_id):
    user_id = get_jwt_identity()
    data = request.json or {}
    message_text = data.get("text", "").strip()

    if not message_text:
        return {"error": "Message text is required"}, 400

    try:
        conversation_oid = ObjectId(conversation_id)
        user_oid = ObjectId(user_id)
    except InvalidId:
        return {"error": "Invalid conversation"}, 400

    conversation = mongo.db.conversations.find_one({"_id": conversation_oid})
    if not conversation or user_oid not in conversation.get("participants", []):
        return {"error": "Forbidden"}, 403

    mongo.db.messages.insert_one(
        {
            "conversationId": conversation_oid,
            "senderId": user_oid,
            "text": message_text,
            "createdAt": datetime.utcnow(),
        }
    )

    mongo.db.conversations.update_one(
        {"_id": conversation_oid}, {"$set": {"updatedAt": datetime.utcnow()}}
    )

    return {"message": "sent"}, 201
