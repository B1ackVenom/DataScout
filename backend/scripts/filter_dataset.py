from sqlalchemy import text
from app.db.database import SessionLocal


def filter_data():
    db = SessionLocal()

    print("Creating filtered dataset...")

    db.execute(text("DROP TABLE IF EXISTS filtered_events"))

    query = """
    CREATE TABLE filtered_events AS
    SELECT e.*
    FROM events e
    JOIN matches m ON e.match_id = m.id
    WHERE 
        (
            m.competition ILIKE '%La Liga%'
            OR m.competition ILIKE '%Premier League%'
            OR m.competition ILIKE '%Indian Super League%'
            OR m.competition ILIKE '%Champions League%'
        )
        AND m.season ILIKE '%2023%'
    """

    db.execute(text(query))
    db.commit()

    print("✅ Filtered dataset created")

    db.close()


if __name__ == "__main__":
    filter_data()