import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Initialize STP Civil BOQ Table
export async function initSTPCivilBOQTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stp_civil_boq (
        id SERIAL PRIMARY KEY,
        stp_id VARCHAR(255) UNIQUE,
        stp_name VARCHAR(255),
        design_capacity_mld DECIMAL(10, 2),
        treatment_type VARCHAR(100),
        
        -- Primary Treatment Structure
        inlet_chamber_m3 DECIMAL(10, 2),
        grit_chamber_m3 DECIMAL(10, 2),
        primary_settling_m3 DECIMAL(10, 2),
        
        -- Secondary Treatment Structure
        aeration_tank_m3 DECIMAL(10, 2),
        secondary_settling_m3 DECIMAL(10, 2),
        
        -- Tertiary Treatment Structure
        tertiary_filter_m3 DECIMAL(10, 2),
        chlorine_contact_m3 DECIMAL(10, 2),
        
        -- Sludge Treatment
        sludge_thickening_m3 DECIMAL(10, 2),
        sludge_dewatering_m3 DECIMAL(10, 2),
        
        -- RCC Specifications
        rcc_grade VARCHAR(50),
        total_rcc_volume_m3 DECIMAL(12, 2),
        rcc_unit_cost DECIMAL(10, 2),
        rcc_total_cost DECIMAL(15, 2),
        
        -- Reinforcement Steel
        steel_grade VARCHAR(50),
        steel_quantity_tons DECIMAL(10, 2),
        steel_percentage DECIMAL(5, 2),
        steel_unit_cost DECIMAL(10, 2),
        steel_total_cost DECIMAL(15, 2),
        
        -- Waterproofing (Critical for STP)
        waterproofing_type VARCHAR(100),
        waterproofing_area_m2 DECIMAL(12, 2),
        waterproofing_thickness_mm DECIMAL(5, 2),
        waterproofing_unit_cost DECIMAL(10, 2),
        waterproofing_total_cost DECIMAL(15, 2),
        
        -- Internal Finishing
        epoxy_coating_area_m2 DECIMAL(12, 2),
        epoxy_coating_unit_cost DECIMAL(10, 2),
        epoxy_coating_total_cost DECIMAL(15, 2),
        
        -- Flooring
        concrete_flooring_area_m2 DECIMAL(12, 2),
        concrete_flooring_unit_cost DECIMAL(10, 2),
        concrete_flooring_total_cost DECIMAL(15, 2),
        
        -- Contingency
        total_civil_cost DECIMAL(15, 2),
        contingency_percent DECIMAL(5, 2),
        final_civil_cost DECIMAL(15, 2),
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] STP Civil BOQ table initialized');
  } catch (err) {
    console.error('[DB] STP Civil BOQ error:', err.message);
  }
}

