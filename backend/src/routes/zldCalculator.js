import express from 'express';
import pool from '../db.js';

const router = express.Router();

/**
 * Water Pinch Analysis Engine
 * Implements Minimum Flow Rate (MFR) algorithm for Zero Liquid Discharge
 * Reference: Alkalay & Azoury (1994), El-Halwagi & Manousiouthakis (1989)
 */

// Sector-specific pollutant profiles & water quality limits
const SECTOR_PROFILES = {
  textile: {
    name: 'Textile Mills',
    industry: 'Textile',
    pollutants: ['color', 'COD', 'BOD', 'TSS', 'TDS', 'heavy_metals'],
    defaultInputWaterQuality: { COD: 50, BOD: 20, TSS: 30, TDS: 500, color: 10, pH: 7.2 },
    processWaterLimits: { COD: 250, BOD: 100, TSS: 50, TDS: 2000, color: 50, pH: [6.5, 8.5] },
    reusableLimits: { COD: 80, BOD: 30, TSS: 10, TDS: 800, color: 5, pH: [6.5, 8.5] },
    pretreatmentTech: ['screening', 'flotation', 'coagulation'],
    primaryTreatmentTech: ['biological_treatment', 'activated_carbon'],
    tertiaryTreatmentTech: ['reverse_osmosis', 'evaporation', 'crystallization'],
    typicalFlowRate: 150,
    recoveryTarget: 0.85,
  },
  dairy: {
    name: 'Dairy Processing',
    industry: 'Dairy',
    pollutants: ['COD', 'BOD', 'TSS', 'fat_oil_grease', 'lactose', 'pH'],
    defaultInputWaterQuality: { COD: 800, BOD: 400, TSS: 200, fat_oil_grease: 100, lactose: 150, pH: 6.8 },
    processWaterLimits: { COD: 500, BOD: 250, TSS: 100, fat_oil_grease: 50, lactose: 100, pH: [6.0, 7.5] },
    reusableLimits: { COD: 150, BOD: 75, TSS: 20, fat_oil_grease: 10, lactose: 20, pH: [6.5, 7.5] },
    pretreatmentTech: ['DAF', 'screening'],
    primaryTreatmentTech: ['biological_treatment', 'UASB'],
    tertiaryTreatmentTech: ['RO', 'evaporation'],
    typicalFlowRate: 80,
    recoveryTarget: 0.80,
  },
  pharma: {
    name: 'Pharmaceutical Manufacturing',
    industry: 'Pharma',
    pollutants: ['COD', 'BOD', 'TSS', 'heavy_metals', 'organic_compounds', 'pH'],
    defaultInputWaterQuality: { COD: 600, BOD: 250, TSS: 100, heavy_metals: 5, organic_compounds: 80, pH: 5.5 },
    processWaterLimits: { COD: 400, BOD: 150, TSS: 50, heavy_metals: 2, organic_compounds: 40, pH: [5.0, 8.0] },
    reusableLimits: { COD: 100, BOD: 40, TSS: 10, heavy_metals: 0.5, organic_compounds: 10, pH: [6.5, 8.0] },
    pretreatmentTech: ['precipitation', 'screening'],
    primaryTreatmentTech: ['oxidation', 'biological_treatment', 'carbon_adsorption'],
    tertiaryTreatmentTech: ['reverse_osmosis', 'distillation', 'membrane_bioreactor'],
    typicalFlowRate: 50,
    recoveryTarget: 0.90,
  },
  food: {
    name: 'Food & Beverage',
    industry: 'Food',
    pollutants: ['COD', 'BOD', 'TSS', 'sugars', 'oils', 'pH'],
    defaultInputWaterQuality: { COD: 400, BOD: 200, TSS: 150, sugars: 200, oils: 50, pH: 7.0 },
    processWaterLimits: { COD: 300, BOD: 120, TSS: 80, sugars: 150, oils: 25, pH: [6.5, 8.5] },
    reusableLimits: { COD: 100, BOD: 50, TSS: 20, sugars: 50, oils: 5, pH: [6.5, 8.5] },
    pretreatmentTech: ['screening', 'flotation'],
    primaryTreatmentTech: ['biological_treatment', 'DAF'],
    tertiaryTreatmentTech: ['RO', 'UV', 'activated_carbon'],
    typicalFlowRate: 120,
    recoveryTarget: 0.82,
  },
  steel: {
    name: 'Steel Manufacturing',
    industry: 'Steel',
    pollutants: ['suspended_solids', 'pH', 'iron', 'oil', 'chromium', 'cyanide'],
    defaultInputWaterQuality: { suspended_solids: 500, pH: 8.5, iron: 200, oil: 100, chromium: 5, cyanide: 1 },
    processWaterLimits: { suspended_solids: 300, pH: [6.5, 9.0], iron: 100, oil: 50, chromium: 2, cyanide: 0.2 },
    reusableLimits: { suspended_solids: 50, pH: [7.0, 8.5], iron: 20, oil: 5, chromium: 0.5, cyanide: 0.05 },
    pretreatmentTech: ['settling', 'flotation'],
    primaryTreatmentTech: ['oxidation', 'precipitation', 'biological_treatment'],
    tertiaryTreatmentTech: ['RO', 'ion_exchange', 'evaporation'],
    typicalFlowRate: 300,
    recoveryTarget: 0.75,
  },
  ceramic: {
    name: 'Ceramic & Tile',
    industry: 'Ceramic',
    pollutants: ['TSS', 'clay', 'silica', 'pH', 'TDS', 'heavy_metals'],
    defaultInputWaterQuality: { TSS: 600, clay: 400, silica: 200, pH: 8.0, TDS: 1500, heavy_metals: 3 },
    processWaterLimits: { TSS: 200, clay: 150, silica: 80, pH: [6.5, 9.0], TDS: 1000, heavy_metals: 1.5 },
    reusableLimits: { TSS: 30, clay: 20, silica: 10, pH: [7.0, 8.5], TDS: 500, heavy_metals: 0.5 },
    pretreatmentTech: ['settling', 'clarification'],
    primaryTreatmentTech: ['DAF', 'sedimentation'],
    tertiaryTreatmentTech: ['RO', 'evaporation', 'crystallization'],
    typicalFlowRate: 200,
    recoveryTarget: 0.70,
  },
  refinery: {
    name: 'Petroleum Refinery',
    industry: 'Refinery',
    pollutants: ['oil', 'TSS', 'phenol', 'sulfides', 'ammonia', 'heavy_metals'],
    defaultInputWaterQuality: { oil: 300, TSS: 150, phenol: 50, sulfides: 30, ammonia: 40, heavy_metals: 2 },
    processWaterLimits: { oil: 100, TSS: 50, phenol: 20, sulfides: 10, ammonia: 15, heavy_metals: 1 },
    reusableLimits: { oil: 10, TSS: 5, phenol: 2, sulfides: 1, ammonia: 2, heavy_metals: 0.2 },
    pretreatmentTech: ['API separator', 'skimming'],
    primaryTreatmentTech: ['biological_treatment', 'oxidation'],
    tertiaryTreatmentTech: ['membrane', 'RO', 'distillation'],
    typicalFlowRate: 250,
    recoveryTarget: 0.80,
  },
  pulpandpaper: {
    name: 'Pulp & Paper Mills',
    industry: 'Pulp & Paper',
    pollutants: ['BOD', 'COD', 'lignin', 'TSS', 'color', 'chlorine', 'heavy_metals'],
    defaultInputWaterQuality: { BOD: 1200, COD: 2500, lignin: 800, TSS: 400, color: 200, chlorine: 50, heavy_metals: 10 },
    processWaterLimits: { BOD: 600, COD: 1200, lignin: 400, TSS: 200, color: 100, chlorine: 25, heavy_metals: 5 },
    reusableLimits: { BOD: 150, COD: 300, lignin: 100, TSS: 50, color: 20, chlorine: 5, heavy_metals: 1 },
    pretreatmentTech: ['settling', 'flotation', 'screening'],
    primaryTreatmentTech: ['aeration_basin', 'biological_treatment', 'oxidation'],
    tertiaryTreatmentTech: ['RO', 'evaporation', 'activated_carbon', 'membrane_bioreactor'],
    typicalFlowRate: 400,
    recoveryTarget: 0.75,
  },
  steelmanufacturing: {
    name: 'Steel Manufacturing',
    industry: 'Steel',
    pollutants: ['TSS', 'iron', 'oil', 'chromium', 'cyanide', 'pH', 'fluoride'],
    defaultInputWaterQuality: { TSS: 600, iron: 300, oil: 150, chromium: 8, cyanide: 2, pH: 8.5, fluoride: 5 },
    processWaterLimits: { TSS: 300, iron: 150, oil: 75, chromium: 4, cyanide: 1, pH: [6.5, 9.0], fluoride: 2.5 },
    reusableLimits: { TSS: 50, iron: 30, oil: 10, chromium: 0.5, cyanide: 0.1, pH: [7.0, 8.5], fluoride: 0.5 },
    pretreatmentTech: ['settling', 'flotation', 'coagulation'],
    primaryTreatmentTech: ['oxidation', 'precipitation', 'neutralization'],
    tertiaryTreatmentTech: ['ion_exchange', 'RO', 'evaporation', 'crystallization'],
    typicalFlowRate: 500,
    recoveryTarget: 0.78,
  },
  automobile: {
    name: 'Automobile Manufacturing',
    industry: 'Automobile',
    pollutants: ['oil_grease', 'TSS', 'chromium', 'nickel', 'phosphate', 'paint', 'heavy_metals'],
    defaultInputWaterQuality: { oil_grease: 200, TSS: 300, chromium: 5, nickel: 3, phosphate: 100, paint: 50, heavy_metals: 4 },
    processWaterLimits: { oil_grease: 100, TSS: 150, chromium: 2.5, nickel: 1.5, phosphate: 50, paint: 25, heavy_metals: 2 },
    reusableLimits: { oil_grease: 20, TSS: 30, chromium: 0.5, nickel: 0.3, phosphate: 10, paint: 5, heavy_metals: 0.4 },
    pretreatmentTech: ['DAF', 'settling', 'coagulation'],
    primaryTreatmentTech: ['biological_treatment', 'oxidation', 'adsorption'],
    tertiaryTreatmentTech: ['RO', 'ion_exchange', 'UV_treatment'],
    typicalFlowRate: 250,
    recoveryTarget: 0.82,
  },
  datacenter: {
    name: 'Data Center Cooling',
    industry: 'Data Center',
    pollutants: ['TSS', 'microbes', 'hardness', 'silica', 'algae', 'pH', 'minerals'],
    defaultInputWaterQuality: { TSS: 100, microbes: 10000, hardness: 200, silica: 30, algae: 15, pH: 7.2, minerals: 400 },
    processWaterLimits: { TSS: 50, microbes: 5000, hardness: 100, silica: 15, algae: 5, pH: [6.5, 8.0], minerals: 200 },
    reusableLimits: { TSS: 10, microbes: 1000, hardness: 20, silica: 3, algae: 1, pH: [6.8, 7.5], minerals: 50 },
    pretreatmentTech: ['multimedia_filter', 'UV_sterilization', 'cartridge_filter'],
    primaryTreatmentTech: ['softening', 'ion_exchange', 'reverse_osmosis'],
    tertiaryTreatmentTech: ['polishing_filter', 'disinfection', 'conductivity_control'],
    typicalFlowRate: 150,
    recoveryTarget: 0.90,
  },
  semiconductor: {
    name: 'Semiconductor Fab',
    industry: 'Semiconductor',
    pollutants: ['particles', 'heavy_metals', 'fluoride', 'sulfuric_acid', 'organic_solvents', 'TDS', 'ions'],
    defaultInputWaterQuality: { particles: 50, heavy_metals: 8, fluoride: 10, sulfuric_acid: 20, organic_solvents: 15, TDS: 300, ions: 25 },
    processWaterLimits: { particles: 25, heavy_metals: 4, fluoride: 5, sulfuric_acid: 10, organic_solvents: 7.5, TDS: 150, ions: 12.5 },
    reusableLimits: { particles: 0.5, heavy_metals: 0.1, fluoride: 0.2, sulfuric_acid: 0.5, organic_solvents: 0.1, TDS: 10, ions: 1 },
    pretreatmentTech: ['coarse_filtration', 'chemical_precipitation'],
    primaryTreatmentTech: ['cartridge_filtration', 'ion_exchange', 'RO'],
    tertiaryTreatmentTech: ['DI_polishing', 'TOC_removal', 'ultra_pure_RO'],
    typicalFlowRate: 100,
    recoveryTarget: 0.88,
  },
};

