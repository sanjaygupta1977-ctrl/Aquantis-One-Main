import express from 'express';
import pool from '../db.js';

const router = express.Router();

// NITI Aayog Water Neutrality Framework
const NITI_FRAMEWORK = {
  textile: { benchmark: 100, recharge_target: 0.7, recycle_target: 0.5, niti_threshold: 0.8 },
  chemical: { benchmark: 150, recharge_target: 0.6, recycle_target: 0.6, niti_threshold: 0.75 },
  pharmaceutical: { benchmark: 80, recharge_target: 0.75, recycle_target: 0.7, niti_threshold: 0.85 },
  food_beverage: { benchmark: 120, recharge_target: 0.65, recycle_target: 0.6, niti_threshold: 0.80 },
  steel: { benchmark: 200, recharge_target: 0.5, recycle_target: 0.7, niti_threshold: 0.75 },
  pulp_paper: { benchmark: 250, recharge_target: 0.6, recycle_target: 0.8, niti_threshold: 0.80 },
  mining: { benchmark: 180, recharge_target: 0.75, recycle_target: 0.5, niti_threshold: 0.70 },
  thermal_power: { benchmark: 300, recharge_target: 0.5, recycle_target: 0.6, niti_threshold: 0.75 },
  automobile: { benchmark: 90, recharge_target: 0.65, recycle_target: 0.65, niti_threshold: 0.85 },
  electronics: { benchmark: 70, recharge_target: 0.7, recycle_target: 0.75, niti_threshold: 0.90 },
};

// Initialize water neutrality table
export async function initWaterNeutralityTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS water_neutrality_assessments (
        id SERIAL PRIMARY KEY,
        assessment_id VARCHAR(255) UNIQUE,
        industry VARCHAR(100),
        water_consumption DECIMAL(10, 2),
        recycling_rate DECIMAL(5, 2),
        recharge_rate DECIMAL(5, 2),
        water_neutrality_index DECIMAL(5, 2),
        niti_benchmark DECIMAL(5, 2),
        compliance_level VARCHAR(50),
        recommendations JSONB,
        scorecard JSONB,
        timeline JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] Water Neutrality table initialized');
  } catch (err) {
    console.error('[DB] Water Neutrality table error:', err.message);
  }
}

// Calculate water neutrality
router.post('/calculate', async (req, res) => {
  try {
    const { industry, water_usage, recycling_rate, recharge_rate } = req.body;

    if (!industry || !water_usage) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const bench = NITI_FRAMEWORK[industry] || NITI_FRAMEWORK.textile;

    // Water Neutrality Calculation
    const recycledVolume = water_usage * (recycling_rate / 100);
    const rechargedVolume = water_usage * (recharge_rate / 100);
    const totalOffset = recycledVolume + rechargedVolume;
    const waterNeutralityIndex = Math.min(100, (totalOffset / water_usage) * 100);

    // Compliance Level
    let complianceLevel = 'Non-Compliant';
    if (waterNeutralityIndex >= bench.niti_threshold * 100) {
      complianceLevel = 'Water Positive';
    } else if (waterNeutralityIndex >= 70) {
      complianceLevel = 'Water Neutral (Near)';
    } else if (waterNeutralityIndex >= 40) {
      complianceLevel = 'Partial Neutrality';
    }

    // Recommendations
    const recommendations = [];
    if (recycling_rate < bench.recycle_target * 100) {
      recommendations.push(`Increase water recycling to ${(bench.recycle_target * 100).toFixed(0)}%`);
    }
    if (recharge_rate < bench.recharge_target * 100) {
      recommendations.push(`Enhance groundwater recharge to ${(bench.recharge_target * 100).toFixed(0)}%`);
    }
    if (water_usage > bench.benchmark) {
      recommendations.push(`Optimize water consumption to ${bench.benchmark} m³/unit`);
    }
    recommendations.push('Implement water audits quarterly');
    recommendations.push('Install real-time water monitoring systems');
    recommendations.push('Establish rainwater harvesting system');

    // Scorecard
    const scorecard = {
      recycling: (recycling_rate / (bench.recycle_target * 100)) * 100,
      recharge: (recharge_rate / (bench.recharge_target * 100)) * 100,
      consumption: Math.min(100, (bench.benchmark / water_usage) * 100),
      compliance: (waterNeutralityIndex / (bench.niti_threshold * 100)) * 100
    };

    // Timeline
    const timeline = Array.from({ length: 5 }, (_, i) => ({
      year: new Date().getFullYear() + i,
      consumption: Math.max(water_usage * 0.8, water_usage - (water_usage * 0.05 * (i + 1))),
      recycled: recycledVolume + (recycledVolume * 0.1 * (i + 1)),
      positivity: Math.min(100, waterNeutralityIndex + ((bench.niti_threshold * 100 - waterNeutralityIndex) * 0.15 * (i + 1)))
    }));

    // Save to database
    const assessment_id = `WN-${Date.now()}`;
    await pool.query(
      `INSERT INTO water_neutrality_assessments 
       (assessment_id, industry, water_consumption, recycling_rate, recharge_rate, water_neutrality_index, niti_benchmark, compliance_level, recommendations, scorecard, timeline)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [assessment_id, industry, water_usage, recycling_rate, recharge_rate, waterNeutralityIndex, bench.niti_threshold * 100, complianceLevel, JSON.stringify(recommendations), JSON.stringify(scorecard), JSON.stringify(timeline)]
    ).catch(err => console.warn('[Water Neutrality] DB save skipped:', err.message));

    const result = {
      industry,
      baseline_water_consumption: water_usage,
      water_recycled: recycledVolume,
      water_recharged: rechargedVolume,
      water_neutrality_index: waterNeutralityIndex,
      status: waterNeutralityIndex >= bench.niti_threshold * 100 ? 'ACHIEVED' : 'IN PROGRESS',
      niti_benchmark: bench.niti_threshold * 100,
      compliance_level: complianceLevel,
      reduction_potential: Math.max(0, bench.niti_threshold * 100 - waterNeutralityIndex),
      recommendations,
      positivity_gap: Math.max(0, (bench.niti_threshold - (waterNeutralityIndex / 100)) * 100),
      scorecard,
      timeline
    };

    res.status(201).json(result);
  } catch (error) {
    console.error('[Water Neutrality] Calculate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get assessments
router.get('/assessments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM water_neutrality_assessments ORDER BY created_at DESC LIMIT 50');
    res.json(result.rows || []);
  } catch (error) {
    res.json([]);
  }
});

// Get NITI benchmarks
router.get('/benchmarks/:industry', (req, res) => {
  const benchmark = NITI_FRAMEWORK[req.params.industry] || NITI_FRAMEWORK.textile;
  res.json({
    industry: req.params.industry,
    ...benchmark,
    description: `NITI Aayog benchmark for ${req.params.industry} industry`
  });
});

export default router;
