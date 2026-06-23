from config.db import db
import uuid

class Stadium(db.Model):
    __tablename__ = "stadiums"

    id_stadium = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(120), nullable=False)
    city = db.Column(db.String(80), nullable=False)
    capacity = db.Column(db.Integer, nullable=True)

    def __init__(self, name, city, capacity=None):
        self.name = name
        self.city = city
        self.capacity = capacity

    def to_json(self):
        return {
            "id_stadium": self.id_stadium,
            "name": self.name,
            "city": self.city,
            "capacity": self.capacity}