/**
 * CBAM Calculator Module
 * EU Carbon Border Adjustment Mechanism (CBAM) Tax Calculation
 * 
 * Calculates embedded carbon in materials, operational emissions,
 * and CBAM tax liability for STP projects
 * 
 * CBAM Phases:
 * - Phase 1 (Oct 2023 - Dec 2025): Transition period - reporting only
 * - Phase 2 (Jan 2026+): Full CBAM tax implementation
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

// ============================================================================
// CBAM CARBON EMISSION FACTORS (kg CO2e per unit)
// ============================================================================

const CARBON_FACTORS = {
  // CONSTRUCTION MATERIALS
  cement: 0.82, // kg CO2e per kg of cement (OPC 53 Grade)
  rcc_concrete: 0.25, // kg CO2e per kg of concrete (M35 grade, includes cement, sand, aggregate)
  steel_general: 2.5, // kg CO2e per kg of steel (Fe500, average)
  steel_stainless_316: 5.8, // kg CO2e per kg (SS 316, higher due to processing)
  gi_coated: 3.2, // kg CO2e per kg (Galvanized Iron)
  aluminum: 8.0, // kg CO2e per kg (high embodied carbon)
  epoxy_coating: 4.5, // kg CO2e per kg
  bituminous_membrane: 3.2, // kg CO2e per kg
  
  // EQUIPMENT & ELECTRICAL
  pump_motor: 0.15, // kg CO2e per kW (manufacturing)
  blower_motor: 0.18, // kg CO2e per kW (manufacturing)
  transformer: 0.12, // kg CO2e per kVA (manufacturing)
  electrical_cable: 2.8, // kg CO2e per kg of copper/aluminum
  
  // MEMBRANE & FILTRATION
  membrane_polymer: 4.2, // kg CO2e per kg (polysulfone, PES)
  membrane_frame_ss: 5.8, // kg CO2e per kg (stainless steel frame)
  
  // CHEMICALS (for annual operations)
  alum_coagulant: 0.35, // kg CO2e per kg
  polyelectrolyte: 2.1, // kg CO2e per kg
  sodium_hypochlorite: 0.45, // kg CO2e per kg
  lime_ph_adjuster: 0.08, // kg CO2e per kg
  nutrients_npk: 1.2, // kg CO2e per kg
  
  // ELECTRICITY GRID (varies by region/year)
  electricity_grid_eu: 0.4, // kg CO2e per kWh (EU average, 2024)
  electricity_grid_india: 0.7, // kg CO2e per kWh (India coal-heavy)
  electricity_renewable: 0.05, // kg CO2e per kWh (solar/wind)
  
  // TRANSPORT & LOGISTICS
  transport_cement: 0.15, // kg CO2e per ton-km (truck, 50km avg)
  transport_steel: 0.12, // kg CO2e per ton-km (truck)
  transport_equipment: 0.10, // kg CO2e per ton-km (general)
};

// ============================================================================
// CBAM TAX RATES & PARAMETERS
// ============================================================================

const CBAM_PARAMETERS = {
  phase1_start: new Date('2023-10-01'),
  phase2_start: new Date('2026-01-01'),
  phase1_reporting_only: true,
  
  // Tax rate per ton CO2e (EU, subject to change)
  current_rate: 95, // EUR per ton CO2e
  rate_forecast_2026: 95,
  rate_forecast_2027: 105,
  rate_forecast_2028: 120,
  
  // Sectors covered (CBAM Scope)
  covered_materials: [
    'cement',
    'steel',
    'aluminum',
    'fertilizers',
    'electricity_imports',
    'organic_chemicals'
  ],
  
  // Default electricity grid carbon intensity
  default_grid_intensity: 0.4, // kg CO2e/kWh (EU)
};

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate embodied carbon in civil works
 */
