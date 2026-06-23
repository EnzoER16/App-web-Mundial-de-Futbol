import datetime
from controllers.base_controller import BaseController
from models.match import Match
from models.team import Team
from models.stadium import Stadium
from models.referee import Referee
from models.goal import Goal
from config.db import db

class ValidationError(Exception):
    pass

class MatchController(BaseController):
    model = Match
    id_field = "id_match"

    REQUIRED_FIELDS = ["date", "time", "round", "id_stadium", "id_referee", "id_home_team", "id_away_team",]

    VALID_ROUNDS = ["Fase de Grupos", "Octavos de Final", "Cuartos de Final", "Semifinal", "Final"]

    def _apply_filters(self, query, filters):
        round_filter = filters.get("round")
        if round_filter:
            query = query.filter(Match.round == round_filter)

        state_filter = filters.get("state")
        if state_filter:
            query = query.filter(Match.state == state_filter)

        team_filter = filters.get("id_team")
        if team_filter:
            query = query.filter((Match.id_home_team == team_filter) | (Match.id_away_team == team_filter))
        return query

    def create(self, data):
        self._validate_payload(data)
        parsed = self._parse_payload(data)

        match = Match(
            date=parsed["date"],
            time=parsed["time"],
            goals_home_team=parsed["goals_home_team"],
            goals_away_team=parsed["goals_away_team"],
            round=parsed["round"],
            id_stadium=parsed["id_stadium"],
            id_referee=parsed["id_referee"],
            id_home_team=parsed["id_home_team"],
            id_away_team=parsed["id_away_team"],
            state=parsed["state"])
        self._save(match)

        if "goals" in data:
            self._replace_goals(match, data["goals"], parsed["id_home_team"], parsed["id_away_team"])

        return match.to_json()

    def update(self, record_id, data):
        match = self.model.query.get(record_id)
        if not match:
            return None

        if "id_home_team" in data or "id_away_team" in data:
            home = data.get("id_home_team", match.id_home_team)
            away = data.get("id_away_team", match.id_away_team)
            if home == away:
                raise ValidationError("El equipo local y visitante no pueden ser el mismo")
            self._assert_team_exists(home)
            self._assert_team_exists(away)
            match.id_home_team = home
            match.id_away_team = away

        if "id_stadium" in data:
            self._assert_exists(Stadium, data["id_stadium"], "Estadio")
            match.id_stadium = data["id_stadium"]

        if "id_referee" in data:
            self._assert_exists(Referee, data["id_referee"], "Árbitro")
            match.id_referee = data["id_referee"]

        if "round" in data:
            if data["round"] not in self.VALID_ROUNDS:
                raise ValidationError(f"Ronda inválida. Opciones: {', '.join(self.VALID_ROUNDS)}")
            match.round = data["round"]

        if "date" in data:
            match.date = self._parse_date(data["date"])

        if "time" in data:
            match.time = self._parse_time(data["time"])

        if "state" in data:
            if data["state"] not in ("Por jugarse", "Terminado"):
                raise ValidationError("Estado inválido. Opciones: 'Por jugarse', 'Terminado'")
            match.state = data["state"]

        if "goals_home_team" in data:
            match.goals_home_team = self._parse_goals(data["goals_home_team"])

        if "goals_away_team" in data:
            match.goals_away_team = self._parse_goals(data["goals_away_team"])

        self._save(match)

        if "goals" in data:
            self._replace_goals(match, data["goals"], match.id_home_team, match.id_away_team)

        return match.to_json()

    def _replace_goals(self, match, goals_data, id_home_team, id_away_team):
        if not isinstance(goals_data, list):
            raise ValidationError("'goals' debe ser una lista de goles")

        valid_team_ids = {id_home_team, id_away_team}
        new_goals = []
        for item in goals_data:
            if not isinstance(item, dict):
                raise ValidationError("Cada gol debe ser un objeto con player_name, minute e id_team")

            player_name = (item.get("player_name") or "").strip()
            if not player_name:
                raise ValidationError("Cada gol necesita el nombre del jugador")

            try:
                minute = int(item.get("minute"))
            except (TypeError, ValueError):
                raise ValidationError(f"Minuto inválido para el gol de {player_name}")
            if minute < 1 or minute > 130:
                raise ValidationError(f"Minuto fuera de rango para el gol de {player_name}")

            id_team = item.get("id_team")
            if id_team not in valid_team_ids:
                raise ValidationError(
                    f"El gol de {player_name} debe pertenecer al equipo local o visitante de este partido"
                )

            new_goals.append(Goal(player_name=player_name, minute=minute, id_match=match.id_match, id_team=id_team))

        match.goals = new_goals
        db.session.commit()

    def _validate_payload(self, data):
        missing = [f for f in self.REQUIRED_FIELDS if f not in data or data[f] in (None, "")]
        if missing:
            raise ValidationError(f"Faltan campos obligatorios: {', '.join(missing)}")

        if data["round"] not in self.VALID_ROUNDS:
            raise ValidationError(f"Ronda inválida. Opciones: {', '.join(self.VALID_ROUNDS)}")

        if data["id_home_team"] == data["id_away_team"]:
            raise ValidationError("El equipo local y visitante no pueden ser el mismo")

        self._assert_team_exists(data["id_home_team"])
        self._assert_team_exists(data["id_away_team"])
        self._assert_exists(Stadium, data["id_stadium"], "Estadio")
        self._assert_exists(Referee, data["id_referee"], "Árbitro")

    def _parse_payload(self, data):
        return {
            "date": self._parse_date(data["date"]),
            "time": self._parse_time(data["time"]),
            "round": data["round"],
            "state": data.get("state", "Por jugarse"),
            "goals_home_team": self._parse_goals(data.get("goals_home_team", 0)),
            "goals_away_team": self._parse_goals(data.get("goals_away_team", 0)),
            "id_stadium": data["id_stadium"],
            "id_referee": data["id_referee"],
            "id_home_team": data["id_home_team"],
            "id_away_team": data["id_away_team"]}

    @staticmethod
    def _parse_date(value):
        try:
            return datetime.datetime.strptime(value, "%Y-%m-%d").date()
        except (ValueError, TypeError):
            raise ValidationError("Formato de fecha inválido. Usar YYYY-MM-DD")

    @staticmethod
    def _parse_time(value):
        for fmt in ("%H:%M:%S", "%H:%M"):
            try:
                return datetime.datetime.strptime(value, fmt).time()
            except (ValueError, TypeError):
                continue
        raise ValidationError("Formato de hora inválido. Usar HH:MM o HH:MM:SS")

    @staticmethod
    def _parse_goals(value):
        try:
            goals = int(value)
        except (ValueError, TypeError):
            raise ValidationError("Los goles deben ser un número entero")
        if goals < 0:
            raise ValidationError("Los goles no pueden ser negativos")
        return goals

    @staticmethod
    def _assert_team_exists(id_team):
        if not Team.query.get(id_team):
            raise ValidationError(f"No existe un equipo con id_team={id_team}")

    @staticmethod
    def _assert_exists(model_class, record_id, label):
        if not model_class.query.get(record_id):
            raise ValidationError(f"No existe {label} con id={record_id}")