from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from controllers.match_controller import MatchController, ValidationError
from utils.decorators import role_required

match_bp = Blueprint("matches", __name__, url_prefix="/api/matches")
match_controller = MatchController()

@match_bp.route("", methods=["GET"])
@jwt_required()
def get_matches():
    filters = {
        "round": request.args.get("round"),
        "state": request.args.get("state"),
        "id_team": request.args.get("id_team")}
    filters = {k: v for k, v in filters.items() if v}
    matches = match_controller.get_all(filters)
    return jsonify(matches), 200

@match_bp.route("/<string:id_match>", methods=["GET"])
@jwt_required()
def get_match(id_match):
    match = match_controller.get_by_id(id_match)
    if not match:
        return jsonify({"message": "Partido no encontrado"}), 404
    return jsonify(match), 200

@match_bp.route("", methods=["POST"])
@role_required("Admin")
def create_match():
    data = request.get_json(silent=True) or {}
    try:
        new_match = match_controller.create(data)
        return jsonify(new_match), 201
    except ValidationError as e:
        return jsonify({"message": str(e)}), 400

@match_bp.route("/<string:id_match>", methods=["PUT"])
@role_required("Admin")
def update_match(id_match):
    data = request.get_json(silent=True) or {}
    try:
        updated = match_controller.update(id_match, data)
    except ValidationError as e:
        return jsonify({"message": str(e)}), 400

    if updated is None:
        return jsonify({"message": "Partido no encontrado"}), 404
    return jsonify(updated), 200

@match_bp.route("/<string:id_match>", methods=["DELETE"])
@role_required("Admin")
def delete_match(id_match):
    deleted = match_controller.delete(id_match)
    if not deleted:
        return jsonify({"message": "Partido no encontrado"}), 404
    return jsonify({"message": "Partido eliminado correctamente"}), 200