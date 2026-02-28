from flask_socketio import join_room, leave_room
from flask_jwt_extended import decode_token
from app.extensions.socket import socketio


@socketio.on("connect")
def handle_connect(auth):
    token = auth.get("token") if auth else None
    if not token:
        return False

    try:
        decoded = decode_token(token)
        user_id = str(decoded["sub"])

        # 🔑 Personal room (USED FOR REAL-TIME DELIVERY)
        join_room(user_id)

        print(f"✅ Socket connected: {user_id}")
    except Exception as e:
        print("❌ Socket auth failed:", e)
        return False


@socketio.on("join_conversation")
def join_conversation(data):
    conversation_id = data.get("conversationId")
    if conversation_id:
        join_room(conversation_id)
        print(f"📥 Joined conversation room {conversation_id}")


@socketio.on("leave_conversation")
def leave_conversation(data):
    conversation_id = data.get("conversationId")
    if conversation_id:
        leave_room(conversation_id)
        print(f"📤 Left conversation {conversation_id}")


@socketio.on("typing")
def typing(data):
    conversation_id = data.get("conversationId")
    user_id = data.get("userId")

    if conversation_id and user_id:
        socketio.emit(
            "typing",
            {"userId": user_id},
            room=conversation_id,
            include_self=False
        )