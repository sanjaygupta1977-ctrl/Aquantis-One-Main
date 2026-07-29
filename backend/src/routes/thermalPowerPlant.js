import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Initialize thermal power plant table
export async function initThermalPowerPlantTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS thermal_power_plants (
        id SERIAL PRIMARY KEY,
        plant_id VARCHAR(255) UNIQUE,
        plant_name VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        capacity_mw DECIMAL(10, 2),
        water_source VARCHAR(100),
        water_intake_m3_day DECIMAL(15, 2),
        cooling_type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS water_quality_parameters (
        id SERIAL PRIMARY KEY,
        plant_id VARCHAR(255),
        parameter_name VARCHAR(100),
        value DECIMAL(15, 6),
        unit VARCHAR(50),
        measurement_date TIMESTAMP,
        water_type VARCHAR(50),
        benchmark_indian VARCHAR(50),
        benchmark_international VARCHAR(50),
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plant_id) REFERENCES thermal_power_plants(plant_id)
      )
    `);

    console.log('[DB] Thermal Power Plant tables initialized');
  } catch (err) {
    console.error('[DB] Thermal Power Plant table error:', err.message);
  }
}

// Save thermal power plant
router.post('/save-plant', async (req, res) => {
  try {
    const { plant_id, plant_name, latitude, longitude, capacity_mw, water_source, water_intake_m3_day, cooling_type } = req.body;

    if (!plant_id || !plant_name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const result = await pool.query(
      `INSERT INTO thermal_power_plants (plant_id, plant_name, latitude, longitude, capacity_mw, water_source, water_intake_m3_day, cooling_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (plant_id) DO UPDATE SET
       plant_name = $2, latitude = $3, longitude = $4, capacity_mw = $5, water_source = $6, water_intake_m3_day = $7, cooling_type = $8
       RETURNING *`,
      [plant_id, plant_name, latitude, longitude, capacity_mw, water_source, water_intake_m3_day, cooling_type]
    );

    res.json({ success: true, plant: result.rows[0] });
  } catch (error) {
    console.error('[Thermal] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Save water quality parameters
router.post('/save-quality', async (req, res) => {
  try {
    const { plant_id, parameters } = req.body;

    if (!plant_id || !Array.isArray(parameters)) {
      return res.status(400).json({ error: 'plant_id and parameters array required' });
    }

    const benchmarks = getBenchmarks();
    const results = [];

    for (const param of parameters) {
      const benchmark = benchmarks[param.parameter_name] || {};
      
      const result = await pool.query(
        `INSERT INTO water_quality_parameters (plant_id, parameter_name, value, unit, measurement_date, water_type, benchmark_indian, benchmark_international, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          plant_id,
          param.parameter_name,
          param.value,
          param.unit || benchmark.unit,
          param.measurement_date || new Date(),
          param.water_type || 'intake',
          benchmark.indian_standard || 'N/A',
          benchmark.international_standard || 'N/A',
          getComplianceStatus(param.value, benchmark)
        ]
      );

      results.push(result.rows[0]);
    }

    res.json({ success: true, parameters: results });
  } catch (error) {
    console.error('[Thermal] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get plant water quality
router.get('/plant/:plant_id', async (req, res) => {
  try {
    const { plant_id } = req.params;

    const plantResult = await pool.query(
      `SELECT * FROM thermal_power_plants WHERE plant_id = $1`,
      [plant_id]
    );

    const qualityResult = await pool.query(
      `SELECT * FROM water_quality_parameters WHERE plant_id = $1 ORDER BY measurement_date DESC`,
      [plant_id]
    );

    if (plantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    res.json({
      plant: plantResult.rows[0],
      quality_parameters: qualityResult.rows || [],
      summary: generateSummary(qualityResult.rows || [])
    });
  } catch (error) {
    console.error('[Thermal] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all plants
router.get('/plants', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM thermal_power_plants ORDER BY created_at DESC`
    );
    res.json(result.rows || []);
  } catch (error) {
    res.json([]);
  }
});

// Get compliance report
router.get('/compliance/:plant_id', async (req, res) => {
  try {
    const { plant_id } = req.params;

    const result = await pool.query(
      `SELECT parameter_name, value, unit, benchmark_indian, benchmark_international, status, measurement_date
       FROM water_quality_parameters
       WHERE plant_id = $1
       ORDER BY measurement_date DESC
       LIMIT 100`,
      [plant_id]
    );

    const summary = {
      total_parameters: result.rows.length,
      compliant: result.rows.filter(r => r.status === 'compliant').length,
      warning: result.rows.filter(r => r.status === 'warning').length,
      non_compliant: result.rows.filter(r => r.status === 'non_compliant').length,
      compliance_rate: result.rows.length > 0 
        ? ((result.rows.filter(r => r.status === 'compliant').length / result.rows.length) * 100).toFixed(2)
        : 0,
      parameters: result.rows
    };

    res.json(summary);
  } catch (error) {
    console.error('[Thermal] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Helper functions
function getBenchmarks() {
  return {
    'pH': {
      unit: '-',
      indian_standard: '6.5-8.5',
      international_standard: '6.5-8.5',
      max_value: 8.5,
      min_value: 6.5
    },
    'Dissolved Oxygen': {
      unit: 'mg/L',
      indian_standard: '>5.0',
      international_standard: '>6.0',
      min_value: 5.0
    },
    'Total Suspended Solids': {
      unit: 'mg/L',
      indian_standard: '<100',
      international_standard: '<50',
      max_value: 100
    },
    'Turbidity': {
      unit: 'NTU',
      indian_standard: '<5',
      international_standard: '<1',
      max_value: 5
    },
    'BOD': {
      unit: 'mg/L',
      indian_standard: '<30',
      international_standard: '<10',
      max_value: 30
    },
    'COD': {
      unit: 'mg/L',
      indian_standard: '<250',
      international_standard: '<100',
      max_value: 250
    },
    'Total Nitrogen': {
      unit: 'mg/L',
      indian_standard: '<100',
      international_standard: '<50',
      max_value: 100
    },
    'Total Phosphorus': {
      unit: 'mg/L',
      indian_standard: '<5',
      international_standard: '<1',
      max_value: 5
    },
    'Temperature': {
      unit: '°C',
      indian_standard: '<35',
      international_standard: '<33',
      max_value: 35
    },
    'Conductivity': {
      unit: 'µS/cm',
      indian_standard: '<2250',
      international_standard: '<1500',
      max_value: 2250
    },
    'Iron': {
      unit: 'mg/L',
      indian_standard: '<0.3',
      international_standard: '<0.2',
      max_value: 0.3
    },
    'Copper': {
      unit: 'mg/L',
      indian_standard: '<1.3',
      international_standard: '<1.0',
      max_value: 1.3
    }
  };
}

function getComplianceStatus(value, benchmark) {
  if (!benchmark) return 'unknown';

  if (benchmark.max_value !== undefined && value > benchmark.max_value) {
    return 'non_compliant';
  }
  if (benchmark.min_value !== undefined && value < benchmark.min_value) {
    return 'non_compliant';
  }

  // Warning threshold (80% of limit)
  if (benchmark.max_value !== undefined && value > benchmark.max_value * 0.8) {
    return 'warning';
  }
  if (benchmark.min_value !== undefined && value < benchmark.min_value * 1.2) {
    return 'warning';
  }

  return 'compliant';
}

function generateSummary(parameters) {
  const statuses = parameters.map(p => p.status);
  return {
    total: parameters.length,
    compliant: statuses.filter(s => s === 'compliant').length,
    warning: statuses.filter(s => s === 'warning').length,
    non_compliant: statuses.filter(s => s === 'non_compliant').length,
    compliance_percentage: parameters.length > 0
      ? ((statuses.filter(s => s === 'compliant').length / parameters.length) * 100).toFixed(2)
      : 0
  };
}

export default router;
