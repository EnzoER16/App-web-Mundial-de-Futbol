import datetime, json
from app import app
from config.db import db
from models.user import User
from models.team import Team
from models.stadium import Stadium
from models.referee import Referee
from models.match import Match
from models.goal import Goal

with app.app_context():
    db.create_all()

    if not User.query.filter_by(username="admin").first():
        db.session.add(User(username="admin", email="admin@mundial.com", password="admin123", role="Admin"))
    if not User.query.filter_by(username="user").first():
        db.session.add(User(username="user", email="user@mundial.com", password="user123", role="User"))

    teams_data = [
        ("Argentina", "CONMEBOL"),
        ("Brasil", "CONMEBOL"),
        ("Uruguay", "CONMEBOL"),
        ("Colombia", "CONMEBOL"),
        ("Ecuador", "CONMEBOL"),
        ("Paraguay", "CONMEBOL"),
        ("Estados Unidos", "CONCACAF"),
        ("México", "CONCACAF"),
        ("Canadá", "CONCACAF"),
        ("Panamá", "CONCACAF"),
        ("Curazao", "CONCACAF"),
        ("Haití", "CONCACAF"),
        ("Inglaterra", "UEFA"),
        ("Francia", "UEFA"),
        ("Alemania", "UEFA"),
        ("España", "UEFA"),
        ("Portugal", "UEFA"),
        ("Países Bajos", "UEFA"),
        ("Bélgica", "UEFA"),
        ("Suiza", "UEFA"),
        ("Austria", "UEFA"),
        ("Suecia", "UEFA"),
        ("República Checa", "UEFA"),
        ("Bosnia y Herzegovina", "UEFA"),
        ("Turquía", "UEFA"),
        ("Escocia", "UEFA"),
        ("Noruega", "UEFA"),
        ("Dinamarca", "UEFA"),
        ("Marruecos", "CAF"),
        ("Egipto", "CAF"),
        ("Senegal", "CAF"),
        ("Costa de Marfil", "CAF"),
        ("Argelia", "CAF"),
        ("Túnez", "CAF"),
        ("Ghana", "CAF"),
        ("Sudáfrica", "CAF"),
        ("Cabo Verde", "CAF"),
        ("República Democrática del Congo", "CAF"),
        ("Japón", "AFC"),
        ("Corea del Sur", "AFC"),
        ("Irán", "AFC"),
        ("Australia", "AFC"),
        ("Arabia Saudita", "AFC"),
        ("Qatar", "AFC"),
        ("Uzbekistán", "AFC"),
        ("Jordania", "AFC"),
        ("Irak", "AFC"),
        ("Nueva Zelanda", "OFC")]
    
    teams = {}
    for name, conf in teams_data:
        existing = Team.query.filter_by(name=name).first()
        if not existing:
            t = Team(name=name, confederation=conf)
            db.session.add(t)
            db.session.flush()
            teams[name] = t
        else:
            teams[name] = existing

    stadiums_data = [
        ("Estadio Ciudad de México (Azteca)", "Ciudad de México", 83000),
        ("Estadio Guadalajara (Akron)", "Guadalajara", 48071),
        ("Estadio Monterrey (BBVA)", "Monterrey", 53500),
        ("AT&T Stadium", "Dallas / Arlington", 92967),
        ("MetLife Stadium", "Nueva York / Nueva Jersey", 82500),
        ("GEHA Field at Arrowhead Stadium", "Kansas City", 76640),
        ("Mercedes-Benz Stadium", "Atlanta", 75000),
        ("NRG Stadium", "Houston", 72220),
        ("Lumen Field", "Seattle", 72000),
        ("Levi's Stadium", "San Francisco / Bay Area", 70900),
        ("SoFi Stadium", "Los Ángeles", 70240),
        ("Gillette Stadium", "Boston / Foxborough", 70000),
        ("Lincoln Financial Field", "Filadelfia", 69320),
        ("Hard Rock Stadium", "Miami", 65000),
        ("BC Place", "Vancouver", 54500),
        ("BMO Field", "Toronto", 45730)]
    
    stadiums = {}
    for name, city, cap in stadiums_data:
        existing = Stadium.query.filter_by(name=name).first()
        if not existing:
            s = Stadium(name=name, city=city, capacity=cap)
            db.session.add(s)
            db.session.flush()
            stadiums[name] = s
        else:
            stadiums[name] = existing

    referees_data = [
        ("César Ramos", "México"),
        ("Katia García", "México"),
        ("Facundo Tello", "Argentina"),
        ("Darío Herrera", "Argentina"),
        ("Raphael Claus", "Brasil"),
        ("Wilton Sampaio", "Brasil"),
        ("Jesús Valenzuela", "Venezuela"),
        ("Stéphanie Frappart", "Francia"),
        ("François Letexier", "Francia"),
        ("Szymon Marciniak", "Polonia"),
        ("Michael Oliver", "Inglaterra"),
        ("Anthony Taylor", "Inglaterra"),
        ("Danny Makkelie", "Países Bajos"),
        ("Maurizio Mariani", "Italia"),
        ("Campbell-Kirk Kawana-Waugh", "Nueva Zelanda")]

    referees = {}
    for name, nat in referees_data:
        existing = Referee.query.filter_by(name=name).first()
        if not existing:
            r = Referee(name=name, nationality=nat)
            db.session.add(r)
            db.session.flush()
            referees[name] = r
        else:
            referees[name] = existing

    db.session.commit()

    if Match.query.count() == 0:
        try:
            with open('matches.json', 'r', encoding='utf-8') as file:
                matches_data = json.load(file)
        except FileNotFoundError:
            matches_data = []

        for m_data in matches_data:
            match_date = datetime.datetime.strptime(m_data["date"], "%Y-%m-%d").date()
            match_time = datetime.datetime.strptime(m_data["time"], "%H:%M").time()

            match = Match(
                date=match_date,
                time=match_time,
                goals_home_team=m_data["home_goals"],
                goals_away_team=m_data["away_goals"],
                round=m_data["round"],
                id_stadium=stadiums[m_data["stadium"]].id_stadium,
                id_referee=referees[m_data["referee"]].id_referee,
                id_home_team=teams[m_data["home_team"]].id_team,
                id_away_team=teams[m_data["away_team"]].id_team,
                state=m_data["state"])
            db.session.add(match)
            db.session.flush()

            for goal in m_data.get("goals", []):
                new_goal = Goal(
                    player_name=goal["player"],
                    minute=goal["minute"],
                    id_match=match.id_match,
                    id_team=teams[goal["team"]].id_team)
                db.session.add(new_goal)

        db.session.commit()

    print("Base de datos inicializada")
    print("Usuarios demo -> admin/admin123 (Admin) | user/user123 (User)")