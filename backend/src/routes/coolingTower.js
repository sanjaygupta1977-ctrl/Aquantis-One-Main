import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all cooling tower records
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cooling_tower ORDER BY created_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save cooling tower record
router.post('/', async (req, res) => {
  try {
    const { inletTemp, outletTemp, ambientTemp, flowRate } = req.body;

    const approachTemp = outletTemp - ambientTemp;
    const rangeTemp = inletTemp - outletTemp;
    const effectiveness = rangeTemp > 0 ? ((rangeTemp) / (inletTemp - ambientTemp) * 100) : 0;

    const result = await pool.query(
      `INSERT INTO cooling_tower (inlet_temp, outlet_temp, ambient_temp, flow_rate, approach_temp, range_temp, effectiveness)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [inletTemp, outletTemp, ambientTemp, flowRate, approachTemp, rangeTemp, effectiveness]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest cooling tower data
router.get('/latest', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cooling_tower ORDER BY created_at DESC LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
