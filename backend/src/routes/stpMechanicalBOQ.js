import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Initialize STP Mechanical BOQ Table
export async function initSTPMechanicalBOQTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stp_mechanical_boq (
        id SERIAL PRIMARY KEY,
        stp_id VARCHAR(255) UNIQUE,
        stp_name VARCHAR(255),
        design_capacity_mld DECIMAL(10, 2),
        
        -- Inlet Pump
        inlet_pump_type VARCHAR(100),
        inlet_pump_head_m DECIMAL(10, 2),
        inlet_pump_flow_lps DECIMAL(10, 2),
        inlet_pump_power_kw DECIMAL(10, 2),
        inlet_pump_efficiency_percent DECIMAL(5, 2),
        inlet_pump_material VARCHAR(100),
        inlet_pump_qty INT,
        inlet_pump_unit_cost DECIMAL(12, 2),
        inlet_pump_total_cost DECIMAL(15, 2),
        
        -- Grit Chamber Pumps
        grit_pump_type VARCHAR(100),
        grit_pump_flow_lps DECIMAL(10, 2),
        grit_pump_power_kw DECIMAL(10, 2),
        grit_pump_efficiency_percent DECIMAL(5, 2),
        grit_pump_material VARCHAR(100),
        grit_pump_qty INT,
        grit_pump_unit_cost DECIMAL(12, 2),
        grit_pump_total_cost DECIMAL(15, 2),
        
        -- RAS (Return Activated Sludge) Pump
        ras_pump_type VARCHAR(100),
        ras_pump_flow_lps DECIMAL(10, 2),
        ras_pump_head_m DECIMAL(10, 2),
        ras_pump_power_kw DECIMAL(10, 2),
        ras_pump_efficiency_percent DECIMAL(5, 2),
        ras_pump_material VARCHAR(100),
        ras_pump_qty INT,
        ras_pump_unit_cost DECIMAL(12, 2),
        ras_pump_total_cost DECIMAL(15, 2),
        
        -- WAS (Waste Activated Sludge) Pump
        was_pump_type VARCHAR(100),
        was_pump_flow_lps DECIMAL(10, 2),
        was_pump_power_kw DECIMAL(10, 2),
        was_pump_efficiency_percent DECIMAL(5, 2),
        was_pump_material VARCHAR(100),
        was_pump_qty INT,
        was_pump_unit_cost DECIMAL(12, 2),
        was_pump_total_cost DECIMAL(15, 2),
        
        -- Effluent Pump
        effluent_pump_type VARCHAR(100),
        effluent_pump_flow_lps DECIMAL(10, 2),
        effluent_pump_head_m DECIMAL(10, 2),
        effluent_pump_power_kw DECIMAL(10, 2),
        effluent_pump_efficiency_percent DECIMAL(5, 2),
        effluent_pump_material VARCHAR(100),
        effluent_pump_qty INT,
        effluent_pump_unit_cost DECIMAL(12, 2),
        effluent_pump_total_cost DECIMAL(15, 2),
        
        -- Aeration System
        blower_type VARCHAR(100),
        blower_capacity_m3_min DECIMAL(10, 2),
        blower_power_kw DECIMAL(10, 2),
        blower_efficiency_percent DECIMAL(5, 2),
        blower_qty INT,
        blower_unit_cost DECIMAL(12, 2),
        blower_total_cost DECIMAL(15, 2),
        
        diffuser_type VARCHAR(100),
        diffuser_qty INT,
        diffuser_unit_cost DECIMAL(12, 2),
        diffuser_total_cost DECIMAL(15, 2),
        
        -- Membrane Filter (SS 316 for robustness)
        membrane_type VARCHAR(100),
        membrane_material VARCHAR(100),
        membrane_area_m2 DECIMAL(12, 2),
        membrane_pore_micron DECIMAL(5, 2),
        membrane_qty INT,
        membrane_unit_cost DECIMAL(12, 2),
        membrane_total_cost DECIMAL(15, 2),
        
        -- Piping & Valves
        piping_material VARCHAR(100),
        piping_length_m DECIMAL(10, 2),
        piping_unit_cost DECIMAL(12, 2),
        piping_total_cost DECIMAL(15, 2),
        
        valve_qty INT,
        valve_unit_cost DECIMAL(12, 2),
        valve_total_cost DECIMAL(15, 2),
        
        -- Miscellaneous
        misc_items_cost DECIMAL(15, 2),
        
        -- Totals
        total_mechanical_cost DECIMAL(15, 2),
        contingency_percent DECIMAL(5, 2),
        final_mechanical_cost DECIMAL(15, 2),
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] STP Mechanical BOQ table initialized');
  } catch (err) {
    console.error('[DB] STP Mechanical BOQ error:', err.message);
  }
}

