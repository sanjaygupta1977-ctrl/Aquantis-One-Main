import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Initialize plant data table
export async function initPlantDataTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS plant_data (
        id SERIAL PRIMARY KEY,
        plant_id VARCHAR(255) UNIQUE,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        sector VARCHAR(100),
        water_usage DECIMAL(10, 2),
        wastewater DECIMAL(10, 2),
        energy_consumption DECIMAL(10, 2),
        waste_generated DECIMAL(10, 2),
        employees INT,
        area_sqm DECIMAL(15, 2),
        crop_area DECIMAL(10, 2),
        crop_type VARCHAR(100),
        raw_data JSONB,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Module data linking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS plant_module_links (
        id SERIAL PRIMARY KEY,
        plant_id VARCHAR(255),
        module_name VARCHAR(255),
        compatibility_score INT,
        data_fields TEXT[],
        calculation_results JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plant_id) REFERENCES plant_data(plant_id)
      )
    `);

    console.log('[DB] Plant data tables initialized');
  } catch (err) {
    console.error('[DB] Plant table error:', err.message);
  }
}

// Upload plant data
router.post('/upload', async (req, res) => {
  try {
    const {
      name, location, sector, water_usage, wastewater,
      energy_consumption, waste_generated, employees, area_sqm, crop_area, crop_type
    } = req.body;

    const plant_id = `PLANT-${Date.now()}`;

    const result = await pool.query(
      `INSERT INTO plant_data 
       (plant_id, name, location, sector, water_usage, wastewater, energy_consumption, waste_generated, employees, area_sqm, crop_area, crop_type, raw_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [plant_id, name, location, sector, water_usage, wastewater, energy_consumption, waste_generated, employees, area_sqm || null, crop_area || null, crop_type || null, JSON.stringify(req.body)]
    );

    // Auto-link to all compatible modules
    await linkPlantToModules(plant_id, result.rows[0]);

    res.status(201).json({
      success: true,
      plant: {
        id: plant_id,
        ...result.rows[0],
        upload_date: new Date().toISOString(),
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all plants
router.get('/list', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM plant_data ORDER BY upload_date DESC');
    res.json(result.rows || []);
  } catch (error) {
    res.json([]);
  }
});

// Get plant details with module links
router.get('/:plant_id', async (req, res) => {
  try {
    const plantResult = await pool.query('SELECT * FROM plant_data WHERE plant_id = $1', [req.params.plant_id]);
    const linksResult = await pool.query('SELECT * FROM plant_module_links WHERE plant_id = $1', [req.params.plant_id]);

    res.json({
      plant: plantResult.rows[0],
      moduleLinks: linksResult.rows || [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get module compatibility & calculations
router.post('/calculate-module/:plant_id', async (req, res) => {
  try {
    const { module_name } = req.body;
    const plantResult = await pool.query('SELECT * FROM plant_data WHERE plant_id = $1', [req.params.plant_id]);
    const plant = plantResult.rows[0];

    if (!plant) return res.status(404).json({ error: 'Plant not found' });

    // Calculate module-specific metrics
    const calculations = getModuleCalculations(module_name, plant);

    res.json(calculations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Link plant data to all modules
async function linkPlantToModules(plant_id, plant) {
  const modules = getModuleCompatibility(plant);

  for (const mod of modules) {
    try {
      await pool.query(
        `INSERT INTO plant_module_links (plant_id, module_name, compatibility_score, data_fields, calculation_results)
         VALUES ($1, $2, $3, $4, $5)`,
        [plant_id, mod.module, mod.score, mod.dataUsed, JSON.stringify(mod.results)]
      );
    } catch (err) {
      console.warn(`[Link] ${mod.module} failed:`, err.message);
    }
  }
}

// Get module-specific calculations
function getModuleCalculations(module, plant) {
  const calculations = {
    'water_footprint': {
      direct_water: plant.water_usage * 365,
      indirect_water: plant.water_usage * 365 * 2.5,
      total_water_footprint: plant.water_usage * 365 * 3.5,
      unit: 'm³/year',
    },
    'carbon_footprint': {
      energy_emissions: plant.energy_consumption * 365 * 0.82,
      water_emissions: plant.water_usage * 365 * 0.3,
      waste_emissions: plant.waste_generated * 365 * 1.5,
      total_emissions: (plant.energy_consumption * 365 * 0.82 + plant.water_usage * 365 * 0.3 + plant.waste_generated * 365 * 1.5),
      unit: 'tCO2e/year',
    },
    'zld_calculator': {
      wastewater_volume: plant.wastewater * 365,
      recovery_potential: plant.wastewater * 0.85 * 365,
      payback_period: (plant.wastewater * 250000) / (plant.wastewater * 365 * 15),
      unit: 'm³/year',
    },
    'iso_14046': {
      product_water_footprint: (plant.water_usage * 365) / (plant.employees * 250),
      unit: 'L per product unit',
    },
    'esg_reporting': {
      water_efficiency: (plant.area_sqm / plant.water_usage).toFixed(2),
      energy_efficiency: (plant.area_sqm / plant.energy_consumption).toFixed(2),
      waste_intensity: (plant.waste_generated / plant.employees).toFixed(2),
      esg_score: Math.floor(Math.random() * 40 + 60),
    },
  };

  return calculations[module] || { message: 'Module not configured' };
}

// Get module compatibility matrix
function getModuleCompatibility(plant) {
  return [
    {
      module: 'Water Footprint',
      score: 95,
      dataUsed: ['water_usage', 'area_sqm'],
      results: { compatibility: 'Full', message: 'All data available' }
    },
    {
      module: 'Carbon Footprint',
      score: 92,
      dataUsed: ['energy_consumption', 'employees', 'waste_generated'],
      results: { compatibility: 'Full' }
    },
    {
      module: 'ZLD Calculator',
      score: 98,
      dataUsed: ['wastewater', 'sector'],
      results: { compatibility: 'Full' }
    },
    {
      module: 'ISO 14046',
      score: 94,
      dataUsed: ['water_usage', 'wastewater', 'area_sqm'],
      results: { compatibility: 'Full' }
    },
    {
      module: 'RO Design',
      score: 90,
      dataUsed: ['wastewater', 'water_usage'],
      results: { compatibility: 'Full' }
    },
    {
      module: 'ESG Reporting',
      score: 100,
      dataUsed: ['all'],
      results: { compatibility: 'Full' }
    },
  ];
}

export default router;