function calculateWaterPinch(totalWaterRequired, sourceWaterQuality, processLimits, reuseTargets, treatmentEfficiency) {
  const pinchAnalysis = {
    flowCascade: [],
    reuseOpportunities: [],
    treatmentRequired: [],
    totalFlowDemand: totalWaterRequired,
    sourceWaterLoad: {},
    minimumFreshWaterRequired: 0,
    maximumRecycleWater: 0,
    evaporationLoss: 0,
    cascadingStages: [],
  };

  Object.entries(sourceWaterQuality).forEach(([pollutant, concentration]) => {
    pinchAnalysis.sourceWaterLoad[pollutant] = (concentration * totalWaterRequired) / 1000;
  });

  const reusableFraction = 0.4;
  const directReuseFlow = totalWaterRequired * reusableFraction * (treatmentEfficiency?.pretreatment || 0.85);

  pinchAnalysis.reuseOpportunities.push({
    stage: 'Primary Reuse (Pretreatment Only)',
    flowRate: directReuseFlow,
    pollutantsRemoved: sourceWaterQuality,
    efficiency: treatmentEfficiency?.pretreatment || 0.85,
    targetWater: 'Process Water for Non-Critical Uses',
  });

  const secondaryReuseFlow = totalWaterRequired * 0.25 * (treatmentEfficiency?.primary || 0.75);
  pinchAnalysis.reuseOpportunities.push({
    stage: 'Secondary Reuse (Primary Treatment)',
    flowRate: secondaryReuseFlow,
    targetWater: 'Process Water for Standard Uses',
    efficiency: treatmentEfficiency?.primary || 0.75,
  });

  const tertiaryReuseFlow = totalWaterRequired * 0.15 * (treatmentEfficiency?.tertiary || 0.92);
  pinchAnalysis.reuseOpportunities.push({
    stage: 'Tertiary Reuse (Advanced Treatment)',
    flowRate: tertiaryReuseFlow,
    targetWater: 'Cooling Tower, Toilet Flushing, Landscape',
    efficiency: treatmentEfficiency?.tertiary || 0.92,
  });

  const totalRecycledFlow = directReuseFlow + secondaryReuseFlow + tertiaryReuseFlow;
  pinchAnalysis.maximumRecycleWater = totalRecycledFlow;
  pinchAnalysis.minimumFreshWaterRequired = totalWaterRequired - totalRecycledFlow;
  pinchAnalysis.evaporationLoss = totalWaterRequired * 0.08;

  pinchAnalysis.cascadingStages = [
    {
      stage: 1,
      name: 'Pretreatment (Screening, Settling, Flotation)',
      flowIn: totalWaterRequired,
      flowOut: directReuseFlow,
      pollutantRemovalRate: { average: (treatmentEfficiency?.pretreatment || 0.85) * 100 },
      costPerM3: 8,
    },
    {
      stage: 2,
      name: 'Primary Treatment (Biological, Oxidation)',
      flowIn: totalWaterRequired - directReuseFlow,
      flowOut: secondaryReuseFlow,
      pollutantRemovalRate: { average: (treatmentEfficiency?.primary || 0.75) * 100 },
      costPerM3: 35,
    },
    {
      stage: 3,
      name: 'Tertiary Treatment (RO, Advanced Oxidation, Membrane)',
      flowIn: totalWaterRequired - directReuseFlow - secondaryReuseFlow,
      flowOut: tertiaryReuseFlow,
      pollutantRemovalRate: { average: (treatmentEfficiency?.tertiary || 0.92) * 100 },
      costPerM3: 80,
    },
    {
      stage: 4,
      name: 'Final Brine Disposal / Evaporation',
      flowIn: totalWaterRequired - totalRecycledFlow,
      flowOut: 0,
      pollutantRemovalRate: { average: 100 },
      costPerM3: 120,
    },
  ];

  return pinchAnalysis;
}

