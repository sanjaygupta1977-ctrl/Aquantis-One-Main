import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import WaterIntelligence from "./pages/WaterIntelligence";
import WaterQuality from "./pages/WaterQuality";
import CoolingTower from "./pages/CoolingTower";
import Neutrality from "./pages/Neutrality";
import KPICard from "./pages/KPICard";
import AIAdvisor from "./pages/AIAdvisor";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import WaterFootprintCalculator from "./pages/WaterFootprintCalculator";
import CarbonFootprintCalculator from "./pages/CarbonFootprintCalculator";
import DrinkingWaterQualityCalculator from "./pages/DrinkingWaterQualityCalculator";
import HealthBarometer from "./pages/HealthBarometer";
import CoolingTowerWaterMgmt from "./pages/CoolingTowerWaterMgmt";
import IntegratedResourceManagement from "./pages/IntegratedResourceManagement";
import IndiaClimateScenario from "./pages/IndiaClimateScenario";
import AquiferMapping from "./pages/AquiferMapping";
import SWATToolIntegration from "./pages/SWATToolIntegration";
import WatershedDelineation from "./pages/WatershedDelineation";
import RCPDatabaseIntegration from "./pages/RCPDatabaseIntegration";
import GECWatershedInterventions from "./pages/GECWatershedInterventions";
import GEC2015GroundWater from "./pages/GEC2015GroundWater";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/water" element={<WaterIntelligence />} />
        <Route path="/quality" element={<WaterQuality />} />
        <Route path="/cooling" element={<CoolingTower />} />
        <Route path="/neutrality" element={<Neutrality />} />
        <Route path="/kpi" element={<KPICard />} />
        <Route path="/ai" element={<AIAdvisor />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      <Route path="/footprint" element={<WaterFootprintCalculator />} />
      <Route path="/carbon" element={<CarbonFootprintCalculator />} />
      <Route path="/drinking-water" element={<DrinkingWaterQualityCalculator />} />
      <Route path="/health-barometer" element={<HealthBarometer />} />
      <Route path="/cooling-tower" element={<CoolingTowerWaterMgmt />} />
      <Route path="/integrated" element={<IntegratedResourceManagement />} />
      <Route path="/india-climate" element={<IndiaClimateScenario />} />
      <Route path="/aquifer-mapping" element={<AquiferMapping />} />
      <Route path="/swat-tool" element={<SWATToolIntegration />} />
      <Route path="/watershed-delineation" element={<WatershedDelineation />} />
      <Route path="/rcp-database" element={<RCPDatabaseIntegration />} />
      <Route path="/gec-interventions" element={<GECWatershedInterventions />} />
      <Route path="/gec-2015-groundwater" element={<GEC2015GroundWater />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
