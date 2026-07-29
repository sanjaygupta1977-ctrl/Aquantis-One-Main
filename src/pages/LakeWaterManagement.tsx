import Layout from "../components/Layout";
import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const API_BASE = "/api";

interface LakeManagementResult {
  lakeProfile: {
    name: string;
    area: number;
    depth: number;
    volume: number;
    catchment_area: number;
  };
  waterQuality: {
    ph: number;
    dissolved_oxygen: number;
    turbidity: number;
    total_phosphorus: number;
    total_nitrogen: number;
    conductivity: number;
    trophic_state: string;
  };
  qualityIndex: {
    wqi_score: number;
    wqi_status: string;
    tsi_score: number;
    tsi_status: string;
  };
  pollutionSources: {
    source: string;
    contribution: number;
    priority: string;
  }[];
  management: {
    restoration_methods: string[];
    treatment_priority: string[];
    monitoring_frequency: string;
    estimated_recovery_years: number;
  };
  timeSeriesData: Array<{ month: string; wqi: number; do: number }>;
}

function calculateLakeManagement(lake_name: string, area: number, pollution_level: string): LakeManagementResult {
  // Determine water quality based on pollution level
  const qualityMap: Record<string, any> = {
    clean: {
      ph: 7.5,
      do: 8.5,
      turbidity: 0.5,
      tp: 0.01,
      tn: 0.3,
      conductivity: 200,
      trophic: "Oligotrophic",
      wqi: 85,
      tsi: 25,
    },
    moderate: {
      ph: 7.2,
      do: 6.0,
      turbidity: 2.5,
      tp: 0.05,
      tn: 0.8,
      conductivity: 400,
      trophic: "Mesotrophic",
      wqi: 65,
      tsi: 50,
    },
    polluted: {
      ph: 6.8,
      do: 3.0,
      turbidity: 5.0,
      tp: 0.15,
      tn: 2.0,
      conductivity: 800,
      trophic: "Eutrophic",
      wqi: 45,
      tsi: 70,
    },
    severe: {
      ph: 6.2,
      do: 1.0,
      turbidity: 10.0,
      tp: 0.3,
      tn: 4.0,
      conductivity: 1500,
      trophic: "Hypertrophic",
      wqi: 25,
      tsi: 85,
    },
  };

  const quality = qualityMap[pollution_level] || qualityMap.moderate;
  
  // Pollution sources
  const sources = [
    { source: "Agricultural runoff", contribution: 35, priority: "High" },
    { source: "Urban stormwater", contribution: 25, priority: "High" },
    { source: "Industrial discharge", contribution: 20, priority: "Critical" },
    { source: "Domestic wastewater", contribution: 15, priority: "High" },
    { source: "Point sources", contribution: 5, priority: "Medium" },
  ];

  // Management strategies
  const getManagementStrategies = (level: string) => {
    const strategies: Record<string, any> = {
      clean: {
        methods: ["Regular monitoring", "Catchment protection", "Riparian buffer maintenance"],
        priority: ["Preventive care", "Pollution prevention"],
        frequency: "Quarterly",
        recovery: 1,
      },
      moderate: {
        methods: ["Wetland restoration", "Sediment removal", "Nutrient management", "Aeration systems"],
        priority: ["Source control", "In-lake treatment"],
        frequency: "Monthly",
        recovery: 3,
      },
      polluted: {
        methods: ["Constructed wetlands", "Mechanical aeration", "Dredging", "Coagulation treatment", "Algae harvesting"],
        priority: ["Source reduction", "Advanced treatment", "Ecological restoration"],
        frequency: "Weekly",
        recovery: 7,
      },
      severe: {
        methods: ["Emergency dredging", "Biomanipulation", "Chemical treatment", "Pumped aeration", "Total intake replacement"],
        priority: ["Emergency intervention", "Complete restoration", "Source elimination"],
        frequency: "Daily monitoring",
        recovery: 15,
      },
    };
    return strategies[level] || strategies.moderate;
  };

  const management = getManagementStrategies(pollution_level);

  // Time series data (12 months)
  const timeSeriesData = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    wqi: quality.wqi + Math.random() * 10 - 5,
    do: quality.do + Math.random() * 2 - 1,
  }));

  return {
    lakeProfile: {
      name: lake_name,
      area,
      depth: 4.5,
      volume: area * 4.5,
      catchment_area: area * 5,
    },
    waterQuality: {
      ph: quality.ph,
      dissolved_oxygen: quality.do,
      turbidity: quality.turbidity,
      total_phosphorus: quality.tp,
      total_nitrogen: quality.tn,
      conductivity: quality.conductivity,
      trophic_state: quality.trophic,
    },
    qualityIndex: {
      wqi_score: quality.wqi,
      wqi_status: quality.wqi >= 80 ? "Excellent" : quality.wqi >= 60 ? "Good" : quality.wqi >= 40 ? "Fair" : "Poor",
      tsi_score: quality.tsi,
      tsi_status: quality.tsi <= 30 ? "Oligotrophic" : quality.tsi <= 50 ? "Mesotrophic" : quality.tsi <= 70 ? "Eutrophic" : "Hypertrophic",
    },
    pollutionSources: sources,
    management: {
      restoration_methods: management.methods,
      treatment_priority: management.priority,
      monitoring_frequency: management.frequency,
      estimated_recovery_years: management.recovery,
    },
    timeSeriesData,
  };
}

