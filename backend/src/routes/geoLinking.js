import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Initialize geographic linking table
export async function initGeoLinkingTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS geo_linked_data (
        id SERIAL PRIMARY KEY,
        lulc_analysis_id VARCHAR(255) UNIQUE,
        water_demand_id VARCHAR(255) UNIQUE,
        thermal_plant_id VARCHAR(255) UNIQUE,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        distance_km DECIMAL(10, 4),
        lulc_data JSONB,
        water_demand_data JSONB,
        thermal_data JSONB,
        link_status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] Geo-Linking table initialized');
  } catch (err) {
    console.error('[DB] Geo-Linking table error:', err.message);
  }
}

// Simple distance calculator (Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Save LULC analysis
router.post('/save-lulc', async (req, res) => {
  try {
    const { lulc_id, latitude, longitude, distribution, totalAreaHa, result } = req.body;

    if (!lulc_id || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const lulc_data = { distribution, totalAreaHa, result, timestamp: new Date().toISOString() };

    // Check if exists, then update or insert
    const exists = await pool.query(
      `SELECT id FROM geo_linked_data WHERE lulc_analysis_id = $1`,
      [lulc_id]
    );

    if (exists.rows.length > 0) {
      await pool.query(
        `UPDATE geo_linked_data SET latitude = $1, longitude = $2, lulc_data = $3, link_status = 'linked'
         WHERE lulc_analysis_id = $4`,
        [latitude, longitude, JSON.stringify(lulc_data), lulc_id]
      );
    } else {
      await pool.query(
        `INSERT INTO geo_linked_data (lulc_analysis_id, latitude, longitude, lulc_data, link_status)
         VALUES ($1, $2, $3, $4, $5)`,
        [lulc_id, latitude, longitude, JSON.stringify(lulc_data), 'linked']
      );
    }

    // Auto-link to nearby thermal plants
    await autoLinkNearby(lulc_id, latitude, longitude, 'lulc');

    res.json({ success: true, lulc_id, coordinates: { latitude, longitude }, message: 'LULC linked' });
  } catch (error) {
    console.error('[Geo-Link] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Save Thermal Power Plant
router.post('/save-thermal-plant', async (req, res) => {
  try {
    const { thermal_plant_id, latitude, longitude, plant_data } = req.body;

    if (!thermal_plant_id || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const thermal_data = { ...plant_data, timestamp: new Date().toISOString() };

    const exists = await pool.query(
      `SELECT id FROM geo_linked_data WHERE thermal_plant_id = $1`,
      [thermal_plant_id]
    );

    if (exists.rows.length > 0) {
      await pool.query(
        `UPDATE geo_linked_data SET latitude = $1, longitude = $2, thermal_data = $3, link_status = 'linked'
         WHERE thermal_plant_id = $4`,
        [latitude, longitude, JSON.stringify(thermal_data), thermal_plant_id]
      );
    } else {
      await pool.query(
        `INSERT INTO geo_linked_data (thermal_plant_id, latitude, longitude, thermal_data, link_status)
         VALUES ($1, $2, $3, $4, $5)`,
        [thermal_plant_id, latitude, longitude, JSON.stringify(thermal_data), 'linked']
      );
    }

    // Auto-link to nearby LULC
    await autoLinkNearby(thermal_plant_id, latitude, longitude, 'thermal');

    res.json({ success: true, thermal_plant_id, coordinates: { latitude, longitude }, message: 'Thermal plant linked' });
  } catch (error) {
    console.error('[Geo-Link] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get nearby data
router.get('/nearby/:latitude/:longitude/:radius_km', async (req, res) => {
  try {
    const lat = parseFloat(req.params.latitude);
    const lon = parseFloat(req.params.longitude);
    const radius = parseFloat(req.params.radius_km) || 50;

    const result = await pool.query(
      `SELECT * FROM geo_linked_data WHERE latitude IS NOT NULL AND longitude IS NOT NULL`
    );

    const nearby = result.rows
      .map(row => ({
        ...row,
        distance_km: calculateDistance(lat, lon, parseFloat(row.latitude), parseFloat(row.longitude))
      }))
      .filter(row => row.distance_km <= radius && row.distance_km > 0)
      .sort((a, b) => a.distance_km - b.distance_km);

    res.json(nearby);
  } catch (error) {
    res.json([]);
  }
});

// Get all links
router.get('/all-links', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM geo_linked_data WHERE (lulc_analysis_id IS NOT NULL OR thermal_plant_id IS NOT NULL) ORDER BY created_at DESC`
    );
    res.json(result.rows || []);
  } catch (error) {
    res.json([]);
  }
});

// Get LULC data
router.get('/lulc/:lulc_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM geo_linked_data WHERE lulc_analysis_id = $1`,
      [req.params.lulc_id]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    res.json({});
  }
});

// Get Thermal Plant data
router.get('/thermal/:thermal_plant_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM geo_linked_data WHERE thermal_plant_id = $1`,
      [req.params.thermal_plant_id]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    res.json({});
  }
});

// Auto-link nearby locations
async function autoLinkNearby(id, latitude, longitude, type) {
  try {
    const result = await pool.query(
      `SELECT * FROM geo_linked_data WHERE latitude IS NOT NULL AND longitude IS NOT NULL`
    );

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    const nearby = result.rows
      .map(row => ({
        ...row,
        distance_km: calculateDistance(lat, lon, parseFloat(row.latitude), parseFloat(row.longitude))
      }))
      .filter(row => row.distance_km < 50 && row.distance_km > 0);

    for (const item of nearby) {
      if (type === 'thermal' && item.lulc_analysis_id) {
        await pool.query(
          `UPDATE geo_linked_data SET thermal_plant_id = $1, distance_km = $2, link_status = 'linked'
           WHERE lulc_analysis_id = $3`,
          [id, item.distance_km, item.lulc_analysis_id]
        ).catch(() => {});
      } else if (type === 'lulc' && item.thermal_plant_id) {
        await pool.query(
          `UPDATE geo_linked_data SET lulc_analysis_id = $1, distance_km = $2, link_status = 'linked'
           WHERE thermal_plant_id = $3`,
          [id, item.distance_km, item.thermal_plant_id]
        ).catch(() => {});
      }
    }

    console.log(`[Geo-Link] Auto-linked ${type} to ${nearby.length} nearby locations`);
  } catch (err) {
    console.error('[Geo-Link] Auto-link error:', err.message);
  }
}

export default router;
