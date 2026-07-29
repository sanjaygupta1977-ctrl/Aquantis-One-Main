import Layout from "../components/Layout";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, ResponsiveContainer, Legend } from "recharts";

const API_BASE = "/api";

interface WaterNeutralityResult {
  industry: string;
  baseline_water_consumption: number;
  water_recycled: number;
  water_recharged: number;
  water_neutrality_index: number;
  status: string;
  niti_benchmark: number;
  compliance_level: string;
  reduction_potential: number;
  recommendations: string[];
  positivity_gap: number;
  scorecard: Record<string, any>;
  timeline: Array<{ year: number; consumption: number; recycled: number; positivity: number }>;
}

function calculateWaterNeutrality(industry: string, waterUsage: number, recyclingRate: number, rechargeRate: number): WaterNeutralityResult {
  // NITI Aayog Framework Standards
  const industryBenchmarks: Record<string, any> = {
    textile: {
      benchmark: 100, // m³/ton of production
      recharge_target: 0.7,
      recycle_target: 0.5,
      niti_threshold: 0.8
    },
    chemical: {
      benchmark: 150,
      recharge_target: 0.6,
      recycle_target: 0.6,
      niti_threshold: 0.75
    },
    pharmaceutical: {
      benchmark: 80,
      recharge_target: 0.75,
      recycle_target: 0.7,
      niti_threshold: 0.85
    },
    food_beverage: {
      benchmark: 120,
      recharge_target: 0.65,
      recycle_target: 0.6,
      niti_threshold: 0.80
    },
    steel: {
      benchmark: 200,
      recharge_target: 0.5,
      recycle_target: 0.7,
      niti_threshold: 0.75
    },
    pulp_paper: {
      benchmark: 250,
      recharge_target: 0.6,
      recycle_target: 0.8,
      niti_threshold: 0.80
    },
    mining: {
      benchmark: 180,
      recharge_target: 0.75,
      recycle_target: 0.5,
      niti_threshold: 0.70
    },
    thermal_power: {
      benchmark: 300,
      recharge_target: 0.5,
      recycle_target: 0.6,
      niti_threshold: 0.75
    },
    automobile: {
      benchmark: 90,
      recharge_target: 0.65,
      recycle_target: 0.65,
      niti_threshold: 0.85
    },
    electronics: {
      benchmark: 70,
      recharge_target: 0.7,
      recycle_target: 0.75,
      niti_threshold: 0.90
    }
  };

  const bench = industryBenchmarks[industry] || industryBenchmarks.textile;

  // Water Neutrality Calculation (NITI Framework)
  // Water Neutrality Index = (Recycled + Recharged) / Total Consumption
  const recycledVolume = waterUsage * (recyclingRate / 100);
  const rechargedVolume = waterUsage * (rechargeRate / 100);
  const totalOffset = recycledVolume + rechargedVolume;
  const waterNeutralityIndex = Math.min(100, (totalOffset / waterUsage) * 100);

  // Water Positivity Gap (NITI Target - Current Performance)
  const currentPerformance = waterNeutralityIndex / 100;
  const positivityGap = Math.max(0, (bench.niti_threshold - currentPerformance) * 100);

  // Compliance Level
  let complianceLevel = "Non-Compliant";
  if (waterNeutralityIndex >= bench.niti_threshold * 100) {
    complianceLevel = "Water Positive";
  } else if (waterNeutralityIndex >= 70) {
    complianceLevel = "Water Neutral (Near)";
  } else if (waterNeutralityIndex >= 40) {
    complianceLevel = "Partial Neutrality";
  }

  // Status
  const status = waterNeutralityIndex >= bench.niti_threshold * 100 ? "ACHIEVED" : "IN PROGRESS";

  // Reduction Potential
  const reductionPotential = Math.max(0, bench.niti_threshold * 100 - waterNeutralityIndex);

  // Recommendations based on gaps
  const recommendations = [];
  if (recyclingRate < bench.recycle_target * 100) {
    recommendations.push(`Increase water recycling to ${(bench.recycle_target * 100).toFixed(0)}% (Currently ${recyclingRate.toFixed(0)}%)`);
  }
  if (rechargeRate < bench.recharge_target * 100) {
    recommendations.push(`Enhance groundwater recharge to ${(bench.recharge_target * 100).toFixed(0)}% (Currently ${rechargeRate.toFixed(0)}%)`);
  }
  if (waterUsage > bench.benchmark) {
    recommendations.push(`Optimize water consumption to ${bench.benchmark} m³/unit (Currently ${waterUsage.toFixed(0)} m³/unit)`);
  }
  recommendations.push("Implement water audits quarterly");
  recommendations.push("Install real-time water monitoring systems");
  recommendations.push("Establish rainwater harvesting system");

  // Timeline (5-year projection)
  const timeline = Array.from({ length: 5 }, (_, i) => ({
    year: new Date().getFullYear() + i,
    consumption: Math.max(waterUsage * 0.8, waterUsage - (waterUsage * 0.05 * (i + 1))),
    recycled: recycledVolume + (recycledVolume * 0.1 * (i + 1)),
    positivity: Math.min(100, waterNeutralityIndex + (positivityGap * 0.15 * (i + 1)))
  }));

  return {
    industry,
    baseline_water_consumption: waterUsage,
    water_recycled: recycledVolume,
    water_recharged: rechargedVolume,
    water_neutrality_index: waterNeutralityIndex,
    status,
    niti_benchmark: bench.niti_threshold * 100,
    compliance_level: complianceLevel,
    reduction_potential: reductionPotential,
    recommendations,
    positivity_gap: positivityGap,
    scorecard: {
      recycling: (recyclingRate / (bench.recycle_target * 100)) * 100,
      recharge: (rechargeRate / (bench.recharge_target * 100)) * 100,
      consumption: Math.min(100, (bench.benchmark / waterUsage) * 100),
      compliance: (waterNeutralityIndex / (bench.niti_threshold * 100)) * 100
    },
    timeline
  };
}

