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
import ESGReporting from "./pages/ESGReporting";
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
import ZLDCalculator from "./pages/ZLDCalculator";
import CropWaterRequirement from "./pages/CropWaterRequirement";
import LULCAnalysis from "./pages/LULCAnalysis";
import ISO14046Calculator from "./pages/ISO14046Calculator";
import RODesignCalculator from "./pages/RODesignCalculator";
import GEC2015LakeRecharge from "./pages/GEC2015LakeRecharge";
import CarbonMethodologiesCalculator from "./pages/CarbonMethodologiesCalculator";
import EcoliWaterQuality from "./pages/EcoliWaterQuality";
import LakeWaterManagement from "./pages/LakeWaterManagement";
import PlantDataUpload from "./pages/PlantDataUpload";
import FileUploadManager from "./pages/FileUploadManager";
import WaterNeutralityIndustry from "./pages/WaterNeutralityIndustry";
import ThermalPowerPlantWaterQuality from "./pages/ThermalPowerPlantWaterQuality";
import STPCivilBOQ from "./pages/STPCivilBOQ";
import STPMechanicalBOQ from "./pages/STPMechanicalBOQ";

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
        <Route path="/esg-reporting" element={<ESGReporting />} />
        <Route path="/footprint" element={<WaterFootprintCalculator />} />
        <Route path="/carbon" element={<CarbonFootprintCalculator />} />
        <Route path="/carbon-methodologies" element={<CarbonMethodologiesCalculator />} />
        <Route path="/ecoli" element={<EcoliWaterQuality />} />
        <Route path="/lake-management" element={<LakeWaterManagement />} />
        <Route path="/plant-data" element={<PlantDataUpload />} />
        <Route path="/file-upload" element={<FileUploadManager />} />
        <Route path="/water-neutrality" element={<WaterNeutralityIndustry />} />
        <Route path="/thermal-power-plant" element={<ThermalPowerPlantWaterQuality />} />
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
        <Route path="/gec-2015-lake-recharge" element={<GEC2015LakeRecharge />} />
        <Route path="/zld-calculator" element={<ZLDCalculator />} />
        <Route path="/crop-water-requirement" element={<CropWaterRequirement />} />
        <Route path="/lulc-analysis" element={<LULCAnalysis />} />
        <Route path="/iso14046" element={<ISO14046Calculator />} />
        <Route path="/ro-design" element={<RODesignCalculator />} />
        <Route path="/stp-civil-boq" element={<STPCivilBOQ />} />
        <Route path="/stp-mechanical-boq" element={<STPMechanicalBOQ />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
