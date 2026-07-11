"""Simple ETL to ingest historical CSVs into Postgres/TimescaleDB.
Usage: set DATABASE_URL env var (e.g., postgresql://app:changeme@localhost:5432/resource_db)
Then run: python etl_ingest.py --dir data
"""
import os
import argparse
from pathlib import Path
import pandas as pd
from sqlalchemy import create_engine, text

DEFAULT_TABLE = "resources"

def ensure_timescale(engine):
    # create extension if missing
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS timescaledb;"))

def create_table_if_not_exists(engine, table_name=DEFAULT_TABLE):
    create_sql = f"""
    CREATE TABLE IF NOT EXISTS {table_name} (
        ts TIMESTAMPTZ NOT NULL,
        resource_type TEXT NOT NULL,
        source_id TEXT,
        value DOUBLE PRECISION,
        metadata JSONB,
        PRIMARY KEY (ts, source_id)
    );
    """
    with engine.connect() as conn:
        conn.execute(text(create_sql))
        # convert to hypertable (idempotent)
        conn.execute(text(f"SELECT create_hypertable('{table_name}', 'ts', if_not_exists => TRUE);"))

def ingest_file(engine, csv_path, table_name=DEFAULT_TABLE):
    df = pd.read_csv(csv_path, parse_dates=[0])
    # Expect first column to be timestamp
    df.columns = [c.strip() for c in df.columns]
    if df.shape[1] < 2:
        raise SystemExit("CSV should have at least timestamp + value columns")
    # Normalize columns
    ts_col = df.columns[0]
    val_col = df.columns[1]
    df = df.rename(columns={ts_col: 'ts', val_col: 'value'})
    # Optional columns: source_id, resource_type
    if 'source_id' not in df.columns:
        df['source_id'] = Path(csv_path).stem
    if 'resource_type' not in df.columns:
        df['resource_type'] = 'unknown'
    # metadata: any other columns
    meta_cols = [c for c in df.columns if c not in ('ts','value','source_id','resource_type')]
    if meta_cols:
        df['metadata'] = df[meta_cols].to_dict(orient='records')
        df = df.drop(columns=meta_cols)
    # ensure tz-aware timestamps
    df['ts'] = pd.to_datetime(df['ts'], utc=True)
    # write to DB
    df.to_sql(table_name, engine, if_exists='append', index=False, method='multi')
    print(f"Ingested {len(df)} rows from {csv_path}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dir', required=True, help='Directory containing CSV files')
    parser.add_argument('--db', default=os.getenv('DATABASE_URL'), help='SQLAlchemy database URL')
    parser.add_argument('--table', default=DEFAULT_TABLE)
    args = parser.parse_args()

    if not args.db:
        raise SystemExit('DATABASE_URL not set; set env var or pass --db')

    engine = create_engine(args.db, pool_pre_ping=True)
    ensure_timescale(engine)
    create_table_if_not_exists(engine, args.table)

    p = Path(args.dir)
    if not p.is_dir():
        raise SystemExit(f"Directory not found: {p}")
    csvs = sorted(p.glob('*.csv'))
    if not csvs:
        raise SystemExit('No CSV files found in directory')
    for f in csvs:
        ingest_file(engine, f, args.table)

if __name__ == '__main__':
    main()
