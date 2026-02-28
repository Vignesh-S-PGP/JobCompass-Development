from app.extensions.db import mongo
from datetime import datetime
from bson import ObjectId
from app.extensions.socket import socketio

def create_notification(user_id, title, message, type, meta=None):
    # 1️⃣ Build DB-safe notification
    notif_db = {
        "userId": ObjectId(user_id),
        "title": title,
        "message": message,
        "type": type,
        "meta": meta or {},
        "isRead": False,
        "createdAt": datetime.utcnow()
    }

    # 2️⃣ Insert ONCE
    result = mongo.db.notifications.insert_one(notif_db)

    # 3️⃣ Build socket / API payload (SEPARATE OBJECT)
    notif_payload = {
        "_id": str(result.inserted_id),
        "userId": str(user_id),
        "title": title,
        "message": message,
        "type": type,
        "meta": meta or {},
        "isRead": False,
        "createdAt": notif_db["createdAt"].isoformat()
    }

    # 4️⃣ Emit realtime event
    socketio.emit(
        "new_notification",
        notif_payload,
        room=str(user_id)
    )

    return notif_payload