export default function LakeWaterManagement() {
  const [lake_name, setLakeName] = useState("Water Body");
  const [area, setArea] = useState(100);
  const [pollution_level, setPollutionLevel] = useState("moderate");

  const [results, setResults] = useState<LakeManagementResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/lake-management/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lake_name, area, pollution_level }),
      });

      if (!response.ok) throw new Error("API unavailable");
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.log("Using fallback");
      setResults(calculateLakeManagement(lake_name, area, pollution_level));
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#06b6d4";
    if (score >= 40) return "#ca8a04";
    return "#dc2626";
  };

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "quality", label: "💧 Quality" },
    { id: "sources", label: "⚠️ Sources" },
    { id: "management", label: "🔧 Management" },
    { id: "timeseries", label: "📈 Trends" },
  ];

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" }}>
          🏞️ Lake Water Management System
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 32px 0" }}>
          Water quality monitoring, pollution assessment & restoration strategies
        </p>

        {/* Input */}
        <div style={{ background: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>⚙️ Lake Parameters</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Lake Name</label>
              <input type="text" value={lake_name} onChange={e => setLakeName(e.target.value)} placeholder="e.g., Lake Baikal" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Area (km²)</label>
              <input type="number" value={area} onChange={e => setArea(parseFloat(e.target.value) || 0)} min="0.1" max="100000" step="10" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Pollution Level</label>
              <select value={pollution_level} onChange={e => setPollutionLevel(e.target.value)} style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a", background: "white", cursor: "pointer" }}>
                <option value="clean">Clean (Oligotrophic)</option>
                <option value="moderate">Moderate (Mesotrophic)</option>
                <option value="polluted">Polluted (Eutrophic)</option>
                <option value="severe">Severe (Hypertrophic)</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={handleCalculate} disabled={loading} style={{ padding: "10px 32px", borderRadius: "8px", border: "none", background: loading ? "#cbd5e1" : "#10b981", color: "white", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", width: "100%" }}>
                {loading ? "🔄 Analyzing..." : "🏞️ Analyze"}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {results && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "28px" }}>
              {[
                { label: "WQI Score", val: results.qualityIndex.wqi_score.toFixed(0), color: getHealthColor(results.qualityIndex.wqi_score) },
                { label: "Status", val: results.qualityIndex.wqi_status, color: getHealthColor(results.qualityIndex.wqi_score) },
                { label: "Trophic State", val: results.waterQuality.trophic_state, color: "#0284c7" },
                { label: "Recovery Time", val: results.management.estimated_recovery_years + " years", color: "#f97316" },
              ].map((item, i) => (
                <div key={i} style={{ background: "white", padding: "14px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: `4px solid ${item.color}` }}>
                  <p style={{ color: "#94a3b8", fontSize: "9px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 4px 0" }}>{item.label}</p>
                  <p style={{ color: item.color, fontSize: "16px", fontWeight: "800", margin: "0" }}>{item.val}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "8px 12px", borderRadius: "8px", border: "2px solid", background: activeTab === t.id ? "#10b981" : "white", color: activeTab === t.id ? "white" : "#10b981", borderColor: "#10b981", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === "overview" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Lake Profile</h3>
                  {[
                    { label: "Name", val: results.lakeProfile.name },
                    { label: "Area", val: results.lakeProfile.area.toFixed(1) + " km²" },
                    { label: "Volume", val: (results.lakeProfile.volume / 1000).toFixed(1) + " Mm³" },
                    { label: "Catchment", val: results.lakeProfile.catchment_area.toFixed(0) + " km²" },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: "8px 0", borderBottom: i < 3 ? "1px solid #f1f5f9" : "none" }}>
                      <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>{item.label}</p>
                      <p style={{ color: "#0f172a", fontSize: "12px", margin: "0" }}>{item.val}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Quality Indices</h3>
                  {[
                    { label: "WQI", val: results.qualityIndex.wqi_score.toFixed(0) + " (" + results.qualityIndex.wqi_status + ")" },
                    { label: "TSI", val: results.qualityIndex.tsi_score.toFixed(0) + " (" + results.qualityIndex.tsi_status + ")" },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: "12px", background: "#f0fdf4", borderRadius: "8px", marginBottom: "8px", borderLeft: "4px solid #10b981" }}>
                      <p style={{ color: "#065f46", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>{item.label}</p>
                      <p style={{ color: "#0f172a", fontSize: "12px", margin: "0" }}>{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quality */}
            {activeTab === "quality" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Water Quality Parameters</h3>
                {[
                  { label: "pH", val: results.waterQuality.ph.toFixed(1) },
                  { label: "Dissolved Oxygen", val: results.waterQuality.dissolved_oxygen.toFixed(1) + " mg/L" },
                  { label: "Turbidity", val: results.waterQuality.turbidity.toFixed(1) + " NTU" },
                  { label: "Total Phosphorus", val: results.waterQuality.total_phosphorus.toFixed(3) + " mg/L" },
                  { label: "Total Nitrogen", val: results.waterQuality.total_nitrogen.toFixed(1) + " mg/L" },
                  { label: "Conductivity", val: results.waterQuality.conductivity.toFixed(0) + " μS/cm" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: i < 5 ? "1px solid #f1f5f9" : "none" }}>
                    <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>{item.label}</p>
                    <p style={{ color: "#0f172a", fontSize: "12px", margin: "0" }}>{item.val}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Sources */}
            {activeTab === "sources" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Pollution Sources</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={results.pollutionSources}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="source" tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <RechartTooltip />
                    <Bar dataKey="contribution" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Management */}
            {activeTab === "management" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Management & Restoration</h3>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>Restoration Methods:</p>
                  {results.management.restoration_methods.map((method, i) => (
                    <p key={i} style={{ color: "#64748b", fontSize: "11px", margin: "0 0 4px 0" }}>• {method}</p>
                  ))}
                </div>
                <div style={{ padding: "12px", background: "#f0f9ff", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
                  <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 4px 0" }}>Monitoring Frequency</p>
                  <p style={{ color: "#0f172a", fontSize: "12px", margin: "0" }}>{results.management.monitoring_frequency}</p>
                </div>
              </div>
            )}

            {/* Timeseries */}
            {activeTab === "timeseries" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>12-Month Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartTooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="wqi" stroke="#10b981" name="WQI" />
                    <Line yAxisId="right" type="monotone" dataKey="do" stroke="#0284c7" name="DO (mg/L)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
