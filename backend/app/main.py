from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.services.radar_service import get_radar_data
from backend.app.db.database import engine, Base
import pandas as pd
import psycopg2

app = FastAPI()

# ✅ CORS (frontend connection fix)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later change to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "API running 🚀"}


# 🔍 SEARCH PLAYERS (FIXED + SAFE)
@app.get("/player/search")
def search_players(query: str):
    conn = psycopg2.connect(
        dbname="football_db",
        user="shreyas",
        password="1234",
        host="localhost",
        port="5432"
    )

    # ✅ SAFE QUERY (NO string injection)
    q = """
    SELECT DISTINCT player_name
    FROM master_players_filtered
    WHERE LOWER(player_name) LIKE LOWER(%s)
    LIMIT 10;
    """

    df = pd.read_sql(q, conn, params=[f"%{query}%"])
    conn.close()

    # ✅ Return clean list
    return df["player_name"].tolist()


# 📊 RADAR DATA (FIXED NAN ISSUE)
@app.get("/player/radar")
def radar(name: str):
    df = get_radar_data(name)

    # ✅ Fix JSON crash (NaN issue)
    df = df.fillna(0)

    # ✅ Ensure no weird values
    df = df.replace([float("inf"), float("-inf")], 0)

    return df.to_dict(orient="records")