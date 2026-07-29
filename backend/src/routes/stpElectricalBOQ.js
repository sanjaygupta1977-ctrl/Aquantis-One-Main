import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Initialize STP Electrical BOQ Table
export async function initSTPElectricalBOQTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stp_electrical_boq (
        id SERIAL PRIMARY KEY,
        stp_id VARCHAR(255) UNIQUE,
        stp_name VARCHAR(255),
        design_capacity_mld DECIMAL(10, 2),
        
        -- Main Supply & Distribution
        incoming_feeder_capacity_kva DECIMAL(10, 2),
        feeder_cable_type VARCHAR(100),
        feeder_cable_length_m DECIMAL(10, 2),
        feeder_cable_unit_cost DECIMAL(12, 2),
        feeder_cable_total_cost DECIMAL(15, 2),
        
        -- Main Switchgear
        main_switchgear_capacity_a DECIMAL(10, 2),
        main_switchgear_type VARCHAR(100),
        main_switchgear_material VARCHAR(100),
        main_switchgear_qty INT,
        main_switchgear_unit_cost DECIMAL(12, 2),
        main_switchgear_total_cost DECIMAL(15, 2),
        
        -- Distribution Panels
        distribution_panel_qty INT,
        distribution_panel_capacity_kva DECIMAL(10, 2),
        distribution_panel_unit_cost DECIMAL(12, 2),
        distribution_panel_total_cost DECIMAL(15, 2),
        
        -- Power Distribution
        power_cable_length_m DECIMAL(12, 2),
        power_cable_type VARCHAR(100),
        power_cable_unit_cost DECIMAL(12, 2),
        power_cable_total_cost DECIMAL(15, 2),
        
        control_cable_length_m DECIMAL(12, 2),
        control_cable_type VARCHAR(100),
        control_cable_unit_cost DECIMAL(12, 2),
        control_cable_total_cost DECIMAL(15, 2),
        
        -- Motors & Starters
        motor_qty INT,
        motor_power_kw DECIMAL(10, 2),
        motor_type VARCHAR(100),
        motor_efficiency_class VARCHAR(50),
        motor_unit_cost DECIMAL(12, 2),
        motor_total_cost DECIMAL(15, 2),
        
        vfd_qty INT,
        vfd_type VARCHAR(100),
        vfd_power_kw DECIMAL(10, 2),
        vfd_unit_cost DECIMAL(12, 2),
        vfd_total_cost DECIMAL(15, 2),
        
        starter_dol_qty INT,
        starter_dol_unit_cost DECIMAL(12, 2),
        starter_dol_total_cost DECIMAL(15, 2),
        
        -- Lighting
        led_light_qty INT,
        led_light_wattage_w INT,
        led_light_unit_cost DECIMAL(12, 2),
        led_light_total_cost DECIMAL(15, 2),
        
        light_pole_qty INT,
        light_pole_height_m DECIMAL(5, 2),
        light_pole_unit_cost DECIMAL(12, 2),
        light_pole_total_cost DECIMAL(15, 2),
        
        -- Earthing & Protection
        earthing_pit_qty INT,
        earthing_pit_depth_m DECIMAL(5, 2),
        earthing_pit_material VARCHAR(100),
        earthing_pit_unit_cost DECIMAL(12, 2),
        earthing_pit_total_cost DECIMAL(15, 2),
        
        earth_electrode_type VARCHAR(100),
        earth_electrode_qty INT,
        earth_electrode_unit_cost DECIMAL(12, 2),
        earth_electrode_total_cost DECIMAL(15, 2),
        
        earth_conductor_length_m DECIMAL(10, 2),
        earth_conductor_type VARCHAR(100),
        earth_conductor_unit_cost DECIMAL(12, 2),
        earth_conductor_total_cost DECIMAL(15, 2),
        
        -- Protection Devices
        mcb_qty INT,
        mcb_rating_a INT,
        mcb_unit_cost DECIMAL(12, 2),
        mcb_total_cost DECIMAL(15, 2),
        
        acb_qty INT,
        acb_rating_a DECIMAL(10, 2),
        acb_unit_cost DECIMAL(12, 2),
        acb_total_cost DECIMAL(15, 2),
        
        surge_protection_qty INT,
        surge_protection_type VARCHAR(100),
        surge_protection_unit_cost DECIMAL(12, 2),
        surge_protection_total_cost DECIMAL(15, 2),
        
        -- Testing & Commissioning
        testing_commissioning_cost DECIMAL(15, 2),
        
        -- Contingency
        total_electrical_cost DECIMAL(15, 2),
        contingency_percent DECIMAL(5, 2),
        final_electrical_cost DECIMAL(15, 2),
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] STP Electrical BOQ table initialized');
  } catch (err) {
    console.error('[DB] STP Electrical BOQ error:', err.message);
  }
}

