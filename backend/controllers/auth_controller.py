from flask_jwt_extended import create_access_token
from config.db import db
from models.user import User
from controllers.match_controller import ValidationError

class AuthController:
    def register(self, data):
        username = (data.get("username") or "").strip()
        email = (data.get("email") or "").strip()
        password = data.get("password") or ""
        role = data.get("role", "User")

        if not username or not email or not password:
            raise ValidationError("username, email y password son obligatorios")

        if role not in ("Admin", "User"):
            role = "User"

        if User.query.filter_by(username=username).first():
            raise ValidationError("Ese nombre de usuario ya está en uso")

        if User.query.filter_by(email=email).first():
            raise ValidationError("Ese email ya está registrado")

        user = User(username=username, email=email, password=password, role=role)
        db.session.add(user)
        db.session.commit()
        return user.to_json()

    def login(self, data):
        username = (data.get("username") or "").strip()
        password = data.get("password") or ""

        if not username or not password:
            raise ValidationError("username y password son obligatorios")

        user = User.query.filter_by(username=username).first()
        if not user or not user.check_password(password):
            return None

        access_token = create_access_token(
            identity=user.id_user,
            additional_claims={"role": user.role, "username": user.username})
        return {"token": access_token, "user": user.to_json()}