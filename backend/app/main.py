from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

from app.extensions.db import init_db
from app.extensions.socket import socketio

load_dotenv()


def create_app():
    app = Flask(__name__)

    # =====================
    # CONFIG
    # =====================
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")

    # =====================
    # CORS
    # =====================
    CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True,
)

    # =====================
    # EXTENSIONS
    # =====================
    JWTManager(app)
    init_db(app)
    socketio.init_app(app)

    # =====================
    # BLUEPRINT IMPORTS (ONLY ONCE)
    # =====================
    from app.routes.auth_routes import auth_bp
    from app.routes.resume_routes import resume_bp
    from app.routes.profile_routes import profile_bp
    from app.routes.recruiter_profile_routes import recruiter_profile_bp
    from app.routes.job_routes import job_bp
    from app.routes.company_routes import company_bp
    from app.routes.job_feed_routes import job_feed_bp
    from app.routes.application_routes import application_bp
    from app.routes.notification_routes import notification_bp
    from app.routes.applicant_profile_routes import applicant_profile_bp
    from app.routes.admin_routes import admin_bp
    from app.routes.chat_routes import chat_bp

    # =====================
    # REGISTER BLUEPRINTS
    # =====================
    app.register_blueprint(auth_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(recruiter_profile_bp)
    app.register_blueprint(job_bp)
    app.register_blueprint(company_bp)
    app.register_blueprint(job_feed_bp)
    app.register_blueprint(application_bp)
    app.register_blueprint(notification_bp)
    app.register_blueprint(applicant_profile_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(chat_bp)

    # =====================
    # HEALTH CHECK
    # =====================
    @app.route("/health")
    def health():
        return {"status": "ok"}

    return app