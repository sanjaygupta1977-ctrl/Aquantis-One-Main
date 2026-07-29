import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Initialize STP Master Linking Table
export async function initSTPMasterLinkingTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stp_master_linking (
        id SERIAL PRIMARY KEY,
        stp_id VARCHAR(255) UNIQUE,
        stp_name VARCHAR(255),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        design_capacity_mld DECIMAL(10, 2),
        
        -- BOQ Links (Foreign Keys)
        civil_boq_id VARCHAR(255),
        mechanical_boq_id VARCHAR(255),
        electrical_boq_id VARCHAR(255),
        instrumentation_boq_id VARCHAR(255),
        chemical_boq_id VARCHAR(255),
        
        -- File Links
        uploaded_file_ids JSONB,
        
        -- Geographic Links (within 50km)
        nearby_lulc_ids JSONB,
        nearby_thermal_plants JSONB,
        nearby_water_demands JSONB,
        
        -- Cost Summary
        civil_cost DECIMAL(15, 2),
        mechanical_cost DECIMAL(15, 2),
        electrical_cost DECIMAL(15, 2),
        instrumentation_cost DECIMAL(15, 2),
        chemical_cost_annual DECIMAL(15, 2),
        
        total_capex DECIMAL(15, 2),
        total_opex_annual DECIMAL(15, 2),
        total_project_cost DECIMAL(15, 2),
        
        -- Status
        status VARCHAR(50),
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] STP Master Linking table initialized');
  } catch (err) {
    console.error('[DB] STP Master Linking error:', err.message);
  }
}

