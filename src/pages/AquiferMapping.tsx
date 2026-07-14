import Layout from "../components/Layout";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

interface AquiferData {
  name: string;
  depth: number;
  area: number;
  yield: number;
  quality: string;
  depth_range: string;
  rock_type: string;
  recharge_rate: number;
  extraction_rate: number;
  stress_level: number;
  states: string[];
}

export default function AquiferMappingIndia() {
  const [selectedState, setSelectedState] = useState("all");
  const [selectedAquifer, setSelectedAquifer] = useState<string | null>(null);

  // Major aquifer systems of India
  const aquiferSystems: Record<string, AquiferData[]> = {
    all: [
      {
        name: "Indo-Gangetic Alluvial",
        depth: 150,
        area: 890000,
        yield: 850,
        quality: "Good",
        depth_range: "0-150m",
        rock_type: "Alluvium (Sand, Silt, Clay)",
        recharge_rate: 42,
        extraction_rate: 65,
        stress_level: 78,
        states: ["UP", "Bihar", "West Bengal", "Punjab", "Haryana"],
      },
      {
        name: "Peninsular Hardrock",
        depth: 80,
        area: 2100000,
        yield: 120,
        quality: "Moderate",
        depth_range: "5-80m",
        rock_type: "Granite, Basalt, Schist",
        recharge_rate: 18,
        extraction_rate: 32,
        stress_level: 62,
        states: ["Rajasthan", "Maharashtra", "Karnataka", "Tamil Nadu"],
      },
      {
        name: "Gondwana Sandstone",
        depth: 200,
        area: 620000,
        yield: 280,
        quality: "Good",
        depth_range: "50-200m",
        rock_type: "Sandstone, Shale",
        recharge_rate: 25,
        extraction_rate: 38,
        stress_level: 55,
        states: ["Madhya Pradesh", "Odisha", "Jharkhand"],
      },
      {
        name: "Deccan Trap",
        depth: 120,
        area: 540000,
        yield: 180,
        quality: "Moderate",
        depth_range: "20-120m",
        rock_type: "Basalt (Lava Flows)",
        recharge_rate: 22,
        extraction_rate: 44,
        stress_level: 68,
        states: ["Maharashtra", "Karnataka", "Telangana"],
      },
      {
        name: "Coastal Aquifers",
        depth: 90,
        area: 180000,
        yield: 420,
        quality: "Moderate-Poor",
        depth_range: "0-90m",
        rock_type: "Sand, Gravel, Clay",
        recharge_rate: 35,
        extraction_rate: 52,
        stress_level: 72,
        states: ["Gujarat", "Tamil Nadu", "Goa", "Kerala"],
      },
      {
        name: "Pre-Cambrian Schist",
        depth: 70,
        area: 450000,
        yield: 95,
        quality: "Fair",
        depth_range: "5-70m",
        rock_type: "Schist, Phyllite, Slate",
        recharge_rate: 15,
        extraction_rate: 28,
        stress_level: 58,
        states: ["Chhattisgarh", "Himachal Pradesh"],
      },
    ],
    north: [
      {
        name: "Indo-Gangetic Alluvial",
        depth: 150,
        area: 890000,
        yield: 850,
        quality: "Good",
        depth_range: "0-150m",
        rock_type: "Alluvium (Sand, Silt, Clay)",
        recharge_rate: 42,
        extraction_rate: 65,
        stress_level: 78,
        states: ["UP", "Bihar", "West Bengal", "Punjab", "Haryana"],
      },
      {
        name: "Gondwana Sandstone",
        depth: 200,
        area: 150000,
        yield: 280,
        quality: "Good",
        depth_range: "50-200m",
        rock_type: "Sandstone, Shale",
        recharge_rate: 28,
        extraction_rate: 42,
        stress_level: 60,
        states: ["Madhya Pradesh"],
      },
    ],
    south: [
      {
        name: "Peninsular Hardrock",
        depth: 80,
        area: 2100000,
        yield: 120,
        quality: "Moderate",
        depth_range: "5-80m",
        rock_type: "Granite, Basalt, Schist",
        recharge_rate: 18,
        extraction_rate: 32,
        stress_level: 62,
        states: ["Rajasthan", "Maharashtra", "Karnataka", "Tamil Nadu"],
      },
      {
        name: "Deccan Trap",
        depth: 120,
        area: 540000,
        yield: 180,
        quality: "Moderate",
        depth_range: "20-120m",
        rock_type: "Basalt (Lava Flows)",
        recharge_rate: 22,
        extraction_rate: 44,
        stress_level: 68,
        states: ["Maharashtra", "Karnataka", "Telangana"],
      },
      {
        name: "Coastal Aquifers",
        depth: 90,
        area: 80000,
        yield: 420,
        quality: "Moderate-Poor",
        depth_range: "0-90m",
        rock_type: "Sand, Gravel, Clay",
        recharge_rate: 38,
        extraction_rate: 55,
        stress_level: 75,
        states: ["Tamil Nadu", "Goa", "Kerala"],
      },
    ],
    east: [
      {
        name: "Indo-Gangetic Alluvial",
        depth: 150,
        area: 300000,
        yield: 850,
        quality: "Good",
        depth_range: "0-150m",
        rock_type: "Alluvium (Sand, Silt, Clay)",
        recharge_rate: 45,
        extraction_rate: 62,
        stress_level: 75,
        states: ["Bihar", "West Bengal", "Odisha"],
      },
      {
        name: "Gondwana Sandstone",
        depth: 200,
        area: 280000,
        yield: 280,
        quality: "Good",
        depth_range: "50-200m",
        rock_type: "Sandstone, Shale",
        recharge_rate: 24,
        extraction_rate: 35,
        stress_level: 52,
        states: ["Odisha", "Jharkhand"],
      },
    ],
    west: [
      {
        name: "Peninsular Hardrock",
        depth: 80,
        area: 800000,
        yield: 120,
        quality: "Moderate",
        depth_range: "5-80m",
        rock_type: "Granite, Basalt, Schist",
        recharge_rate: 12,
        extraction_rate: 35,
        stress_level: 75,
        states: ["Rajasthan", "Gujarat"],
      },
      {
        name: "Coastal Aquifers",
        depth: 90,
        area: 100000,
        yield: 420,
        quality: "Moderate-Poor",
        depth_range: "0-90m",
        rock_type: "Sand, Gravel, Clay",
        recharge_rate: 32,
        extraction_rate: 50,
        stress_level: 70,
        states: ["Gujarat", "Goa"],
      },
    ],
  };

  // Groundwater depletion trends
  const depletionTrend = [
    { year: 1995, level: 100, recharge: 100 },
    { year: 2000, level: 98, recharge: 98 },
    { year: 2005, level: 92, recharge: 95 },
    { year: 2010, level: 82, recharge: 90 },
    { year: 2015, level: 68, recharge: 85 },
    { year: 2020, level: 52, recharge: 78 },
    { year: 2024, level: 42, recharge: 72 },
  ];

  // State-wise groundwater stress
  const stateStressData = [
    { state: "Punjab", stress: 92, category: "Critical" },
    { state: "Rajasthan", stress: 88, category: "Critical" },
    { state: "Haryana", stress: 85, category: "Over-exploited" },
    { state: "Gujarat", stress: 82, category: "Over-exploited" },
    { state: "Uttar Pradesh", stress: 78, category: "Over-exploited" },
    { state: "Karnataka", stress: 72, category: "Over-exploited" },
    { state: "Telangana", stress: 68, category: "Critical" },
    { state: "Maharashtra", stress: 65, category: "Over-exploited" },
    { state: "Odisha", stress: 45, category: "Semi-Critical" },
    { state: "West Bengal", stress: 42, category: "Safe" },
  ];

  // Aquifer vulnerability assessment
  const vulnerabilityData = [
    { aquifer: "Coastal", contamination: 78, salinity: 82, arsenic: 45 },
    { aquifer: "Alluvial", contamination: 65, salinity: 35, arsenic: 55 },
    { aquifer: "Hardrock", contamination: 42, salinity: 28, arsenic: 32 },
    { aquifer: "Sandstone", contamination: 48, salinity: 22, arsenic: 38 },
  ];

  // Artificial recharge potential
  const rechargeData = [
    { method: "Rainwater Harvesting", potential: 420, cost: 2500, roi: 3.5 },
    { method: "Check Dams", potential: 280, cost: 1800, roi: 4.2 },
    { method: "Percolation Tanks", potential: 350, cost: 2200, roi: 3.8 },
    { method: "Bore Wells", potential: 150, cost: 800, roi: 5.1 },
    { method: "Tube Well Recharge", potential: 200, cost: 1200, roi: 4.6 },
  ];

  // Fluoride & Arsenic contamination zones
  const contaminationZones = [
    { region: "Rajasthan", fluoride: 92, arsenic: 28, nitrate: 45 },
    { region: "Punjab", fluoride: 68, arsenic: 72, nitrate: 85 },
    { region: "West Bengal", fluoride: 35, arsenic: 88, nitrate: 32 },
    { region: "Odisha", fluoride: 45, arsenic: 82, nitrate: 28 },
    { region: "Uttar Pradesh", fluoride: 62, arsenic: 48, nitrate: 78 },
    { region: "Gujarat", fluoride: 78, arsenic: 35, nitrate: 52 },
  ];

  const filteredAquifers = aquiferSystems[selectedState as keyof typeof aquiferSystems] || aquiferSystems.all;
  const currentAquifer = selectedAquifer ? filteredAquifers.find((a) => a.name === selectedAquifer) : null;

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "36px", fontWeight: "800", margin: "0 0 10px 0" }}>
          💧 Aquifer Mapping & Hydrogeological Data - India
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 40px 0" }}>
          Comprehensive groundwater resources, depletion trends, and contamination mapping based on CGWB & USGS data
        </p>

        {/* Region Selector */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
          {["all", "north", "south", "east", "west"].map((region) => (
            <button
              key={region}
              onClick={() => {
                setSelectedState(region);
                setSelectedAquifer(null);
              }}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "2px solid #0284c7",
                background: selectedState === region ? "#0284c7" : "white",
                color: selectedState === region ? "white" : "#0284c7",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s",
                textTransform: "capitalize",
              }}
            >
              {region === "all" ? "All India" : region.charAt(0).toUpperCase() + region.slice(1)}
            </button>
          ))}
        </div>

        {/* Major Aquifer Systems */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🗺️ Major Aquifer Systems</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginBottom: "20px" }}>
            {filteredAquifers.map((aquifer, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedAquifer(aquifer.name)}
                style={{
                  cursor: "pointer",
                  padding: "15px",
                  borderRadius: "10px",
                  border: selectedAquifer === aquifer.name ? "3px solid #0284c7" : "1px solid #e5e7eb",
                  background: selectedAquifer === aquifer.name ? "#f0f9ff" : "white",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = selectedAquifer === aquifer.name ? "0 0 0 3px rgba(2,132,199,0.1)" : "none";
                }}
              >
                <p style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 10px 0" }}>{aquifer.name}</p>
                <div style={{ display: "grid", gap: "6px", fontSize: "12px", color: "#666" }}>
                  <p style={{ margin: "0" }}>🎯 Area: {(aquifer.area / 1000).toFixed(0)}k km²</p>
                  <p style={{ margin: "0" }}>💧 Yield: {aquifer.yield} m³/day</p>
                  <p style={{ margin: "0" }}>📊 Depth: {aquifer.depth}m</p>
                  <p style={{ margin: "0" }}>⚠️ Stress: {aquifer.stress_level}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Aquifer Details */}
        {currentAquifer && (
          <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #0284c7", marginBottom: "40px" }}>
            <h2 style={{ color: "#0c4a6e", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>📋 {currentAquifer.name} - Detailed Profile</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "20px" }}>
              <div style={{ background: "white", padding: "12px", borderRadius: "8px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0" }}>Rock Type</p>
                <p style={{ color: "#0284c7", fontSize: "13px", fontWeight: "700", margin: "0" }}>{currentAquifer.rock_type}</p>
              </div>
              <div style={{ background: "white", padding: "12px", borderRadius: "8px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0" }}>Depth Range</p>
                <p style={{ color: "#0284c7", fontSize: "13px", fontWeight: "700", margin: "0" }}>{currentAquifer.depth_range}</p>
              </div>
              <div style={{ background: "white", padding: "12px", borderRadius: "8px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0" }}>Water Quality</p>
                <p style={{ color: "#0284c7", fontSize: "13px", fontWeight: "700", margin: "0" }}>{currentAquifer.quality}</p>
              </div>
              <div style={{ background: "white", padding: "12px", borderRadius: "8px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0" }}>Coverage</p>
                <p style={{ color: "#0284c7", fontSize: "13px", fontWeight: "700", margin: "0" }}>{currentAquifer.states.join(", ")}</p>
              </div>
            </div>

            {/* Aquifer Stress Radar */}
            <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={[
                  { metric: "Recharge", value: currentAquifer.recharge_rate },
                  { metric: "Extraction", value: currentAquifer.extraction_rate },
                  { metric: "Stress Level", value: currentAquifer.stress_level },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Status (%)" dataKey="value" stroke="#0284c7" fill="#0284c7" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Groundwater Depletion Trend */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>📉 Groundwater Depletion Trend (1995-2024)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={depletionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: "Index (1995 = 100)", angle: -90, position: "insideLeft" }} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Line type="monotone" dataKey="level" stroke="#dc2626" strokeWidth={2} name="Water Level" />
              <Line type="monotone" dataKey="recharge" stroke="#10b981" strokeWidth={2} name="Recharge Rate" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* State-wise Groundwater Stress */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>⚠️ State-wise Groundwater Stress Assessment</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={stateStressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stress" radius={[8, 8, 0, 0]}>
                {stateStressData.map((entry, index) => {
                  let color = "#10b981"; // Safe
                  if (entry.stress > 80) color = "#dc2626"; // Critical
                  else if (entry.stress > 70) color = "#ca8a04"; // Over-exploited
                  else if (entry.stress > 60) color = "#f59e0b"; // Over-exploited
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Contamination Zones */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🧪 Contamination Zones - Fluoride, Arsenic & Nitrate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contaminationZones} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="region" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="fluoride" stackId="a" fill="#dc2626" name="Fluoride %" />
              <Bar dataKey="arsenic" stackId="a" fill="#3b82f6" name="Arsenic %" />
              <Bar dataKey="nitrate" stackId="a" fill="#ca8a04" name="Nitrate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Aquifer Vulnerability */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🛡️ Aquifer Vulnerability Assessment</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vulnerabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="aquifer" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="contamination" fill="#dc2626" name="Contamination Risk %" />
              <Bar dataKey="salinity" fill="#ca8a04" name="Salinity Risk %" />
              <Bar dataKey="arsenic" fill="#3b82f6" name="Arsenic Risk %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Artificial Recharge Potential */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>💧 Artificial Recharge Potential & Economics</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f0f9ff", borderBottom: "2px solid #0284c7" }}>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>Method</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Recharge Potential (MCM/year)</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Cost (₹ Cr)</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>ROI (years)</th>
                </tr>
              </thead>
              <tbody>
                {rechargeData.map((method, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "12px", color: "#0f172a", fontWeight: "600" }}>{method.method}</td>
                    <td style={{ padding: "12px", textAlign: "center", color: "#0284c7", fontWeight: "600" }}>{method.potential}</td>
                    <td style={{ padding: "12px", textAlign: "center", color: "#10b981", fontWeight: "600" }}>{method.cost}</td>
                    <td style={{ padding: "12px", textAlign: "center", color: "#ca8a04", fontWeight: "600" }}>{method.roi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insights */}
        <div style={{ background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #dc2626" }}>
          <h2 style={{ color: "#7f1d1d", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>🚨 Critical Findings & Recommendations</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "15px" }}>
            <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
              <p style={{ color: "#7f1d1d", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>⚠️ Depletion Crisis</p>
              <p style={{ color: "#991b1b", fontSize: "12px", margin: "0" }}>
                Groundwater levels have declined 58% since 1995. Punjab, Rajasthan critical. Immediate artificial recharge needed.
              </p>
            </div>
            <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
              <p style={{ color: "#7f1d1d", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>🧪 Contamination Hotspots</p>
              <p style={{ color: "#991b1b", fontSize: "12px", margin: "0" }}>
                Fluoride in Rajasthan (92%), Arsenic in Punjab & West Bengal (88%), Nitrate in Punjab (85%).
              </p>
            </div>
            <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
              <p style={{ color: "#7f1d1d", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>💰 Investment Priority</p>
              <p style={{ color: "#991b1b", fontSize: "12px", margin: "0" }}>
                Rainwater harvesting (₹2,500 Cr, 420 MCM) offers best potential. ROI 3.5 years. Target: 500 MCM by 2030.
              </p>
            </div>
            <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
              <p style={{ color: "#7f1d1d", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>🎯 Strategic Actions</p>
              <p style={{ color: "#991b1b", fontSize: "12px", margin: "0" }}>
                Enforce groundwater governance, shift to deficit irrigation, implement CGWB monitoring, invest in recharge structures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
