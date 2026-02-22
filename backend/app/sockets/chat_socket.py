from app.extensions.socket import socketio
from flask_jwt_extended import decode_token
from bson import ObjectId
from app.extensions.db import mongo
from datetime import datetime
from flask import request

@socketio.on("connect")
def on_connect(auth):
    token = auth.get("token")
    if not token:
        return False
    try:
        decoded = decode_token(token)
        user_id = decoded["sub"]
        # join personal room for notifications
        socketio.enter_room(user_id)
        print(f"User {user_id} connected")
    except Exception as e:
        print(f"Connect error: {e}")
        return False

@socketio.on("join_room")
def on_join(data):
    room = data.get("conversationId")
    if room:
        socketio.enter_room(room)
        print(f"User joined room: {room}")

@socketio.on("send_message")
def on_send_message(data):
    room = data.get("conversationId")
    sender_id = data.get("senderId")
    text = data.get("text")

    if not room or not sender_id or not text:
        return

    message = {
        "conversationId": ObjectId(room),
        "senderId": ObjectId(sender_id),
        "text": text,
        "createdAt": datetime.utcnow()
    }

    mongo.db.messages.insert_one(message)

    # Update conversation
    mongo.db.conversations.update_one(
        {"_id": ObjectId(room)},
        {"$set": {"updatedAt": datetime.utcnow()}}
    )

    # Broadcast to room
    message["_id"] = str(message["_id"])
    message["conversationId"] = str(message["conversationId"])
    message["senderId"] = str(message["senderId"])
    message["createdAt"] = message["createdAt"].isoformat()

    socketio.emit("new_message", message, room=room)

@socketio.on("typing")
def on_typing(data):
    room = data.get("conversationId")
    user_id = data.get("userId")
    is_typing = data.get("isTyping")
    socketio.emit("display_typing", {"userId": user_id, "isTyping": is_typing}, room=room, include_self=False)
