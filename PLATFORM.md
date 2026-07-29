# Resource Intelligence Platform

Real-time monitoring, anomaly detection, and forecasting for water & energy resources.

## Architecture

```
┌────────────────┐        ┌──────────────────┐         ┌─────────────┐
│   React SPA    │───────▶│  FastAPI Backend │◀───────▶│  Timescale  │
│   (Dashboard)  │        │   (REST API)     │         │  + Postgres │
└────────────────┘        └──────────────────┘         └─────────────┘
                                  │
                                  ▼
                          ┌──────────────────┐
                          │  ML Modules      │
                          │  (Prophet,       │
                          │   Anomaly Det.)  │
                          └──────────────────┘
```

### Components
1. **backend/** - FastAPI REST API, data models, DB access
2. **frontend/** - React SPA (dashboards, real-time charts, alerts)
3. **analytics/** - Python ML modules (forecasting, anomaly detection)
4. **etl/** - CSV ingestion & ETL pipeline
5. **docker-compose.yml** - Postgres/Timescale, backend, frontend, optional monitoring

## Quick Start

```bash
# 1. Install dependencies
pip install -r backend/requirements.txt
cd frontend && npm install && cd ..

# 2. Start services
docker-compose up -d

# 3. Run migrations & seed data
python backend/db/migrate.py

# 4. Start backend (separate terminal)
uvicorn backend.main:app --reload --port 8000

# 5. Start frontend (separate terminal)
cd frontend && npm run dev

# 6. Access dashboard at http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/resources | List all resources & latest KPIs |
| GET | /api/v1/resources/{id}/timeseries | Time-series data (JSON or CSV) |
| GET | /api/v1/resources/{id}/anomalies | Detected anomalies in range |
| GET | /api/v1/resources/{id}/forecast | 30-day forecast using Prophet |
| POST | /api/v1/admin/ingest | Trigger CSV ingest job |

## Development

- **Backend**: `uvicorn backend.main:app --reload --port 8000`
- **Frontend**: `cd frontend && npm run dev`
- **Analytics**: Use Jupyter notebooks in `notebooks/` for experimentation
- **Tests**: `pytest backend/tests` and `npm run test` (frontend)

## Deployment

See `DEPLOYMENT.md` for AWS/Docker production guidelines.

## Todo
- [ ] Complete backend API (resource CRUD, timeseries queries)
- [ ] Implement anomaly detection (Prophet + statistical methods)
- [ ] Build React dashboard (KPIs, charts, alerts)
- [ ] Add authentication & role-based access
- [ ] Integrate real-time data ingestion (MQTT/Kafka future enhancement)
- [ ] Set up CI/CD (GitHub Actions)
- [ ] Add monitoring & logging (ELK/Datadog)
