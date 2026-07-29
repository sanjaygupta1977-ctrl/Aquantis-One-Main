import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Initialize Civil BOQ Table
export async function initCivilBOQTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS civil_boq (
        id SERIAL PRIMARY KEY,
        project_id VARCHAR(255) UNIQUE,
        project_name VARCHAR(255),
        structure_type VARCHAR(100),
        total_area_m2 DECIMAL(12, 2),
        
        -- RCC Details
        rcc_grade VARCHAR(50),
        rcc_volume_m3 DECIMAL(10, 2),
        rcc_unit_cost DECIMAL(10, 2),
        rcc_total_cost DECIMAL(15, 2),
        
        -- Reinforcement Steel
        steel_grade VARCHAR(50),
        steel_quantity_tons DECIMAL(10, 2),
        steel_percentage DECIMAL(5, 2),
        steel_unit_cost DECIMAL(10, 2),
        steel_total_cost DECIMAL(15, 2),
        
        -- Waterproofing
        waterproofing_type VARCHAR(100),
        waterproofing_area_m2 DECIMAL(12, 2),
        waterproofing_thickness_mm DECIMAL(5, 2),
        waterproofing_unit_cost DECIMAL(10, 2),
        waterproofing_total_cost DECIMAL(15, 2),
        
        -- Finishing
        flooring_type VARCHAR(100),
        flooring_area_m2 DECIMAL(12, 2),
        flooring_unit_cost DECIMAL(10, 2),
        flooring_total_cost DECIMAL(15, 2),
        
        wall_finish_type VARCHAR(100),
        wall_finish_area_m2 DECIMAL(12, 2),
        wall_finish_unit_cost DECIMAL(10, 2),
        wall_finish_total_cost DECIMAL(15, 2),
        
        -- Totals
        total_civil_cost DECIMAL(15, 2),
        contingency_percent DECIMAL(5, 2),
        final_cost DECIMAL(15, 2),
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] Civil BOQ table initialized');
  } catch (err) {
    console.error('[DB] Civil BOQ table error:', err.message);
  }
}

// Save Civil BOQ
router.post('/save', async (req, res) => {
  try {
    const {
      project_id, project_name, structure_type, total_area_m2,
      rcc_grade, rcc_volume_m3, rcc_unit_cost,
      steel_grade, steel_quantity_tons, steel_percentage, steel_unit_cost,
      waterproofing_type, waterproofing_area_m2, waterproofing_thickness_mm, waterproofing_unit_cost,
      flooring_type, flooring_area_m2, flooring_unit_cost,
      wall_finish_type, wall_finish_area_m2, wall_finish_unit_cost,
      contingency_percent = 5
    } = req.body;

    // Calculate costs
    const rcc_total = rcc_volume_m3 * rcc_unit_cost;
    const steel_total = steel_quantity_tons * steel_unit_cost;
    const waterproofing_total = waterproofing_area_m2 * waterproofing_unit_cost;
    const flooring_total = flooring_area_m2 * flooring_unit_cost;
    const wall_finish_total = wall_finish_area_m2 * wall_finish_unit_cost;
    
    const subtotal = rcc_total + steel_total + waterproofing_total + flooring_total + wall_finish_total;
    const contingency = subtotal * (contingency_percent / 100);
    const final_cost = subtotal + contingency;

    const exists = await pool.query(
      `SELECT id FROM civil_boq WHERE project_id = $1`,
      [project_id]
    );

    if (exists.rows.length > 0) {
      await pool.query(
        `UPDATE civil_boq SET
         project_name = $1, structure_type = $2, total_area_m2 = $3,
         rcc_grade = $4, rcc_volume_m3 = $5, rcc_unit_cost = $6, rcc_total_cost = $7,
         steel_grade = $8, steel_quantity_tons = $9, steel_percentage = $10, steel_unit_cost = $11, steel_total_cost = $12,
         waterproofing_type = $13, waterproofing_area_m2 = $14, waterproofing_thickness_mm = $15, waterproofing_unit_cost = $16, waterproofing_total_cost = $17,
         flooring_type = $18, flooring_area_m2 = $19, flooring_unit_cost = $20, flooring_total_cost = $21,
         wall_finish_type = $22, wall_finish_area_m2 = $23, wall_finish_unit_cost = $24, wall_finish_total_cost = $25,
         total_civil_cost = $26, contingency_percent = $27, final_cost = $28,
         updated_at = CURRENT_TIMESTAMP
         WHERE project_id = $29`,
        [project_name, structure_type, total_area_m2,
         rcc_grade, rcc_volume_m3, rcc_unit_cost, rcc_total,
         steel_grade, steel_quantity_tons, steel_percentage, steel_unit_cost, steel_total,
         waterproofing_type, waterproofing_area_m2, waterproofing_thickness_mm, waterproofing_unit_cost, waterproofing_total,
         flooring_type, flooring_area_m2, flooring_unit_cost, flooring_total,
         wall_finish_type, wall_finish_area_m2, wall_finish_unit_cost, wall_finish_total,
         subtotal, contingency_percent, final_cost, project_id]
      );
    } else {
      await pool.query(
        `INSERT INTO civil_boq (
         project_id, project_name, structure_type, total_area_m2,
         rcc_grade, rcc_volume_m3, rcc_unit_cost, rcc_total_cost,
         steel_grade, steel_quantity_tons, steel_percentage, steel_unit_cost, steel_total_cost,
         waterproofing_type, waterproofing_area_m2, waterproofing_thickness_mm, waterproofing_unit_cost, waterproofing_total_cost,
         flooring_type, flooring_area_m2, flooring_unit_cost, flooring_total_cost,
         wall_finish_type, wall_finish_area_m2, wall_finish_unit_cost, wall_finish_total_cost,
         total_civil_cost, contingency_percent, final_cost
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)`,
        [project_id, project_name, structure_type, total_area_m2,
         rcc_grade, rcc_volume_m3, rcc_unit_cost, rcc_total,
         steel_grade, steel_quantity_tons, steel_percentage, steel_unit_cost, steel_total,
         waterproofing_type, waterproofing_area_m2, waterproofing_thickness_mm, waterproofing_unit_cost, waterproofing_total,
         flooring_type, flooring_area_m2, flooring_unit_cost, flooring_total,
         wall_finish_type, wall_finish_area_m2, wall_finish_unit_cost, wall_finish_total,
         subtotal, contingency_percent, final_cost]
      );
    }

    res.json({ success: true, project_id, final_cost });
  } catch (error) {
    console.error('[Civil BOQ] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get Civil BOQ
router.get('/:project_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM civil_boq WHERE project_id = $1`,
      [req.params.project_id]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    res.json({});
  }
});

// Get all Civil BOQs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM civil_boq ORDER BY created_at DESC`);
    res.json(result.rows || []);
  } catch (error) {
    res.json([]);
  }
});

export default router;
