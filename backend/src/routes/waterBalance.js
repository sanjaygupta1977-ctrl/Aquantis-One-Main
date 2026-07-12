import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db.js';

const router = express.Router();

// Get all water balance records
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM water_balance ORDER BY created_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save water balance record
router.post('/', async (req, res) => {
  try {
    const {
      freshwater,
      recycledWater,
      rainwater,
      production,
      evaporationLoss,
      blowdownLoss,
      processLoss,
      domesticUse,
      discharge,
    } = req.body;

    const totalInput = freshwater + recycledWater + rainwater;
    const totalOutput = evaporationLoss + blowdownLoss + processLoss + domesticUse + discharge;
    const reusePercentage = (recycledWater / totalInput) * 100;
    const waterIntensity = totalInput / production;
    const balanceStatus = Math.abs(totalInput - totalOutput) < 100 ? 'Balanced' : 'Imbalanced';

    const result = await pool.query(
      `INSERT INTO water_balance 
       (freshwater, recycled_water, rainwater, production, evaporation_loss, blowdown_loss, 
        process_loss, domestic_use, discharge, total_input, reuse_percentage, water_intensity, balance_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        freshwater,
        recycledWater,
        rainwater,
        production,
        evaporationLoss,
        blowdownLoss,
        processLoss,
        domesticUse,
        discharge,
        totalInput,
        reusePercentage,
        waterIntensity,
        balanceStatus,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest water balance
router.get('/latest', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM water_balance ORDER BY created_at DESC LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
