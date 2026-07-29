import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Initialize STP Chemical BOQ Table
export async function initSTPChemicalBOQTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stp_chemical_boq (
        id SERIAL PRIMARY KEY,
        stp_id VARCHAR(255) UNIQUE,
        stp_name VARCHAR(255),
        design_capacity_mld DECIMAL(10, 2),
        
        -- Coagulant (Alum/Ferric Chloride)
        coagulant_type VARCHAR(100),
        coagulant_grade VARCHAR(50),
        coagulant_dosing_mg_l DECIMAL(10, 2),
        coagulant_dosing_range_min DECIMAL(10, 2),
        coagulant_dosing_range_max DECIMAL(10, 2),
        coagulant_annual_consumption_tons DECIMAL(12, 2),
        coagulant_unit_cost DECIMAL(10, 2),
        coagulant_total_annual_cost DECIMAL(15, 2),
        coagulant_storage_capacity_liters DECIMAL(12, 2),
        coagulant_tank_material VARCHAR(100),
        coagulant_tank_qty INT,
        coagulant_pump_type VARCHAR(100),
        coagulant_pump_power_kw DECIMAL(10, 2),
        
        -- Polyelectrolyte (Coagulant Aid)
        polyelectrolyte_type VARCHAR(100),
        polyelectrolyte_dosing_mg_l DECIMAL(10, 2),
        polyelectrolyte_dosing_range_min DECIMAL(10, 2),
        polyelectrolyte_dosing_range_max DECIMAL(10, 2),
        polyelectrolyte_annual_consumption_tons DECIMAL(12, 2),
        polyelectrolyte_unit_cost DECIMAL(10, 2),
        polyelectrolyte_total_annual_cost DECIMAL(15, 2),
        polyelectrolyte_storage_capacity_liters DECIMAL(12, 2),
        polyelectrolyte_tank_material VARCHAR(100),
        
        -- Chlorine/Hypochlorite (Disinfectant)
        disinfectant_type VARCHAR(100),
        disinfectant_dosing_mg_l DECIMAL(10, 2),
        disinfectant_dosing_range_min DECIMAL(10, 2),
        disinfectant_dosing_range_max DECIMAL(10, 2),
        disinfectant_annual_consumption_tons DECIMAL(12, 2),
        disinfectant_unit_cost DECIMAL(10, 2),
        disinfectant_total_annual_cost DECIMAL(15, 2),
        disinfectant_storage_capacity_liters DECIMAL(12, 2),
        disinfectant_tank_material VARCHAR(100),
        disinfectant_safety_enclosure VARCHAR(100),
        
        -- pH Adjustment (Lime/Caustic)
        ph_chemical_type VARCHAR(100),
        ph_dosing_mg_l DECIMAL(10, 2),
        ph_dosing_range_min DECIMAL(10, 2),
        ph_dosing_range_max DECIMAL(10, 2),
        ph_annual_consumption_tons DECIMAL(12, 2),
        ph_unit_cost DECIMAL(10, 2),
        ph_total_annual_cost DECIMAL(15, 2),
        ph_storage_capacity_liters DECIMAL(12, 2),
        ph_tank_material VARCHAR(100),
        
        -- Nutrient Addition (N & P for biological treatment)
        nutrient_type VARCHAR(100),
        nutrient_dosing_mg_l DECIMAL(10, 2),
        nutrient_annual_consumption_tons DECIMAL(12, 2),
        nutrient_unit_cost DECIMAL(10, 2),
        nutrient_total_annual_cost DECIMAL(15, 2),
        nutrient_storage_capacity_liters DECIMAL(12, 2),
        
        -- Anti-Foam Agent
        antifoam_type VARCHAR(100),
        antifoam_dosing_mg_l DECIMAL(10, 2),
        antifoam_annual_consumption_liters DECIMAL(12, 2),
        antifoam_unit_cost DECIMAL(10, 2),
        antifoam_total_annual_cost DECIMAL(15, 2),
        
        -- Membrane Cleaning Chemicals
        membrane_clean_chem_type VARCHAR(100),
        membrane_clean_frequency_months INT,
        membrane_clean_chemical_cost_per_cycle DECIMAL(12, 2),
        membrane_clean_annual_cost DECIMAL(15, 2),
        
        -- Safety Equipment
        safety_enclosure_type VARCHAR(100),
        safety_enclosure_qty INT,
        safety_enclosure_cost DECIMAL(15, 2),
        
        ppe_cost DECIMAL(12, 2),
        eyewash_station_qty INT,
        eyewash_station_cost DECIMAL(12, 2),
        
        emergency_shower_qty INT,
        emergency_shower_cost DECIMAL(12, 2),
        
        spill_kit_qty INT,
        spill_kit_cost DECIMAL(12, 2),
        
        -- Dosing Equipment
        diaphragm_pump_qty INT,
        diaphragm_pump_cost DECIMAL(12, 2),
        
        peristaltic_pump_qty INT,
        peristaltic_pump_cost DECIMAL(12, 2),
        
        rotary_pump_qty INT,
        rotary_pump_cost DECIMAL(12, 2),
        
        -- Piping & Fittings
        dosing_pipe_length_m DECIMAL(10, 2),
        dosing_pipe_material VARCHAR(100),
        dosing_pipe_unit_cost DECIMAL(12, 2),
        dosing_pipe_total_cost DECIMAL(15, 2),
        
        mixing_tank_qty INT,
        mixing_tank_volume_liters DECIMAL(12, 2),
        mixing_tank_material VARCHAR(100),
        mixing_tank_unit_cost DECIMAL(12, 2),
        mixing_tank_total_cost DECIMAL(15, 2),
        
        -- Labor & Training
        operator_training_cost DECIMAL(12, 2),
        chemical_handling_certification_cost DECIMAL(12, 2),
        
        -- Waste Disposal
        chemical_waste_disposal_annual_cost DECIMAL(15, 2),
        hazmat_transportation_cost DECIMAL(12, 2),
        
        -- Contingency
        total_chemical_cost DECIMAL(15, 2),
        contingency_percent DECIMAL(5, 2),
        final_chemical_cost DECIMAL(15, 2),
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] STP Chemical BOQ table initialized');
  } catch (err) {
    console.error('[DB] STP Chemical BOQ error:', err.message);
  }
}

