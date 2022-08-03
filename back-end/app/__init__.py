from flask import Flask
from flask_cors import CORS
from app.extensions import db, migrate
from config import Config


def create_app(config_class=Config):

    app = Flask(__name__)
    app.config.from_object(config_class)
    # Enable CORS
    CORS(app, resources=r'/*',origins="*",allow_headers="*",methods=["GET","POST","OPTIONS", "DELETE", "PUT"])
    # Init Flask-SQLAlchemy
    db.init_app(app)
    # Init Flask-Migrate
    migrate.init_app(app, db)

    # 注册 blueprint
    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app

from app import models