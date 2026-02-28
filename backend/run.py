from dotenv import load_dotenv
load_dotenv()   # 🔥 MUST be first – before any app imports

from app.main import create_app
from app.extensions.socket import socketio

app = create_app()

if __name__ == "__main__":
    socketio.run(
        app,
        host="127.0.0.1",
        port=5000,
        debug=True,
        use_reloader=False  # ✅ correct for SocketIO
    )