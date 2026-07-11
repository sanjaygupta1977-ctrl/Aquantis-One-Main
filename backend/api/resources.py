from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timedelta
from backend.db import get_db_session
from backend.models import Resource, ResourceStats

router = APIRouter()

@router.get("/resources", response_model=list[ResourceStats])
async def list_resources(db: Session = Depends(get_db_session)):
    """List all resources with latest KPIs"""
    query = """
    SELECT DISTINCT ON (source_id) 
        source_id, 
        resource_type, 
        value as latest_value, 
        ts as latest_ts,
        COUNT(*) OVER (PARTITION BY source_id) as count
    FROM resources
    ORDER BY source_id, ts DESC
    """
    results = db.execute(text(query)).fetchall()
    resources_list = []
    for row in results:
        resources_list.append(ResourceStats(
            source_id=row[0],
            resource_type=row[1],
            latest_value=row[2],
            latest_ts=row[3],
            count=row[4]
        ))
    return resources_list

@router.get("/resources/{source_id}/timeseries", response_model=list[Resource])
async def get_timeseries(
    source_id: str,
    days: int = Query(7, ge=1, le=365),
    db: Session = Depends(get_db_session)
):
    """Get time-series data for a resource"""
    start_time = datetime.utcnow() - timedelta(days=days)
    query = """
    SELECT source_id, resource_type, value, ts, metadata
    FROM resources
    WHERE source_id = :source_id AND ts >= :start_time
    ORDER BY ts DESC
    LIMIT 10000
    """
    results = db.execute(text(query), {"source_id": source_id, "start_time": start_time}).fetchall()
    resources_list = [
        Resource(source_id=r[0], resource_type=r[1], value=r[2], ts=r[3], metadata=r[4])
        for r in results
    ]
    return resources_list

@router.get("/resources/{source_id}/anomalies")
async def get_anomalies(
    source_id: str,
    days: int = Query(7, ge=1, le=365),
    threshold: float = Query(2.0, ge=1.0, le=5.0),
    db: Session = Depends(get_db_session)
):
    """Detect anomalies using rolling mean & std dev"""
    start_time = datetime.utcnow() - timedelta(days=days)
    query = """
    WITH stats AS (
        SELECT 
            AVG(value) OVER (ORDER BY ts ROWS BETWEEN 14 PRECEDING AND CURRENT ROW) as rolling_mean,
            STDDEV(value) OVER (ORDER BY ts ROWS BETWEEN 14 PRECEDING AND CURRENT ROW) as rolling_std,
            value,
            ts,
            source_id
        FROM resources
        WHERE source_id = :source_id AND ts >= :start_time
    )
    SELECT ts, value, rolling_mean, rolling_std, source_id
    FROM stats
    WHERE rolling_std IS NOT NULL 
      AND ABS(value - rolling_mean) > :threshold * rolling_std
    ORDER BY ts DESC
    """
    results = db.execute(text(query), {
        "source_id": source_id,
        "start_time": start_time,
        "threshold": threshold
    }).fetchall()
    
    anomalies = []
    for row in results:
        deviation = abs(row[1] - row[2]) / row[3] if row[3] > 0 else 0
        anomalies.append({
            "ts": row[0],
            "value": row[1],
            "expected": row[2],
            "deviation": round(deviation, 2),
            "severity": "high" if deviation > 3 else "medium"
        })
    return anomalies

@router.get("/resources/{source_id}/forecast")
async def forecast_resource(
    source_id: str,
    days: int = Query(30, ge=7, le=90),
    db: Session = Depends(get_db_session)
):
    """Forecast resource usage (stub - requires Prophet integration)"""
    return {
        "source_id": source_id,
        "forecast_days": days,
        "status": "coming_soon",
        "note": "Prophet integration needed"
    }
