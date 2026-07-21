import express from 'express';

const router = express.Router();

/**
 * Crop-wise Water Requirement Data
 * Based on FAO-56 Penman-Monteith, Indian meteorological dept, & AICVIP studies
 * Water requirement in mm/season or ML/hectare
 */

const CROP_DATA = {
  // KHARIF (Summer/Monsoon) Crops
  rice: {
    name: 'Rice (Paddy)',
    season: 'Kharif',
    cropType: 'Cereal',
    durationDays: 120,
    waterRequirementMM: 1200,
    waterRequirementMLHa: 12,
    soilWaterAvailable: 'High (flooded)',
    irrigationMethod: 'Flood/Drip',
    states: ['Punjab', 'Haryana', 'Uttar Pradesh', 'West Bengal', 'Odisha', 'Chhattisgarh', 'Karnataka'],
    growthStages: {
      nursery: { days: 30, waterMM: 200 },
      transplanting: { days: 90, waterMM: 900 },
      maturity: { days: 30, waterMM: 100 },
    },
    irrigationSchedule: 'Every 5-7 days, 5-10 cm standing water',
    fieldCapacity: 0.32,
    wiltingPoint: 0.15,
  },
  cotton: {
    name: 'Cotton',
    season: 'Kharif',
    cropType: 'Cash Crop',
    durationDays: 180,
    waterRequirementMM: 650,
    waterRequirementMLHa: 6.5,
    soilWaterAvailable: 'Medium',
    irrigationMethod: 'Drip/Sprinkler',
    states: ['Gujarat', 'Maharashtra', 'Telangana', 'Andhra Pradesh', 'Karnataka'],
    growthStages: {
      vegetative: { days: 90, waterMM: 300 },
      flowering: { days: 60, waterMM: 250 },
      boll_formation: { days: 30, waterMM: 100 },
    },
    irrigationSchedule: '10-12 days interval, 50-75 mm per irrigation',
    fieldCapacity: 0.28,
    wiltingPoint: 0.12,
  },
  sugarcane: {
    name: 'Sugarcane',
    season: 'Kharif/Rabi',
    cropType: 'Cash Crop',
    durationDays: 360,
    waterRequirementMM: 2000,
    waterRequirementMLHa: 20,
    soilWaterAvailable: 'High',
    irrigationMethod: 'Flood/Sprinkler/Drip',
    states: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Tamil Nadu'],
    growthStages: {
      establishment: { days: 90, waterMM: 300 },
      growth: { days: 180, waterMM: 1200 },
      maturity: { days: 90, waterMM: 500 },
    },
    irrigationSchedule: 'Every 10-14 days, high water demand in growth phase',
    fieldCapacity: 0.35,
    wiltingPoint: 0.16,
  },
  maize: {
    name: 'Maize (Corn)',
    season: 'Kharif/Rabi',
    cropType: 'Cereal',
    durationDays: 120,
    waterRequirementMM: 450,
    waterRequirementMLHa: 4.5,
    soilWaterAvailable: 'Medium',
    irrigationMethod: 'Sprinkler/Drip',
    states: ['Karnataka', 'Himachal Pradesh', 'Rajasthan', 'Madhya Pradesh'],
    growthStages: {
      germination: { days: 10, waterMM: 30 },
      vegetative: { days: 35, waterMM: 120 },
      silking_tasseling: { days: 40, waterMM: 180 },
      grain_fill: { days: 35, waterMM: 120 },
    },
    irrigationSchedule: 'Critical at silking; 3-4 irrigations total',
    fieldCapacity: 0.26,
    wiltingPoint: 0.11,
  },
  soybean: {
    name: 'Soybean',
    season: 'Kharif',
    cropType: 'Pulses/Oil',
    durationDays: 110,
    waterRequirementMM: 550,
    waterRequirementMLHa: 5.5,
    soilWaterAvailable: 'Low-Medium',
    irrigationMethod: 'Drip/Sprinkler',
    states: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Odisha'],
    growthStages: {
      seedling: { days: 20, waterMM: 50 },
      vegetative: { days: 40, waterMM: 220 },
      flowering_pod: { days: 40, waterMM: 240 },
      seed_fill: { days: 10, waterMM: 40 },
    },
    irrigationSchedule: '2-3 critical irrigations during pod formation',
    fieldCapacity: 0.27,
    wiltingPoint: 0.10,
  },

  // RABI (Winter) Crops
  wheat: {
    name: 'Wheat',
    season: 'Rabi',
    cropType: 'Cereal',
    durationDays: 140,
    waterRequirementMM: 450,
    waterRequirementMLHa: 4.5,
    soilWaterAvailable: 'Medium (rain-fed)',
    irrigationMethod: 'Flood/Sprinkler',
    states: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan'],
    growthStages: {
      germination: { days: 20, waterMM: 50 },
      growth: { days: 80, waterMM: 250 },
      grain_fill: { days: 40, waterMM: 150 },
    },
    irrigationSchedule: '3-4 irrigations; CRI, Heading, Grain fill stages',
    fieldCapacity: 0.24,
    wiltingPoint: 0.10,
  },
  chickpea: {
    name: 'Chickpea (Chana)',
    season: 'Rabi',
    cropType: 'Pulses',
    durationDays: 140,
    waterRequirementMM: 350,
    waterRequirementMLHa: 3.5,
    soilWaterAvailable: 'Low (rain-fed)',
    irrigationMethod: 'Drip/Flood',
    states: ['Madhya Pradesh', 'Rajasthan', 'Uttar Pradesh', 'Karnataka'],
    growthStages: {
      germination: { days: 20, waterMM: 30 },
      vegetative: { days: 60, waterMM: 140 },
      flowering_podding: { days: 60, waterMM: 180 },
    },
    irrigationSchedule: '1-2 irrigations; mostly rain-fed',
    fieldCapacity: 0.28,
    wiltingPoint: 0.09,
  },
  mustard: {
    name: 'Mustard',
    season: 'Rabi',
    cropType: 'Oil Seed',
    durationDays: 130,
    waterRequirementMM: 350,
    waterRequirementMLHa: 3.5,
    soilWaterAvailable: 'Low (rain-fed)',
    irrigationMethod: 'Drip/Flood',
    states: ['Rajasthan', 'Uttar Pradesh', 'Haryana', 'Madhya Pradesh'],
    growthStages: {
      seedling: { days: 30, waterMM: 60 },
      growth: { days: 60, waterMM: 180 },
      flowering_maturity: { days: 40, waterMM: 110 },
    },
    irrigationSchedule: '1-2 irrigations depending on rainfall',
    fieldCapacity: 0.25,
    wiltingPoint: 0.08,
  },

  // SUMMER/PERENNIAL Crops
  groundnut: {
    name: 'Groundnut',
    season: 'Kharif/Summer',
    cropType: 'Oil Seed',
    durationDays: 140,
    waterRequirementMM: 600,
    waterRequirementMLHa: 6.0,
    soilWaterAvailable: 'Low-Medium',
    irrigationMethod: 'Drip/Sprinkler',
    states: ['Gujarat', 'Andhra Pradesh', 'Karnataka', 'Tamil Nadu'],
    growthStages: {
      seedling: { days: 30, waterMM: 100 },
      growth: { days: 70, waterMM: 300 },
      pod_formation: { days: 40, waterMM: 200 },
    },
    irrigationSchedule: '3-4 irrigations; critical at flowering & pod formation',
    fieldCapacity: 0.26,
    wiltingPoint: 0.09,
  },
  potato: {
    name: 'Potato',
    season: 'Rabi/Summer',
    cropType: 'Vegetable',
    durationDays: 90,
    waterRequirementMM: 450,
    waterRequirementMLHa: 4.5,
    soilWaterAvailable: 'Medium (frequent irrigation)',
    irrigationMethod: 'Drip/Sprinkler',
    states: ['Uttar Pradesh', 'Bihar', 'Jharkhand', 'Punjab', 'Himachal Pradesh'],
    growthStages: {
      emergence: { days: 20, waterMM: 50 },
      growth: { days: 40, waterMM: 250 },
      tuber_fill: { days: 30, waterMM: 150 },
    },
    irrigationSchedule: 'Every 7-10 days; avoid water logging',
    fieldCapacity: 0.30,
    wiltingPoint: 0.13,
  },
  onion: {
    name: 'Onion',
    season: 'Rabi',
    cropType: 'Vegetable',
    durationDays: 150,
    waterRequirementMM: 500,
    waterRequirementMLHa: 5.0,
    soilWaterAvailable: 'Medium (frequent irrigation)',
    irrigationMethod: 'Drip/Sprinkler',
    states: ['Maharashtra', 'Karnataka', 'Madhya Pradesh', 'Bihar'],
    growthStages: {
      germination: { days: 30, waterMM: 80 },
      vegetative: { days: 80, waterMM: 280 },
      bulb_formation: { days: 40, waterMM: 140 },
    },
    irrigationSchedule: 'Every 10-15 days; reduce near harvest',
    fieldCapacity: 0.28,
    wiltingPoint: 0.11,
  },
  sugarbeet: {
    name: 'Sugar Beet',
    season: 'Rabi',
    cropType: 'Cash Crop',
    durationDays: 180,
    waterRequirementMM: 1000,
    waterRequirementMLHa: 10.0,
    soilWaterAvailable: 'Medium-High',
    irrigationMethod: 'Drip/Flood',
    states: ['Uttar Pradesh', 'Punjab', 'Haryana'],
    growthStages: {
      establishment: { days: 60, waterMM: 250 },
      growth: { days: 90, waterMM: 600 },
      root_maturity: { days: 30, waterMM: 150 },
    },
    irrigationSchedule: 'Every 15-20 days; 5-6 total irrigations',
    fieldCapacity: 0.32,
    wiltingPoint: 0.14,
  },
};