// Save STP Chemical BOQ
router.post('/save', async (req, res) => {
  try {
    const data = req.body;
    const {
      stp_id, stp_name, design_capacity_mld,
      // Coagulant
      coagulant_type, coagulant_grade, coagulant_dosing_mg_l, coagulant_dosing_range_min,
      coagulant_dosing_range_max, coagulant_annual_consumption_tons, coagulant_unit_cost,
      coagulant_storage_capacity_liters, coagulant_tank_material, coagulant_tank_qty,
      coagulant_pump_type, coagulant_pump_power_kw,
      // Polyelectrolyte
      polyelectrolyte_type, polyelectrolyte_dosing_mg_l, polyelectrolyte_dosing_range_min,
      polyelectrolyte_dosing_range_max, polyelectrolyte_annual_consumption_tons, polyelectrolyte_unit_cost,
      polyelectrolyte_storage_capacity_liters, polyelectrolyte_tank_material,
      // Disinfectant
      disinfectant_type, disinfectant_dosing_mg_l, disinfectant_dosing_range_min,
      disinfectant_dosing_range_max, disinfectant_annual_consumption_tons, disinfectant_unit_cost,
      disinfectant_storage_capacity_liters, disinfectant_tank_material, disinfectant_safety_enclosure,
      // pH
      ph_chemical_type, ph_dosing_mg_l, ph_dosing_range_min, ph_dosing_range_max,
      ph_annual_consumption_tons, ph_unit_cost, ph_storage_capacity_liters, ph_tank_material,
      // Nutrient
      nutrient_type, nutrient_dosing_mg_l, nutrient_annual_consumption_tons, nutrient_unit_cost,
      nutrient_storage_capacity_liters,
      // Anti-Foam
      antifoam_type, antifoam_dosing_mg_l, antifoam_annual_consumption_liters, antifoam_unit_cost,
      // Membrane Cleaning
      membrane_clean_chem_type, membrane_clean_frequency_months, membrane_clean_chemical_cost_per_cycle,
      // Safety
      safety_enclosure_type, safety_enclosure_qty, safety_enclosure_cost,
      ppe_cost, eyewash_station_qty, eyewash_station_cost,
      emergency_shower_qty, emergency_shower_cost,
      spill_kit_qty, spill_kit_cost,
      // Dosing Equipment
      diaphragm_pump_qty, diaphragm_pump_cost,
      peristaltic_pump_qty, peristaltic_pump_cost,
      rotary_pump_qty, rotary_pump_cost,
      // Piping
      dosing_pipe_length_m, dosing_pipe_material, dosing_pipe_unit_cost,
      mixing_tank_qty, mixing_tank_volume_liters, mixing_tank_material, mixing_tank_unit_cost,
      // Labor
      operator_training_cost, chemical_handling_certification_cost,
      // Waste
      chemical_waste_disposal_annual_cost, hazmat_transportation_cost,
      contingency_percent = 10
    } = data;

    // Calculate costs
    const coagulant_total_annual = coagulant_annual_consumption_tons * coagulant_unit_cost;
    const polyelectrolyte_total_annual = polyelectrolyte_annual_consumption_tons * polyelectrolyte_unit_cost;
    const disinfectant_total_annual = disinfectant_annual_consumption_tons * disinfectant_unit_cost;
    const ph_total_annual = ph_annual_consumption_tons * ph_unit_cost;
    const nutrient_total_annual = nutrient_annual_consumption_tons * nutrient_unit_cost;
    const antifoam_total_annual = antifoam_annual_consumption_liters * antifoam_unit_cost;
    const membrane_clean_annual = (12 / membrane_clean_frequency_months) * membrane_clean_chemical_cost_per_cycle;
    
    const safety_total = (safety_enclosure_qty * safety_enclosure_cost) + 
                        ppe_cost + (eyewash_station_qty * eyewash_station_cost) +
                        (emergency_shower_qty * emergency_shower_cost) + (spill_kit_qty * spill_kit_cost);
    
    const dosing_equipment_total = (diaphragm_pump_qty * diaphragm_pump_cost) +
                                   (peristaltic_pump_qty * peristaltic_pump_cost) +
                                   (rotary_pump_qty * rotary_pump_cost);
    
    const dosing_pipe_total = dosing_pipe_length_m * dosing_pipe_unit_cost;
    const mixing_tank_total = mixing_tank_qty * mixing_tank_unit_cost;
    
    const labor_total = operator_training_cost + chemical_handling_certification_cost;
    
    const annual_operational = coagulant_total_annual + polyelectrolyte_total_annual + 
                              disinfectant_total_annual + ph_total_annual + nutrient_total_annual +
                              antifoam_total_annual + membrane_clean_annual + chemical_waste_disposal_annual_cost;
    
    const capital_cost = safety_total + dosing_equipment_total + dosing_pipe_total + 
                        mixing_tank_total + labor_total + hazmat_transportation_cost;
    
    const subtotal = annual_operational + capital_cost;
    const contingency = subtotal * (contingency_percent / 100);
    const final_cost = subtotal + contingency;

    const exists = await pool.query(
      `SELECT id FROM stp_chemical_boq WHERE stp_id = $1`,
      [stp_id]
    );

    const updateStmt = `
      UPDATE stp_chemical_boq SET
      stp_name = $1, design_capacity_mld = $2,
      coagulant_type = $3, coagulant_grade = $4, coagulant_dosing_mg_l = $5, coagulant_dosing_range_min = $6,
      coagulant_dosing_range_max = $7, coagulant_annual_consumption_tons = $8, coagulant_unit_cost = $9,
      coagulant_total_annual_cost = $10,
      coagulant_storage_capacity_liters = $11, coagulant_tank_material = $12, coagulant_tank_qty = $13,
      coagulant_pump_type = $14, coagulant_pump_power_kw = $15,
      polyelectrolyte_type = $16, polyelectrolyte_dosing_mg_l = $17, polyelectrolyte_dosing_range_min = $18,
      polyelectrolyte_dosing_range_max = $19, polyelectrolyte_annual_consumption_tons = $20, polyelectrolyte_unit_cost = $21,
      polyelectrolyte_total_annual_cost = $22,
      polyelectrolyte_storage_capacity_liters = $23, polyelectrolyte_tank_material = $24,
      disinfectant_type = $25, disinfectant_dosing_mg_l = $26, disinfectant_dosing_range_min = $27,
      disinfectant_dosing_range_max = $28, disinfectant_annual_consumption_tons = $29, disinfectant_unit_cost = $30,
      disinfectant_total_annual_cost = $31,
      disinfectant_storage_capacity_liters = $32, disinfectant_tank_material = $33, disinfectant_safety_enclosure = $34,
      ph_chemical_type = $35, ph_dosing_mg_l = $36, ph_dosing_range_min = $37, ph_dosing_range_max = $38,
      ph_annual_consumption_tons = $39, ph_unit_cost = $40, ph_total_annual_cost = $41,
      ph_storage_capacity_liters = $42, ph_tank_material = $43,
      nutrient_type = $44, nutrient_dosing_mg_l = $45, nutrient_annual_consumption_tons = $46, nutrient_unit_cost = $47,
      nutrient_total_annual_cost = $48, nutrient_storage_capacity_liters = $49,
      antifoam_type = $50, antifoam_dosing_mg_l = $51, antifoam_annual_consumption_liters = $52, antifoam_unit_cost = $53,
      antifoam_total_annual_cost = $54,
      membrane_clean_chem_type = $55, membrane_clean_frequency_months = $56, membrane_clean_chemical_cost_per_cycle = $57,
      membrane_clean_annual_cost = $58,
      safety_enclosure_type = $59, safety_enclosure_qty = $60, safety_enclosure_cost = $61,
      ppe_cost = $62, eyewash_station_qty = $63, eyewash_station_cost = $64,
      emergency_shower_qty = $65, emergency_shower_cost = $66,
      spill_kit_qty = $67, spill_kit_cost = $68,
      diaphragm_pump_qty = $69, diaphragm_pump_cost = $70,
      peristaltic_pump_qty = $71, peristaltic_pump_cost = $72,
      rotary_pump_qty = $73, rotary_pump_cost = $74,
      dosing_pipe_length_m = $75, dosing_pipe_material = $76, dosing_pipe_unit_cost = $77, dosing_pipe_total_cost = $78,
      mixing_tank_qty = $79, mixing_tank_volume_liters = $80, mixing_tank_material = $81, mixing_tank_unit_cost = $82,
      mixing_tank_total_cost = $83,
      operator_training_cost = $84, chemical_handling_certification_cost = $85,
      chemical_waste_disposal_annual_cost = $86, hazmat_transportation_cost = $87,
      total_chemical_cost = $88, contingency_percent = $89, final_chemical_cost = $90,
      updated_at = CURRENT_TIMESTAMP
      WHERE stp_id = $91
    `;

    const values = [
      stp_name, design_capacity_mld,
      coagulant_type, coagulant_grade, coagulant_dosing_mg_l, coagulant_dosing_range_min,
      coagulant_dosing_range_max, coagulant_annual_consumption_tons, coagulant_unit_cost,
      coagulant_total_annual,
      coagulant_storage_capacity_liters, coagulant_tank_material, coagulant_tank_qty,
      coagulant_pump_type, coagulant_pump_power_kw,
      polyelectrolyte_type, polyelectrolyte_dosing_mg_l, polyelectrolyte_dosing_range_min,
      polyelectrolyte_dosing_range_max, polyelectrolyte_annual_consumption_tons, polyelectrolyte_unit_cost,
      polyelectrolyte_total_annual,
      polyelectrolyte_storage_capacity_liters, polyelectrolyte_tank_material,
      disinfectant_type, disinfectant_dosing_mg_l, disinfectant_dosing_range_min,
      disinfectant_dosing_range_max, disinfectant_annual_consumption_tons, disinfectant_unit_cost,
      disinfectant_total_annual,
      disinfectant_storage_capacity_liters, disinfectant_tank_material, disinfectant_safety_enclosure,
      ph_chemical_type, ph_dosing_mg_l, ph_dosing_range_min, ph_dosing_range_max,
      ph_annual_consumption_tons, ph_unit_cost, ph_total_annual,
      ph_storage_capacity_liters, ph_tank_material,
      nutrient_type, nutrient_dosing_mg_l, nutrient_annual_consumption_tons, nutrient_unit_cost,
      nutrient_total_annual, nutrient_storage_capacity_liters,
      antifoam_type, antifoam_dosing_mg_l, antifoam_annual_consumption_liters, antifoam_unit_cost,
      antifoam_total_annual,
      membrane_clean_chem_type, membrane_clean_frequency_months, membrane_clean_chemical_cost_per_cycle,
      membrane_clean_annual,
      safety_enclosure_type, safety_enclosure_qty, safety_enclosure_cost,
      ppe_cost, eyewash_station_qty, eyewash_station_cost,
      emergency_shower_qty, emergency_shower_cost,
      spill_kit_qty, spill_kit_cost,
      diaphragm_pump_qty, diaphragm_pump_cost,
      peristaltic_pump_qty, peristaltic_pump_cost,
      rotary_pump_qty, rotary_pump_cost,
      dosing_pipe_length_m, dosing_pipe_material, dosing_pipe_unit_cost, dosing_pipe_total,
      mixing_tank_qty, mixing_tank_volume_liters, mixing_tank_material, mixing_tank_unit_cost,
      mixing_tank_total,
      operator_training_cost, chemical_handling_certification_cost,
      chemical_waste_disposal_annual_cost, hazmat_transportation_cost,
      subtotal, contingency_percent, final_cost, stp_id
    ];

    if (exists.rows.length > 0) {
      await pool.query(updateStmt, values);
    } else {
      const insertStmt = `
        INSERT INTO stp_chemical_boq (
          stp_id, stp_name, design_capacity_mld,
          coagulant_type, coagulant_grade, coagulant_dosing_mg_l, coagulant_dosing_range_min,
          coagulant_dosing_range_max, coagulant_annual_consumption_tons, coagulant_unit_cost,
          coagulant_total_annual_cost,
          coagulant_storage_capacity_liters, coagulant_tank_material, coagulant_tank_qty,
          coagulant_pump_type, coagulant_pump_power_kw,
          polyelectrolyte_type, polyelectrolyte_dosing_mg_l, polyelectrolyte_dosing_range_min,
          polyelectrolyte_dosing_range_max, polyelectrolyte_annual_consumption_tons, polyelectrolyte_unit_cost,
          polyelectrolyte_total_annual_cost,
          polyelectrolyte_storage_capacity_liters, polyelectrolyte_tank_material,
          disinfectant_type, disinfectant_dosing_mg_l, disinfectant_dosing_range_min,
          disinfectant_dosing_range_max, disinfectant_annual_consumption_tons, disinfectant_unit_cost,
          disinfectant_total_annual_cost,
          disinfectant_storage_capacity_liters, disinfectant_tank_material, disinfectant_safety_enclosure,
          ph_chemical_type, ph_dosing_mg_l, ph_dosing_range_min, ph_dosing_range_max,
          ph_annual_consumption_tons, ph_unit_cost, ph_total_annual_cost,
          ph_storage_capacity_liters, ph_tank_material,
          nutrient_type, nutrient_dosing_mg_l, nutrient_annual_consumption_tons, nutrient_unit_cost,
          nutrient_total_annual_cost, nutrient_storage_capacity_liters,
          antifoam_type, antifoam_dosing_mg_l, antifoam_annual_consumption_liters, antifoam_unit_cost,
          antifoam_total_annual_cost,
          membrane_clean_chem_type, membrane_clean_frequency_months, membrane_clean_chemical_cost_per_cycle,
          membrane_clean_annual_cost,
          safety_enclosure_type, safety_enclosure_qty, safety_enclosure_cost,
          ppe_cost, eyewash_station_qty, eyewash_station_cost,
          emergency_shower_qty, emergency_shower_cost,
          spill_kit_qty, spill_kit_cost,
          diaphragm_pump_qty, diaphragm_pump_cost,
          peristaltic_pump_qty, peristaltic_pump_cost,
          rotary_pump_qty, rotary_pump_cost,
          dosing_pipe_length_m, dosing_pipe_material, dosing_pipe_unit_cost, dosing_pipe_total_cost,
          mixing_tank_qty, mixing_tank_volume_liters, mixing_tank_material, mixing_tank_unit_cost,
          mixing_tank_total_cost,
          operator_training_cost, chemical_handling_certification_cost,
          chemical_waste_disposal_annual_cost, hazmat_transportation_cost,
          total_chemical_cost, contingency_percent, final_chemical_cost
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, $83, $84, $85, $86, $87, $88, $89, $90)
      `;
      await pool.query(insertStmt, values.slice(0, -1));
    }

    res.json({ 
      success: true, 
      stp_id, 
      final_chemical_cost: final_cost,
      annual_operational_cost: annual_operational,
      capital_cost: capital_cost
    });
  } catch (error) {
    console.error('[STP Chemical BOQ] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get STP Chemical BOQ
router.get('/:stp_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM stp_chemical_boq WHERE stp_id = $1`,
      [req.params.stp_id]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    res.json({});
  }
});

export default router;