function calculateCivilCarbon(civilData) {
  const carbon = {};
  
  // RCC Concrete (density: 2400 kg/m³)
  carbon.rcc_volume = civilData.rcc_volume || 0; // m³
  carbon.rcc_mass = carbon.rcc_volume * 2400; // kg
  carbon.rcc_co2 = carbon.rcc_mass * CARBON_FACTORS.rcc_concrete; // kg CO2e
  
  // Steel Reinforcement
  carbon.steel_mass = civilData.steel_mass || 0; // kg
  carbon.steel_co2 = carbon.steel_mass * CARBON_FACTORS.steel_general; // kg CO2e
  
  // Waterproofing (bituminous membrane)
  carbon.waterproofing_area = civilData.waterproofing_area || 0; // m²
  carbon.waterproofing_mass = carbon.waterproofing_area * 1.5; // kg (1.5 kg/m² typical)
  carbon.waterproofing_co2 = carbon.waterproofing_mass * CARBON_FACTORS.bituminous_membrane;
  
  // Epoxy Coating
  carbon.epoxy_area = civilData.epoxy_area || 0; // m²
  carbon.epoxy_mass = carbon.epoxy_area * 0.2; // kg (0.2 kg/m² typical)
  carbon.epoxy_co2 = carbon.epoxy_mass * CARBON_FACTORS.epoxy_coating;
  
  // Total civil embodied carbon
  carbon.total_civil = carbon.rcc_co2 + carbon.steel_co2 + carbon.waterproofing_co2 + carbon.epoxy_co2;
  carbon.total_civil_tons = carbon.total_civil / 1000; // Convert to tons
  
  return carbon;
}

/**
 * Calculate embodied carbon in mechanical equipment
 */
function calculateMechanicalCarbon(mechanicalData) {
  const carbon = {};
  
  // Pumps (manufacturing emissions)
  carbon.inlet_pumps = (mechanicalData.inlet_pump_kw || 0) * 2 * CARBON_FACTORS.pump_motor;
  carbon.ras_pumps = (mechanicalData.ras_pump_kw || 0) * 2 * CARBON_FACTORS.pump_motor;
  carbon.effluent_pumps = (mechanicalData.effluent_pump_kw || 0) * 2 * CARBON_FACTORS.pump_motor;
  carbon.total_pump_co2 = carbon.inlet_pumps + carbon.ras_pumps + carbon.effluent_pumps;
  
  // Blowers
  carbon.blower_co2 = (mechanicalData.blower_kw || 0) * 2 * CARBON_FACTORS.blower_motor;
  
  // Membrane system
  carbon.membrane_polymer_mass = mechanicalData.membrane_area ? mechanicalData.membrane_area * 0.5 : 0;
  carbon.membrane_frame_mass = mechanicalData.membrane_area ? mechanicalData.membrane_area * 0.3 : 0;
  carbon.membrane_co2 = 
    (carbon.membrane_polymer_mass * CARBON_FACTORS.membrane_polymer) +
    (carbon.membrane_frame_mass * CARBON_FACTORS.membrane_frame_ss);
  
  // Piping & Valves (GI, MS)
  carbon.piping_mass = mechanicalData.piping_length ? mechanicalData.piping_length * 15 : 0;
  carbon.piping_co2 = carbon.piping_mass * CARBON_FACTORS.gi_coated;
  
  // Total mechanical embodied carbon
  carbon.total_mechanical = carbon.total_pump_co2 + carbon.blower_co2 + carbon.membrane_co2 + carbon.piping_co2;
  carbon.total_mechanical_tons = carbon.total_mechanical / 1000;
  
  return carbon;
}

/**
 * Calculate embodied carbon in electrical equipment
 */
