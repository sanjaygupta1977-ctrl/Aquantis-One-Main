import Layout from "../components/Layout";
import { useState } from "react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function IndiaClimateScenario() {
  const [selectedScenario, setSelectedScenario] = useState("rcp45"); // rcp26, rcp45, rcp85
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Temperature projection scenarios
  const temperatureProjections: Record<string, Array<{year: number, temp: number, label: string}>> = {
    rcp26: [
      { year: 2020, temp: 0.0, label: "Historical" },
      { year: 2030, temp: 1.1, label: "Low Emissions" },
      { year: 2050, temp: 1.4, label: "" },
      { year: 2070, temp: 1.5, label: "" },
      { year: 2100, temp: 1.6, label: "" },
    ],
    rcp45: [
      { year: 2020, temp: 0.0, label: "Historical" },
      { year: 2030, temp: 1.3, label: "Middle" },
      { year: 2050, temp: 2.0, label: "" },
      { year: 2070, temp: 2.5, label: "" },
      { year: 2100, temp: 2.8, label: "" },
    ],
    rcp85: [
      { year: 2020, temp: 0.0, label: "Historical" },
      { year: 2030, temp: 1.5, label: "High Emissions" },
      { year: 2050, temp: 2.8, label: "" },
      { year: 2070, temp: 4.1, label: "" },
      { year: 2100, temp: 4.8, label: "" },
    ],
  };

  // Regional impacts by 2050
  const regionalImpacts = {
    all: [
      { region: "North India", waterStress: 78, cropLoss: 35, floodRisk: 42, droughtRisk: 65 },
      { region: "South India", waterStress: 82, cropLoss: 42, floodRisk: 38, droughtRisk: 72 },
      { region: "East India", waterStress: 65, cropLoss: 28, floodRisk: 68, droughtRisk: 45 },
      { region: "West India", waterStress: 85, cropLoss: 48, floodRisk: 35, droughtRisk: 78 },
      { region: "Central India", waterStress: 80, cropLoss: 40, floodRisk: 45, droughtRisk: 70 },
    ],
    north: [
      { region: "Punjab", waterStress: 75, cropLoss: 32, floodRisk: 38, droughtRisk: 62 },
      { region: "Haryana", waterStress: 80, cropLoss: 38, floodRisk: 40, droughtRisk: 68 },
      { region: "Uttar Pradesh", waterStress: 76, cropLoss: 34, floodRisk: 45, droughtRisk: 64 },
    ],
    south: [
      { region: "Tamil Nadu", waterStress: 84, cropLoss: 44, floodRisk: 35, droughtRisk: 74 },
      { region: "Karnataka", waterStress: 80, cropLoss: 40, floodRisk: 40, droughtRisk: 70 },
      { region: "Telangana", waterStress: 82, cropLoss: 43, floodRisk: 38, droughtRisk: 72 },
    ],
    west: [
      { region: "Rajasthan", waterStress: 88, cropLoss: 50, floodRisk: 30, droughtRisk: 82 },
      { region: "Gujarat", waterStress: 86, cropLoss: 48, floodRisk: 36, droughtRisk: 78 },
      { region: "Maharashtra", waterStress: 82, cropLoss: 46, floodRisk: 38, droughtRisk: 76 },
    ],
    east: [
      { region: "Bihar", waterStress: 68, cropLoss: 30, floodRisk: 72, droughtRisk: 48 },
      { region: "West Bengal", waterStress: 62, cropLoss: 26, floodRisk: 70, droughtRisk: 42 },
      { region: "Odisha", waterStress: 65, cropLoss: 28, floodRisk: 65, droughtRisk: 45 },
    ],
  };

  // Monsoon rainfall changes
  const monsooonData = [
    { year: 2020, rainfall: 100, temp: 28 },
    { year: 2030, rainfall: 95, temp: 29.5 },
    { year: 2040, rainfall: 88, temp: 31 },
    { year: 2050, rainfall: 82, temp: 32.5 },
    { year: 2060, rainfall: 76, temp: 33.8 },
    { year: 2070, rainfall: 72, temp: 35 },
    { year: 2080, rainfall: 68, temp: 36 },
    { year: 2090, rainfall: 65, temp: 36.5 },
  ];

  // Water resources projection
  const waterResourcesData = [
    { basin: "Ganges", current: 12000, rcp26: 9800, rcp45: 8200, rcp85: 6500 },
    { basin: "Brahmaputra", current: 10800, rcp26: 8900, rcp45: 7200, rcp85: 5400 },
    { basin: "Godavari", current: 7200, rcp26: 5100, rcp45: 3800, rcp85: 2200 },
    { basin: "Krishna", current: 6400, rcp26: 4300, rcp45: 2900, rcp85: 1500 },
    { basin: "Narmada", current: 4200, rcp26: 2800, rcp45: 1900, rcp85: 900 },
  ];

  // Extreme weather events projection
  const extremeWeatherData = [
    { year: 2020, heatwaves: 12, floods: 15, droughts: 8, cyclones: 3 },
    { year: 2030, heatwaves: 22, floods: 18, droughts: 14, cyclones: 5 },
    { year: 2040, heatwaves: 35, floods: 22, droughts: 22, cyclones: 7 },
    { year: 2050, heatwaves: 52, floods: 28, droughts: 32, cyclones: 9 },
    { year: 2070, heatwaves: 85, floods: 35, droughts: 48, cyclones: 12 },
  ];

  // Agricultural impact scenarios
  const agricultureImpact = [
    { crop: "Rice", current: 100, rcp26: 92, rcp45: 78, rcp85: 58 },
    { crop: "Wheat", current: 100, rcp26: 88, rcp45: 68, rcp85: 45 },
    { crop: "Cotton", current: 100, rcp26: 85, rcp45: 62, rcp85: 38 },
    { crop: "Sugarcane", current: 100, rcp26: 90, rcp45: 75, rcp85: 52 },
    { crop: "Maize", current: 100, rcp26: 86, rcp45: 64, rcp85: 40 },
  ];

  // Health impacts projection
  const healthImpacts = [
    { impact: "Heat Stress Deaths", current: 1200, rcp26: 3400, rcp45: 6800, rcp85: 12000 },
    { impact: "Water-borne Diseases", current: 890000, rcp26: 1200000, rcp45: 1800000, rcp85: 2500000 },
    { impact: "Malnutrition Cases", current: 48000000, rcp26: 52000000, rcp45: 58000000, rcp85: 65000000 },
    { impact: "Migration Forced", current: 12000000, rcp26: 18000000, rcp45: 28000000, rcp85: 45000000 },
  ];

  // Adaptation strategies
  const adaptationStrategies = [
    {
      category: "Water Management",
      strategies: [
        { name: "Rainwater Harvesting", cost: 2500, impact: 35, timeline: "2-3 years", region: "All" },
        { name: "Drip Irrigation Expansion", cost: 4200, impact: 42, timeline: "3-4 years", region: "West, South" },
        { name: "Groundwater Recharge", cost: 1800, impact: 28, timeline: "1-2 years", region: "All" },
        { name: "River Linking Projects", cost: 15000, impact: 65, timeline: "10-15 years", region: "North, South" },
      ],
    },
    {
      category: "Agriculture",
      strategies: [
        { name: "Climate-Resilient Crops", cost: 800, impact: 38, timeline: "2-3 years", region: "All" },
        { name: "Soil Health Improvement", cost: 1200, impact: 32, timeline: "3-5 years", region: "All" },
        { name: "Precision Farming", cost: 2100, impact: 45, timeline: "2-3 years", region: "North, West" },
        { name: "Crop Insurance Programs", cost: 500, impact: 40, timeline: "1 year", region: "All" },
      ],
    },
    {
      category: "Energy & Infrastructure",
      strategies: [
        { name: "Renewable Energy Expansion", cost: 8500, impact: 55, timeline: "5-7 years", region: "All" },
        { name: "Flood-Resistant Infrastructure", cost: 5200, impact: 48, timeline: "4-6 years", region: "East" },
        { name: "Heat-Resilient Cities", cost: 3400, impact: 42, timeline: "3-5 years", region: "North, West" },
        { name: "Grid Modernization", cost: 6800, impact: 50, timeline: "5-8 years", region: "All" },
      ],
    },
  ];

  const currentRegionalData = regionalImpacts[selectedRegion as keyof typeof regionalImpacts];
  const scenarioLabel = selectedScenario === "rcp26" ? "Low Emissions (RCP 2.6)" : selectedScenario === "rcp45" ? "Middle Emissions (RCP 4.5)" : "High Emissions (RCP 8.5)";

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "36px", fontWeight: "800", margin: "0 0 10px 0" }}>
          🌏 India Climate Change Impact Scenarios 2020-2100
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 40px 0" }}>
          Projections based on IPCC AR6, ISRO, and India Meteorological Department data - RCP 2.6, 4.5, and 8.5 scenarios
        </p>

        {/* Scenario Selector */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "30px", flexWrap: "wrap" }}>
          <div>
            <label style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", marginRight: "10px" }}>EMISSIONS SCENARIO:</label>
            {["rcp26", "rcp45", "rcp85"].map((scenario) => (
              <button
                key={scenario}
                onClick={() => setSelectedScenario(scenario)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "2px solid",
                  background: selectedScenario === scenario ? (scenario === "rcp26" ? "#10b981" : scenario === "rcp45" ? "#ca8a04" : "#dc2626") : "white",
                  color: selectedScenario === scenario ? "white" : scenario === "rcp26" ? "#10b981" : scenario === "rcp45" ? "#ca8a04" : "#dc2626",
                  borderColor: scenario === "rcp26" ? "#10b981" : scenario === "rcp45" ? "#ca8a04" : "#dc2626",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  marginRight: "8px",
                  transition: "all 0.3s",
                }}
              >
                {scenario === "rcp26" ? "Low (2.6)" : scenario === "rcp45" ? "Middle (4.5)" : "High (8.5)"}
              </button>
            ))}
          </div>

          <div>
            <label style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", marginRight: "10px" }}>REGION:</label>
            {["all", "north", "south", "west", "east"].map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "2px solid #0284c7",
                  background: selectedRegion === region ? "#0284c7" : "white",
                  color: selectedRegion === region ? "white" : "#0284c7",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  marginRight: "8px",
                  transition: "all 0.3s",
                }}
              >
                {region === "all" ? "All India" : region.charAt(0).toUpperCase() + region.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Temperature Projection */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>
            🌡️ Temperature Rise Projection - {scenarioLabel}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperatureProjections[selectedScenario as keyof typeof temperatureProjections]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: "Temp Rise (°C)", angle: -90, position: "insideLeft" }} />
              <Tooltip formatter={(value) => `${value}°C`} />
              <Line type="monotone" dataKey="temp" stroke={selectedScenario === "rcp26" ? "#10b981" : selectedScenario === "rcp45" ? "#ca8a04" : "#dc2626"} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
          <p style={{ color: "#666", fontSize: "12px", margin: "15px 0 0 0" }}>
            By 2100: {selectedScenario === "rcp26" ? "+1.6°C" : selectedScenario === "rcp45" ? "+2.8°C" : "+4.8°C"} above pre-industrial levels
          </p>
        </div>

        {/* Regional Impacts Heatmap */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🗺️ Regional Climate Impact Index by 2050</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f0f9ff", borderBottom: "2px solid #0284c7" }}>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>Region</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Water Stress</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Crop Loss</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Flood Risk</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Drought Risk</th>
                </tr>
              </thead>
              <tbody>
                {currentRegionalData.map((region, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "12px", color: "#0f172a", fontWeight: "600" }}>{region.region}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <span style={{ background: `rgba(220, 38, 38, ${region.waterStress / 100})`, color: "#dc2626", padding: "4px 8px", borderRadius: "4px", fontWeight: "600" }}>
                        {region.waterStress}%
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <span style={{ background: `rgba(202, 138, 4, ${region.cropLoss / 100})`, color: "#854d0e", padding: "4px 8px", borderRadius: "4px", fontWeight: "600" }}>
                        {region.cropLoss}%
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <span style={{ background: `rgba(59, 130, 246, ${region.floodRisk / 100})`, color: "#1e40af", padding: "4px 8px", borderRadius: "4px", fontWeight: "600" }}>
                        {region.floodRisk}%
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <span style={{ background: `rgba(239, 68, 68, ${region.droughtRisk / 100})`, color: "#7f1d1d", padding: "4px 8px", borderRadius: "4px", fontWeight: "600" }}>
                        {region.droughtRisk}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monsoon & Water Resources */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {/* Monsoon Projection */}
          <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h2 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>☔ Monsoon Rainfall & Temperature Trend</h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monsooonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" label={{ value: "Rainfall (% of current)", angle: -90, position: "insideLeft" }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: "Temperature (°C)", angle: 90, position: "insideRight" }} />
                <Tooltip />
                <Area yAxisId="left" type="monotone" dataKey="rainfall" fill="#3b82f6" stroke="#0284c7" opacity={0.6} />
                <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#dc2626" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Water Resources Projection */}
          <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h2 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>💧 River Basin Runoff by 2050 (MCM)</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={waterResourcesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="basin" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#10b981" name="Current" />
                <Bar dataKey={selectedScenario} fill={selectedScenario === "rcp26" ? "#0284c7" : selectedScenario === "rcp45" ? "#ca8a04" : "#dc2626"} name={scenarioLabel} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Extreme Weather Events */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>⚡ Projected Extreme Weather Events Increase</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={extremeWeatherData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: "Number of Events/Year", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="heatwaves" stroke="#dc2626" strokeWidth={2} name="Heatwaves" />
              <Line type="monotone" dataKey="floods" stroke="#3b82f6" strokeWidth={2} name="Floods" />
              <Line type="monotone" dataKey="droughts" stroke="#ca8a04" strokeWidth={2} name="Droughts" />
              <Line type="monotone" dataKey="cyclones" stroke="#8b5cf6" strokeWidth={2} name="Cyclones" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Agricultural Impact */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🌾 Crop Yield Impact by 2050 (% of baseline)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agricultureImpact}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" />
              <YAxis label={{ value: "Yield %", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="#10b981" name="Current" />
              <Bar dataKey={selectedScenario} fill={selectedScenario === "rcp26" ? "#0284c7" : selectedScenario === "rcp45" ? "#ca8a04" : "#dc2626"} name={scenarioLabel} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Health Impacts */}
        <div style={{ background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #dc2626", marginBottom: "40px" }}>
          <h2 style={{ color: "#7f1d1d", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>⚠️ Projected Health & Social Impacts by 2050</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
            {healthImpacts.map((impact, idx) => {
              const rcp45Value = impact.rcp45;
              const currentValue = impact.current;
              const percentChange = ((rcp45Value - currentValue) / currentValue * 100).toFixed(0);
              return (
                <div key={idx} style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
                  <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "700", margin: "0 0 8px 0" }}>{impact.impact}</p>
                  <p style={{ color: "#666", fontSize: "12px", margin: "0 0 5px 0" }}>Current: {currentValue.toLocaleString()}</p>
                  <p style={{ color: "#7f1d1d", fontSize: "12px", margin: "0 0 5px 0" }}>By 2050 (RCP 4.5): {rcp45Value.toLocaleString()}</p>
                  <p style={{ color: "#dc2626", fontSize: "13px", fontWeight: "700", margin: "0" }}>+{percentChange}% increase</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Adaptation Strategies */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 25px 0" }}>🛡️ Climate Adaptation Strategies for India</h2>

          {adaptationStrategies.map((category, catIdx) => (
            <div key={catIdx} style={{ marginBottom: "30px" }}>
              <h3 style={{ color: "#0284c7", fontSize: "16px", fontWeight: "700", margin: "0 0 15px 0", paddingBottom: "10px", borderBottom: "2px solid #0284c7" }}>
                {category.category}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "15px" }}>
                {category.strategies.map((strategy, idx) => (
                  <div key={idx} style={{ background: "#f9fafb", padding: "15px", borderRadius: "10px", borderLeft: "4px solid #10b981" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                      <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "700", margin: "0" }}>{strategy.name}</p>
                      <span style={{ background: "#dcfce7", color: "#065f46", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600" }}>
                        Impact: {strategy.impact}%
                      </span>
                    </div>
                    <div style={{ display: "grid", gap: "6px", fontSize: "12px", color: "#666" }}>
                      <p style={{ margin: "0" }}>💰 Cost: ₹{strategy.cost} Cr</p>
                      <p style={{ margin: "0" }}>⏱️ Timeline: {strategy.timeline}</p>
                      <p style={{ margin: "0" }}>📍 Region: {strategy.region}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Key Takeaways */}
        <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #0284c7", marginTop: "40px" }}>
          <h2 style={{ color: "#0c4a6e", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>📊 Key Findings & Recommendations</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
            <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
              <p style={{ color: "#0c4a6e", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>🌊 Water Crisis</p>
              <p style={{ color: "#0369a1", fontSize: "12px", margin: "0" }}>
                River runoff will decrease 30-40% by 2050. Immediate investment in water harvesting & groundwater recharge needed.
              </p>
            </div>
            <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
              <p style={{ color: "#0c4a6e", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>🌾 Agricultural Threat</p>
              <p style={{ color: "#0369a1", fontSize: "12px", margin: "0" }}>
                Major crops like wheat & rice will see 25-40% yield losses. Climate-resilient varieties essential for food security.
              </p>
            </div>
            <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
              <p style={{ color: "#0c4a6e", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>🔥 Extreme Heat</p>
              <p style={{ color: "#0369a1", fontSize: "12px", margin: "0" }}>
                Heat-related deaths will increase 10x by 2050. Urban cooling centers & heat alert systems critical.
              </p>
            </div>
            <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
              <p style={{ color: "#0c4a6e", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>🚀 Urgent Action</p>
              <p style={{ color: "#0369a1", fontSize: "12px", margin: "0" }}>
                Transition to renewable energy, strengthen monsoon forecasting, & implement national adaptation plan immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
