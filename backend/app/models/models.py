from sqlalchemy import Column, Integer, String, ForeignKey, Float
from app.db.database import Base


# 👤 Player Table
class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)


# 🏟️ Team Table
class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)


# ⚽ Match Table
class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    competition = Column(String)
    season = Column(String)


# 📊 Event Table (MOST IMPORTANT)
class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)

    match_id = Column(Integer, ForeignKey("matches.id"))
    player_id = Column(Integer, ForeignKey("players.id"))
    team_id = Column(Integer, ForeignKey("teams.id"))

    type = Column(String)
    minute = Column(Integer)

    location_x = Column(Float)
    location_y = Column(Float)