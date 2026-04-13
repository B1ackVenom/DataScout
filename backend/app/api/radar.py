from fastapi import APIRouter
from backend.app.services.radar_service import get_radar_data

router = APIRouter()

@router.get("/player/radar")
def get_player_radar(name: str):
    df = get_radar_data(name)
    return df.to_dict(orient="records")