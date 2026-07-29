import express from 'express';
import pool from '../db.js';

const router = express.Router();

/**
 * GEC 2015 (Groundwater Estimation Committee 2015) - Lake Recharge Impact Calculator
 * Methodology Reference: CGWB, Ministry of Water Resources, India
 * 
 * Key Components:
 * 1. Rainfall-Runoff Analysis
 * 2. Infiltration & Recharge Estimation
 * 3. Recharge Zone Classification
 * 4. Lake Water Balance
 * 5. Environmental Impact Assessment
 */

// GEC 2015 Parameters
const GEC2015_PARAMETERS = {
  soilInfiltration: {
    sandy: 150, // mm/day
    loamy: 75,
    clayey: 25,
    clay: 5,
  },
  runoffCoefficients: {
    urban: 0.85,
    agricultural: 0.35,
    forest: 0.15,
    barren: 0.60,
  },
  rechargePercentages: {
    sandy: 80,
    loamy: 50,
    clayey: 20,
    clay: 5,
  },
  rechargeZoneAreas: {
    high: 0.30,   // 30% of catchment - High recharge zones
    medium: 0.40, // 40% of catchment - Medium recharge zones
    low: 0.30,    // 30% of catchment - Low recharge zones
  },
};

function calculateGEC2015LakeRecharge(lakeArea, catchmentArea, annualRainfall, soilType, landUse) {
  // Get parameters
  const soilInfRate = GEC2015_PARAMETERS.soilInfiltration[soilType] || 75;
  const runoffCoeff = GEC2015_PARAMETERS.runoffCoefficients[landUse] || 0.35;
  const rechargePerc = GEC2015_PARAMETERS.rechargePercentages[soilType] || 50;

  // Convert units
  const lakeAreaM2 = lakeArea * 1e6; // km² to m²
  const catchmentAreaM2 = catchmentArea * 1e6;
  const catchmentAreaHa = catchmentArea * 100; // km² to hectares

  // 1. RAINFALL ANALYSIS (GEC 2015 splits monsoon and non-monsoon)
  const monsoonMonths = 4; // Typical India monsoon
  const monsoonPercentage = 0.75; // 75% of annual rainfall in monsoon
  const nonMonsoonPercentage = 0.25;

  const monsoonRainfall = annualRainfall * monsoonPercentage;
  const nonMonsoonRainfall = annualRainfall * nonMonsoonPercentage;
  const totalRainfallMm3 = (annualRainfall * catchmentAreaM2) / 1e9; // Convert to Mm³

  // 2. RUNOFF CALCULATION (GEC formula: Q = P × C, where P=rainfall, C=runoff coefficient)
  const monsoonRunoff = (monsoonRainfall * runoffCoeff * catchmentAreaM2) / 1e12; // Convert to Mm³
  const nonMonsoonRunoff = (nonMonsoonRainfall * runoffCoeff * catchmentAreaM2) / 1e12;
  const totalRunoff = monsoonRunoff + nonMonsoonRunoff;

  // 3. INFILTRATION ANALYSIS
  const totalInfiltrationCapacity = (soilInfRate * 365 * catchmentAreaM2) / 1e12; // Mm³/year
  const directRechargeMm3 = (totalRainfallMm3 * (rechargePerc / 100));

  // 4. LAKE-SPECIFIC RECHARGE IMPACT
  // Direct recharge over lake surface (95% efficiency - minimal runoff)
  const lakeDirectRecharge = ((annualRainfall * lakeAreaM2) / 1e12) * 0.95;

  // Catchment baseflow contribution to lake (30% of runoff becomes groundwater contribution)
  const baseFlowContribution = (totalRunoff * 0.30);

  // Total lake recharge from GEC 2015 methodology
  const totalLakeRecharge = lakeDirectRecharge + baseFlowContribution;

  // 5. RECHARGE ZONES (GEC 2015 classifies into High, Medium, Low)
  const rechargeZones = [
    {
      name: 'High Recharge Zone',
      percentage: GEC2015_PARAMETERS.rechargeZoneAreas.high,
      characteristics: 'Sandy soils, flat terrain, good infiltration',
      infiltrationRate: soilInfRate * 0.8,
    },
    {
      name: 'Medium Recharge Zone',
      percentage: GEC2015_PARAMETERS.rechargeZoneAreas.medium,
      characteristics: 'Loamy soils, moderate slope, moderate infiltration',
      infiltrationRate: soilInfRate * 0.5,
    },
    {
      name: 'Low Recharge Zone',
      percentage: GEC2015_PARAMETERS.rechargeZoneAreas.low,
      characteristics: 'Clay soils, high slope, low infiltration',
      infiltrationRate: soilInfRate * 0.2,
    },
  ];

  const zoneData = rechargeZones.map((zone) => ({
    zone: zone.name,
    percentage: zone.percentage * 100,
    rechargeRate: zone.infiltrationRate,
    area: catchmentArea * zone.percentage,
    totalRecharge: ((catchmentArea * zone.percentage) * (zone.infiltrationRate / 1000)) / 365,
  }));

  // 6. STORAGE CAPACITY OPTIMIZATION (GEC 2015)
  // Optimal storage = 40% of annual rainfall
  const optimalStorageCapacity = (totalRainfallMm3 * 0.4);
  const currentStorageCapacity = (lakeAreaM2 * 0.5) / 1e12; // Assume 0.5m avg depth in Mm³
  const storageDeficitOrSurplus = currentStorageCapacity - optimalStorageCapacity;
  const capacityUtilization = (currentStorageCapacity / optimalStorageCapacity) * 100;

  // Annual storage increment (70% of recharge retained)
  const annualStorageIncrement = totalLakeRecharge * 0.70;

  // 7. ENVIRONMENTAL IMPACT METRICS
  // Groundwater table rise calculation (GEC 2015)
  // Rise = Total Recharge / Catchment Area × Specific Yield (assume 0.1)
  const gwTableRise = (totalLakeRecharge / catchmentArea) * 10; // mm/year

  // Spring discharge potential (25% of recharge)
  const springDischargePotential = totalLakeRecharge * 0.25;

  // Wetland recharge (15% of recharge)
  const wetlandRecharge = totalLakeRecharge * 0.15;

  // Biodiversity index (based on GW availability and water spread)
  const biodiversityIndex = Math.min(100, 50 + (gwTableRise * 3));

  // 8. RECOMMENDATIONS (GEC 2015 Best Practices)
  const recommendations = [
    `Implement check dams in ${landUse === 'agricultural' ? 'high recharge' : 'identified high recharge'} zones for enhanced infiltration`,
    `Soil conservation priority: ${soilType} soils require ${soilType === 'sandy' ? 'vegetative cover' : soilType === 'clay' ? 'drainage management' : 'moderate moisture management'}`,
    `Focus lake augmentation in areas with ${gwTableRise > 50 ? 'declining' : 'stable'} groundwater tables`,
    `Maintain minimum ecological flow of ${(optimalStorageCapacity * 0.20).toFixed(1)} Mm³ for spring and wetland sustenance`,
    `Monitor groundwater rise rate of ${gwTableRise.toFixed(1)} mm/year for waterlogging risks in low areas`,
  ];

  return {
    inputParameters: {
      lakeArea,
      catchmentArea,
      annualRainfall,
      soilType,
      landUse,
      monsoonMonths,
    },
    rainfallAnalysis: {
      totalRainfall: totalRainfallMm3,
      monsoonRainfall: (monsoonRainfall * catchmentAreaM2) / 1e12,
      nonMonsoonRainfall: (nonMonsoonRainfall * catchmentAreaM2) / 1e12,
      rainfallCoefficient: 0.95,
    },
    runoffCalculation: {
      totalRunoff: parseFloat(totalRunoff.toFixed(3)),
      monsoonRunoff: parseFloat(monsoonRunoff.toFixed(3)),
      nonMonsoonRunoff: parseFloat(nonMonsoonRunoff.toFixed(4)),
      runoffCoefficient: runoffCoeff,
    },
    infiltrationAnalysis: {
      infiltrationCapacity: soilInfRate,
      permeability: soilType === 'sandy' ? 10 : soilType === 'loamy' ? 5 : 1,
      soilInfiltrationRate: soilInfRate,
      totalInfiltration: parseFloat(directRechargeMm3.toFixed(3)),
    },
    rechargeZone: zoneData,
    lakeRechargeImpact: {
      directRecharge: parseFloat(lakeDirectRecharge.toFixed(3)),
      baseFlowContribution: parseFloat(baseFlowContribution.toFixed(3)),
      totalLakeRecharge: parseFloat(totalLakeRecharge.toFixed(3)),
      rechargePercentageOfRainfall: parseFloat(((totalLakeRecharge / totalRainfallMm3) * 100).toFixed(1)),
      annualStorageIncrement: parseFloat(annualStorageIncrement.toFixed(3)),
    },
    storageCapacity: {
      optimalCapacity: parseFloat(optimalStorageCapacity.toFixed(2)),
      currentCapacity: parseFloat(currentStorageCapacity.toFixed(2)),
      deficitOrSurplus: parseFloat(storageDeficitOrSurplus.toFixed(2)),
      capacityUtilization: parseFloat(capacityUtilization.toFixed(1)),
    },
    environmentalImpact: {
      groundwaterTable: parseFloat(gwTableRise.toFixed(2)),
      springDischargePotential: parseFloat(springDischargePotential.toFixed(3)),
      wetlandRecharge: parseFloat(wetlandRecharge.toFixed(3)),
      biodiversityIndex: parseFloat(biodiversityIndex.toFixed(1)),
    },
    recommendations,
  };
}

// POST: Calculate GEC 2015 Lake Recharge
router.post('/lake-recharge', async (req, res) => {
  try {
    const { lakeArea, catchmentArea, annualRainfall, soilType, landUse } = req.body;

    if (!lakeArea || !catchmentArea || !annualRainfall) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const result = calculateGEC2015LakeRecharge(lakeArea, catchmentArea, annualRainfall, soilType, landUse);

    // Try to save to DB (non-blocking)
    pool.query(
      `INSERT INTO gec2015_calculations 
       (lake_area, catchment_area, annual_rainfall, soil_type, land_use, result, calculation_date)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [lakeArea, catchmentArea, annualRainfall, soilType, landUse, JSON.stringify(result)]
    ).catch(err => {
      console.warn('[GEC2015] DB save skipped:', err.message);
    });

    res.status(201).json({
      ...result,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('[GEC2015] Calculate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET: GEC 2015 Parameters
router.get('/parameters', (req, res) => {
  res.json(GEC2015_PARAMETERS);
});

// GET: History
router.get('/history', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM gec2015_calculations ORDER BY calculation_date DESC LIMIT 50'
    );
    res.json(result.rows || []);
  } catch (error) {
    res.json([]);
  }
});

export default router;
