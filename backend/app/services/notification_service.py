from app.extensions.db import mongo
from datetime import datetime
from bson import ObjectId
from app.extensions.socket import socketio

def create_notification(user_id, title, message, type, meta=None):
    notif = {
        "userId": ObjectId(user_id),
        "title": title,
        "message": message,
        "type": type,
        "meta": meta or {},
        "isRead": False,
        "createdAt": datetime.utcnow()
    }

    result = mongo.db.notifications.insert_one(notif)

    # Emit real-time notification
    notif["_id"] = str(result.inserted_id)
    notif["userId"] = str(notif["userId"])
    notif["createdAt"] = notif["createdAt"].isoformat()

    socketio.emit("new_notification", notif, room=str(user_id))