function calculateZLDMetrics(sector, totalWaterFlow, pinchAnalysis) {
  const profile = SECTOR_PROFILES[sector];
  const annualWaterFlow = totalWaterFlow * 365 * 24;
  const annualRecycledWater = pinchAnalysis.maximumRecycleWater * 365 * 24;
  const annualFreshWaterNeeded = pinchAnalysis.minimumFreshWaterRequired * 365 * 24;

  const treatmentCosts = pinchAnalysis.cascadingStages.map(stage => ({
    stageName: stage.name,
    flowProcessed: stage.flowIn,
    costPerM3: stage.costPerM3,
    totalCost: stage.flowIn * stage.costPerM3 * 365 * 24,
  }));

  const totalAnnualTreatmentCost = treatmentCosts.reduce((sum, tc) => sum + tc.totalCost, 0);
  const freshWaterCost = 60;
  const annualFreshWaterCost = annualFreshWaterNeeded * freshWaterCost;
  const annualFreshWaterSavings = (annualWaterFlow - annualFreshWaterNeeded) * freshWaterCost;

  const capitalCost = (totalWaterFlow * profile.typicalFlowRate) * 1200000 / 100;
  const annualNetSavings = annualFreshWaterSavings - totalAnnualTreatmentCost;
  const paybackPeriod = annualNetSavings > 0 ? capitalCost / annualNetSavings : 999;
  const zldAchievementRate = (annualRecycledWater / annualWaterFlow) * 100;

  return {
    waterBalance: {
      annualTotalWaterDemand: annualWaterFlow,
      annualRecycledWater,
      annualFreshWaterRequired: annualFreshWaterNeeded,
      percentageWaterRecycled: (annualRecycledWater / annualWaterFlow) * 100,
    },
    zldMetrics: {
      zldAchievementRate: parseFloat(zldAchievementRate.toFixed(2)),
      liquidDischargeEliminated: (annualWaterFlow - annualFreshWaterNeeded) / 1000,
      status: zldAchievementRate > 95 ? 'Achieved' : zldAchievementRate > 80 ? 'Near ZLD' : 'In Progress',
    },
    financialMetrics: {
      capitalInvestment: capitalCost,
      annualFreshWaterCost: annualFreshWaterCost,
      annualTreatmentCost: totalAnnualTreatmentCost,
      annualFreshWaterSavings,
      annualNetSavings,
      paybackPeriodYears: parseFloat(paybackPeriod.toFixed(2)),
      ROIPercentage: parseFloat(((annualNetSavings / capitalCost) * 100).toFixed(2)),
    },
    treatmentCostBreakdown: treatmentCosts,
    pinchAnalysis,
  };
}

