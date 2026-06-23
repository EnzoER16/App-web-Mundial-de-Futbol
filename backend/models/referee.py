from config.db import db
import uuid

class Referee(db.Model):
    __tablename__ = "referees"

    id_referee = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(120), nullable=False)
    nationality = db.Column(db.String(80), nullable=True)

    def __init__(self, name, nationality=None):
        self.name = name
        self.nationality = nationality

    def to_json(self):
        return {
            "id_referee": self.id_referee,
            "name": self.name,
            "nationality": self.nationality}