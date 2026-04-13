from playwright.sync_api import sync_playwright
import pandas as pd
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.models import Player, PlayerStats

URL = "https://fbref.com/en/comps/Big5/stats/players/Big-5-European-Leagues-Stats"


def get_data():
    from playwright.sync_api import sync_playwright
    import time

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # 🔥 important change
        page = browser.new_page()

        page.goto(URL, timeout=60000)

        print("Waiting for Cloudflare check... 👀")
        time.sleep(10)  # 🔥 give time to pass challenge

        html = page.content()
        browser.close()

    df = pd.read_html(html)[0]

    df.columns = df.columns.droplevel(0)
    df = df[df["Player"] != "Player"]
    df = df.fillna(0)

    return df


def insert_data(df):
    db: Session = SessionLocal()

    for _, row in df.head(50).iterrows():

        existing_player = db.query(Player).filter_by(full_name=row["Player"]).first()
        if existing_player:
            continue

        player = Player(
            full_name=row["Player"],
            nationality=row["Nation"],
            position=row["Pos"]
        )

        db.add(player)
        db.commit()
        db.refresh(player)

        stats = PlayerStats(
            player_id=player.id,
            goals=float(row["Gls"]),
            assists=float(row["Ast"]),
            xg=float(row["xG"]),
            xa=float(row["xAG"]),
            minutes=int(row["Min"])
        )

        db.add(stats)
        db.commit()

    db.close()


if __name__ == "__main__":
    print("Fetching data from FBref (browser mode)...")
    df = get_data()

    print("Inserting into database...")
    insert_data(df)

    print("✅ Data inserted successfully 🚀")