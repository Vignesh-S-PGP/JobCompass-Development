from flask_socketio import SocketIO

socketio = SocketIO(
    cors_allowed_origins="http://localhost:5173",
    async_mode="threading"
)