import requests
from bs4 import BeautifulSoup
import time

from app.db.database import SessionLocal
from sqlalchemy import text


BASE_URL = "https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?query="

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}


def get_player_profile(name):
    try:
        search_url = BASE_URL + name.replace(" ", "+")
        res = requests.get(search_url, headers=HEADERS, timeout=10)

        soup = BeautifulSoup(res.text, "html.parser")

        # Find first player result
        link = soup.select_one("td.hauptlink a")

        if not link:
            return None

        player_url = "https://www.transfermarkt.com" + link["href"]

        res = requests.get(player_url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(res.text, "html.parser")

        # NATIONALITY
        nat_tag = soup.select_one("span[itemprop='nationality']")
        nationality = nat_tag.text.strip() if nat_tag else None

        # POSITION (SAFE SELECTOR)
        position_tag = soup.select_one(".detail-position")
        position = position_tag.text.strip() if position_tag else None

        return {
            "position": position,
            "nationality": nationality
        }

    except Exception as e:
        print(f"❌ Error fetching {name}: {e}")
        return None


def main():
    db = SessionLocal()

    players = db.execute(text("""
        SELECT DISTINCT player_name 
        FROM master_players_filtered
    """)).fetchall()

    print(f"Total players: {len(players)}")

    for i, player in enumerate(players):
        name = player[0]

        print(f"[{i+1}/{len(players)}] Fetching {name}...")

        profile = get_player_profile(name)

        if profile:
            db.execute(text("""
                INSERT INTO player_profiles (player_name, position, nationality)
                VALUES (:name, :position, :nationality)
                ON CONFLICT (player_name) DO NOTHING
            """), {
                "name": name,
                "position": profile["position"],
                "nationality": profile["nationality"]
            })

            db.commit()

        time.sleep(1.5)  # safe delay

    db.close()
    print("✅ Player profiles loaded")


if __name__ == "__main__":
    main()