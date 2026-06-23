from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from controllers.auth_controller import AuthController
from controllers.match_controller import ValidationError
from models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")
auth_controller = AuthController()

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    try:
        new_user = auth_controller.register(data)
        return jsonify(new_user), 201
    except ValidationError as e:
        return jsonify({"message": str(e)}), 400

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    try:
        result = auth_controller.login(data)
    except ValidationError as e:
        return jsonify({"message": str(e)}), 400

    if result is None:
        return jsonify({"message": "Usuario o contraseña incorrectos"}), 401

    return jsonify(result), 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404
    return jsonify(user.to_json()), 200

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"message": "Sesión cerrada correctamente"}), 200