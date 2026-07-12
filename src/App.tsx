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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