function calculateElectricalCarbon(electricalData) {
  const carbon = {};
  
  // Transformer
  carbon.transformer_kva = electricalData.transformer_kva || 100;
  carbon.transformer_co2 = carbon.transformer_kva * CARBON_FACTORS.transformer;
  
  // Cables (copper, 500m average)
  carbon.cable_length = electricalData.cable_length || 500;
  carbon.cable_mass = carbon.cable_length * 0.5;
  carbon.cable_co2 = carbon.cable_mass * CARBON_FACTORS.electrical_cable;
  
  // Earthing system (copper rods)
  carbon.earthing_rods = electricalData.earthing_rods || 10;
  carbon.earthing_mass = carbon.earthing_rods * 1.2;
  carbon.earthing_co2 = carbon.earthing_mass * CARBON_FACTORS.electrical_cable;
  
  // Total electrical embodied carbon
  carbon.total_electrical = carbon.transformer_co2 + carbon.cable_co2 + carbon.earthing_co2;
  carbon.total_electrical_tons = carbon.total_electrical / 1000;
  
  return carbon;
}

/**
 * Calculate annual operational carbon (electricity + chemicals)
 */
function calculateOperationalCarbon(operationalData) {
  const carbon = {};
  
  // Annual electricity consumption
  carbon.annual_electricity_kwh = operationalData.annual_electricity_kwh || 1050000;
  carbon.grid_intensity = operationalData.grid_intensity || CARBON_FACTORS.electricity_grid_eu;
  carbon.renewable_fraction = operationalData.renewable_fraction || 0;
  
  const effective_intensity = 
    carbon.grid_intensity * (1 - carbon.renewable_fraction) +
    CARBON_FACTORS.electricity_renewable * carbon.renewable_fraction;
  
  carbon.annual_electricity_co2 = carbon.annual_electricity_kwh * effective_intensity / 1000;
  
  // Annual chemicals
  carbon.coagulant_kg = operationalData.coagulant_kg_annual || 150000;
  carbon.coagulant_co2 = carbon.coagulant_kg * CARBON_FACTORS.alum_coagulant / 1000;
  
  carbon.polyelectrolyte_kg = operationalData.polyelectrolyte_kg_annual || 30000;
  carbon.polyelectrolyte_co2 = carbon.polyelectrolyte_kg * CARBON_FACTORS.polyelectrolyte / 1000;
  
  carbon.disinfectant_kg = operationalData.disinfectant_kg_annual || 90000;
  carbon.disinfectant_co2 = carbon.disinfectant_kg * CARBON_FACTORS.sodium_hypochlorite / 1000;
  
  carbon.lime_kg = operationalData.lime_kg_annual || 150000;
  carbon.lime_co2 = carbon.lime_kg * CARBON_FACTORS.lime_ph_adjuster / 1000;
  
  carbon.nutrients_kg = operationalData.nutrients_kg_annual || 30000;
  carbon.nutrients_co2 = carbon.nutrients_kg * CARBON_FACTORS.nutrients_npk / 1000;
  
  carbon.total_chemicals = 
    carbon.coagulant_co2 + 
    carbon.polyelectrolyte_co2 + 
    carbon.disinfectant_co2 + 
    carbon.lime_co2 + 
    carbon.nutrients_co2;
  
  carbon.total_annual_operational = carbon.annual_electricity_co2 + carbon.total_chemicals;
  
  return carbon;
}

/**
 * Calculate CBAM tax liability
 */
