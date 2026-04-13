import asyncio
import pandas as pd
from understat import Understat
import aiohttp

from app.db.database import SessionLocal
from sqlalchemy import text


LEAGUES = ["EPL", "La_liga"]
SEASON = "2023"


async def fetch_understat_data():
    async with aiohttp.ClientSession() as session:
        understat = Understat(session)

        all_players = []

        for league in LEAGUES:
            print(f"Fetching {league}...")

            players = await understat.get_league_players(
                league_name=league,
                season=SEASON
            )

            df = pd.DataFrame(players)
            df["league"] = league

            all_players.append(df)

        return pd.concat(all_players, ignore_index=True)


def save_to_db(df):
    db = SessionLocal()

    print("Creating understat_players table...")

    db.execute(text("""
        DROP TABLE IF EXISTS understat_players;

        CREATE TABLE understat_players (
            id SERIAL PRIMARY KEY,
            player_name TEXT,
            team TEXT,
            league TEXT,
            games INTEGER,
            goals INTEGER,
            assists INTEGER,
            xg FLOAT,
            xa FLOAT,
            minutes INTEGER
        );
    """))

    db.commit()

    print("Inserting data...")

    for _, row in df.iterrows():
        db.execute(text("""
            INSERT INTO understat_players
            (player_name, team, league, games, goals, assists, xg, xa, minutes)
            VALUES
            (:player_name, :team, :league, :games, :goals, :assists, :xg, :xa, :minutes)
        """), {
            "player_name": row["player_name"],
            "team": row["team_title"],
            "league": row["league"],
            "games": int(row["games"]),
            "goals": int(row["goals"]),
            "assists": int(row["assists"]),
            "xg": float(row["xG"]),
            "xa": float(row["xA"]),
            "minutes": int(row["time"])
        })

    db.commit()
    db.close()

    print("✅ Understat data loaded")


if __name__ == "__main__":
    df = asyncio.run(fetch_understat_data())
    save_to_db(df)