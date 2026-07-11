from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from backend.config import settings
import logging

logger = logging.getLogger(__name__)

engine = create_engine(settings.database_url, pool_pre_ping=True, echo=settings.debug)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db_session() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Ensure TimescaleDB extension and create base hypertable"""
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS timescaledb;"))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS resources (
                ts TIMESTAMPTZ NOT NULL,
                resource_type TEXT NOT NULL,
                source_id TEXT,
                value DOUBLE PRECISION,
                metadata JSONB,
                PRIMARY KEY (ts, source_id)
            );
        """))
        conn.execute(text("""
            SELECT create_hypertable('resources', 'ts', if_not_exists => TRUE);
        """))
        conn.commit()
        logger.info("Database initialized")