function calculateCBAMTax(allEmissions, projectionYears = 10) {
  const cbam = {};
  
  const now = new Date();
  const phase2Start = CBAM_PARAMETERS.phase2_start;
  
  cbam.current_phase = now < phase2Start ? 'Phase 1 (Reporting)' : 'Phase 2 (Tax Active)';
  cbam.phase2_start_date = phase2Start.toISOString().split('T')[0];
  
  cbam.total_embodied_carbon = 
    (allEmissions.civil ? allEmissions.civil.total_civil_tons : 0) +
    (allEmissions.mechanical ? allEmissions.mechanical.total_mechanical_tons : 0) +
    (allEmissions.electrical ? allEmissions.electrical.total_electrical_tons : 0);
  
  cbam.annual_operational_carbon = 
    allEmissions.operational ? allEmissions.operational.total_annual_operational : 0;
  
  cbam.embodied_carbon_tax_eur = cbam.total_embodied_carbon * CBAM_PARAMETERS.current_rate;
  cbam.annual_operational_tax_eur = cbam.annual_operational_carbon * CBAM_PARAMETERS.current_rate;
  
  cbam.projection_years = projectionYears;
  cbam.projected_years = [];
  
  for (let year = 1; year <= projectionYears; year++) {
    const yearDate = new Date(phase2Start);
    yearDate.setFullYear(yearDate.getFullYear() + year);
    
    let rateThisYear = CBAM_PARAMETERS.current_rate;
    if (year >= 2) rateThisYear = CBAM_PARAMETERS.rate_forecast_2027;
    if (year >= 3) rateThisYear = CBAM_PARAMETERS.rate_forecast_2028;
    
    cbam.projected_years.push({
      year: year,
      calendar_year: yearDate.getFullYear(),
      annual_tax_eur: cbam.annual_operational_carbon * rateThisYear,
      cumulative_tax_eur: cbam.embodied_carbon_tax_eur + (cbam.annual_operational_carbon * rateThisYear * year)
    });
  }
  
  cbam.total_embodied_tax_eur = cbam.embodied_carbon_tax_eur;
  cbam.total_10year_tax_eur = 
    cbam.embodied_carbon_tax_eur + 
    (cbam.annual_operational_tax_eur * projectionYears);
  
  cbam.annual_tax_eur = cbam.annual_operational_tax_eur;
  
  return cbam;
}

/**
 * Calculate carbon offset options
 */
