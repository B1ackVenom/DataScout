import json
import os

from app.db.database import SessionLocal
from app.models.models import Match

MATCHES_PATH = "data/raw/open-data/data/matches"


def load_matches():
    db = SessionLocal()

    for comp_id in os.listdir(MATCHES_PATH):
        comp_path = os.path.join(MATCHES_PATH, comp_id)

        for season_file in os.listdir(comp_path):
            season_path = os.path.join(comp_path, season_file)

            with open(season_path) as f:
                matches = json.load(f)

            for m in matches:
                match_id = m["match_id"]

                competition = m["competition"]["competition_name"]
                season = m["season"]["season_name"]

                existing = db.query(Match).filter_by(id=match_id).first()

                if existing:
                    existing.competition = competition
                    existing.season = season
                else:
                    new_match = Match(
                        id=match_id,
                        competition=competition,
                        season=season
                    )
                    db.add(new_match)

            db.commit()

    db.close()
    print("✅ Match metadata loaded")


if __name__ == "__main__":
    load_matches()