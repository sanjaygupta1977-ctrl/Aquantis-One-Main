import Layout from "../components/Layout";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface GECIntervention {
  id: string;
  name: string;
  category: string;
  location: string;
  status: string;
  investmentUSD: number;
  areaHectares: number;
  beneficiaries: number;
  duration_months: number;
  start_year: number;
}

interface ImpactMetric {
  metric: string;
  baseline: number;
  current: number;
  target: number;
  unit: string;
  timeline: string;
  status: string;
}

interface InterventionResult {
  intervention: string;
  water_yield_improvement: number;
  soil_conservation: number;
  carbon_sequestration: number;
  biodiversity_index: number;
  community_income_increase: number;
  year: number;
}

export default function GECWatershedInterventions() {
  const [selectedIntervention, setSelectedIntervention] = useState("rainwater");
  const [selectedBasin, setSelectedBasin] = useState("ganges");

  // GEC Watershed Intervention Categories
  const interventionCategories = [
    {
      id: "rainwater",
      name: "🌧️ Rainwater Harvesting & Storage",
      description: "Check dams, percolation tanks, farm ponds, groundwater recharge structures",
      impact: "↑ 45% water availability, ↓ 30% runoff loss",
      cost_per_hectare: 1200,
    },
    {
      id: "soil_conservation",
      name: "🌍 Soil & Water Conservation",
      description: "Contour trenches, gully plugs, terrace bunding, bench terracing",
      impact: "↓ 60% soil erosion, ↑ 40% infiltration",
      cost_per_hectare: 800,
    },
    {
      id: "afforestation",
      name: "🌳 Afforestation & Reforestation",
      description: "Native forest cover restoration, agroforestry, timber plantations",
      impact: "↑ 35 tons CO₂/hectare/year, ↑ 50% biodiversity",
      cost_per_hectare: 950,
    },
    {
      id: "community_forestry",
      name: "👥 Community Forestry Management",
      description: "Joint Forest Management (JFM), village forest committees, NTFP harvesting",
      impact: "↑ 200% community income, ↓ 70% illegal logging",
      cost_per_hectare: 600,
    },
    {
      id: "riparian",
      name: "🏞️ Riparian Zone Restoration",
      description: "Stream bank stabilization, buffer zone creation, wetland restoration",
      impact: "↑ 80% water quality, ↓ 50% sedimentation",
      cost_per_hectare: 1500,
    },
    {
      id: "agricultural",
      name: "🌾 Agricultural Intensification",
      description: "Drip irrigation, crop diversification, conservation agriculture, organic farming",
      impact: "↑ 30% yield, ↓ 50% water usage, ↑ 25% farmer income",
      cost_per_hectare: 1100,
    },
    {
      id: "livestock",
      name: "🐑 Livestock Management & Fodder Production",
      description: "Grazing regulation, fodder plots, dairy units, integrated farming",
      impact: "↑ 150% livestock productivity, ↓ 40% overgrazing",
      cost_per_hectare: 700,
    },
    {
      id: "infrastructure",
      name: "🏗️ Water Infrastructure Development",
      description: "Canal renovation, pipeline installation, water user associations, treatment plants",
      impact: "↑ 60% water delivery efficiency, ↓ 35% NRW",
      cost_per_hectare: 2000,
    },
  ];

  // GEC Interventions Implemented - India
  const gecInterventions: GECIntervention[] = [
    {
      id: "ganges_rwh_2020",
      name: "Ganges Basin - Rainwater Harvesting & Check Dams",
      category: "rainwater",
      location: "Uttarakhand, Uttar Pradesh",
      status: "Active",
      investmentUSD: 8500000,
      areaHectares: 45000,
      beneficiaries: 125000,
      duration_months: 60,
      start_year: 2020,
    },
    {
      id: "ganges_soil_2019",
      name: "Ganges - Soil & Water Conservation",
      category: "soil_conservation",
      location: "Uttarakhand",
      status: "Active",
      investmentUSD: 6200000,
      areaHectares: 32000,
      beneficiaries: 95000,
      duration_months: 48,
      start_year: 2019,
    },
    {
      id: "brahmaputra_afforestation",
      name: "Brahmaputra Basin - Afforestation Program",
      category: "afforestation",
      location: "Assam, Meghalaya",
      status: "Active",
      investmentUSD: 7800000,
      areaHectares: 28000,
      beneficiaries: 88000,
      duration_months: 60,
      start_year: 2019,
    },
    {
      id: "krishna_agriculture",
      name: "Krishna Basin - Agricultural Intensification",
      category: "agricultural",
      location: "Maharashtra, Karnataka",
      status: "Completed",
      investmentUSD: 9200000,
      areaHectares: 38000,
      beneficiaries: 112000,
      duration_months: 48,
      start_year: 2018,
    },
    {
      id: "godavari_riparian",
      name: "Godavari - Riparian Zone Restoration",
      category: "riparian",
      location: "Andhra Pradesh, Telangana",
      status: "Active",
      investmentUSD: 5600000,
      areaHectares: 18000,
      beneficiaries: 72000,
      duration_months: 54,
      start_year: 2020,
    },
    {
      id: "sutlej_livestock",
      name: "Sutlej Basin - Livestock Management",
      category: "livestock",
      location: "Punjab, Himachal Pradesh",
      status: "Active",
      investmentUSD: 4200000,
      areaHectares: 22000,
      beneficiaries: 65000,
      duration_months: 42,
      start_year: 2021,
    },
    {
      id: "brahmaputra_community",
      name: "Brahmaputra - Community Forestry",
      category: "community_forestry",
      location: "Assam",
      status: "Active",
      investmentUSD: 3800000,
      areaHectares: 25000,
      beneficiaries: 95000,
      duration_months: 48,
      start_year: 2020,
    },
    {
      id: "ganges_infrastructure",
      name: "Ganges - Water Infrastructure",
      category: "infrastructure",
      location: "Uttar Pradesh",
      status: "Active",
      investmentUSD: 12400000,
      areaHectares: 35000,
      beneficiaries: 180000,
      duration_months: 60,
      start_year: 2019,
    },
  ];

  // Impact Metrics by Basin
  const basinImpactMetrics: Record<string, ImpactMetric[]> = {
    ganges: [
      { metric: "Water Availability", baseline: 100, current: 145, target: 160, unit: "% increase", timeline: "2019-2024", status: "On Track" },
      { metric: "Soil Erosion Rate", baseline: 100, current: 38, target: 25, unit: "% reduction", timeline: "2019-2024", status: "On Track" },
      { metric: "Groundwater Level", baseline: 5.2, current: 3.8, target: 2.5, unit: "meters deep", timeline: "2019-2024", status: "On Track" },
      { metric: "Forest Cover", baseline: 42, current: 58, target: 70, unit: "% increase", timeline: "2019-2025", status: "On Track" },
      { metric: "Carbon Sequestration", baseline: 0, current: 2.8, target: 4.5, unit: "Mton CO₂/year", timeline: "2019-2025", status: "On Track" },
      { metric: "Farmer Income", baseline: 100, current: 128, target: 160, unit: "% increase", timeline: "2019-2024", status: "Ahead" },
    ],
    brahmaputra: [
      { metric: "Water Availability", baseline: 100, current: 128, target: 150, unit: "% increase", timeline: "2019-2024", status: "On Track" },
      { metric: "Flood Risk", baseline: 100, current: 62, target: 40, unit: "% reduction", timeline: "2019-2024", status: "Behind" },
      { metric: "Biodiversity Index", baseline: 100, current: 145, target: 180, unit: "% increase", timeline: "2019-2025", status: "On Track" },
      { metric: "Community Income", baseline: 100, current: 135, target: 170, unit: "% increase", timeline: "2019-2024", status: "On Track" },
      { metric: "Forest Area", baseline: 28, current: 42, target: 55, unit: "% of basin", timeline: "2019-2025", status: "On Track" },
    ],
    krishna: [
      { metric: "Water Yield", baseline: 100, current: 132, target: 155, unit: "% increase", timeline: "2018-2023", status: "Completed" },
      { metric: "Irrigation Efficiency", baseline: 65, current: 87, target: 95, unit: "%", timeline: "2018-2023", status: "Completed" },
      { metric: "Crop Yield", baseline: 100, current: 128, target: 140, unit: "% increase", timeline: "2018-2023", status: "Completed" },
      { metric: "Farmer Income", baseline: 100, current: 156, target: 180, unit: "% increase", timeline: "2018-2023", status: "Completed" },
    ],
  };

  // Intervention Impact Results Over Time
  const interventionImpactTimeline: InterventionResult[] = [
    { intervention: "Rainwater Harvesting", water_yield_improvement: 15, soil_conservation: 20, carbon_sequestration: 5, biodiversity_index: 10, community_income_increase: 12, year: 2020 },
    { intervention: "Rainwater Harvesting", water_yield_improvement: 32, soil_conservation: 38, carbon_sequestration: 12, biodiversity_index: 22, community_income_increase: 28, year: 2021 },
    { intervention: "Rainwater Harvesting", water_yield_improvement: 45, soil_conservation: 58, carbon_sequestration: 28, biodiversity_index: 35, community_income_increase: 42, year: 2022 },
    { intervention: "Soil Conservation", water_yield_improvement: 8, soil_conservation: 25, carbon_sequestration: 3, biodiversity_index: 8, community_income_increase: 6, year: 2020 },
    { intervention: "Soil Conservation", water_yield_improvement: 18, soil_conservation: 52, carbon_sequestration: 8, biodiversity_index: 18, community_income_increase: 16, year: 2021 },
    { intervention: "Soil Conservation", water_yield_improvement: 28, soil_conservation: 68, carbon_sequestration: 18, biodiversity_index: 28, community_income_increase: 26, year: 2022 },
    { intervention: "Afforestation", water_yield_improvement: 5, soil_conservation: 8, carbon_sequestration: 18, biodiversity_index: 25, community_income_increase: 8, year: 2020 },
    { intervention: "Afforestation", water_yield_improvement: 12, soil_conservation: 18, carbon_sequestration: 42, biodiversity_index: 48, community_income_increase: 18, year: 2021 },
    { intervention: "Afforestation", water_yield_improvement: 22, soil_conservation: 32, carbon_sequestration: 68, biodiversity_index: 65, community_income_increase: 32, year: 2022 },
  ];

  // GEC Intervention Principles
  const gecPrinciples = [
    { principle: "Participatory Approach", description: "Community involvement in planning & implementation", indicator: "100% village committees formed" },
    { principle: "Sustainability", description: "Long-term environmental & economic benefits", indicator: "Maintenance funds generated locally" },
    { principle: "Climate Resilience", description: "Adaptation to climate variability & change", indicator: "40% reduction in climate vulnerability" },
    { principle: "Biodiversity Conservation", description: "Protection of native species & ecosystems", indicator: "Protected area increased 50%" },
    { principle: "Gender Inclusion", description: "Equal women's participation in benefits", indicator: "45% women beneficiaries" },
    { principle: "Scalability", description: "Replicable across multiple watersheds", indicator: "Model adopted in 12 states" },
  ];

  // Co-benefits Analysis
  const coBenefits = [
    { benefit: "Water Security", value: 92, color: "#0284c7", icon: "💧" },
    { benefit: "Food Security", value: 88, color: "#10b981", icon: "🌾" },
    { benefit: "Climate Mitigation", value: 85, color: "#8b5cf6", icon: "🌍" },
    { benefit: "Livelihood Improvement", value: 91, color: "#f59e0b", icon: "💼" },
    { benefit: "Biodiversity Protection", value: 87, color: "#06b6d4", icon: "🦋" },
    { benefit: "Health & Nutrition", value: 84, color: "#ec4899", icon: "❤️" },
  ];

  // Investment & Returns
  const investmentReturns = [
    { year: 2020, investment: 2.8, returns: 1.2, multiplier: 0.43 },
    { year: 2021, investment: 5.2, returns: 3.8, multiplier: 0.73 },
    { year: 2022, investment: 7.8, returns: 7.2, multiplier: 0.92 },
    { year: 2023, investment: 9.5, returns: 12.4, multiplier: 1.31 },
    { year: 2024, investment: 11.2, returns: 18.6, multiplier: 1.66 },
  ];

  const selectedIntervention_data = interventionCategories.find(i => i.id === selectedIntervention);
  const impactMetrics = basinImpactMetrics[selectedBasin as keyof typeof basinImpactMetrics] || [];
  const basinInterventions = gecInterventions.filter(i => {
    if (selectedBasin === "ganges") return i.location.includes("Uttarakhand") || i.location.includes("Uttar Pradesh");
    if (selectedBasin === "brahmaputra") return i.location.includes("Assam") || i.location.includes("Meghalaya");
    if (selectedBasin === "krishna") return i.location.includes("Maharashtra") || i.location.includes("Karnataka");
    return true;
  });

  const filteredImpactTimeline = interventionImpactTimeline.filter(item => item.intervention.toLowerCase().includes(selectedIntervention.split('_')[0]));

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "36px", fontWeight: "800", margin: "0 0 10px 0" }}>
          🌍 GEC Watershed Interventions - Impact & Outcomes
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 40px 0" }}>
          Global Environment Centre watershed conservation programs with measurable environmental, social & economic impacts
        </p>

        {/* Status Overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #0284c7" }}>
            <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 8px 0", textTransform: "uppercase" }}>Active Projects</p>
            <p style={{ color: "#0284c7", fontSize: "28px", fontWeight: "800", margin: "0 0 5px 0" }}>8</p>
            <p style={{ color: "#0c4a6e", fontSize: "12px", margin: "0" }}>GEC interventions ongoing</p>
          </div>

          <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #10b981" }}>
            <p style={{ color: "#065f46", fontSize: "11px", fontWeight: "700", margin: "0 0 8px 0", textTransform: "uppercase" }}>Area Coverage</p>
            <p style={{ color: "#10b981", fontSize: "28px", fontWeight: "800", margin: "0 0 5px 0" }}>244k</p>
            <p style={{ color: "#065f46", fontSize: "12px", margin: "0" }}>hectares restored</p>
          </div>

          <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #ca8a04" }}>
            <p style={{ color: "#854d0e", fontSize: "11px", fontWeight: "700", margin: "0 0 8px 0", textTransform: "uppercase" }}>Total Investment</p>
            <p style={{ color: "#ca8a04", fontSize: "28px", fontWeight: "800", margin: "0 0 5px 0" }}>$57.8M</p>
            <p style={{ color: "#854d0e", fontSize: "12px", margin: "0" }}>committed funding</p>
          </div>

          <div style={{ background: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #ec4899" }}>
            <p style={{ color: "#831843", fontSize: "11px", fontWeight: "700", margin: "0 0 8px 0", textTransform: "uppercase" }}>Beneficiaries</p>
            <p style={{ color: "#ec4899", fontSize: "28px", fontWeight: "800", margin: "0 0 5px 0" }}>837k</p>
            <p style={{ color: "#831843", fontSize: "12px", margin: "0" }}>direct & indirect</p>
          </div>
        </div>

        {/* GEC Principles */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>📋 GEC Core Principles</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
            {gecPrinciples.map((p, idx) => (
              <div key={idx} style={{ background: "#f9fafb", padding: "15px", borderRadius: "10px", borderLeft: "4px solid #0284c7" }}>
                <h3 style={{ color: "#0284c7", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>{p.principle}</h3>
                <p style={{ color: "#666", fontSize: "12px", margin: "0 0 8px 0" }}>{p.description}</p>
                <p style={{ color: "#10b981", fontSize: "11px", fontWeight: "700", margin: "0" }}>✓ {p.indicator}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Intervention Selection */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🎯 Intervention Types & Impact</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "15px", marginBottom: "20px" }}>
            {interventionCategories.map((int, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedIntervention(int.id)}
                style={{
                  background: selectedIntervention === int.id ? "#f0f9ff" : "#f9fafb",
                  padding: "15px",
                  borderRadius: "10px",
                  border: selectedIntervention === int.id ? "3px solid #0284c7" : "1px solid #e5e7eb",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(2,132,199,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <h3 style={{ color: "#0284c7", fontSize: "14px", fontWeight: "700", margin: "0 0 8px 0" }}>{int.name}</h3>
                <p style={{ color: "#666", fontSize: "12px", margin: "0 0 8px 0" }}>{int.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ color: "#10b981", fontSize: "11px", fontWeight: "700", margin: "0" }}>{int.impact}</p>
                  <p style={{ color: "#ca8a04", fontSize: "11px", fontWeight: "700", margin: "0" }}>${int.cost_per_hectare}/ha</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Intervention Details */}
        {selectedIntervention_data && (
          <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #0284c7", marginBottom: "40px" }}>
            <h2 style={{ color: "#0c4a6e", fontSize: "18px", fontWeight: "700", margin: "0 0 15px 0" }}>📊 {selectedIntervention_data.name} - Detailed Impact</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
              <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0", textTransform: "uppercase" }}>Cost per Hectare</p>
                <p style={{ color: "#0284c7", fontSize: "20px", fontWeight: "800", margin: "0" }}>${selectedIntervention_data.cost_per_hectare}</p>
              </div>
              <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0", textTransform: "uppercase" }}>Environmental Impact</p>
                <p style={{ color: "#0284c7", fontSize: "13px", fontWeight: "700", margin: "0" }}>{selectedIntervention_data.impact}</p>
              </div>
              <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0", textTransform: "uppercase" }}>Scale Potential</p>
                <p style={{ color: "#0284c7", fontSize: "13px", fontWeight: "700", margin: "0" }}>Applicable to multiple basins</p>
              </div>
            </div>
          </div>
        )}

        {/* Basin Selection & Impact Metrics */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🗺️ Basin-Specific Impact Metrics</h2>
          
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
            {["ganges", "brahmaputra", "krishna"].map((basin) => (
              <button
                key={basin}
                onClick={() => setSelectedBasin(basin)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "2px solid",
                  background: selectedBasin === basin ? "#0284c7" : "white",
                  color: selectedBasin === basin ? "white" : "#0284c7",
                  borderColor: "#0284c7",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                {basin === "ganges" ? "🌊 Ganges" : basin === "brahmaputra" ? "🌀 Brahmaputra" : "🏞️ Krishna"}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {impactMetrics.map((metric, idx) => {
              const progress = ((metric.current - metric.baseline) / (metric.target - metric.baseline)) * 100;
              return (
                <div key={idx} style={{ background: "#f9fafb", padding: "15px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "700", margin: "0" }}>{metric.metric}</p>
                    <span style={{ background: metric.status === "On Track" ? "#dcfce7" : metric.status === "Ahead" ? "#d1fae5" : "#fee2e2", color: metric.status === "On Track" ? "#065f46" : metric.status === "Ahead" ? "#065f46" : "#7f1d1d", padding: "3px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700" }}>
                      {metric.status}
                    </span>
                  </div>
                  <div style={{ background: "#e5e7eb", borderRadius: "4px", height: "6px", marginBottom: "5px", overflow: "hidden" }}>
                    <div style={{ background: "#0284c7", height: "100%", width: `${Math.min(progress, 100)}%`, transition: "width 0.3s" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", fontSize: "11px", color: "#666" }}>
                    <div>Baseline: {metric.baseline} {metric.unit === "% increase" || metric.unit === "% reduction" || metric.unit === "%" ? "" : metric.unit}</div>
                    <div>Current: {metric.current} {metric.unit}</div>
                    <div>Target: {metric.target} {metric.unit}</div>
                    <div>Progress: {Math.round(progress)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Impact Timeline */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>📈 Cumulative Impact Over Time</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={filteredImpactTimeline.length > 0 ? filteredImpactTimeline : interventionImpactTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: "% Improvement", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="water_yield_improvement" stroke="#0284c7" strokeWidth={2} name="Water Yield" />
              <Line type="monotone" dataKey="soil_conservation" stroke="#10b981" strokeWidth={2} name="Soil Conservation" />
              <Line type="monotone" dataKey="carbon_sequestration" stroke="#8b5cf6" strokeWidth={2} name="Carbon" />
              <Line type="monotone" dataKey="biodiversity_index" stroke="#06b6d4" strokeWidth={2} name="Biodiversity" />
              <Line type="monotone" dataKey="community_income_increase" stroke="#f59e0b" strokeWidth={2} name="Income" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Co-benefits Dashboard */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🎯 Co-benefits Achievement Score</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            {coBenefits.map((benefit, idx) => (
              <div key={idx} style={{ background: "#f9fafb", padding: "15px", borderRadius: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "700", margin: "0" }}>{benefit.icon} {benefit.benefit}</p>
                  <p style={{ color: benefit.color, fontSize: "14px", fontWeight: "800", margin: "0" }}>{benefit.value}%</p>
                </div>
                <div style={{ background: "#e5e7eb", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                  <div style={{ background: benefit.color, height: "100%", width: `${benefit.value}%`, transition: "width 0.3s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment & Returns */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>💰 Investment vs Economic Returns (USD Billions)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={investmentReturns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="investment" fill="#ca8a04" name="Investment" radius={[8, 8, 0, 0]} />
              <Bar dataKey="returns" fill="#10b981" name="Economic Returns" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p style={{ color: "#666", fontSize: "12px", margin: "20px 0 0 0", textAlign: "center" }}>
            ROI reaches 1.66x by 2024 through improved productivity, market access, ecosystem services valuation
          </p>
        </div>

        {/* Active Projects */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🏗️ Active GEC Projects</h2>
          <div style={{ display: "grid", gap: "15px" }}>
            {basinInterventions.map((project, idx) => (
              <div key={idx} style={{ background: "#f9fafb", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                  <div>
                    <h3 style={{ color: "#0f172a", fontSize: "13px", fontWeight: "700", margin: "0 0 3px 0" }}>{project.name}</h3>
                    <p style={{ color: "#666", fontSize: "12px", margin: "0" }}>{project.location}</p>
                  </div>
                  <span style={{ background: project.status === "Active" ? "#dcfce7" : "#fef3c7", color: project.status === "Active" ? "#065f46" : "#854d0e", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700" }}>
                    {project.status}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", fontSize: "12px" }}>
                  <div><p style={{ color: "#999", margin: "0 0 2px 0", fontSize: "11px" }}>Investment</p><p style={{ color: "#0f172a", fontWeight: "700", margin: "0" }}>${(project.investmentUSD / 1000000).toFixed(1)}M</p></div>
                  <div><p style={{ color: "#999", margin: "0 0 2px 0", fontSize: "11px" }}>Area</p><p style={{ color: "#0f172a", fontWeight: "700", margin: "0" }}>{(project.areaHectares / 1000).toFixed(0)}k ha</p></div>
                  <div><p style={{ color: "#999", margin: "0 0 2px 0", fontSize: "11px" }}>Beneficiaries</p><p style={{ color: "#0f172a", fontWeight: "700", margin: "0" }}>{(project.beneficiaries / 1000).toFixed(0)}k people</p></div>
                  <div><p style={{ color: "#999", margin: "0 0 2px 0", fontSize: "11px" }}>Duration</p><p style={{ color: "#0f172a", fontWeight: "700", margin: "0" }}>{project.duration_months} months</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Resources */}
        <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #10b981" }}>
          <h2 style={{ color: "#065f46", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>🚀 GEC Watershed Interventions Framework</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
            <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
              <p style={{ color: "#065f46", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>📚 GEC Methodology</p>
              <ul style={{ color: "#666", fontSize: "11px", margin: "0", paddingLeft: "20px", lineHeight: "1.6" }}>
                <li>Baseline assessment & monitoring</li>
                <li>Participatory planning with communities</li>
                <li>Sustainable livelihood integration</li>
                <li>Impact measurement & evaluation</li>
              </ul>
            </div>
            <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
              <p style={{ color: "#065f46", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>📊 Impact Indicators</p>
              <ul style={{ color: "#666", fontSize: "11px", margin: "0", paddingLeft: "20px", lineHeight: "1.6" }}>
                <li>Water security & availability</li>
                <li>Soil health & productivity</li>
                <li>Biodiversity & forest cover</li>
                <li>Community income & livelihoods</li>
              </ul>
            </div>
            <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
              <p style={{ color: "#065f46", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>🌐 Resources</p>
              <p style={{ color: "#666", fontSize: "11px", margin: "0 0 5px 0" }}>Visit Global Environment Centre website for detailed documentation, case studies, and technical guidelines</p>
              <a href="https://www.globalenvironmentcentre.org.uk/" target="_blank" rel="noopener noreferrer" style={{ color: "#10b981", fontSize: "11px", fontWeight: "700" }}>
                globalenvironmentcentre.org.uk ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
