from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models.team import Team
from models.stadium import Stadium
from models.referee import Referee

catalog_bp = Blueprint("catalog", __name__, url_prefix="/api")

@catalog_bp.route("/teams", methods=["GET"])
@jwt_required()
def get_teams():
    teams = Team.query.all()
    return jsonify([t.to_json() for t in teams]), 200

@catalog_bp.route("/stadiums", methods=["GET"])
@jwt_required()
def get_stadiums():
    stadiums = Stadium.query.all()
    return jsonify([s.to_json() for s in stadiums]), 200

@catalog_bp.route("/referees", methods=["GET"])
@jwt_required()
def get_referees():
    referees = Referee.query.all()
    return jsonify([r.to_json() for r in referees]), 200