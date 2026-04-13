import json
import os

from app.db.database import SessionLocal, create_tables
from app.models.models import Player, Team, Match, Event

DATA_PATH = "data/raw/open-data/data/events"


def get_or_create_player(db, name):
    player = db.query(Player).filter_by(name=name).first()
    if not player:
        player = Player(name=name)
        db.add(player)
        db.commit()
        db.refresh(player)
    return player


def get_or_create_team(db, name):
    team = db.query(Team).filter_by(name=name).first()
    if not team:
        team = Team(name=name)
        db.add(team)
        db.commit()
        db.refresh(team)
    return team


def load_data():
    db = SessionLocal()

    for file in os.listdir(DATA_PATH):
        if not file.endswith(".json"):
            continue

        match_id = int(file.replace(".json", ""))

        # ✅ FIX: Ensure match exists FIRST
        match = db.query(Match).filter_by(id=match_id).first()
        if not match:
            match = Match(
                id=match_id,
                competition="Unknown",
                season="Unknown"
            )
            db.add(match)
            db.commit()  # 🔥 IMPORTANT

        with open(os.path.join(DATA_PATH, file)) as f:
            events = json.load(f)

        for e in events:

            if "player" not in e or "team" not in e:
                continue

            player = get_or_create_player(db, e["player"]["name"])
            team = get_or_create_team(db, e["team"]["name"])

            location = e.get("location", [None, None])

            event = Event(
                match_id=match_id,
                player_id=player.id,
                team_id=team.id,
                type=e["type"]["name"],
                minute=e.get("minute", 0),
                location_x=location[0],
                location_y=location[1]
            )

            db.add(event)

        # ✅ commit once per match (efficient)
        db.commit()

    db.close()


if __name__ == "__main__":
    print("Creating tables...")
    create_tables()

    print("Loading StatsBomb data...")
    load_data()

    print("✅ Data loaded successfully 🚀")