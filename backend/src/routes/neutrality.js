import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all neutrality records
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM neutrality ORDER BY created_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save neutrality record
router.post('/', async (req, res) => {
  try {
    const { acidity, alkalinity } = req.body;

    const neutralityIndex = Math.abs(acidity - alkalinity);
    const requiresTreatment = neutralityIndex > 2;
    const recommendedDose = requiresTreatment ? (neutralityIndex * 50) : 0;

    const result = await pool.query(
      `INSERT INTO neutrality (acidity, alkalinity, neutrality_index, requires_treatment, recommended_dose)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [acidity, alkalinity, neutralityIndex, requiresTreatment, recommendedDose]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest neutrality data
router.get('/latest', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM neutrality ORDER BY created_at DESC LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