// Save STP Mechanical BOQ
router.post('/save', async (req, res) => {
  try {
    const data = req.body;
    const {
      stp_id, stp_name, design_capacity_mld,
      // Inlet Pump
      inlet_pump_type, inlet_pump_head_m, inlet_pump_flow_lps, inlet_pump_power_kw, 
      inlet_pump_efficiency_percent, inlet_pump_material, inlet_pump_qty, inlet_pump_unit_cost,
      // Grit Pump
      grit_pump_type, grit_pump_flow_lps, grit_pump_power_kw, grit_pump_efficiency_percent,
      grit_pump_material, grit_pump_qty, grit_pump_unit_cost,
      // RAS Pump
      ras_pump_type, ras_pump_flow_lps, ras_pump_head_m, ras_pump_power_kw, 
      ras_pump_efficiency_percent, ras_pump_material, ras_pump_qty, ras_pump_unit_cost,
      // WAS Pump
      was_pump_type, was_pump_flow_lps, was_pump_power_kw, was_pump_efficiency_percent,
      was_pump_material, was_pump_qty, was_pump_unit_cost,
      // Effluent Pump
      effluent_pump_type, effluent_pump_flow_lps, effluent_pump_head_m, effluent_pump_power_kw,
      effluent_pump_efficiency_percent, effluent_pump_material, effluent_pump_qty, effluent_pump_unit_cost,
      // Blower
      blower_type, blower_capacity_m3_min, blower_power_kw, blower_efficiency_percent,
      blower_qty, blower_unit_cost,
      // Diffuser
      diffuser_type, diffuser_qty, diffuser_unit_cost,
      // Membrane
      membrane_type, membrane_material, membrane_area_m2, membrane_pore_micron,
      membrane_qty, membrane_unit_cost,
      // Piping
      piping_material, piping_length_m, piping_unit_cost,
      valve_qty, valve_unit_cost,
      misc_items_cost = 0,
      contingency_percent = 8
    } = data;

    // Calculate costs
    const inlet_pump_total = inlet_pump_qty * inlet_pump_unit_cost;
    const grit_pump_total = grit_pump_qty * grit_pump_unit_cost;
    const ras_pump_total = ras_pump_qty * ras_pump_unit_cost;
    const was_pump_total = was_pump_qty * was_pump_unit_cost;
    const effluent_pump_total = effluent_pump_qty * effluent_pump_unit_cost;
    const blower_total = blower_qty * blower_unit_cost;
    const diffuser_total = diffuser_qty * diffuser_unit_cost;
    const membrane_total = membrane_qty * membrane_unit_cost;
    const piping_total = piping_length_m * piping_unit_cost;
    const valve_total = valve_qty * valve_unit_cost;

    const subtotal = inlet_pump_total + grit_pump_total + ras_pump_total + was_pump_total +
                     effluent_pump_total + blower_total + diffuser_total + membrane_total +
                     piping_total + valve_total + misc_items_cost;
    const contingency = subtotal * (contingency_percent / 100);
    const final_cost = subtotal + contingency;

    const exists = await pool.query(
      `SELECT id FROM stp_mechanical_boq WHERE stp_id = $1`,
      [stp_id]
    );

    const updateStmt = `
      UPDATE stp_mechanical_boq SET
      stp_name = $1, design_capacity_mld = $2,
      inlet_pump_type = $3, inlet_pump_head_m = $4, inlet_pump_flow_lps = $5, inlet_pump_power_kw = $6,
      inlet_pump_efficiency_percent = $7, inlet_pump_material = $8, inlet_pump_qty = $9, inlet_pump_unit_cost = $10,
      inlet_pump_total_cost = $11,
      grit_pump_type = $12, grit_pump_flow_lps = $13, grit_pump_power_kw = $14, grit_pump_efficiency_percent = $15,
      grit_pump_material = $16, grit_pump_qty = $17, grit_pump_unit_cost = $18, grit_pump_total_cost = $19,
      ras_pump_type = $20, ras_pump_flow_lps = $21, ras_pump_head_m = $22, ras_pump_power_kw = $23,
      ras_pump_efficiency_percent = $24, ras_pump_material = $25, ras_pump_qty = $26, ras_pump_unit_cost = $27,
      ras_pump_total_cost = $28,
      was_pump_type = $29, was_pump_flow_lps = $30, was_pump_power_kw = $31, was_pump_efficiency_percent = $32,
      was_pump_material = $33, was_pump_qty = $34, was_pump_unit_cost = $35, was_pump_total_cost = $36,
      effluent_pump_type = $37, effluent_pump_flow_lps = $38, effluent_pump_head_m = $39, effluent_pump_power_kw = $40,
      effluent_pump_efficiency_percent = $41, effluent_pump_material = $42, effluent_pump_qty = $43,
      effluent_pump_unit_cost = $44, effluent_pump_total_cost = $45,
      blower_type = $46, blower_capacity_m3_min = $47, blower_power_kw = $48, blower_efficiency_percent = $49,
      blower_qty = $50, blower_unit_cost = $51, blower_total_cost = $52,
      diffuser_type = $53, diffuser_qty = $54, diffuser_unit_cost = $55, diffuser_total_cost = $56,
      membrane_type = $57, membrane_material = $58, membrane_area_m2 = $59, membrane_pore_micron = $60,
      membrane_qty = $61, membrane_unit_cost = $62, membrane_total_cost = $63,
      piping_material = $64, piping_length_m = $65, piping_unit_cost = $66, piping_total_cost = $67,
      valve_qty = $68, valve_unit_cost = $69, valve_total_cost = $70,
      misc_items_cost = $71,
      total_mechanical_cost = $72, contingency_percent = $73, final_mechanical_cost = $74,
      updated_at = CURRENT_TIMESTAMP
      WHERE stp_id = $75
    `;

    const values = [
      stp_name, design_capacity_mld,
      inlet_pump_type, inlet_pump_head_m, inlet_pump_flow_lps, inlet_pump_power_kw,
      inlet_pump_efficiency_percent, inlet_pump_material, inlet_pump_qty, inlet_pump_unit_cost,
      inlet_pump_total,
      grit_pump_type, grit_pump_flow_lps, grit_pump_power_kw, grit_pump_efficiency_percent,
      grit_pump_material, grit_pump_qty, grit_pump_unit_cost, grit_pump_total,
      ras_pump_type, ras_pump_flow_lps, ras_pump_head_m, ras_pump_power_kw,
      ras_pump_efficiency_percent, ras_pump_material, ras_pump_qty, ras_pump_unit_cost,
      ras_pump_total,
      was_pump_type, was_pump_flow_lps, was_pump_power_kw, was_pump_efficiency_percent,
      was_pump_material, was_pump_qty, was_pump_unit_cost, was_pump_total,
      effluent_pump_type, effluent_pump_flow_lps, effluent_pump_head_m, effluent_pump_power_kw,
      effluent_pump_efficiency_percent, effluent_pump_material, effluent_pump_qty,
      effluent_pump_unit_cost, effluent_pump_total,
      blower_type, blower_capacity_m3_min, blower_power_kw, blower_efficiency_percent,
      blower_qty, blower_unit_cost, blower_total,
      diffuser_type, diffuser_qty, diffuser_unit_cost, diffuser_total,
      membrane_type, membrane_material, membrane_area_m2, membrane_pore_micron,
      membrane_qty, membrane_unit_cost, membrane_total,
      piping_material, piping_length_m, piping_unit_cost, piping_total,
      valve_qty, valve_unit_cost, valve_total,
      misc_items_cost,
      subtotal, contingency_percent, final_cost,
      stp_id
    ];

    if (exists.rows.length > 0) {
      await pool.query(updateStmt, values);
    } else {
      const insertStmt = `
        INSERT INTO stp_mechanical_boq (
          stp_id, stp_name, design_capacity_mld,
          inlet_pump_type, inlet_pump_head_m, inlet_pump_flow_lps, inlet_pump_power_kw,
          inlet_pump_efficiency_percent, inlet_pump_material, inlet_pump_qty, inlet_pump_unit_cost,
          inlet_pump_total_cost,
          grit_pump_type, grit_pump_flow_lps, grit_pump_power_kw, grit_pump_efficiency_percent,
          grit_pump_material, grit_pump_qty, grit_pump_unit_cost, grit_pump_total_cost,
          ras_pump_type, ras_pump_flow_lps, ras_pump_head_m, ras_pump_power_kw,
          ras_pump_efficiency_percent, ras_pump_material, ras_pump_qty, ras_pump_unit_cost,
          ras_pump_total_cost,
          was_pump_type, was_pump_flow_lps, was_pump_power_kw, was_pump_efficiency_percent,
          was_pump_material, was_pump_qty, was_pump_unit_cost, was_pump_total_cost,
          effluent_pump_type, effluent_pump_flow_lps, effluent_pump_head_m, effluent_pump_power_kw,
          effluent_pump_efficiency_percent, effluent_pump_material, effluent_pump_qty,
          effluent_pump_unit_cost, effluent_pump_total_cost,
          blower_type, blower_capacity_m3_min, blower_power_kw, blower_efficiency_percent,
          blower_qty, blower_unit_cost, blower_total_cost,
          diffuser_type, diffuser_qty, diffuser_unit_cost, diffuser_total_cost,
          membrane_type, membrane_material, membrane_area_m2, membrane_pore_micron,
          membrane_qty, membrane_unit_cost, membrane_total_cost,
          piping_material, piping_length_m, piping_unit_cost, piping_total_cost,
          valve_qty, valve_unit_cost, valve_total_cost,
          misc_items_cost,
          total_mechanical_cost, contingency_percent, final_mechanical_cost
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74)
      `;
      await pool.query(insertStmt, values.slice(0, -1));
    }

    res.json({ 
      success: true, 
      stp_id, 
      final_mechanical_cost: final_cost,
      total_power_kw: (inlet_pump_power_kw + ras_pump_power_kw + was_pump_power_kw + effluent_pump_power_kw + blower_power_kw)
    });
  } catch (error) {
    console.error('[STP Mechanical BOQ] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get STP Mechanical BOQ
router.get('/:stp_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM stp_mechanical_boq WHERE stp_id = $1`,
      [req.params.stp_id]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    res.json({});
  }
});

// Get all STP Mechanical BOQs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM stp_mechanical_boq ORDER BY created_at DESC`);
    res.json(result.rows || []);
  } catch (error) {
    res.json([]);
  }
});

export default router;
