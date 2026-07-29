# Resource Intelligence Platform

**A full-stack platform for monitoring, analyzing, and optimizing water & energy resource usage.**

## Features

### Core Capabilities
✅ **Real-time Monitoring** - Ingest and track water/energy metrics  
✅ **Anomaly Detection** - Multi-method detection (z-score, IQR, change-point)  
✅ **Forecasting** - 30-day predictions using Prophet  
✅ **KPI Dashboards** - Interactive React UI with live charts  
✅ **Historical Analysis** - Query and analyze time-series data  
✅ **REST API** - Comprehensive API for integration  

### Technology Stack
- **Backend**: FastAPI (Python), Postgres + TimescaleDB
- **Frontend**: React 18, Recharts, Axios
- **Analytics**: Pandas, Prophet, NumPy
- **Deployment**: Docker, Docker Compose, AWS-ready
- **Database**: TimescaleDB for efficient time-series storage

---

## Quick Start

### Option 1: Docker Compose (Recommended for Local Dev)

```bash
# Start all services
docker-compose up -d

# Ingest sample data
docker-compose exec backend python etl_ingest.py --dir data

# Access dashboard
# Frontend: http://localhost:5173
# API docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

```bash
# 1. Start PostgreSQL + TimescaleDB
docker run -d --name timescale \
  -e POSTGRES_USER=app \
  -e POSTGRES_PASSWORD=changeme \
  -p 5432:5432 \
  timescale/timescaledb:latest-pg14

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Start backend
export DATABASE_URL="postgresql://app:changeme@localhost:5432/resource_db"
uvicorn backend.main:app --reload --port 8000

# 4. Start frontend (separate terminal)
cd frontend && npm install && npm run dev

# 5. Ingest sample data
python etl_ingest.py --dir data
```

---

## Project Structure

```
.
├── backend/                 # FastAPI application
│   ├── main.py             # App entry point
│   ├── config.py           # Settings
│   ├── db.py               # Database connection
│   ├── models.py           # Pydantic models
│   └── api/                # Route handlers
│       ├── health.py       # Health check
│       ├── resources.py    # Resource endpoints
│       └── admin.py        # Admin operations
├── frontend/               # React SPA
│   ├── src/
│   │   ├── App.jsx        # Main component
│   │   ├── App.css        # Styles
│   │   └── main.jsx       # Entry point
│   └── package.json       # Dependencies
├── analytics/              # ML/Analytics modules
│   ├── forecast.py        # Prophet-based forecasting
│   ├── anomaly.py         # Anomaly detection algorithms
│   └── utils.py           # Helper functions
├── data/                   # Sample CSV data
├── docker-compose.yml      # Local dev setup
├── requirements.txt        # Python dependencies
├── PLATFORM.md            # Architecture overview
└── DEPLOYMENT.md          # Deployment guides
```

---

## API Endpoints

### Resources
- `GET /api/v1/resources` - List all resources with latest KPIs
- `GET /api/v1/resources/{id}/timeseries?days=7` - Time-series data
- `GET /api/v1/resources/{id}/anomalies?days=30` - Detected anomalies
- `GET /api/v1/resources/{id}/forecast?days=30` - Forecast data (stub)

### Admin
- `POST /api/v1/admin/ingest` - Trigger CSV ingest job
- `GET /api/v1/admin/stats` - System statistics

### Health
- `GET /health` - Health check with DB connectivity

Full API docs available at `http://localhost:8000/docs` (Swagger UI).

---

## Data Format

### Input CSV Format
Ingest CSVs with columns:
```
timestamp,value,[source_id],[resource_type],[metadata...]
2024-01-01T00:00:00Z,120.5,location-a,water,pressure=45.2
```

The ETL script maps columns:
- **timestamp** (required) → `ts`
- **value** (required) → `value`
- **source_id** (optional, defaults to filename)
- **resource_type** (optional, defaults to "unknown")
- Other columns → `metadata` (JSONB)

### Database Schema
```sql
CREATE TABLE resources (
  ts TIMESTAMPTZ NOT NULL,
  source_id TEXT NOT NULL,
  resource_type TEXT,
  value DOUBLE PRECISION,
  metadata JSONB
);
-- Converted to TimescaleDB hypertable for efficient queries
```

---

## Analytics Features

### Anomaly Detection Methods
1. **Z-Score** - Statistical deviation (14-day rolling window)
2. **IQR** - Interquartile range method (robust to outliers)
3. **Change Point** - Sudden shifts in trend
4. **Prophet** - Prediction interval deviation

### Forecasting
- **Algorithm**: Facebook Prophet
- **Seasonality**: Yearly (configurable)
- **Horizon**: Up to 90 days
- **Confidence Intervals**: 80% and 95%

### KPIs Calculated
- Min, max, mean, median, std dev
- 25th and 75th percentiles
- Total record count
- Latest value & timestamp

---

## Development

### Backend
```bash
# Run tests
pytest backend/tests

# Format code
black backend

# Type check
mypy backend
```

### Frontend
```bash
# Run dev server
npm run dev

# Build
npm run build

# Lint
npm run lint
```

### Analytics (Notebooks)
```bash
jupyter notebook notebooks/
```

---

## Deployment

### Local (Docker Compose)
```bash
docker-compose up -d
# See DEPLOYMENT.md for troubleshooting
```

### AWS (ECS Fargate + RDS)
Follow detailed guide in `DEPLOYMENT.md`:
1. Build & push Docker images to ECR
2. Create RDS instance (Postgres 14 + TimescaleDB)
3. Deploy backend & frontend via ECS/Fargate
4. Configure load balancer & security groups

### Kubernetes
Helm charts available in `k8s/` (coming soon).

---

## Configuration

### Environment Variables
```bash
DATABASE_URL=postgresql://user:pass@host:5432/resource_db
DEBUG=false
ENV=production
```

See `.env.example` for full list.

---

## Roadmap

- [ ] Real-time data ingestion (MQTT/Kafka streams)
- [ ] Advanced ML models (XGBoost, LightGBM)
- [ ] Role-based access control (RBAC)
- [ ] Data export (PDF reports, Excel)
- [ ] Mobile app (React Native)
- [ ] Grafana integration
- [ ] Alert notifications (email, Slack, webhook)
- [ ] Cost optimization recommendations
- [ ] Multi-tenancy support

---

## Support

- **Issues**: GitHub Issues
- **Documentation**: See `PLATFORM.md` and `DEPLOYMENT.md`
- **Examples**: Check `data/` for sample CSV formats

---

## License

Proprietary – Aquantis One

