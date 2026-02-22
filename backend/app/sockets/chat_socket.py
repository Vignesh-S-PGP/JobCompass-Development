from app.extensions.socket import socketio
from flask_jwt_extended import decode_token
from bson import ObjectId
from app.extensions.db import mongo
from datetime import datetime

@socketio.on("connect")
def on_connect(auth):
    token = auth.get("token")
    if not token:
        return False

    decoded = decode_token(token)
    user_id = decoded["sub"]

    # join personal room
    socketio.enter_room(request.sid, user_id)

    from app.extensions.socket import socketio
from flask_jwt_extended import decode_token
from bson import ObjectId
from app.extensions.db import mongo
from datetime import datetime

@socketio.on("connect")
def on_connect(auth):
    token = auth.get("token")
    if not token:
        return False

    decoded = decode_token(token)
    user_id = decoded["sub"]

    # join personal room
    socketio.enter_room(request.sid, user_id)