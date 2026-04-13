from fastapi import APIRouter
from backend.app.db.database import get_connection
import pandas as pd

router = APIRouter()

@router.get("/players/search")
def search_players(name: str):
    conn = get_connection()

    query = f"""
    SELECT DISTINCT player_name, role
    FROM player_percentiles
    WHERE player_name ILIKE '%{name}%'
    ORDER BY player_name
    LIMIT 10;
    """

    df = pd.read_sql(query, conn)
    conn.close()

    return df.to_dict(orient="records")