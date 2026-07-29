import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Initialize STP Instrumentation BOQ Table
export async function initSTPInstrumentationBOQTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stp_instrumentation_boq (
        id SERIAL PRIMARY KEY,
        stp_id VARCHAR(255) UNIQUE,
        stp_name VARCHAR(255),
        design_capacity_mld DECIMAL(10, 2),
        
        -- Water Quality Sensors
        do_sensor_type VARCHAR(100),
        do_sensor_range VARCHAR(50),
        do_sensor_accuracy_percent DECIMAL(5, 2),
        do_sensor_calibration_std VARCHAR(100),
        do_sensor_qty INT,
        do_sensor_unit_cost DECIMAL(12, 2),
        do_sensor_total_cost DECIMAL(15, 2),
        
        ph_sensor_type VARCHAR(100),
        ph_sensor_range VARCHAR(50),
        ph_sensor_accuracy DECIMAL(5, 2),
        ph_sensor_calibration_std VARCHAR(100),
        ph_sensor_qty INT,
        ph_sensor_unit_cost DECIMAL(12, 2),
        ph_sensor_total_cost DECIMAL(15, 2),
        
        orp_sensor_type VARCHAR(100),
        orp_sensor_range VARCHAR(50),
        orp_sensor_accuracy_mv INT,
        orp_sensor_calibration_std VARCHAR(100),
        orp_sensor_qty INT,
        orp_sensor_unit_cost DECIMAL(12, 2),
        orp_sensor_total_cost DECIMAL(15, 2),
        
        tss_sensor_type VARCHAR(100),
        tss_sensor_range VARCHAR(50),
        tss_sensor_accuracy_percent DECIMAL(5, 2),
        tss_sensor_calibration_std VARCHAR(100),
        tss_sensor_qty INT,
        tss_sensor_unit_cost DECIMAL(12, 2),
        tss_sensor_total_cost DECIMAL(15, 2),
        
        -- Flow Meters
        flow_meter_type VARCHAR(100),
        flow_meter_range_lps VARCHAR(50),
        flow_meter_accuracy_percent DECIMAL(5, 2),
        flow_meter_calibration_std VARCHAR(100),
        flow_meter_qty INT,
        flow_meter_unit_cost DECIMAL(12, 2),
        flow_meter_total_cost DECIMAL(15, 2),
        
        -- Level Sensors
        level_sensor_type VARCHAR(100),
        level_sensor_range_m VARCHAR(50),
        level_sensor_accuracy_mm INT,
        level_sensor_calibration_std VARCHAR(100),
        level_sensor_qty INT,
        level_sensor_unit_cost DECIMAL(12, 2),
        level_sensor_total_cost DECIMAL(15, 2),
        
        -- Pressure Sensors
        pressure_sensor_type VARCHAR(100),
        pressure_sensor_range_bar VARCHAR(50),
        pressure_sensor_accuracy_percent DECIMAL(5, 2),
        pressure_sensor_calibration_std VARCHAR(100),
        pressure_sensor_qty INT,
        pressure_sensor_unit_cost DECIMAL(12, 2),
        pressure_sensor_total_cost DECIMAL(15, 2),
        
        -- Temperature Sensors
        temp_sensor_type VARCHAR(100),
        temp_sensor_range VARCHAR(50),
        temp_sensor_accuracy_c DECIMAL(5, 2),
        temp_sensor_calibration_std VARCHAR(100),
        temp_sensor_qty INT,
        temp_sensor_unit_cost DECIMAL(12, 2),
        temp_sensor_total_cost DECIMAL(15, 2),
        
        -- Redundancy (Critical for STP Monitoring)
        redundancy_type VARCHAR(100),
        redundancy_sensors_percent DECIMAL(5, 2),
        redundancy_cost_percent DECIMAL(5, 2),
        redundancy_total_cost DECIMAL(15, 2),
        
        -- Data Logger
        data_logger_type VARCHAR(100),
        data_logger_channels INT,
        data_logger_memory_gb DECIMAL(10, 2),
        data_logger_qty INT,
        data_logger_unit_cost DECIMAL(12, 2),
        data_logger_total_cost DECIMAL(15, 2),
        
        -- SCADA System
        scada_software_cost DECIMAL(15, 2),
        scada_hardware_cost DECIMAL(15, 2),
        scada_integration_cost DECIMAL(15, 2),
        scada_total_cost DECIMAL(15, 2),
        
        -- Calibration Lab Setup
        calibration_lab_equipment_cost DECIMAL(15, 2),
        calibration_standard_cost DECIMAL(15, 2),
        
        -- Communication Infrastructure
        sensor_network_type VARCHAR(100),
        communication_cable_length_m DECIMAL(10, 2),
        communication_cable_unit_cost DECIMAL(12, 2),
        communication_cable_total_cost DECIMAL(15, 2),
        
        -- Installation & Commissioning
        sensor_installation_cost DECIMAL(15, 2),
        system_integration_cost DECIMAL(15, 2),
        commissioning_cost DECIMAL(15, 2),
        
        -- Contingency
        total_instrumentation_cost DECIMAL(15, 2),
        contingency_percent DECIMAL(5, 2),
        final_instrumentation_cost DECIMAL(15, 2),
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] STP Instrumentation BOQ table initialized');
  } catch (err) {
    console.error('[DB] STP Instrumentation BOQ error:', err.message);
  }
}

