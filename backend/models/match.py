from config.db import db
from sqlalchemy import Enum
import uuid, datetime

class Match(db.Model):
    __tablename__ = "matches"

    id_match = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    date = db.Column(db.Date, default=datetime.date.today, nullable=False)
    time = db.Column(db.Time, nullable=False)
    state = db.Column(Enum("Por jugarse", "Terminado", name="match_state"), nullable=False, default="Por jugarse")
    goals_home_team = db.Column(db.Integer, nullable=False)
    goals_away_team = db.Column(db.Integer, nullable=False)
    round = db.Column(db.String(20), nullable=False)
    id_stadium = db.Column(db.String(36), db.ForeignKey("stadiums.id_stadium"), nullable=False)
    id_referee = db.Column(db.String(36), db.ForeignKey("referees.id_referee"), nullable=False)
    id_home_team = db.Column(db.String(36), db.ForeignKey("teams.id_team"), nullable=False)
    id_away_team = db.Column(db.String(36), db.ForeignKey("teams.id_team"), nullable=False)

    stadium = db.relationship("Stadium")
    referee = db.relationship("Referee")
    home_team = db.relationship("Team", foreign_keys=[id_home_team])
    away_team = db.relationship("Team", foreign_keys=[id_away_team])
    goals = db.relationship("Goal", backref="match", cascade="all, delete-orphan", order_by="Goal.minute")

    def __init__(self, date, time, goals_home_team, goals_away_team, round, id_stadium, id_referee, id_home_team, id_away_team, state="Por jugarse"):
        self.date = date
        self.time = time
        self.goals_home_team = goals_home_team
        self.goals_away_team = goals_away_team
        self.round = round
        self.state = state
        self.id_stadium = id_stadium
        self.id_referee = id_referee
        self.id_home_team = id_home_team
        self.id_away_team = id_away_team

    def to_json(self):
        return {
            "id_match": self.id_match,
            "date": self.date.strftime('%Y-%m-%d') if self.date else None,
            "time": self.time.strftime('%H:%M:%S') if self.time else None,
            "state": self.state,
            "goals_home_team": self.goals_home_team,
            "goals_away_team": self.goals_away_team,
            "round": self.round,
            "id_stadium": self.id_stadium,
            "id_referee": self.id_referee,
            "id_home_team": self.id_home_team,
            "id_away_team": self.id_away_team,
            "goals": [g.to_json() for g in sorted(self.goals, key=lambda g: g.minute)]}