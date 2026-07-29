import express from 'express';
import pool from '../db.js';

const router = express.Router();

// ISO 14046 category water use data (L per unit)
const CATEGORY_WATER_USE = {
  textile: 79000,      // L per kg (cotton t-shirt ~0.2kg = 15800L)
  beverage: 1900,      // L per liter
  meat: 15415,         // L per kg
  crop: 1644,          // L per kg
  electronics: 240,    // L per unit
  automotive: 148,     // L per unit (simplified)
  steel: 24000,        // L per ton
  semiconductor: 1500, // L per wafer
};

const REGION_DATA = {
  'high-rainfall': { rainfall: 2500, availability: 2000, category: 'Very Wet' },
  'moderate-rainfall': { rainfall: 1200, availability: 800, category: 'Moderate' },
  'low-rainfall': { rainfall: 600, availability: 300, category: 'Dry' },
  'arid': { rainfall: 200, availability: 50, category: 'Arid' },
};

function calculateISO14046(sector, category, region, production, pollutants) {
  // Blue water (freshwater consumed)
  const baseWaterUse = CATEGORY_WATER_USE[category] || 1000;
  const blueWater = baseWaterUse * (production / 100);

  // Green water (rainwater/natural water)
  const greenWater = blueWater * 0.3;

  // Grey water (polluted water requiring treatment)
  const totalPollutant = Object.values(pollutants || {}).reduce((a, b) => a + b, 0);
  const greyWater = blueWater * (totalPollutant / 1000); // Scale with pollution

  const totalWater = blueWater + greenWater + greyWater;

  // Regional water scarcity analysis
  const regionInfo = REGION_DATA[region] || REGION_DATA['moderate-rainfall'];
  const availableWater = regionInfo.availability * 10; // M m³ to m³
  const scarcityIndex = (totalWater / availableWater) * 100;

  const stressLevel =
    scarcityIndex > 80 ? 'Critical' :
    scarcityIndex > 50 ? 'High' :
    scarcityIndex > 20 ? 'Moderate' : 'Low';

  // Water degradation index (0-100)
  const pollutantArray = Object.entries(pollutants || {}).map(([name, conc]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' '),
    concentration: conc,
    unit: 'mg/L',
  }));

  const degradationIndex = Math.min(100, totalPollutant / 10);

  // LCA stages breakdown
  const lcaStages = [
    { stage: 'Raw Material Extraction', water: totalWater * 0.3, impact: 30 },
    { stage: 'Production Phase', water: totalWater * 0.5, impact: 50 },
    { stage: 'Distribution & Transport', water: totalWater * 0.15, impact: 15 },
    { stage: 'End of Life / Recycling', water: totalWater * 0.05, impact: 5 },
  ];

  // ISO 14046 Compliance assessment
  const certificationLevel =
    degradationIndex < 30 && scarcityIndex < 50 ? 'Gold' :
    degradationIndex < 50 && scarcityIndex < 70 ? 'Silver' : 'Bronze';

  const iso14046Compliant = certificationLevel !== 'Bronze' || degradationIndex < 75;

  const recommendations = [];
  if (degradationIndex > 40) recommendations.push('Implement advanced wastewater treatment system');
  if (scarcityIndex > 60) recommendations.push('Adopt water recycling and reuse strategies');
  if (blueWater > baseWaterUse * 1.2) recommendations.push('Optimize production process to reduce water intake');
  if (recommendations.length === 0) recommendations.push('Maintain current water management practices');
  if (recommendations.length < 3) recommendations.push('Consider renewable water sources');

  return {
    productName: 'Product Assessment',
    category,
    waterConsumption: {
      blue: blueWater,
      green: greenWater,
      grey: greyWater,
      total: totalWater,
    },
    waterDegradation: {
      pollutants: pollutantArray,
      degredationIndex: parseFloat(degradationIndex.toFixed(2)),
      quality_impact: degradationIndex > 50 ? 'High' : degradationIndex > 20 ? 'Medium' : 'Low',
    },
    waterScarcity: {
      regionName: region,
      annualRainfall: regionInfo.rainfall,
      waterAvailability: availableWater,
      scarcityIndex: parseFloat(scarcityIndex.toFixed(2)),
      stressLevel,
    },
    lcaMetrics: {
      stages: lcaStages,
      totalLCAImpact: 100,
      hotspots: ['Production phase (50% of total impact)', 'Raw material sourcing (30% of total impact)'],
    },
    complianceReport: {
      iso14046Compliant,
      certificationLevel,
      recommendations,
      benchmarkComparison: `${category} industry average: ${baseWaterUse} L/unit`,
    },
  };
}

// POST: Calculate ISO 14046
router.post('/calculate', async (req, res) => {
  try {
    const { productName, category, region, production, pollutants } = req.body;

    if (!category || !region) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = calculateISO14046('iso14046', category, region, production, pollutants);

    // Try to save to DB (non-blocking)
    pool.query(
      `INSERT INTO iso14046_calculations 
       (product_name, category, region, production, pollutants, results, calculation_date)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [productName || 'Product', category, region, production, JSON.stringify(pollutants), JSON.stringify(result)]
    ).catch(err => {
      console.warn('[ISO14046] DB save skipped:', err.message);
    });

    res.status(201).json({
      ...result,
      productName,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('[ISO14046] Calculate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Supported categories
router.get('/categories', (req, res) => {
  res.json({
    categories: Object.keys(CATEGORY_WATER_USE),
    regions: Object.keys(REGION_DATA),
  });
});

// GET: Region data
router.get('/regions', (req, res) => {
  res.json(REGION_DATA);
});

// GET: History
router.get('/history', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM iso14046_calculations ORDER BY calculation_date DESC LIMIT 50'
    );
    res.json(result.rows || []);
  } catch (error) {
    res.json([]);
  }
});

export default router;
