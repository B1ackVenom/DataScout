import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.services.radar_service import get_radar_data
from backend.app.db.database import engine, Base
import pandas as pd
import psycopg2
from sqlalchemy import create_engine
from urllib.parse import urlparse

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

# ✅ Get DATABASE_URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:1234@localhost:5432/football_db")

def get_db_connection():
    """Create a database connection from DATABASE_URL"""
    parsed = urlparse(DATABASE_URL)
    return psycopg2.connect(
        dbname=parsed.path[1:],  # Remove leading slash
        user=parsed.username,
        password=parsed.password,
        host=parsed.hostname,
        port=parsed.port or 5432
    )

@app.get("/")
def root():
    return {"message": "API running 🚀"}


# 🔥 🔍 SEARCH (FIXED — IMPORTANT CHANGE HERE)
@app.get("/player/search")
def search_players(query: str):
    try:
        conn = get_db_connection()
        
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
    
    except Exception as e:
        print("ERROR in search:", e)
        return []


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
        print("ERROR in radar:", e)
        return []
