from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
from app.extensions.db import mongo

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")

@chat_bp.route("/my", methods=["GET"])
@jwt_required()
def my_conversations():
    user_id = get_jwt_identity()

    conversations = list(
        mongo.db.conversations.find(
            {"participants": ObjectId(user_id)}
        ).sort("updatedAt", -1)
    )

    for c in conversations:
        c["_id"] = str(c["_id"])
        c["applicationId"] = str(c["applicationId"])

    return {"conversations": conversations}, 200



# 1️⃣ Start or get conversation
@chat_bp.route("/start", methods=["POST"])
@jwt_required()
def start_chat():
    user_id = get_jwt_identity()
    data = request.json
    application_id = data.get("applicationId")

    application = mongo.db.applications.find_one(
        {"_id": ObjectId(application_id)}
    )

    if not application:
        return {"error": "Invalid application"}, 400

    participants = [
        ObjectId(user_id),
        application["userId"]
    ]

    conversation = mongo.db.conversations.find_one({
        "applicationId": ObjectId(application_id)
    })

    if not conversation:
        result = mongo.db.conversations.insert_one({
            "participants": participants,
            "applicationId": ObjectId(application_id),
            "updatedAt": datetime.utcnow()
        })
        conversation_id = result.inserted_id
    else:
        conversation_id = conversation["_id"]

    return {"conversationId": str(conversation_id)}, 200


# 2️⃣ Get messages
@chat_bp.route("/<conversation_id>/messages", methods=["GET"])
@jwt_required()
def get_messages(conversation_id):
    messages = list(
        mongo.db.messages.find(
            {"conversationId": ObjectId(conversation_id)}
        ).sort("createdAt", 1)
    )

    for m in messages:
        m["_id"] = str(m["_id"])
        m["senderId"] = str(m["senderId"])

    return {"messages": messages}, 200


# 3️⃣ Send message
@chat_bp.route("/<conversation_id>/messages", methods=["POST"])
@jwt_required()
def send_message(conversation_id):
    user_id = get_jwt_identity()
    text = request.json.get("text")

    mongo.db.messages.insert_one({
        "conversationId": ObjectId(conversation_id),
        "senderId": ObjectId(user_id),
        "text": text,
        "createdAt": datetime.utcnow()
    })

    mongo.db.conversations.update_one(
        {"_id": ObjectId(conversation_id)},
        {"$set": {"updatedAt": datetime.utcnow()}}
    )

    return {"message": "sent"}, 201