function calculateOffsetOptions(allEmissions) {
  const offsets = {};
  
  const total_carbon = 
    (allEmissions.civil ? allEmissions.civil.total_civil_tons : 0) +
    (allEmissions.mechanical ? allEmissions.mechanical.total_mechanical_tons : 0) +
    (allEmissions.electrical ? allEmissions.electrical.total_electrical_tons : 0) +
    (allEmissions.operational ? allEmissions.operational.total_annual_operational : 0);
  
  offsets.options = [
    {
      name: 'Low Carbon Cement',
      description: 'Use LC3 or slag-based cement (50% lower carbon)',
      reduction_percent: 40,
      reduced_carbon: total_carbon * 0.4,
      cost_per_ton_co2: 5,
      total_cost_eur: (total_carbon * 0.4) * 5
    },
    {
      name: 'Renewable Electricity',
      description: 'Source 100% renewable energy',
      reduction_percent: 65,
      reduced_carbon: (allEmissions.operational ? allEmissions.operational.annual_electricity_co2 : 0),
      cost_per_ton_co2: 15,
      total_cost_eur: (allEmissions.operational ? allEmissions.operational.annual_electricity_co2 : 0) * 15
    },
    {
      name: 'Carbon Credits (VCS)',
      description: 'Purchase verified carbon credits',
      reduction_percent: 100,
      reduced_carbon: total_carbon,
      cost_per_ton_co2: 8,
      total_cost_eur: total_carbon * 8
    },
    {
      name: 'Combined Strategy',
      description: 'Low carbon cement + 50% renewable electricity',
      reduction_percent: 60,
      reduced_carbon: total_carbon * 0.6,
      cost_per_ton_co2: 10,
      total_cost_eur: total_carbon * 0.6 * 10
    }
  ];
  
  return offsets;
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

router.post('/calculate', async (req, res) => {
  try {
    const {
      project_name,
      capacity_mld,
      civil_data,
      mechanical_data,
      electrical_data,
      operational_data,
      projection_years = 10
    } = req.body;
    
    const civil = calculateCivilCarbon(civil_data || {});
    const mechanical = calculateMechanicalCarbon(mechanical_data || {});
    const electrical = calculateElectricalCarbon(electrical_data || {});
    const operational = calculateOperationalCarbon(operational_data || {});
    
    const cbam = calculateCBAMTax({
      civil, mechanical, electrical, operational
    }, projection_years);
    
    const offsets = calculateOffsetOptions({
      civil, mechanical, electrical, operational
    });
    
    const result = {
      project_name,
      capacity_mld,
      timestamp: new Date().toISOString(),
      emissions: {
        civil,
        mechanical,
        electrical,
        operational
      },
      cbam_analysis: cbam,
      offset_options: offsets,
      summary: {
        total_embodied_carbon_tons: cbam.total_embodied_carbon,
        annual_operational_carbon_tons: cbam.annual_operational_carbon,
        total_embodied_tax_eur: cbam.total_embodied_tax_eur,
        annual_operational_tax_eur: cbam.annual_operational_tax_eur,
        total_10year_tax_eur: cbam.total_10year_tax_eur
      }
    };
    
    res.json(result);
  } catch (error) {
    console.error('CBAM calculation error:', error);
    res.status(500).json({ error: 'CBAM calculation failed', details: error.message });
  }
});

router.get('/factors', (req, res) => {
  res.json({
    carbon_factors: CARBON_FACTORS,
    cbam_parameters: CBAM_PARAMETERS,
    timestamp: new Date().toISOString()
  });
});

router.get('/parameters', (req, res) => {
  res.json({
    cbam_parameters: CBAM_PARAMETERS,
    timestamp: new Date().toISOString()
  });
});

router.post('/save', async (req, res) => {
  try {
    const {
      project_name,
      capacity_mld,
      total_embodied_carbon_tons,
      annual_operational_carbon_tons,
      total_embodied_tax_eur,
      annual_operational_tax_eur,
      total_10year_tax_eur,
      current_phase,
      offset_strategy,
      notes
    } = req.body;
    
    const result = await db.query(
      `INSERT INTO cbam_analysis (
        project_name, capacity_mld, total_embodied_carbon_tons,
        annual_operational_carbon_tons, total_embodied_tax_eur,
        annual_operational_tax_eur, total_10year_tax_eur,
        current_phase, offset_strategy, notes, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (project_name) DO UPDATE SET
        total_embodied_carbon_tons = $3,
        annual_operational_carbon_tons = $4,
        total_embodied_tax_eur = $5,
        annual_operational_tax_eur = $6,
        total_10year_tax_eur = $7,
        current_phase = $8,
        offset_strategy = $9,
        notes = $10,
        updated_at = NOW()
      RETURNING *;`,
      [
        project_name,
        capacity_mld,
        total_embodied_carbon_tons,
        annual_operational_carbon_tons,
        total_embodied_tax_eur,
        annual_operational_tax_eur,
        total_10year_tax_eur,
        current_phase,
        offset_strategy,
        notes
      ]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('CBAM save error:', error);
    res.status(500).json({ error: 'Failed to save CBAM analysis', details: error.message });
  }
});

router.get('/projects', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM cbam_analysis ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('CBAM query error:', error);
    res.status(500).json({ error: 'Failed to retrieve CBAM analyses', details: error.message });
  }
});

// Initialize database table
async function initCBAMAnalysisTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS cbam_analysis (
        id SERIAL PRIMARY KEY,
        project_name VARCHAR(255) UNIQUE NOT NULL,
        capacity_mld DECIMAL(10, 2),
        total_embodied_carbon_tons DECIMAL(15, 4),
        annual_operational_carbon_tons DECIMAL(15, 4),
        total_embodied_tax_eur DECIMAL(15, 2),
        annual_operational_tax_eur DECIMAL(15, 2),
        total_10year_tax_eur DECIMAL(15, 2),
        current_phase VARCHAR(50),
        offset_strategy VARCHAR(500),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('CBAM Analysis table initialized');
  } catch (error) {
    console.error('Error initializing CBAM table:', error);
  }
}

module.exports = router;
module.exports.initCBAMAnalysisTable = initCBAMAnalysisTable;
