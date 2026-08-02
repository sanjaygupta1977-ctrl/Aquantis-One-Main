import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db.js';
import waterBalanceRoutes from './routes/waterBalance.js';
import waterQualityRoutes from './routes/waterQuality.js';
import coolingTowerRoutes from './routes/coolingTower.js';
import neutralityRoutes from './routes/neutrality.js';
import kpisRoutes from './routes/kpis.js';
import zldCalculatorRoutes from './routes/zldCalculator.js';
import iso14046CalculatorRoutes from './routes/iso14046Calculator.js';
import roDesignRoutes from './routes/roDesignCalculator.js';
import gec2015Routes from './routes/gec2015Calculator.js';
import carbonMethodologiesRoutes from './routes/carbonMethodologies.js';
import ecoli from './routes/ecoli.js';
import lakeManagement from './routes/lakeManagement.js';

import plantDataRoutes, { initPlantDataTable } from './routes/plantData.js';
import fileUploadRoutes, { initFilesTable } from './routes/fileUpload.js';

import waterNeutralityRoutes, { initWaterNeutralityTable } from './routes/waterNeutrality.js';
import moduleLinkingRouter, { initModuleLinkingTable } from './routes/moduleLinking.js';
import geoLinkingRouter, { initGeoLinkingTable } from './routes/geoLinking.js';
import thermalPowerPlantRouter, { initThermalPowerPlantTable } from './routes/thermalPowerPlant.js';

import stpCivilBOQRouter, { initSTPCivilBOQTable } from './routes/stpCivilBOQ.js';
import stpMechanicalBOQRouter, { initSTPMechanicalBOQTable } from './routes/stpMechanicalBOQ.js';
import stpElectricalBOQRouter, { initSTPElectricalBOQTable } from './routes/stpElectricalBOQ.js';
import stpInstrumentationBOQRouter, { initSTPInstrumentationBOQTable } from './routes/stpInstrumentationBOQ.js';
import stpChemicalBOQRouter, { initSTPChemicalBOQTable } from './routes/stpChemicalBOQ.js';
import stpMasterLinkingRouter, { initSTPMasterLinkingTable } from './routes/stpMasterLinking.js';
import cbamCalculatorRouter, { initCBAMAnalysisTable } from './routes/cbamCalculator.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await initializeDatabase();
await initPlantDataTable();
await initFilesTable();
await initWaterNeutralityTable();
await initModuleLinkingTable();
await initGeoLinkingTable();
await initThermalPowerPlantTable();
await initSTPCivilBOQTable();
await initSTPMechanicalBOQTable();
await initSTPElectricalBOQTable();
await initSTPInstrumentationBOQTable();
await initSTPChemicalBOQTable();
await initSTPMasterLinkingTable();
await initCBAMAnalysisTable();

// Routes
app.use('/api/water-balance', waterBalanceRoutes);
app.use('/api/water-quality', waterQualityRoutes);
app.use('/api/cooling-tower', coolingTowerRoutes);
app.use('/api/neutrality', neutralityRoutes);
app.use('/api/kpis', kpisRoutes);
app.use('/api/zld-calculator', zldCalculatorRoutes);
app.use('/api/iso14046', iso14046CalculatorRoutes);
app.use('/api/ro-design', roDesignRoutes);
app.use('/api/gec2015', gec2015Routes);
app.use('/api/carbon-methodologies', carbonMethodologiesRoutes);
app.use('/api/ecoli', ecoli);
app.use('/api/lake-management', lakeManagement);
app.use('/api/plant-data', plantDataRoutes);
app.use('/api/files', fileUploadRoutes);
app.use('/api/water-neutrality', waterNeutralityRoutes);
app.use('/api/module-linking', moduleLinkingRouter);
app.use('/api/geo-linking', geoLinkingRouter);
app.use('/api/thermal-power-plant', thermalPowerPlantRouter);

app.use('/api/stp-civil-boq', stpCivilBOQRouter);
app.use('/api/stp-mechanical-boq', stpMechanicalBOQRouter);
app.use('/api/stp-electrical-boq', stpElectricalBOQRouter);
app.use('/api/stp-instrumentation-boq', stpInstrumentationBOQRouter);
app.use('/api/stp-chemical-boq', stpChemicalBOQRouter);
app.use('/api/stp-master-linking', stpMasterLinkingRouter);
app.use('/api/cbam', cbamCalculatorRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend API running', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Aquantis Backend running on http://localhost:${PORT}`);
});