// Save STP Electrical BOQ
router.post('/save', async (req, res) => {
  try {
    const data = req.body;
    const {
      stp_id, stp_name, design_capacity_mld,
      // Main Supply
      incoming_feeder_capacity_kva, feeder_cable_type, feeder_cable_length_m, feeder_cable_unit_cost,
      // Main Switchgear
      main_switchgear_capacity_a, main_switchgear_type, main_switchgear_material,
      main_switchgear_qty, main_switchgear_unit_cost,
      // Distribution Panels
      distribution_panel_qty, distribution_panel_capacity_kva, distribution_panel_unit_cost,
      // Power Distribution
      power_cable_length_m, power_cable_type, power_cable_unit_cost,
      control_cable_length_m, control_cable_type, control_cable_unit_cost,
      // Motors & Starters
      motor_qty, motor_power_kw, motor_type, motor_efficiency_class, motor_unit_cost,
      vfd_qty, vfd_type, vfd_power_kw, vfd_unit_cost,
      starter_dol_qty, starter_dol_unit_cost,
      // Lighting
      led_light_qty, led_light_wattage_w, led_light_unit_cost,
      light_pole_qty, light_pole_height_m, light_pole_unit_cost,
      // Earthing
      earthing_pit_qty, earthing_pit_depth_m, earthing_pit_material, earthing_pit_unit_cost,
      earth_electrode_type, earth_electrode_qty, earth_electrode_unit_cost,
      earth_conductor_length_m, earth_conductor_type, earth_conductor_unit_cost,
      // Protection
      mcb_qty, mcb_rating_a, mcb_unit_cost,
      acb_qty, acb_rating_a, acb_unit_cost,
      surge_protection_qty, surge_protection_type, surge_protection_unit_cost,
      // Testing
      testing_commissioning_cost = 50000,
      contingency_percent = 10
    } = data;

    // Calculate costs
    const feeder_cable_total = feeder_cable_length_m * feeder_cable_unit_cost;
    const main_switchgear_total = main_switchgear_qty * main_switchgear_unit_cost;
    const distribution_panel_total = distribution_panel_qty * distribution_panel_unit_cost;
    const power_cable_total = power_cable_length_m * power_cable_unit_cost;
    const control_cable_total = control_cable_length_m * control_cable_unit_cost;
    const motor_total = motor_qty * motor_unit_cost;
    const vfd_total = vfd_qty * vfd_unit_cost;
    const starter_dol_total = starter_dol_qty * starter_dol_unit_cost;
    const led_light_total = led_light_qty * led_light_unit_cost;
    const light_pole_total = light_pole_qty * light_pole_unit_cost;
    const earthing_pit_total = earthing_pit_qty * earthing_pit_unit_cost;
    const earth_electrode_total = earth_electrode_qty * earth_electrode_unit_cost;
    const earth_conductor_total = earth_conductor_length_m * earth_conductor_unit_cost;
    const mcb_total = mcb_qty * mcb_unit_cost;
    const acb_total = acb_qty * acb_unit_cost;
    const surge_protection_total = surge_protection_qty * surge_protection_unit_cost;

    const subtotal = feeder_cable_total + main_switchgear_total + distribution_panel_total +
                     power_cable_total + control_cable_total + motor_total + vfd_total +
                     starter_dol_total + led_light_total + light_pole_total +
                     earthing_pit_total + earth_electrode_total + earth_conductor_total +
                     mcb_total + acb_total + surge_protection_total + testing_commissioning_cost;
    
    const contingency = subtotal * (contingency_percent / 100);
    const final_cost = subtotal + contingency;

    const exists = await pool.query(
      `SELECT id FROM stp_electrical_boq WHERE stp_id = $1`,
      [stp_id]
    );

    const baseValues = [
      stp_id, stp_name, design_capacity_mld,
      incoming_feeder_capacity_kva, feeder_cable_type, feeder_cable_length_m, feeder_cable_unit_cost, feeder_cable_total,
      main_switchgear_capacity_a, main_switchgear_type, main_switchgear_material, main_switchgear_qty,
      main_switchgear_unit_cost, main_switchgear_total,
      distribution_panel_qty, distribution_panel_capacity_kva, distribution_panel_unit_cost, distribution_panel_total,
      power_cable_length_m, power_cable_type, power_cable_unit_cost, power_cable_total,
      control_cable_length_m, control_cable_type, control_cable_unit_cost, control_cable_total,
      motor_qty, motor_power_kw, motor_type, motor_efficiency_class, motor_unit_cost, motor_total,
      vfd_qty, vfd_type, vfd_power_kw, vfd_unit_cost, vfd_total,
      starter_dol_qty, starter_dol_unit_cost, starter_dol_total,
      led_light_qty, led_light_wattage_w, led_light_unit_cost, led_light_total,
      light_pole_qty, light_pole_height_m, light_pole_unit_cost, light_pole_total,
      earthing_pit_qty, earthing_pit_depth_m, earthing_pit_material, earthing_pit_unit_cost, earthing_pit_total,
      earth_electrode_type, earth_electrode_qty, earth_electrode_unit_cost, earth_electrode_total,
      earth_conductor_length_m, earth_conductor_type, earth_conductor_unit_cost, earth_conductor_total,
      mcb_qty, mcb_rating_a, mcb_unit_cost, mcb_total,
      acb_qty, acb_rating_a, acb_unit_cost, acb_total,
      surge_protection_qty, surge_protection_type, surge_protection_unit_cost, surge_protection_total,
      testing_commissioning_cost,
      subtotal, contingency_percent, final_cost
    ];

    if (exists.rows.length > 0) {
      const updateStmt = `UPDATE stp_electrical_boq SET
        stp_name = $2, design_capacity_mld = $3,
        incoming_feeder_capacity_kva = $4, feeder_cable_type = $5, feeder_cable_length_m = $6, feeder_cable_unit_cost = $7, feeder_cable_total_cost = $8,
        main_switchgear_capacity_a = $9, main_switchgear_type = $10, main_switchgear_material = $11, main_switchgear_qty = $12, main_switchgear_unit_cost = $13, main_switchgear_total_cost = $14,
        distribution_panel_qty = $15, distribution_panel_capacity_kva = $16, distribution_panel_unit_cost = $17, distribution_panel_total_cost = $18,
        power_cable_length_m = $19, power_cable_type = $20, power_cable_unit_cost = $21, power_cable_total_cost = $22,
        control_cable_length_m = $23, control_cable_type = $24, control_cable_unit_cost = $25, control_cable_total_cost = $26,
        motor_qty = $27, motor_power_kw = $28, motor_type = $29, motor_efficiency_class = $30, motor_unit_cost = $31, motor_total_cost = $32,
        vfd_qty = $33, vfd_type = $34, vfd_power_kw = $35, vfd_unit_cost = $36, vfd_total_cost = $37,
        starter_dol_qty = $38, starter_dol_unit_cost = $39, starter_dol_total_cost = $40,
        led_light_qty = $41, led_light_wattage_w = $42, led_light_unit_cost = $43, led_light_total_cost = $44,
        light_pole_qty = $45, light_pole_height_m = $46, light_pole_unit_cost = $47, light_pole_total_cost = $48,
        earthing_pit_qty = $49, earthing_pit_depth_m = $50, earthing_pit_material = $51, earthing_pit_unit_cost = $52, earthing_pit_total_cost = $53,
        earth_electrode_type = $54, earth_electrode_qty = $55, earth_electrode_unit_cost = $56, earth_electrode_total_cost = $57,
        earth_conductor_length_m = $58, earth_conductor_type = $59, earth_conductor_unit_cost = $60, earth_conductor_total_cost = $61,
        mcb_qty = $62, mcb_rating_a = $63, mcb_unit_cost = $64, mcb_total_cost = $65,
        acb_qty = $66, acb_rating_a = $67, acb_unit_cost = $68, acb_total_cost = $69,
        surge_protection_qty = $70, surge_protection_type = $71, surge_protection_unit_cost = $72, surge_protection_total_cost = $73,
        testing_commissioning_cost = $74,
        total_electrical_cost = $75, contingency_percent = $76, final_electrical_cost = $77,
        updated_at = CURRENT_TIMESTAMP
        WHERE stp_id = $1`;
      await pool.query(updateStmt, baseValues);
    } else {
      const cols = `(stp_id, stp_name, design_capacity_mld, incoming_feeder_capacity_kva, feeder_cable_type, feeder_cable_length_m, feeder_cable_unit_cost, feeder_cable_total_cost, main_switchgear_capacity_a, main_switchgear_type, main_switchgear_material, main_switchgear_qty, main_switchgear_unit_cost, main_switchgear_total_cost, distribution_panel_qty, distribution_panel_capacity_kva, distribution_panel_unit_cost, distribution_panel_total_cost, power_cable_length_m, power_cable_type, power_cable_unit_cost, power_cable_total_cost, control_cable_length_m, control_cable_type, control_cable_unit_cost, control_cable_total_cost, motor_qty, motor_power_kw, motor_type, motor_efficiency_class, motor_unit_cost, motor_total_cost, vfd_qty, vfd_type, vfd_power_kw, vfd_unit_cost, vfd_total_cost, starter_dol_qty, starter_dol_unit_cost, starter_dol_total_cost, led_light_qty, led_light_wattage_w, led_light_unit_cost, led_light_total_cost, light_pole_qty, light_pole_height_m, light_pole_unit_cost, light_pole_total_cost, earthing_pit_qty, earthing_pit_depth_m, earthing_pit_material, earthing_pit_unit_cost, earthing_pit_total_cost, earth_electrode_type, earth_electrode_qty, earth_electrode_unit_cost, earth_electrode_total_cost, earth_conductor_length_m, earth_conductor_type, earth_conductor_unit_cost, earth_conductor_total_cost, mcb_qty, mcb_rating_a, mcb_unit_cost, mcb_total_cost, acb_qty, acb_rating_a, acb_unit_cost, acb_total_cost, surge_protection_qty, surge_protection_type, surge_protection_unit_cost, surge_protection_total_cost, testing_commissioning_cost, total_electrical_cost, contingency_percent, final_electrical_cost)`;
      const placeholders = Array.from({length: baseValues.length}, (_, i) => `$${i+1}`).join(', ');
      await pool.query(`INSERT INTO stp_electrical_boq ${cols} VALUES (${placeholders})`, baseValues);
    }

    res.json({ success: true, stp_id, final_electrical_cost: final_cost });
  } catch (error) {
    console.error('[STP Electrical BOQ] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get STP Electrical BOQ
router.get('/:stp_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM stp_electrical_boq WHERE stp_id = $1`,
      [req.params.stp_id]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    res.json({});
  }
});

export default router;
