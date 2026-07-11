from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class Resource(BaseModel):
    source_id: str
    resource_type: str
    value: float
    ts: datetime
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class ResourceStats(BaseModel):
    source_id: str
    resource_type: str
    latest_value: float
    latest_ts: datetime
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    avg_value: Optional[float] = None
    count: int

class Anomaly(BaseModel):
    source_id: str
    ts: datetime
    value: float
    expected: float
    deviation: float
    severity: str

class Forecast(BaseModel):
    source_id: str
    ds: datetime
    yhat: float
    yhat_lower: Optional[float] = None
    yhat_upper: Optional[float] = None

class IngestJob(BaseModel):
    status: str
    rows_ingested: int
    errors: int
