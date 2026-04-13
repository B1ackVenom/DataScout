from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.services.radar_service import get_radar_data
from backend.app.db.database import engine, Base
import pandas as pd
import psycopg2

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "API running 🚀"}


# 🔥 🔍 SEARCH (FIXED — IMPORTANT CHANGE HERE)
@app.get("/player/search")
def search_players(query: str):
    conn = psycopg2.connect(
        dbname="football_db",
        user="shreyas",
        password="1234",
        host="localhost",
        port="5432"
    )

    q = """
    SELECT DISTINCT player_name
    FROM player_percentiles   -- 🔥 CHANGED FROM master_players_filtered
    WHERE LOWER(player_name) LIKE LOWER(%s)
    ORDER BY player_name
    LIMIT 10;
    """

    df = pd.read_sql(q, conn, params=[f"%{query}%"])
    conn.close()

    return df["player_name"].tolist()


# 📊 RADAR (UNCHANGED — YOUR ORIGINAL LOGIC)
@app.get("/player/radar")
def radar(name: str):
    try:
        df = get_radar_data(name)

        if df is None or len(df) == 0:
            return []

        df = pd.DataFrame(df)
        df = df.fillna(0)

        return df.to_dict(orient="records")

    except Exception as e:
        print("ERROR:", e)
        return []