export default function WaterNeutralityIndustry() {
  const [industry, setIndustry] = useState("textile");
  const [waterUsage, setWaterUsage] = useState(100);
  const [recyclingRate, setRecyclingRate] = useState(40);
  const [rechargeRate, setRechargeRate] = useState(20);
  const [results, setResults] = useState<WaterNeutralityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/water-neutrality/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, water_usage: waterUsage, recycling_rate: recyclingRate, recharge_rate: rechargeRate }),
      });

      if (!response.ok) throw new Error("API unavailable");
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.log("Using fallback");
      setResults(calculateWaterNeutrality(industry, waterUsage, recyclingRate, rechargeRate));
    } finally {
      setLoading(false);
    }
  };

  const getComplianceColor = (status: string) => {
    if (status === "Water Positive") return "#10b981";
    if (status === "Water Neutral (Near)") return "#06b6d4";
    if (status === "Partial Neutrality") return "#f59e0b";
    return "#ef4444";
  };

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "niti_framework", label: "📋 NITI Framework" },
    { id: "scorecard", label: "📈 Scorecard" },
    { id: "recommendations", label: "💡 Recommendations" },
    { id: "timeline", label: "📅 5-Year Plan" },
  ];

  const industryOptions = [
    { value: "textile", label: "🧵 Textile & Apparel" },
    { value: "chemical", label: "🧪 Chemical & Petrochemical" },
    { value: "pharmaceutical", label: "💊 Pharmaceutical" },
    { value: "food_beverage", label: "🥤 Food & Beverage" },
    { value: "steel", label: "🏭 Steel" },
    { value: "pulp_paper", label: "📄 Pulp & Paper" },
    { value: "mining", label: "⛏️ Mining" },
    { value: "thermal_power", label: "⚡ Thermal Power" },
    { value: "automobile", label: "🚗 Automobile" },
    { value: "electronics", label: "📱 Electronics" },
  ];

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" }}>
          💧 Water Neutrality & Positivity for Industry
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 32px 0" }}>
          NITI Aayog Framework | Industry-Specific Benchmarks | Water Neutrality Index
        </p>

        {/* Input Section */}
        <div style={{ background: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>⚙️ Industry Parameters</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Industry Type *</label>
              <select value={industry} onChange={e => setIndustry(e.target.value)} style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a", background: "white", cursor: "pointer" }}>
                {industryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Water Consumption (m³/day)</label>
              <input type="number" value={waterUsage} onChange={e => setWaterUsage(parseFloat(e.target.value) || 0)} min="0" step="10" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Water Recycling Rate (%)</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input type="range" value={recyclingRate} onChange={e => setRecyclingRate(parseFloat(e.target.value))} min="0" max="100" style={{ flex: 1 }} />
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{recyclingRate.toFixed(0)}%</span>
              </div>
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Groundwater Recharge (%)</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input type="range" value={rechargeRate} onChange={e => setRechargeRate(parseFloat(e.target.value))} min="0" max="100" style={{ flex: 1 }} />
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{rechargeRate.toFixed(0)}%</span>
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "flex-end" }}>
              <button onClick={handleCalculate} disabled={loading} style={{ padding: "10px 32px", borderRadius: "8px", border: "none", background: loading ? "#cbd5e1" : "#0284c7", color: "white", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", width: "100%" }}>
                {loading ? "🔄 Calculating..." : "💧 Calculate Water Neutrality"}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {results && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "28px" }}>
              {[
                { label: "WNI Score", val: results.water_neutrality_index.toFixed(1), unit: "%", color: getComplianceColor(results.compliance_level) },
                { label: "Status", val: results.status, unit: "", color: results.status === "ACHIEVED" ? "#10b981" : "#f59e0b" },
                { label: "Compliance", val: results.compliance_level, unit: "", color: getComplianceColor(results.compliance_level) },
                { label: "NITI Target", val: results.niti_benchmark.toFixed(0), unit: "%", color: "#0284c7" },
              ].map((item, i) => (
                <div key={i} style={{ background: "white", padding: "14px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: `4px solid ${item.color}` }}>
                  <p style={{ color: "#94a3b8", fontSize: "9px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 4px 0" }}>{item.label}</p>
                  <p style={{ color: item.color, fontSize: "16px", fontWeight: "800", margin: "0" }}>{item.val}</p>
                  {item.unit && <p style={{ color: "#64748b", fontSize: "9px", margin: "0" }}>{item.unit}</p>}
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "8px 12px", borderRadius: "8px", border: "2px solid", background: activeTab === t.id ? "#0284c7" : "white", color: activeTab === t.id ? "white" : "#0284c7", borderColor: "#0284c7", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === "overview" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Water Balance (m³/day)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[
                      { name: "Consumed", value: results.baseline_water_consumption },
                      { name: "Recycled", value: results.water_recycled },
                      { name: "Recharged", value: results.water_recharged },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartTooltip />
                      <Bar dataKey="value" fill="#0284c7" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Key Metrics</h3>
                  {[
                    { label: "Total Consumption", val: results.baseline_water_consumption.toFixed(0), unit: "m³/day" },
                    { label: "Water Recycled", val: results.water_recycled.toFixed(0), unit: "m³/day" },
                    { label: "Groundwater Recharged", val: results.water_recharged.toFixed(0), unit: "m³/day" },
                    { label: "Net Offset", val: (results.water_recycled + results.water_recharged).toFixed(0), unit: "m³/day" },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: "8px 0", borderBottom: i < 3 ? "1px solid #f1f5f9" : "none" }}>
                      <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>{item.label}</p>
                      <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0" }}>{item.val} {item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NITI Framework */}
            {activeTab === "niti_framework" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>NITI Aayog Water Neutrality Framework</h3>
                <div style={{ background: "#f0f9ff", padding: "16px", borderRadius: "8px", marginBottom: "12px", borderLeft: "4px solid #0284c7" }}>
                  <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 4px 0" }}>Framework Overview</p>
                  <p style={{ color: "#0f172a", fontSize: "11px", margin: "0" }}>
                    Water Neutrality Index (WNI) = (Water Recycled + Water Recharged) / Total Water Consumption × 100%
                  </p>
                </div>

                {[
                  { label: "Your WNI", val: results.water_neutrality_index.toFixed(1), color: getComplianceColor(results.compliance_level) },
                  { label: "NITI Target", val: results.niti_benchmark.toFixed(0), color: "#0284c7" },
                  { label: "Gap to Close", val: (results.niti_benchmark - results.water_neutrality_index).toFixed(1), color: "#f59e0b" },
                  { label: "Compliance Status", val: results.compliance_level, color: getComplianceColor(results.compliance_level) },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", marginBottom: "8px" }}>
                    <p style={{ color: "#64748b", fontSize: "10px", fontWeight: "700", margin: "0 0 2px 0" }}>{item.label}</p>
                    <p style={{ color: item.color, fontSize: "13px", fontWeight: "800", margin: "0" }}>{item.val}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Scorecard */}
            {activeTab === "scorecard" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Performance Scorecard</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: "Recycling", score: results.scorecard.recycling },
                    { name: "Recharge", score: results.scorecard.recharge },
                    { name: "Consumption", score: results.scorecard.consumption },
                    { name: "Compliance", score: results.scorecard.compliance },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <RechartTooltip />
                    <Bar dataKey="score" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recommendations */}
            {activeTab === "recommendations" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Action Items for Water Positivity</h3>
                {results.recommendations.map((rec, i) => (
                  <div key={i} style={{ padding: "12px", background: "#f0fdf4", borderRadius: "8px", marginBottom: "8px", borderLeft: "4px solid #10b981" }}>
                    <p style={{ color: "#065f46", fontSize: "11px", margin: "0" }}>✓ {rec}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Timeline */}
            {activeTab === "timeline" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>5-Year Water Positivity Roadmap</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results.timeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartTooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="consumption" stroke="#ef4444" name="Consumption (m³)" />
                    <Line yAxisId="left" type="monotone" dataKey="recycled" stroke="#10b981" name="Recycled (m³)" />
                    <Line yAxisId="right" type="monotone" dataKey="positivity" stroke="#0284c7" name="WNI (%)" />
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
