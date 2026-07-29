import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { lake_name, area, pollution_level } = req.body;

    const qualityMap = {
      clean: { ph: 7.5, do: 8.5, turbidity: 0.5, tp: 0.01, tn: 0.3, conductivity: 200, trophic: "Oligotrophic", wqi: 85, tsi: 25 },
      moderate: { ph: 7.2, do: 6.0, turbidity: 2.5, tp: 0.05, tn: 0.8, conductivity: 400, trophic: "Mesotrophic", wqi: 65, tsi: 50 },
      polluted: { ph: 6.8, do: 3.0, turbidity: 5.0, tp: 0.15, tn: 2.0, conductivity: 800, trophic: "Eutrophic", wqi: 45, tsi: 70 },
      severe: { ph: 6.2, do: 1.0, turbidity: 10.0, tp: 0.3, tn: 4.0, conductivity: 1500, trophic: "Hypertrophic", wqi: 25, tsi: 85 },
    };

    const quality = qualityMap[pollution_level] || qualityMap.moderate;

    const result = {
      lakeProfile: { name: lake_name, area, depth: 4.5, volume: area * 4.5, catchment_area: area * 5 },
      waterQuality: {
        ph: quality.ph, dissolved_oxygen: quality.do, turbidity: quality.turbidity,
        total_phosphorus: quality.tp, total_nitrogen: quality.tn, conductivity: quality.conductivity,
        trophic_state: quality.trophic,
      },
      qualityIndex: {
        wqi_score: quality.wqi,
        wqi_status: quality.wqi >= 80 ? "Excellent" : quality.wqi >= 60 ? "Good" : "Fair",
        tsi_score: quality.tsi,
        tsi_status: quality.tsi <= 30 ? "Oligotrophic" : quality.tsi <= 50 ? "Mesotrophic" : "Eutrophic",
      },
      pollutionSources: [
        { source: "Agricultural runoff", contribution: 35, priority: "High" },
        { source: "Urban stormwater", contribution: 25, priority: "High" },
        { source: "Industrial discharge", contribution: 20, priority: "Critical" },
      ],
      management: {
        restoration_methods: pollution_level === "severe" ? ["Dredging", "Aeration", "Treatment"] : ["Wetland restoration", "Monitoring"],
        treatment_priority: ["Source control", "In-lake treatment"],
        monitoring_frequency: pollution_level === "severe" ? "Daily" : "Monthly",
        estimated_recovery_years: pollution_level === "clean" ? 1 : pollution_level === "moderate" ? 3 : 7,
      },
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
