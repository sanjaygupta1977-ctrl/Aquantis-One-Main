import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all water quality records
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM water_quality ORDER BY created_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save water quality record
router.post('/', async (req, res) => {
  try {
    const { ph, turbidity, tds } = req.body;

    let qualityStatus = 'Excellent';
    if (ph < 6.5 || ph > 8.5) qualityStatus = 'Poor';
    else if (turbidity > 1 || tds > 1000) qualityStatus = 'Fair';

    const result = await pool.query(
      `INSERT INTO water_quality (ph, turbidity, tds, quality_status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [ph, turbidity, tds, qualityStatus]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest water quality
router.get('/latest', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM water_quality ORDER BY created_at DESC LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
