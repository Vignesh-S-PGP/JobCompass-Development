from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from flask_jwt_extended import JWTManager
from app.extensions import db as db_module   # ✅ import MODULE, not variable
from app.extensions.db import init_db

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")

    CORS(app)
    JWTManager(app)

    init_db(app)

    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)

    @app.route("/health")
    def health():
        return {
            "status": "ok",
            "collections": db_module.db.list_collection_names()
        }

    return app
