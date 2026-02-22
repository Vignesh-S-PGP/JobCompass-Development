from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from app.extensions.db import mongo

notification_bp = Blueprint(
    "notifications",
    __name__,
    url_prefix="/api/notifications"
)

@notification_bp.route("", methods=["GET"])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()

    notifications = list(
        mongo.db.notifications.find(
            {"userId": ObjectId(user_id)}
        ).sort("createdAt", -1)
    )

    for n in notifications:
        n["_id"] = str(n["_id"])
        n["userId"] = str(n["userId"])

    return {"notifications": notifications}, 200


@notification_bp.route("/<notification_id>/read", methods=["PATCH"])
@jwt_required()
def mark_as_read(notification_id):
    mongo.db.notifications.update_one(
        {"_id": ObjectId(notification_id)},
        {"$set": {"isRead": True}}
    )

    return {"message": "Marked as read"}, 200