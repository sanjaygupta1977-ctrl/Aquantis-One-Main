import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'aquantis',
  password: process.env.DB_PASSWORD || 'aquantis_pass',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'aquantis_db',
});

// Initialize database schema
export async function initializeDatabase() {
  try {
    // Water Balance table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS water_balance (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        freshwater NUMERIC NOT NULL,
        recycled_water NUMERIC NOT NULL,
        rainwater NUMERIC NOT NULL,
        production NUMERIC NOT NULL,
        evaporation_loss NUMERIC NOT NULL,
        blowdown_loss NUMERIC NOT NULL,
        process_loss NUMERIC NOT NULL,
        domestic_use NUMERIC NOT NULL,
        discharge NUMERIC NOT NULL,
        total_input NUMERIC NOT NULL,
        reuse_percentage NUMERIC NOT NULL,
        water_intensity NUMERIC NOT NULL,
        balance_status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Water Quality table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS water_quality (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ph NUMERIC NOT NULL,
        turbidity NUMERIC NOT NULL,
        tds NUMERIC NOT NULL,
        quality_status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Cooling Tower table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cooling_tower (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        inlet_temp NUMERIC NOT NULL,
        outlet_temp NUMERIC NOT NULL,
        ambient_temp NUMERIC NOT NULL,
        flow_rate NUMERIC NOT NULL,
        approach_temp NUMERIC NOT NULL,
        range_temp NUMERIC NOT NULL,
        effectiveness NUMERIC NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Neutrality table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS neutrality (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        acidity NUMERIC NOT NULL,
        alkalinity NUMERIC NOT NULL,
        neutrality_index NUMERIC NOT NULL,
        requires_treatment BOOLEAN NOT NULL,
        recommended_dose NUMERIC NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // KPI table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS kpis (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        metric_name VARCHAR(100) NOT NULL,
        value NUMERIC NOT NULL,
        unit VARCHAR(50) NOT NULL,
        trend VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

export default pool;
