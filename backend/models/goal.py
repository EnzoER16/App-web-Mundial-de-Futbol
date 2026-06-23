from config.db import db
import uuid

class Goal(db.Model):
    __tablename__ = "goals"

    id_goal = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    player_name = db.Column(db.String(120), nullable=False)
    minute = db.Column(db.Integer, nullable=False)
    id_match = db.Column(db.String(36), db.ForeignKey("matches.id_match"), nullable=False)
    id_team = db.Column(db.String(36), db.ForeignKey("teams.id_team"), nullable=False)

    team = db.relationship("Team")

    def __init__(self, player_name, minute, id_match, id_team):
        self.player_name = player_name
        self.minute = minute
        self.id_match = id_match
        self.id_team = id_team

    def to_json(self):
        return {
            "id_goal": self.id_goal,
            "player_name": self.player_name,
            "minute": self.minute,
            "id_match": self.id_match,
            "id_team": self.id_team,}