/**
 * LULC (Land Use/Land Cover) Classification Data
 * Based on NRSC, Bhuvan, & satellite imagery analysis
 * Water demand indexed (ML/hectare/year)
 */

const LULC_CLASSES = {
  built_up: {
    code: 'BuiltUp',
    name: 'Built-up Area',
    description: 'Urban, towns, villages, concrete structures',
    color: '#FF0000',
    waterDemandMLHa: 2.5,
    waterUsageType: 'Domestic, Industrial',
    percentageInIndia: 8.5,
  },
  agricultural_kharif: {
    code: 'AgriKharif',
    name: 'Agricultural Land - Kharif',
    description: 'Rainfed/Irrigated crops in monsoon season',
    color: '#FFFF00',
    waterDemandMLHa: 8.0,
    waterUsageType: 'Irrigation',
    percentageInIndia: 22,
  },
  agricultural_rabi: {
    code: 'AgriRabi',
    name: 'Agricultural Land - Rabi',
    description: 'Winter season crops requiring irrigation',
    color: '#90EE90',
    waterDemandMLHa: 5.5,
    waterUsageType: 'Irrigation',
    percentageInIndia: 18,
  },
  forests: {
    code: 'Forest',
    name: 'Forest & Dense Vegetation',
    description: 'Deciduous, Evergreen, Mixed forests',
    color: '#228B22',
    waterDemandMLHa: 3.2,
    waterUsageType: 'Evapotranspiration',
    percentageInIndia: 21,
  },
  scrubland: {
    code: 'Scrub',
    name: 'Scrub Land',
    description: 'Sparse vegetation, degraded land',
    color: '#CD853F',
    waterDemandMLHa: 1.5,
    waterUsageType: 'Limited ET',
    percentageInIndia: 12,
  },
  water_bodies: {
    code: 'Water',
    name: 'Water Bodies',
    description: 'Rivers, lakes, reservoirs, ponds',
    color: '#0099FF',
    waterDemandMLHa: 0,
    waterUsageType: 'Source/Evaporation',
    percentageInIndia: 5,
  },
  barren: {
    code: 'Barren',
    name: 'Barren/Rocky Terrain',
    description: 'Rocks, cliffs, desert',
    color: '#999999',
    waterDemandMLHa: 0,
    waterUsageType: 'None',
    percentageInIndia: 10,
  },
  plantation: {
    code: 'Plantation',
    name: 'Plantations',
    description: 'Tea, Coffee, Coconut, Spices',
    color: '#CCFF00',
    waterDemandMLHa: 6.0,
    waterUsageType: 'Irrigation/ET',
    percentageInIndia: 3.5,
  },
};

