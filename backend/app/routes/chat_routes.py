from datetime import datetime
from bson import ObjectId
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions.db import mongo
from app.extensions.socket import socketio

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")


# ---------------- HELPER ----------------
def get_profile(user_id):
    user = mongo.db.users.find_one({"_id": user_id})
    if not user:
        return {
            "name": "Unknown",
            "profileImage": None,
            "role": None
        }

    if user["role"] == "job_seeker":
        profile = mongo.db.jobseekerprofiles.find_one({"userId": user_id})
    else:
        profile = mongo.db.recruiterprofiles.find_one({"userId": user_id})

    return {
        "name": profile.get("fullName") if profile else user["email"],
        "profileImage": profile.get("profileImage") if profile else None,
        "role": user["role"]
    }

@chat_bp.route("/my", methods=["GET"])
@jwt_required()
def my_conversations():
    user_id = ObjectId(get_jwt_identity())

    conversations = mongo.db.conversations.find(
        {"participants": user_id}
    ).sort("updatedAt", -1)

    results = []

    for convo in conversations:
        convo_id = str(convo["_id"])

        other_user_id = next(pid for pid in convo["participants"] if pid != user_id)
        user = mongo.db.users.find_one({"_id": other_user_id})

        name = user.get("email")
        profile_image = None

        # ✅ CORRECT COLLECTION NAMES
        profile = None
        if user["role"] == "job_seeker":
            profile = mongo.db.jobseeker_profiles.find_one(
                {"userId": other_user_id}
            )
        elif user["role"] == "recruiter":
            profile = mongo.db.recruiter_profiles.find_one(
                {"userId": other_user_id}
            )

        if profile:
            name = profile.get("fullName", name)
            profile_image = profile.get("profileImage")

        last_msg = mongo.db.messages.find_one(
            {"conversationId": convo["_id"]},
            sort=[("createdAt", -1)]
        )

        unread_count = mongo.db.messages.count_documents({
            "conversationId": convo["_id"],
            "senderId": {"$ne": user_id},
            "readAt": None
        })

        results.append({
            "_id": convo_id,
            "participant": {
                "_id": str(other_user_id),
                "name": name,
                "profileImage": profile_image,
                "role": user["role"]
            },
            "lastMessage": last_msg["text"] if last_msg else "",
            "lastMessageAt": (
                last_msg["createdAt"].isoformat() if last_msg else None
            ),
            "unreadCount": unread_count
        })

    return {"conversations": results}, 200


# ---------------- GET MESSAGES ----------------
@chat_bp.route("/<cid>/messages", methods=["GET"])
@jwt_required()
def get_messages(cid):
    user_oid = ObjectId(get_jwt_identity())
    convo_oid = ObjectId(cid)

    messages = mongo.db.messages.find(
        {"conversationId": convo_oid}
    ).sort("createdAt", 1)

    result = []
    for m in messages:
        result.append({
            "_id": str(m["_id"]),
            "senderId": str(m["senderId"]),
            "text": m["text"],
            "createdAt": m["createdAt"].isoformat(),
            "readAt": m["readAt"].isoformat() if m.get("readAt") else None
        })

    # mark messages as read
    mongo.db.messages.update_many(
        {
            "conversationId": convo_oid,
            "senderId": {"$ne": user_oid},
            "readAt": None
        },
        {"$set": {"readAt": datetime.utcnow()}}
    )

    return {"messages": result}, 200


# ---------------- SEND MESSAGE ----------------
@chat_bp.route("/<cid>/messages", methods=["POST"])
@jwt_required()
def send_message(cid):
    user_oid = ObjectId(get_jwt_identity())
    convo_oid = ObjectId(cid)

    text = request.json.get("text", "").strip()
    if not text:
        return {"error": "Text required"}, 400

    message = {
        "conversationId": convo_oid,
        "senderId": user_oid,
        "text": text,
        "createdAt": datetime.utcnow(),
        "readAt": None
    }

    res = mongo.db.messages.insert_one(message)

    payload = {
        "_id": str(res.inserted_id),
        "conversationId": str(convo_oid),
        "senderId": str(user_oid),
        "text": text,
        "createdAt": message["createdAt"].isoformat(),
        "readAt": None
    }

    socketio.emit("new_message", payload, room=str(convo_oid))
    return payload, 201