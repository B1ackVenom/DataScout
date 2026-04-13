from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import psycopg2

# ✅ Your actual DB credentials
DATABASE_URL = "postgresql://shreyas:1234@localhost:5432/football_db"

# 🔥 SQLAlchemy Engine
engine = create_engine(DATABASE_URL)

# 🔥 Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 🔥 Base for ORM models
Base = declarative_base()


# 🔥 Create tables
def create_tables():
    from backend.app.models import models   # FIXED import path
    Base.metadata.create_all(bind=engine)


# 🔥 Raw connection (used for pandas)
def get_connection():
    return psycopg2.connect(
        dbname="football_db",
        user="shreyas",      # ✅ FIXED
        password="alan",     # ✅ FIXED
        host="localhost",
        port="5432"
    )