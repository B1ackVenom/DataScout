import time
from sqlalchemy import text
from app.db.database import SessionLocal


def get_counts(db):
    events = db.execute(text("SELECT COUNT(*) FROM events")).scalar()
    players = db.execute(text("SELECT COUNT(*) FROM players")).scalar()
    teams = db.execute(text("SELECT COUNT(*) FROM teams")).scalar()

    return events, players, teams


def monitor():
    db = SessionLocal()

    print("📊 Monitoring database... (Ctrl+C to stop)\n")

    while True:
        try:
            events, players, teams = get_counts(db)

            print(f"\rEvents: {events} | Players: {players} | Teams: {teams}", end="")

            time.sleep(2)

        except KeyboardInterrupt:
            print("\nStopped monitoring.")
            break

    db.close()


if __name__ == "__main__":
    monitor()