// Save STP Instrumentation BOQ
router.post('/save', async (req, res) => {
  try {
    const data = req.body;
    const {
      stp_id, stp_name, design_capacity_mld,
      // Sensors
      do_sensor_type, do_sensor_range, do_sensor_accuracy_percent, do_sensor_calibration_std,
      do_sensor_qty, do_sensor_unit_cost,
      ph_sensor_type, ph_sensor_range, ph_sensor_accuracy, ph_sensor_calibration_std,
      ph_sensor_qty, ph_sensor_unit_cost,
      orp_sensor_type, orp_sensor_range, orp_sensor_accuracy_mv, orp_sensor_calibration_std,
      orp_sensor_qty, orp_sensor_unit_cost,
      tss_sensor_type, tss_sensor_range, tss_sensor_accuracy_percent, tss_sensor_calibration_std,
      tss_sensor_qty, tss_sensor_unit_cost,
      // Flow & Level
      flow_meter_type, flow_meter_range_lps, flow_meter_accuracy_percent, flow_meter_calibration_std,
      flow_meter_qty, flow_meter_unit_cost,
      level_sensor_type, level_sensor_range_m, level_sensor_accuracy_mm, level_sensor_calibration_std,
      level_sensor_qty, level_sensor_unit_cost,
      // Pressure & Temp
      pressure_sensor_type, pressure_sensor_range_bar, pressure_sensor_accuracy_percent,
      pressure_sensor_calibration_std, pressure_sensor_qty, pressure_sensor_unit_cost,
      temp_sensor_type, temp_sensor_range, temp_sensor_accuracy_c, temp_sensor_calibration_std,
      temp_sensor_qty, temp_sensor_unit_cost,
      // Redundancy
      redundancy_type, redundancy_sensors_percent, redundancy_cost_percent,
      // Data Logger
      data_logger_type, data_logger_channels, data_logger_memory_gb,
      data_logger_qty, data_logger_unit_cost,
      // SCADA
      scada_software_cost, scada_hardware_cost, scada_integration_cost,
      // Calibration
      calibration_lab_equipment_cost, calibration_standard_cost,
      // Communication
      sensor_network_type, communication_cable_length_m, communication_cable_unit_cost,
      // Installation
      sensor_installation_cost, system_integration_cost, commissioning_cost,
      contingency_percent = 12
    } = data;

    // Calculate costs
    const do_total = do_sensor_qty * do_sensor_unit_cost;
    const ph_total = ph_sensor_qty * ph_sensor_unit_cost;
    const orp_total = orp_sensor_qty * orp_sensor_unit_cost;
    const tss_total = tss_sensor_qty * tss_sensor_unit_cost;
    const flow_total = flow_meter_qty * flow_meter_unit_cost;
    const level_total = level_sensor_qty * level_sensor_unit_cost;
    const pressure_total = pressure_sensor_qty * pressure_sensor_unit_cost;
    const temp_total = temp_sensor_qty * temp_sensor_unit_cost;
    
    const sensors_subtotal = do_total + ph_total + orp_total + tss_total + flow_total + level_total + pressure_total + temp_total;
    const redundancy_cost = sensors_subtotal * (redundancy_cost_percent / 100);
    
    const data_logger_total = data_logger_qty * data_logger_unit_cost;
    const scada_total = scada_software_cost + scada_hardware_cost + scada_integration_cost;
    const calibration_total = calibration_lab_equipment_cost + calibration_standard_cost;
    const communication_total = communication_cable_length_m * communication_cable_unit_cost;
    const installation_total = sensor_installation_cost + system_integration_cost + commissioning_cost;

    const subtotal = sensors_subtotal + redundancy_cost + data_logger_total + scada_total + 
                     calibration_total + communication_total + installation_total;
    const contingency = subtotal * (contingency_percent / 100);
    const final_cost = subtotal + contingency;

    const exists = await pool.query(
      `SELECT id FROM stp_instrumentation_boq WHERE stp_id = $1`,
      [stp_id]
    );

    if (exists.rows.length > 0) {
      await pool.query(
        `UPDATE stp_instrumentation_boq SET
         stp_name = $1, design_capacity_mld = $2,
         do_sensor_type = $3, do_sensor_range = $4, do_sensor_accuracy_percent = $5, do_sensor_calibration_std = $6,
         do_sensor_qty = $7, do_sensor_unit_cost = $8, do_sensor_total_cost = $9,
         ph_sensor_type = $10, ph_sensor_range = $11, ph_sensor_accuracy = $12, ph_sensor_calibration_std = $13,
         ph_sensor_qty = $14, ph_sensor_unit_cost = $15, ph_sensor_total_cost = $16,
         orp_sensor_type = $17, orp_sensor_range = $18, orp_sensor_accuracy_mv = $19, orp_sensor_calibration_std = $20,
         orp_sensor_qty = $21, orp_sensor_unit_cost = $22, orp_sensor_total_cost = $23,
         tss_sensor_type = $24, tss_sensor_range = $25, tss_sensor_accuracy_percent = $26, tss_sensor_calibration_std = $27,
         tss_sensor_qty = $28, tss_sensor_unit_cost = $29, tss_sensor_total_cost = $30,
         flow_meter_type = $31, flow_meter_range_lps = $32, flow_meter_accuracy_percent = $33, flow_meter_calibration_std = $34,
         flow_meter_qty = $35, flow_meter_unit_cost = $36, flow_meter_total_cost = $37,
         level_sensor_type = $38, level_sensor_range_m = $39, level_sensor_accuracy_mm = $40, level_sensor_calibration_std = $41,
         level_sensor_qty = $42, level_sensor_unit_cost = $43, level_sensor_total_cost = $44,
         pressure_sensor_type = $45, pressure_sensor_range_bar = $46, pressure_sensor_accuracy_percent = $47,
         pressure_sensor_calibration_std = $48, pressure_sensor_qty = $49, pressure_sensor_unit_cost = $50, pressure_sensor_total_cost = $51,
         temp_sensor_type = $52, temp_sensor_range = $53, temp_sensor_accuracy_c = $54, temp_sensor_calibration_std = $55,
         temp_sensor_qty = $56, temp_sensor_unit_cost = $57, temp_sensor_total_cost = $58,
         redundancy_type = $59, redundancy_sensors_percent = $60, redundancy_cost_percent = $61, redundancy_total_cost = $62,
         data_logger_type = $63, data_logger_channels = $64, data_logger_memory_gb = $65,
         data_logger_qty = $66, data_logger_unit_cost = $67, data_logger_total_cost = $68,
         scada_software_cost = $69, scada_hardware_cost = $70, scada_integration_cost = $71, scada_total_cost = $72,
         calibration_lab_equipment_cost = $73, calibration_standard_cost = $74,
         sensor_network_type = $75, communication_cable_length_m = $76, communication_cable_unit_cost = $77, communication_cable_total_cost = $78,
         sensor_installation_cost = $79, system_integration_cost = $80, commissioning_cost = $81,
         total_instrumentation_cost = $82, contingency_percent = $83, final_instrumentation_cost = $84,
         updated_at = CURRENT_TIMESTAMP
         WHERE stp_id = $85`,
        [stp_name, design_capacity_mld,
         do_sensor_type, do_sensor_range, do_sensor_accuracy_percent, do_sensor_calibration_std,
         do_sensor_qty, do_sensor_unit_cost, do_total,
         ph_sensor_type, ph_sensor_range, ph_sensor_accuracy, ph_sensor_calibration_std,
         ph_sensor_qty, ph_sensor_unit_cost, ph_total,
         orp_sensor_type, orp_sensor_range, orp_sensor_accuracy_mv, orp_sensor_calibration_std,
         orp_sensor_qty, orp_sensor_unit_cost, orp_total,
         tss_sensor_type, tss_sensor_range, tss_sensor_accuracy_percent, tss_sensor_calibration_std,
         tss_sensor_qty, tss_sensor_unit_cost, tss_total,
         flow_meter_type, flow_meter_range_lps, flow_meter_accuracy_percent, flow_meter_calibration_std,
         flow_meter_qty, flow_meter_unit_cost, flow_total,
         level_sensor_type, level_sensor_range_m, level_sensor_accuracy_mm, level_sensor_calibration_std,
         level_sensor_qty, level_sensor_unit_cost, level_total,
         pressure_sensor_type, pressure_sensor_range_bar, pressure_sensor_accuracy_percent,
         pressure_sensor_calibration_std, pressure_sensor_qty, pressure_sensor_unit_cost, pressure_total,
         temp_sensor_type, temp_sensor_range, temp_sensor_accuracy_c, temp_sensor_calibration_std,
         temp_sensor_qty, temp_sensor_unit_cost, temp_total,
         redundancy_type, redundancy_sensors_percent, redundancy_cost_percent, redundancy_cost,
         data_logger_type, data_logger_channels, data_logger_memory_gb,
         data_logger_qty, data_logger_unit_cost, data_logger_total,
         scada_software_cost, scada_hardware_cost, scada_integration_cost, scada_total,
         calibration_lab_equipment_cost, calibration_standard_cost,
         sensor_network_type, communication_cable_length_m, communication_cable_unit_cost, communication_total,
         sensor_installation_cost, system_integration_cost, commissioning_cost,
         subtotal, contingency_percent, final_cost, stp_id]
      );
    } else {
      await pool.query(
        `INSERT INTO stp_instrumentation_boq (
         stp_id, stp_name, design_capacity_mld,
         do_sensor_type, do_sensor_range, do_sensor_accuracy_percent, do_sensor_calibration_std,
         do_sensor_qty, do_sensor_unit_cost, do_sensor_total_cost,
         ph_sensor_type, ph_sensor_range, ph_sensor_accuracy, ph_sensor_calibration_std,
         ph_sensor_qty, ph_sensor_unit_cost, ph_sensor_total_cost,
         orp_sensor_type, orp_sensor_range, orp_sensor_accuracy_mv, orp_sensor_calibration_std,
         orp_sensor_qty, orp_sensor_unit_cost, orp_sensor_total_cost,
         tss_sensor_type, tss_sensor_range, tss_sensor_accuracy_percent, tss_sensor_calibration_std,
         tss_sensor_qty, tss_sensor_unit_cost, tss_sensor_total_cost,
         flow_meter_type, flow_meter_range_lps, flow_meter_accuracy_percent, flow_meter_calibration_std,
         flow_meter_qty, flow_meter_unit_cost, flow_meter_total_cost,
         level_sensor_type, level_sensor_range_m, level_sensor_accuracy_mm, level_sensor_calibration_std,
         level_sensor_qty, level_sensor_unit_cost, level_sensor_total_cost,
         pressure_sensor_type, pressure_sensor_range_bar, pressure_sensor_accuracy_percent,
         pressure_sensor_calibration_std, pressure_sensor_qty, pressure_sensor_unit_cost, pressure_sensor_total_cost,
         temp_sensor_type, temp_sensor_range, temp_sensor_accuracy_c, temp_sensor_calibration_std,
         temp_sensor_qty, temp_sensor_unit_cost, temp_sensor_total_cost,
         redundancy_type, redundancy_sensors_percent, redundancy_cost_percent, redundancy_total_cost,
         data_logger_type, data_logger_channels, data_logger_memory_gb,
         data_logger_qty, data_logger_unit_cost, data_logger_total_cost,
         scada_software_cost, scada_hardware_cost, scada_integration_cost, scada_total_cost,
         calibration_lab_equipment_cost, calibration_standard_cost,
         sensor_network_type, communication_cable_length_m, communication_cable_unit_cost, communication_cable_total_cost,
         sensor_installation_cost, system_integration_cost, commissioning_cost,
         total_instrumentation_cost, contingency_percent, final_instrumentation_cost
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, $83, $84)`,
        [stp_id, stp_name, design_capacity_mld,
         do_sensor_type, do_sensor_range, do_sensor_accuracy_percent, do_sensor_calibration_std,
         do_sensor_qty, do_sensor_unit_cost, do_total,
         ph_sensor_type, ph_sensor_range, ph_sensor_accuracy, ph_sensor_calibration_std,
         ph_sensor_qty, ph_sensor_unit_cost, ph_total,
         orp_sensor_type, orp_sensor_range, orp_sensor_accuracy_mv, orp_sensor_calibration_std,
         orp_sensor_qty, orp_sensor_unit_cost, orp_total,
         tss_sensor_type, tss_sensor_range, tss_sensor_accuracy_percent, tss_sensor_calibration_std,
         tss_sensor_qty, tss_sensor_unit_cost, tss_total,
         flow_meter_type, flow_meter_range_lps, flow_meter_accuracy_percent, flow_meter_calibration_std,
         flow_meter_qty, flow_meter_unit_cost, flow_total,
         level_sensor_type, level_sensor_range_m, level_sensor_accuracy_mm, level_sensor_calibration_std,
         level_sensor_qty, level_sensor_unit_cost, level_total,
         pressure_sensor_type, pressure_sensor_range_bar, pressure_sensor_accuracy_percent,
         pressure_sensor_calibration_std, pressure_sensor_qty, pressure_sensor_unit_cost, pressure_total,
         temp_sensor_type, temp_sensor_range, temp_sensor_accuracy_c, temp_sensor_calibration_std,
         temp_sensor_qty, temp_sensor_unit_cost, temp_total,
         redundancy_type, redundancy_sensors_percent, redundancy_cost_percent, redundancy_cost,
         data_logger_type, data_logger_channels, data_logger_memory_gb,
         data_logger_qty, data_logger_unit_cost, data_logger_total,
         scada_software_cost, scada_hardware_cost, scada_integration_cost, scada_total,
         calibration_lab_equipment_cost, calibration_standard_cost,
         sensor_network_type, communication_cable_length_m, communication_cable_unit_cost, communication_total,
         sensor_installation_cost, system_integration_cost, commissioning_cost,
         subtotal, contingency_percent, final_cost]
      );
    }

    res.json({ success: true, stp_id, final_instrumentation_cost: final_cost });
  } catch (error) {
    console.error('[STP Instrumentation BOQ] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get STP Instrumentation BOQ
router.get('/:stp_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM stp_instrumentation_boq WHERE stp_id = $1`,
      [req.params.stp_id]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    res.json({});
  }
});

export default router;
