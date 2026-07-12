import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all KPIs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kpis ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save or update KPI
router.post('/', async (req, res) => {
  try {
    const { metricName, value, unit, trend } = req.body;

    const result = await pool.query(
      `INSERT INTO kpis (metric_name, value, unit, trend)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [metricName, value, unit, trend]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest KPIs
router.get('/latest', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (metric_name) metric_name, value, unit, trend, created_at
      FROM kpis
      ORDER BY metric_name, created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