// Function to calculate distance (Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Create/Link all BOQ modules for an STP
router.post('/create-linked-boq', async (req, res) => {
  try {
    const {
      stp_id, stp_name, latitude, longitude, design_capacity_mld,
      civil_boq_id, mechanical_boq_id, electrical_boq_id, 
      instrumentation_boq_id, chemical_boq_id
    } = req.body;

    // Fetch all BOQ costs
    const civil = await pool.query(`SELECT final_civil_cost FROM stp_civil_boq WHERE stp_id = $1`, [civil_boq_id]).then(r => r.rows[0] || {});
    const mechanical = await pool.query(`SELECT final_mechanical_cost FROM stp_mechanical_boq WHERE stp_id = $1`, [mechanical_boq_id]).then(r => r.rows[0] || {});
    const electrical = await pool.query(`SELECT final_electrical_cost FROM stp_electrical_boq WHERE stp_id = $1`, [electrical_boq_id]).then(r => r.rows[0] || {});
    const instrumentation = await pool.query(`SELECT final_instrumentation_cost FROM stp_instrumentation_boq WHERE stp_id = $1`, [instrumentation_boq_id]).then(r => r.rows[0] || {});
    const chemical = await pool.query(`SELECT final_chemical_cost FROM stp_chemical_boq WHERE stp_id = $1`, [chemical_boq_id]).then(r => r.rows[0] || {});

    const civil_cost = parseFloat(civil.final_civil_cost || 0);
    const mechanical_cost = parseFloat(mechanical.final_mechanical_cost || 0);
    const electrical_cost = parseFloat(electrical.final_electrical_cost || 0);
    const instrumentation_cost = parseFloat(instrumentation.final_instrumentation_cost || 0);
    const chemical_cost = parseFloat(chemical.final_chemical_cost || 0);

    const total_capex = civil_cost + mechanical_cost + electrical_cost + instrumentation_cost;
    const total_opex_annual = chemical_cost; // Chemical costs are mostly annual

    // Auto-link to nearby LULC (50km radius)
    const lulcData = await pool.query(`SELECT * FROM geo_linked_data WHERE lulc_analysis_id IS NOT NULL`);
    const nearby_lulc = lulcData.rows
      .map(row => ({
        ...row,
        distance_km: calculateDistance(latitude, longitude, parseFloat(row.latitude), parseFloat(row.longitude))
      }))
      .filter(row => row.distance_km <= 50 && row.distance_km > 0)
      .sort((a, b) => a.distance_km - b.distance_km);

    // Auto-link to nearby Thermal Plants
    const thermalData = await pool.query(`SELECT * FROM geo_linked_data WHERE thermal_plant_id IS NOT NULL`);
    const nearby_thermal = thermalData.rows
      .map(row => ({
        ...row,
        distance_km: calculateDistance(latitude, longitude, parseFloat(row.latitude), parseFloat(row.longitude))
      }))
      .filter(row => row.distance_km <= 50 && row.distance_km > 0)
      .sort((a, b) => a.distance_km - b.distance_km);

    // Save to master linking table
    const exists = await pool.query(
      `SELECT id FROM stp_master_linking WHERE stp_id = $1`,
      [stp_id]
    );

    if (exists.rows.length > 0) {
      await pool.query(
        `UPDATE stp_master_linking SET
         stp_name = $1, latitude = $2, longitude = $3, design_capacity_mld = $4,
         civil_boq_id = $5, mechanical_boq_id = $6, electrical_boq_id = $7,
         instrumentation_boq_id = $8, chemical_boq_id = $9,
         nearby_lulc_ids = $10, nearby_thermal_plants = $11,
         civil_cost = $12, mechanical_cost = $13, electrical_cost = $14, instrumentation_cost = $15, chemical_cost_annual = $16,
         total_capex = $17, total_opex_annual = $18, total_project_cost = $19,
         status = $20, updated_at = CURRENT_TIMESTAMP
         WHERE stp_id = $21`,
        [stp_name, latitude, longitude, design_capacity_mld,
         civil_boq_id, mechanical_boq_id, electrical_boq_id, instrumentation_boq_id, chemical_boq_id,
         JSON.stringify(nearby_lulc.map(l => ({ id: l.lulc_analysis_id, distance_km: l.distance_km }))),
         JSON.stringify(nearby_thermal.map(t => ({ id: t.thermal_plant_id, distance_km: t.distance_km }))),
         civil_cost, mechanical_cost, electrical_cost, instrumentation_cost, chemical_cost,
         total_capex, total_opex_annual, total_capex + total_opex_annual,
         'linked', stp_id]
      );
    } else {
      await pool.query(
        `INSERT INTO stp_master_linking (
         stp_id, stp_name, latitude, longitude, design_capacity_mld,
         civil_boq_id, mechanical_boq_id, electrical_boq_id, instrumentation_boq_id, chemical_boq_id,
         nearby_lulc_ids, nearby_thermal_plants,
         civil_cost, mechanical_cost, electrical_cost, instrumentation_cost, chemical_cost_annual,
         total_capex, total_opex_annual, total_project_cost, status
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`,
        [stp_id, stp_name, latitude, longitude, design_capacity_mld,
         civil_boq_id, mechanical_boq_id, electrical_boq_id, instrumentation_boq_id, chemical_boq_id,
         JSON.stringify(nearby_lulc.map(l => ({ id: l.lulc_analysis_id, distance_km: l.distance_km }))),
         JSON.stringify(nearby_thermal.map(t => ({ id: t.thermal_plant_id, distance_km: t.distance_km }))),
         civil_cost, mechanical_cost, electrical_cost, instrumentation_cost, chemical_cost,
         total_capex, total_opex_annual, total_capex + total_opex_annual, 'linked']
      );
    }

    res.json({
      success: true,
      stp_id,
      total_capex,
      total_opex_annual,
      nearby_lulc_count: nearby_lulc.length,
      nearby_thermal_count: nearby_thermal.length,
      status: 'All BOQ modules linked successfully'
    });
  } catch (error) {
    console.error('[STP Master Linking] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get STP with all linked data
router.get('/:stp_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM stp_master_linking WHERE stp_id = $1`,
      [req.params.stp_id]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    res.json({});
  }
});

// Get all linked STPs with cost summary
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        stp_id, stp_name, design_capacity_mld,
        civil_cost, mechanical_cost, electrical_cost, instrumentation_cost, chemical_cost_annual,
        total_capex, total_opex_annual, total_project_cost,
        status, created_at
      FROM stp_master_linking 
      ORDER BY created_at DESC
    `);
    res.json(result.rows || []);
  } catch (error) {
    res.json([]);
  }
});

// Get STP with full BOQ details
router.get('/details/:stp_id', async (req, res) => {
  try {
    const { stp_id } = req.params;
    
    const master = await pool.query(
      `SELECT * FROM stp_master_linking WHERE stp_id = $1`,
      [stp_id]
    );

    if (master.rows.length === 0) {
      return res.json({ error: 'STP not found' });
    }

    const m = master.rows[0];

    // Fetch all BOQ details
    const [civil, mechanical, electrical, instrumentation, chemical] = await Promise.all([
      pool.query(`SELECT * FROM stp_civil_boq WHERE stp_id = $1`, [m.civil_boq_id]),
      pool.query(`SELECT * FROM stp_mechanical_boq WHERE stp_id = $1`, [m.mechanical_boq_id]),
      pool.query(`SELECT * FROM stp_electrical_boq WHERE stp_id = $1`, [m.electrical_boq_id]),
      pool.query(`SELECT * FROM stp_instrumentation_boq WHERE stp_id = $1`, [m.instrumentation_boq_id]),
      pool.query(`SELECT * FROM stp_chemical_boq WHERE stp_id = $1`, [m.chemical_boq_id]),
    ]);

    res.json({
      master: m,
      civil: civil.rows[0] || {},
      mechanical: mechanical.rows[0] || {},
      electrical: electrical.rows[0] || {},
      instrumentation: instrumentation.rows[0] || {},
      chemical: chemical.rows[0] || {}
    });
  } catch (error) {
    console.error('[STP Details] Error:', error.message);
    res.json({ error: error.message });
  }
});

// Link STP with uploaded files
router.post('/link-files', async (req, res) => {
  try {
    const { stp_id, file_ids } = req.body;

    await pool.query(
      `UPDATE stp_master_linking SET uploaded_file_ids = $1, updated_at = CURRENT_TIMESTAMP WHERE stp_id = $2`,
      [JSON.stringify(file_ids), stp_id]
    );

    res.json({ success: true, message: `${file_ids.length} files linked to STP` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
