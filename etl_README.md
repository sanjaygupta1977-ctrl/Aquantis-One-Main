ETL starter

This minimal ETL ingests historical CSV files into Postgres/TimescaleDB.

1. Start DB: docker-compose up -d
2. Install deps: pip install pandas sqlalchemy psycopg2-binary python-dotenv
3. Create a folder `data/` and drop CSV files. Each CSV should have timestamp in first column and value in second column. Optional columns: source_id, resource_type, other columns become metadata.
4. Set env var DATABASE_URL (example):
   export DATABASE_URL="postgresql://app:changeme@localhost:5432/resource_db"
5. Run: python etl_ingest.py --dir data

Notes:
- The script creates a hypertable if TimescaleDB extension exists.
- For production, replace plain Postgres with managed DB and add robust ETL (batching, retries, schema mapping).