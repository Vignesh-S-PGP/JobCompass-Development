from app.extensions.db import mongo
from datetime import datetime
from bson import ObjectId

def create_notification(user_id, title, message, type, meta=None):
    mongo.db.notifications.insert_one({
        "userId": ObjectId(user_id),
        "title": title,
        "message": message,
        "type": type,
        "meta": meta or {},
        "isRead": False,
        "createdAt": datetime.utcnow()
    })