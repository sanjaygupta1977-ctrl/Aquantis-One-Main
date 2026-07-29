from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db import get_db_session
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/ingest")
async def trigger_ingest(db: Session = Depends(get_db_session)):
    """Trigger CSV ingest job (stub for background task integration)"""
    return {
        "status": "queued",
        "message": "Ingest job queued. Use Celery/RQ for background processing.",
        "note": "Background task integration coming soon"
    }

@router.get("/stats")
async def get_stats(db: Session = Depends(get_db_session)):
    """Get system stats and resource counts"""
    from sqlalchemy import text
    
    count = db.execute(text("SELECT COUNT(*) FROM resources")).scalar()
    sources = db.execute(text("SELECT COUNT(DISTINCT source_id) FROM resources")).scalar()
    
    return {
        "total_records": count,
        "total_sources": sources,
        "status": "ok"
    }