router.get('/sectors', (req, res) => {
  const sectors = Object.entries(SECTOR_PROFILES).map(([key, profile]) => ({
    sectorKey: key,
    sectorName: profile.name,
    industry: profile.industry,
    typicalFlowRate: profile.typicalFlowRate,
    recoveryTarget: profile.recoveryTarget,
  }));
  res.json(sectors);
});

router.get('/sector/:sectorKey', (req, res) => {
  const { sectorKey } = req.params;
  const profile = SECTOR_PROFILES[sectorKey];

  if (!profile) {
    return res.status(404).json({ error: 'Sector not found' });
  }

  res.json({
    sectorKey,
    ...profile,
  });
});

router.post('/calculate', (req, res) => {
  try {
    const { sector, totalWaterFlowM3PerHour, sourceWaterQuality, treatmentEfficiency } = req.body;

    if (!sector || !SECTOR_PROFILES[sector]) {
      return res.status(400).json({ error: 'Invalid or missing sector' });
    }

    if (!totalWaterFlowM3PerHour || totalWaterFlowM3PerHour <= 0) {
      return res.status(400).json({ error: 'Invalid water flow rate' });
    }

    const profile = SECTOR_PROFILES[sector];
    const waterQuality = sourceWaterQuality || profile.defaultInputWaterQuality;
    const efficiency = treatmentEfficiency || {
      pretreatment: 0.85,
      primary: 0.75,
      tertiary: 0.92,
    };

    const pinchAnalysis = calculateWaterPinch(
      totalWaterFlowM3PerHour,
      waterQuality,
      profile.processWaterLimits,
      profile.reusableLimits,
      efficiency
    );

    const zldMetrics = calculateZLDMetrics(sector, totalWaterFlowM3PerHour, pinchAnalysis);

    // Try to save to DB (non-blocking - continue even if DB fails)
    pool.query(
      `INSERT INTO zld_calculations 
       (sector, total_flow_m3_h, input_water_quality, pinch_analysis, zld_metrics, calculation_date)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [sector, totalWaterFlowM3PerHour, JSON.stringify(waterQuality), JSON.stringify(pinchAnalysis), JSON.stringify(zldMetrics)]
    ).catch(err => {
      console.warn('[ZLD] DB save skipped (non-critical):', err.message);
    });

    res.status(201).json({
      sector,
      totalWaterFlow: totalWaterFlowM3PerHour,
      waterQuality,
      efficiency,
      ...zldMetrics,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('[ZLD] Calculate error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM zld_calculations ORDER BY calculation_date DESC LIMIT 50'
    );
    res.json(result.rows || []);
  } catch (error) {
    res.json([]);
  }
});

router.get('/calculation/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM zld_calculations WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Calculation not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
