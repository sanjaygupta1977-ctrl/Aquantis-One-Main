import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import WaterIntelligence from "./pages/WaterIntelligence";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/water" element={<WaterIntelligence />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;