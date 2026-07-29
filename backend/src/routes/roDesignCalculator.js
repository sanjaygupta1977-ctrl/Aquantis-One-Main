import express from 'express';
import pool from '../db.js';

const router = express.Router();

// RO design parameters by feed water type
const RO_PARAMETERS = {
  textile: {
    name: 'Textile Wastewater',
    sdi: 3.0,
    turbidity: 2.0,
    waterFlux: 12,
    saltRejection: 98.5,
    recovery: 75,
    boron_rejection: 97,
  },
  dairy: {
    name: 'Dairy Wastewater',
    sdi: 2.5,
    turbidity: 1.5,
    waterFlux: 10,
    saltRejection: 99.0,
    recovery: 80,
    boron_rejection: 98,
  },
  semiconductor: {
    name: 'Semiconductor DI Water',
    sdi: 1.0,
    turbidity: 0.5,
    waterFlux: 8,
    saltRejection: 99.8,
    recovery: 85,
    boron_rejection: 99.5,
  },
  municipal: {
    name: 'Municipal Wastewater',
    sdi: 4.0,
    turbidity: 3.0,
    waterFlux: 13,
    saltRejection: 98.0,
    recovery: 70,
    boron_rejection: 96,
  },
};

// Membrane database (Dow, GE, Hydranautics standard models)
const MEMBRANE_DATABASE = [
  { code: 'BW30', type: 'Standard RO', flux: 13.6, rejection: 99.5, area: 37.2, manufacturer: 'Dow' },
  { code: 'SW30XLE', type: 'Seawater RO', flux: 14.5, rejection: 99.8, area: 37.2, manufacturer: 'Dow' },
  { code: 'TW30', type: 'Textile Wastewater', flux: 12.0, rejection: 98.5, area: 37.2, manufacturer: 'Dow' },
  { code: 'CPA3', type: 'Brackish Water', flux: 11.8, rejection: 99.2, area: 40.0, manufacturer: 'Hydranautics' },
  { code: 'AG30', type: 'Agriculture', flux: 12.5, rejection: 99.0, area: 40.0, manufacturer: 'Hydranautics' },
];

