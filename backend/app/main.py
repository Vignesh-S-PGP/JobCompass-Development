from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from app.extensions.db import init_db
from flask_jwt_extended import JWTManager

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")

    # 🔥 THIS LINE IS CRITICAL
    CORS(
        app,
        resources={r"/api/*": {"origins": "http://localhost:5173"}},
        supports_credentials=True,
    )

    JWTManager(app)
    init_db(app)

    from app.routes.auth_routes import auth_bp
    from app.routes.resume_routes import resume_bp
    from app.routes.profile_routes import profile_bp
    app.register_blueprint(profile_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(resume_bp)

    @app.route("/health")
    def health():
        return {"status": "ok"}

    return app
