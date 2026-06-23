from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config.settings import Config
from config.db import db
from utils.error_handlers import register_error_handlers

from models import user, team, stadium, referee, match, goal
from routes.auth_routes import auth_bp
from routes.match_routes import match_bp
from routes.catalog_routes import catalog_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
JWTManager(app)
CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

app.register_blueprint(auth_bp)
app.register_blueprint(match_bp)
app.register_blueprint(catalog_bp)

register_error_handlers(app)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)