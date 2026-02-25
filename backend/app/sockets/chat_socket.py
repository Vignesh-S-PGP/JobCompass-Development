from flask import request
from app.extensions.socket import socketio
from flask_jwt_extended import decode_token
from bson import ObjectId
from app.extensions.db import mongo
from datetime import datetime
from flask import request

@socketio.on("connect")
def on_connect(auth=None):
    token = auth.get("token") if auth else None
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

    try:
        decoded = decode_token(token)
        user_id = str(decoded["sub"])
        # Join a room named after the user_id to receive personal notifications/messages
        socketio.enter_room(user_id)
        print(f"User {user_id} connected and joined room")
    except Exception as e:
        print(f"Socket connection error: {e}")
        return False

@socketio.on("join_conversation")
def on_join_conversation(data):
    conversation_id = data.get("conversationId")
    if conversation_id:
        socketio.enter_room(conversation_id)
        print(f"Joined conversation room: {conversation_id}")

@socketio.on("leave_conversation")
def on_leave_conversation(data):
    conversation_id = data.get("conversationId")
    if conversation_id:
        socketio.leave_room(conversation_id)
        print(f"Left conversation room: {conversation_id}")

@socketio.on("typing")
def on_typing(data):
    conversation_id = data.get("conversationId")
    user_id = data.get("userId")
    socketio.emit("typing", {"userId": user_id}, room=conversation_id, include_self=False)

@socketio.on("send_message")
def on_send_message(data):
    conversation_id = data.get("conversationId")
    sender_id = data.get("senderId")
    text = data.get("text")

    message = {
        "conversationId": ObjectId(conversation_id),

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


    # Emit to conversation room

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


    socketio.emit("new_message", message, room=conversation_id)

    # Update conversation's updatedAt
    mongo.db.conversations.update_one(
        {"_id": ObjectId(conversation_id)},
        {"$set": {"updatedAt": datetime.utcnow()}}
    )
    socketio.emit("new_message", message, room=room)

@socketio.on("typing")
def on_typing(data):
    room = data.get("conversationId")
    user_id = data.get("userId")
    is_typing = data.get("isTyping")
    socketio.emit("display_typing", {"userId": user_id, "isTyping": is_typing}, room=room, include_self=False)