// Save STP Civil BOQ
router.post('/save', async (req, res) => {
  try {
    const {
      stp_id, stp_name, design_capacity_mld, treatment_type,
      inlet_chamber_m3, grit_chamber_m3, primary_settling_m3,
      aeration_tank_m3, secondary_settling_m3,
      tertiary_filter_m3, chlorine_contact_m3,
      sludge_thickening_m3, sludge_dewatering_m3,
      rcc_grade, rcc_unit_cost,
      steel_grade, steel_quantity_tons, steel_percentage, steel_unit_cost,
      waterproofing_type, waterproofing_area_m2, waterproofing_thickness_mm, waterproofing_unit_cost,
      epoxy_coating_area_m2, epoxy_coating_unit_cost,
      concrete_flooring_area_m2, concrete_flooring_unit_cost,
      contingency_percent = 7
    } = req.body;

    // Calculate total RCC volume
    const total_rcc_volume_m3 = 
      (inlet_chamber_m3 || 0) + (grit_chamber_m3 || 0) + (primary_settling_m3 || 0) +
      (aeration_tank_m3 || 0) + (secondary_settling_m3 || 0) +
      (tertiary_filter_m3 || 0) + (chlorine_contact_m3 || 0) +
      (sludge_thickening_m3 || 0) + (sludge_dewatering_m3 || 0);

    const rcc_total = total_rcc_volume_m3 * rcc_unit_cost;
    const steel_total = steel_quantity_tons * steel_unit_cost;
    const waterproofing_total = waterproofing_area_m2 * waterproofing_unit_cost;
    const epoxy_total = epoxy_coating_area_m2 * epoxy_coating_unit_cost;
    const flooring_total = concrete_flooring_area_m2 * concrete_flooring_unit_cost;

    const subtotal = rcc_total + steel_total + waterproofing_total + epoxy_total + flooring_total;
    const contingency = subtotal * (contingency_percent / 100);
    const final_cost = subtotal + contingency;

    const exists = await pool.query(
      `SELECT id FROM stp_civil_boq WHERE stp_id = $1`,
      [stp_id]
    );

    if (exists.rows.length > 0) {
      await pool.query(
        `UPDATE stp_civil_boq SET
         stp_name = $1, design_capacity_mld = $2, treatment_type = $3,
         inlet_chamber_m3 = $4, grit_chamber_m3 = $5, primary_settling_m3 = $6,
         aeration_tank_m3 = $7, secondary_settling_m3 = $8,
         tertiary_filter_m3 = $9, chlorine_contact_m3 = $10,
         sludge_thickening_m3 = $11, sludge_dewatering_m3 = $12,
         rcc_grade = $13, total_rcc_volume_m3 = $14, rcc_unit_cost = $15, rcc_total_cost = $16,
         steel_grade = $17, steel_quantity_tons = $18, steel_percentage = $19, steel_unit_cost = $20, steel_total_cost = $21,
         waterproofing_type = $22, waterproofing_area_m2 = $23, waterproofing_thickness_mm = $24, waterproofing_unit_cost = $25, waterproofing_total_cost = $26,
         epoxy_coating_area_m2 = $27, epoxy_coating_unit_cost = $28, epoxy_coating_total_cost = $29,
         concrete_flooring_area_m2 = $30, concrete_flooring_unit_cost = $31, concrete_flooring_total_cost = $32,
         total_civil_cost = $33, contingency_percent = $34, final_civil_cost = $35,
         updated_at = CURRENT_TIMESTAMP
         WHERE stp_id = $36`,
        [stp_name, design_capacity_mld, treatment_type,
         inlet_chamber_m3, grit_chamber_m3, primary_settling_m3,
         aeration_tank_m3, secondary_settling_m3,
         tertiary_filter_m3, chlorine_contact_m3,
         sludge_thickening_m3, sludge_dewatering_m3,
         rcc_grade, total_rcc_volume_m3, rcc_unit_cost, rcc_total,
         steel_grade, steel_quantity_tons, steel_percentage, steel_unit_cost, steel_total,
         waterproofing_type, waterproofing_area_m2, waterproofing_thickness_mm, waterproofing_unit_cost, waterproofing_total,
         epoxy_coating_area_m2, epoxy_coating_unit_cost, epoxy_total,
         concrete_flooring_area_m2, concrete_flooring_unit_cost, flooring_total,
         subtotal, contingency_percent, final_cost, stp_id]
      );
    } else {
      await pool.query(
        `INSERT INTO stp_civil_boq (
         stp_id, stp_name, design_capacity_mld, treatment_type,
         inlet_chamber_m3, grit_chamber_m3, primary_settling_m3,
         aeration_tank_m3, secondary_settling_m3,
         tertiary_filter_m3, chlorine_contact_m3,
         sludge_thickening_m3, sludge_dewatering_m3,
         rcc_grade, total_rcc_volume_m3, rcc_unit_cost, rcc_total_cost,
         steel_grade, steel_quantity_tons, steel_percentage, steel_unit_cost, steel_total_cost,
         waterproofing_type, waterproofing_area_m2, waterproofing_thickness_mm, waterproofing_unit_cost, waterproofing_total_cost,
         epoxy_coating_area_m2, epoxy_coating_unit_cost, epoxy_coating_total_cost,
         concrete_flooring_area_m2, concrete_flooring_unit_cost, concrete_flooring_total_cost,
         total_civil_cost, contingency_percent, final_civil_cost
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35)`,
        [stp_id, stp_name, design_capacity_mld, treatment_type,
         inlet_chamber_m3, grit_chamber_m3, primary_settling_m3,
         aeration_tank_m3, secondary_settling_m3,
         tertiary_filter_m3, chlorine_contact_m3,
         sludge_thickening_m3, sludge_dewatering_m3,
         rcc_grade, total_rcc_volume_m3, rcc_unit_cost, rcc_total,
         steel_grade, steel_quantity_tons, steel_percentage, steel_unit_cost, steel_total,
         waterproofing_type, waterproofing_area_m2, waterproofing_thickness_mm, waterproofing_unit_cost, waterproofing_total,
         epoxy_coating_area_m2, epoxy_coating_unit_cost, epoxy_total,
         concrete_flooring_area_m2, concrete_flooring_unit_cost, flooring_total,
         subtotal, contingency_percent, final_cost]
      );
    }

    res.json({ success: true, stp_id, final_civil_cost: final_cost, total_rcc_volume_m3 });
  } catch (error) {
    console.error('[STP Civil BOQ] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get STP Civil BOQ
router.get('/:stp_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM stp_civil_boq WHERE stp_id = $1`,
      [req.params.stp_id]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    res.json({});
  }
});

// Get all STP Civil BOQs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM stp_civil_boq ORDER BY created_at DESC`);
    res.json(result.rows || []);
  } catch (error) {
    res.json([]);
  }
});

export default router;