function calculateRODesign(feedFlow, feedTDS, productTDS, temperature, feedType) {
  const params = RO_PARAMETERS[feedType] || RO_PARAMETERS.municipal;

  // Van't Hoff osmotic pressure equation: π = i·M·R·T
  // i = 2 (dissociation), M = molarity, R = 0.0831, T = Kelvin
  const osmoPressure = (0.0831 * (temperature + 273.15) * (feedTDS / 642)) / 0.987;

  // Operating pressure = osmotic pressure + ΔP system losses (30% margin + 2 bar losses)
  const operatingPressure = osmoPressure * 1.3 + 2;

  // Membrane area calculation
  // Area = Feed Flow / Water Flux (accounting for concentration polarization)
  const membraneArea = (feedFlow / params.waterFlux) * (1000 / 1000); // m³/day to m²
  const membranesPerModule = Math.ceil(membraneArea / 40); // 40 m² per standard membrane
  const numStages = Math.ceil(membranesPerModule / 6); // Max 6 in series per stage
  const membranesPerStage = Math.ceil(membranesPerModule / numStages);

  // Flow calculations
  const productFlow = (feedFlow * params.recovery) / 100;
  const rejectFlow = feedFlow - productFlow;

  // Product water quality
  const actualProductTDS = (feedTDS * (100 - params.saltRejection)) / 100;

  // Energy calculation (kW)
  // Power = Pressure (bar) × Flow (m³/h) × 0.1667 / Efficiency
  const feedFlowM3h = feedFlow / 24; // Convert m³/day to m³/h
  const hydraulicPower = (operatingPressure * feedFlowM3h * 0.1667) / 0.75; // 75% pump efficiency
  const pumpEff = 0.85;
  const actualPower = hydraulicPower / pumpEff;
  const specificEnergy = (actualPower / (productFlow / 24)) * 1000; // kWh/1000 m³
  const annualEnergy = actualPower * 365 * 24;
  const annualEnergyCost = annualEnergy * 8; // ₹8/kWh

  // Capital cost estimation
  const membranesCost = membranesPerModule * 50000; // ₹50K per membrane
  const housingsVessels = membraneArea * 2000; // ₹2000 per m²
  const pumpMotor = actualPower * 50000; // ₹50K per kW
  const pretreatment = 300000; // Fixed pretreatment cost
  const instrumentation = 150000; // Sensors, gauges, controls
  const capitalCost = membranesCost + housingsVessels + pumpMotor + pretreatment + instrumentation;

  // Operating cost
  const annualMembraneCost = (capitalCost * 0.15) / 10; // 15% maintenance, 10-year life
  const annualCartridgeCost = 40000; // ₹40K/year for cartridges
  const annualOtherCost = productFlow * 365 * 15; // ₹15/m³ for chemicals, misc
  const annualOperatingCost = annualEnergyCost + annualMembraneCost + annualCartridgeCost + annualOtherCost;

  const costPerM3 = annualOperatingCost / (productFlow * 365);
  const paybackMonths = (capitalCost / (annualOperatingCost * 1000)) * 12;

  return {
    feedWaterQuality: {
      tds: feedTDS,
      turbidity: params.turbidity,
      sdi: params.sdi,
      cod: feedType === 'textile' ? 150 : feedType === 'dairy' ? 200 : 50,
      temperature,
    },
    membraneSelection: {
      type: 'Thin-Film Composite (TFC)',
      material: 'Polyamide',
      poreSize: 0.0001,
      area: membraneArea,
      manufacturer: 'Dow/GE/Hydranautics',
    },
    systemDesign: {
      feedFlow,
      productFlow: parseFloat(productFlow.toFixed(2)),
      rejectFlow: parseFloat(rejectFlow.toFixed(2)),
      stages: numStages,
      membranesPerStage,
    },
    performancePrediction: {
      waterFlux: params.waterFlux,
      saltRejection: params.saltRejection,
      productTDS: parseFloat(actualProductTDS.toFixed(2)),
      recovery: params.recovery,
      operatingPressure: parseFloat(operatingPressure.toFixed(2)),
    },
    energyCalculation: {
      hydraulicPower: parseFloat(hydraulicPower.toFixed(2)),
      pumpEfficiency: pumpEff,
      specificEnergyConsumption: parseFloat(specificEnergy.toFixed(2)),
      annualEnergyCost: parseFloat(annualEnergyCost.toFixed(0)),
    },
    maintenanceSchedule: {
      prefilterInterval: 30,
      cartridgeInterval: 90,
      membraneCleaningFrequency: 'Every 3-6 months or when pressure drop exceeds 0.5 bar',
      membraneReplacementLife: 10,
      cip: 'Chemical-In-Place: Citric acid (pH 3.0), NaOH (pH 11.5), Biocide quarterly',
    },
    costAnalysis: {
      capitalCost: parseFloat(capitalCost.toFixed(0)),
      annualOperatingCost: parseFloat(annualOperatingCost.toFixed(0)),
      costPerM3: parseFloat(costPerM3.toFixed(0)),
      paybackPeriod: parseFloat((paybackMonths / 12).toFixed(2)),
    },
  };
}

// POST: Design RO System
router.post('/calculate', async (req, res) => {
  try {
    const { feedFlow, feedTDS, productTDS, temperature, feedType } = req.body;

    if (!feedFlow || !feedTDS || !temperature) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const result = calculateRODesign(feedFlow, feedTDS, productTDS, temperature, feedType);

    // Try to save to DB (non-blocking)
    pool.query(
      `INSERT INTO ro_designs 
       (feed_flow, feed_tds, product_tds, temperature, feed_type, design_result, calculation_date)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [feedFlow, feedTDS, productTDS, temperature, feedType, JSON.stringify(result)]
    ).catch(err => {
      console.warn('[RO] DB save skipped:', err.message);
    });

    res.status(201).json({
      ...result,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('[RO] Calculate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Membrane database
router.get('/membranes', (req, res) => {
  res.json(MEMBRANE_DATABASE);
});

// GET: Feed water parameters
router.get('/parameters', (req, res) => {
  res.json(RO_PARAMETERS);
});

// GET: Design history
router.get('/history', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM ro_designs ORDER BY calculation_date DESC LIMIT 50'
    );
    res.json(result.rows || []);
  } catch (error) {
    res.json([]);
  }
});

export default router;
