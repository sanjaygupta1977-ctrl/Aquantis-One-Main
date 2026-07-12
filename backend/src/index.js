import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db.js';
import waterBalanceRoutes from './routes/waterBalance.js';
import waterQualityRoutes from './routes/waterQuality.js';
import coolingTowerRoutes from './routes/coolingTower.js';
import neutralityRoutes from './routes/neutrality.js';
import kpisRoutes from './routes/kpis.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await initializeDatabase();

// Routes
app.use('/api/water-balance', waterBalanceRoutes);
app.use('/api/water-quality', waterQualityRoutes);
app.use('/api/cooling-tower', coolingTowerRoutes);
app.use('/api/neutrality', neutralityRoutes);
app.use('/api/kpis', kpisRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend API running', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Aquantis Backend running on http://localhost:${PORT}`);
});
