from config.db import db
import uuid

class Team(db.Model):
    __tablename__ = "teams"

    id_team = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(80), nullable=False, unique=True)
    confederation = db.Column(db.String(50), nullable=True)

    def __init__(self, name, confederation=None):
        self.name = name
        self.confederation = confederation

    def to_json(self):
        return {
            "id_team": self.id_team,
            "name": self.name,
            "confederation": self.confederation}