/**
 * GET /api/crop-water/crops
 * Returns all available crops with water requirements
 */
router.get('/crops', (req, res) => {
  const crops = Object.entries(CROP_DATA).map(([key, data]) => ({
    cropKey: key,
    cropName: data.name,
    season: data.season,
    cropType: data.cropType,
    durationDays: data.durationDays,
    waterRequirementMM: data.waterRequirementMM,
    waterRequirementMLHa: data.waterRequirementMLHa,
    irrigationMethod: data.irrigationMethod,
    states: data.states,
  }));
  res.json(crops);
});

/**
 * GET /api/crop-water/crop/:cropKey
 * Returns detailed crop water data
 */
router.get('/crop/:cropKey', (req, res) => {
  const { cropKey } = req.params;
  const crop = CROP_DATA[cropKey];

  if (!crop) {
    return res.status(404).json({ error: 'Crop not found' });
  }

  res.json({
    cropKey,
    ...crop,
  });
});

/**
 * POST /api/crop-water/calculate
 * Calculate water requirement for given area & crop
 * Body: { cropKey, areaHectares, season }
 */
router.post('/calculate', (req, res) => {
  try {
    const { cropKey, areaHectares, season } = req.body;

    if (!cropKey || !CROP_DATA[cropKey]) {
      return res.status(400).json({ error: 'Invalid crop' });
    }

    if (!areaHectares || areaHectares <= 0) {
      return res.status(400).json({ error: 'Invalid area' });
    }

    const crop = CROP_DATA[cropKey];
    const waterPerHa = crop.waterRequirementMLHa;
    const totalWaterML = areaHectares * waterPerHa;
    const totalWaterM3 = totalWaterML * 1000; // Convert ML to m³

    // Seasonal adjustment
    let seasonalFactor = 1.0;
    if (season === 'dry') seasonalFactor = 1.2;
    if (season === 'wet') seasonalFactor = 0.8;

    const adjustedWaterM3 = totalWaterM3 * seasonalFactor;

    // Cost estimation (₹ per m³)
    const costPerM3 = 6; // Average water cost
    const totalCost = adjustedWaterM3 * costPerM3;

    res.json({
      cropKey,
      cropName: crop.name,
      areaHectares,
      season,
      seasonalFactor,
      waterRequirementMLHa: waterPerHa,
      totalWaterML: totalWaterML.toFixed(2),
      totalWaterM3: adjustedWaterM3.toFixed(2),
      estimatedCostRupees: totalCost.toFixed(2),
      growthStages: crop.growthStages,
      irrigationSchedule: crop.irrigationSchedule,
      fieldCapacity: crop.fieldCapacity,
      wiltingPoint: crop.wiltingPoint,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/lulc/classes
 * Returns LULC classification data
 */
router.get('/lulc/classes', (req, res) => {
  const classes = Object.entries(LULC_CLASSES).map(([key, data]) => ({
    lulcKey: key,
    ...data,
  }));
  res.json(classes);
});

/**
 * POST /api/lulc/analyze
 * Analyze water demand for given LULC distribution
 * Body: { lulcDistribution: { built_up: 10, agricultural_kharif: 40, ... }, totalAreaHa: 1000 }
 */
router.post('/lulc/analyze', (req, res) => {
  try {
    const { lulcDistribution, totalAreaHa } = req.body;

    if (!lulcDistribution || !totalAreaHa || totalAreaHa <= 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    let totalWaterDemandMLHa = 0;
    let breakdown = [];

    Object.entries(lulcDistribution).forEach(([lulcKey, percentage]) => {
      if (LULC_CLASSES[lulcKey]) {
        const lulcClass = LULC_CLASSES[lulcKey];
        const areaHa = (percentage / 100) * totalAreaHa;
        const waterMLHa = lulcClass.waterDemandMLHa;
        const totalWaterML = areaHa * waterMLHa;
        const contribution = (waterMLHa * percentage) / 100;

        totalWaterDemandMLHa += contribution;
        breakdown.push({
          lulcClass: lulcClass.name,
          percentage,
          areaHectares: areaHa.toFixed(2),
          waterDemandMLHa: waterMLHa,
          totalWaterML: totalWaterML.toFixed(2),
        });
      }
    });

    const totalWaterDemandML = (totalWaterDemandMLHa * totalAreaHa).toFixed(2);
    const totalWaterDemandM3 = (totalWaterDemandML * 1000).toFixed(2);

    res.json({
      totalAreaHectares: totalAreaHa,
      averageWaterDemandMLHa: totalWaterDemandMLHa.toFixed(2),
      totalWaterDemandML,
      totalWaterDemandM3,
      breakdown,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
