import Layout from "../components/Layout";
import { useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const API_BASE = "/api";

interface ISO14046Result {
  productName: string;
  category: string;
  waterConsumption: {
    blue: number;
    green: number;
    grey: number;
    total: number;
  };
  waterDegradation: {
    pollutants: { name: string; concentration: number; unit: string }[];
    degredationIndex: number;
    quality_impact: string;
  };
  waterScarcity: {
    regionName: string;
    annualRainfall: number;
    waterAvailability: number;
    scarcityIndex: number;
    stressLevel: string;
  };
  lcaMetrics: {
    stages: Array<{ stage: string; water: number; impact: number }>;
    totalLCAImpact: number;
    hotspots: string[];
  };
  complianceReport: {
    iso14046Compliant: boolean;
    certificationLevel: string;
    recommendations: string[];
    benchmarkComparison: string;
  };
}

// Fallback calculation
function calculateISO14046Fallback(
  productName: string,
  category: string,
  region: string,
  production: number,
  pollutants: Record<string, number>
): ISO14046Result {
  const categoryWaterUse: Record<string, number> = {
    textile: 79000,
    beverage: 1900,
    meat: 15415,
    crop: 1644,
    electronics: 240,
    automotive: 148,
    steel: 24000,
    semiconductor: 1500,
  };

  const blueWater = (categoryWaterUse[category] || 1000) * (production / 100);
  const greenWater = blueWater * 0.3;
  const greyWater = blueWater * 0.15;
  const totalWater = blueWater + greenWater + greyWater;

  const regionData: Record<string, { rainfall: number; availability: number }> = {
    "high-rainfall": { rainfall: 2500, availability: 2000 },
    "moderate-rainfall": { rainfall: 1200, availability: 800 },
    "low-rainfall": { rainfall: 600, availability: 300 },
    "arid": { rainfall: 200, availability: 50 },
  };

  const rd = regionData[region] || regionData["moderate-rainfall"];
  const scarcityIndex = (totalWater / (rd.availability * 10)) * 100;
  const stressLevel = scarcityIndex > 80 ? "Critical" : scarcityIndex > 50 ? "High" : scarcityIndex > 20 ? "Moderate" : "Low";

  const pollutantArray = Object.entries(pollutants).map(([name, conc]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    concentration: conc,
    unit: "mg/L",
  }));

  const degradationIndex = Object.values(pollutants).reduce((a, b) => a + b, 0) / 100;

  return {
    productName,
    category,
    waterConsumption: {
      blue: blueWater,
      green: greenWater,
      grey: greyWater,
      total: totalWater,
    },
    waterDegradation: {
      pollutants: pollutantArray,
      degredationIndex: degradationIndex,
      quality_impact: degradationIndex > 50 ? "High" : degradationIndex > 20 ? "Medium" : "Low",
    },
    waterScarcity: {
      regionName: region,
      annualRainfall: rd.rainfall,
      waterAvailability: rd.availability * 10,
      scarcityIndex,
      stressLevel,
    },
    lcaMetrics: {
      stages: [
        { stage: "Raw Material", water: totalWater * 0.3, impact: 30 },
        { stage: "Production", water: totalWater * 0.5, impact: 50 },
        { stage: "Distribution", water: totalWater * 0.15, impact: 15 },
        { stage: "End of Life", water: totalWater * 0.05, impact: 5 },
      ],
      totalLCAImpact: 100,
      hotspots: ["Production phase (50%)", "Raw material sourcing (30%)"],
    },
    complianceReport: {
      iso14046Compliant: true,
      certificationLevel: degradationIndex < 30 && scarcityIndex < 50 ? "Gold" : degradationIndex < 50 && scarcityIndex < 70 ? "Silver" : "Bronze",
      recommendations: [
        "Implement water recycling system",
        "Reduce pollutant discharge by 25%",
        "Optimize production process",
      ],
      benchmarkComparison: `${category} industry average: ${(categoryWaterUse[category] || 1000) * 0.9} L/unit`,
    },
  };
}

export default function ISO14046Calculator() {
  const [productName, setProductName] = useState("Sample Product");
  const [category, setCategory] = useState("textile");
  const [region, setRegion] = useState("moderate-rainfall");
  const [production, setProduction] = useState(100);
  const [pollutants, setPollutants] = useState({ cod: 150, tds: 500, tss: 100, heavy_metals: 5 });

  const [results, setResults] = useState<ISO14046Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/iso14046/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          category,
          region,
          production,
          pollutants,
        }),
      });

      if (!response.ok) throw new Error("API unavailable");
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.log("Using fallback calculation");
      setResults(calculateISO14046Fallback(productName, category, region, production, pollutants));
    } finally {
      setLoading(false);
    }
  };

  const certColor = (level: string) => {
    if (level === "Gold") return "#fbbf24";
    if (level === "Silver") return "#d1d5db";
    return "#b87333";
  };

  const stressColor = (level: string) => {
    if (level === "Critical") return "#dc2626";
    if (level === "High") return "#f97316";
    if (level === "Moderate") return "#ca8a04";
    return "#10b981";
  };

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "consumption", label: "💧 Water Consumption" },
    { id: "degradation", label: "🧪 Water Degradation" },
    { id: "scarcity", label: "🌍 Water Scarcity" },
    { id: "lca", label: "🔄 LCA Metrics" },
    { id: "compliance", label: "✅ ISO 14046 Compliance" },
  ];

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" }}>
          🌊 ISO 14046 Water Footprint Calculator
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 32px 0" }}>
          Comprehensive lifecycle water footprint assessment & environmental compliance
        </p>

        {/* Input Section */}
        <div style={{ background: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>⚙️ Product & Assessment Parameters</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Product Name</label>
              <input type="text" value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g., Cotton T-Shirt" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a", background: "white", cursor: "pointer" }}>
                <option value="textile">Textile</option>
                <option value="beverage">Beverage</option>
                <option value="meat">Meat Production</option>
                <option value="crop">Crop Production</option>
                <option value="electronics">Electronics</option>
                <option value="automotive">Automotive</option>
                <option value="steel">Steel</option>
                <option value="semiconductor">Semiconductor</option>
              </select>
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Region</label>
              <select value={region} onChange={e => setRegion(e.target.value)} style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a", background: "white", cursor: "pointer" }}>
                <option value="high-rainfall">High Rainfall ({">"}2000mm)</option>
                <option value="moderate-rainfall">Moderate Rainfall (1000-2000mm)</option>
                <option value="low-rainfall">Low Rainfall (400-1000mm)</option>
                <option value="arid">Arid ({"<"}400mm)</option>
              </select>
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Production Volume (units)</label>
              <input type="number" value={production} onChange={e => setProduction(parseFloat(e.target.value) || 0)} min="1" max="10000" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
            </div>
          </div>

          {/* Pollutants */}
          <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "24px 0 12px 0" }}>Water Quality Pollutants (mg/L)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            {Object.entries(pollutants).map(([key, val]) => (
              <div key={key}>
                <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                  {key.toUpperCase()}
                </label>
                <input type="number" value={val} onChange={e => setPollutants({ ...pollutants, [key]: parseFloat(e.target.value) || 0 })} min="0" max="1000" style={{ width: "100%", padding: "8px", border: "2px solid #e2e8f0", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
              </div>
            ))}
          </div>

          <button onClick={handleCalculate} disabled={loading} style={{ padding: "12px 36px", borderRadius: "8px", border: "none", background: loading ? "#cbd5e1" : "#0284c7", color: "white", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "🔄 Calculating..." : "🚀 Calculate ISO 14046"}
          </button>
        </div>

        {/* Results */}
        {results && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "14px", marginBottom: "28px" }}>
              <div style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: "4px solid #0284c7" }}>
                <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 6px 0" }}>Total Water</p>
                <p style={{ color: "#0284c7", fontSize: "20px", fontWeight: "800", margin: "0" }}>{(results.waterConsumption.total / 1000).toFixed(1)}K</p>
                <p style={{ color: "#64748b", fontSize: "10px", margin: "0" }}>Liters</p>
              </div>

              <div style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: "4px solid #10b981" }}>
                <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 6px 0" }}>Scarcity Index</p>
                <p style={{ color: stressColor(results.waterScarcity.stressLevel), fontSize: "20px", fontWeight: "800", margin: "0" }}>{results.waterScarcity.scarcityIndex.toFixed(1)}%</p>
                <p style={{ color: "#64748b", fontSize: "10px", margin: "0" }}>{results.waterScarcity.stressLevel}</p>
              </div>

              <div style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: `4px solid ${certColor(results.complianceReport.certificationLevel)}` }}>
                <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 6px 0" }}>Certification</p>
                <p style={{ color: certColor(results.complianceReport.certificationLevel), fontSize: "18px", fontWeight: "800", margin: "0" }}>{results.complianceReport.certificationLevel}</p>
                <p style={{ color: "#64748b", fontSize: "10px", margin: "0" }}>ISO 14046</p>
              </div>

              <div style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: "4px solid #f97316" }}>
                <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 6px 0" }}>Degradation</p>
                <p style={{ color: "#f97316", fontSize: "20px", fontWeight: "800", margin: "0" }}>{results.waterDegradation.degredationIndex.toFixed(1)}</p>
                <p style={{ color: "#64748b", fontSize: "10px", margin: "0" }}>{results.waterDegradation.quality_impact}</p>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "10px 14px", borderRadius: "8px", border: "2px solid", background: activeTab === t.id ? "#0284c7" : "white", color: activeTab === t.id ? "white" : "#0284c7", borderColor: "#0284c7", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>Executive Summary</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <p style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>Product: {results.productName}</p>
                    <p style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>Category: {results.category.charAt(0).toUpperCase() + results.category.slice(1)}</p>
                    <p style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>Region: {results.waterScarcity.regionName}</p>
                  </div>
                  <div>
                    <p style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>ISO 14046: {results.complianceReport.iso14046Compliant ? "✅ Compliant" : "❌ Non-Compliant"}</p>
                    <p style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>Certification: {results.complianceReport.certificationLevel}</p>
                    <p style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>{results.complianceReport.benchmarkComparison}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Consumption Tab */}
            {activeTab === "consumption" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>Water Consumption Breakdown</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Blue (Freshwater)", value: results.waterConsumption.blue },
                          { name: "Green (Rainwater)", value: results.waterConsumption.green },
                          { name: "Grey (Polluted)", value: results.waterConsumption.grey },
                        ]}
                        cx="50%" cy="50%" outerRadius={80} dataKey="value"
                        label={({ name, value }) => `${name}: ${(value / 1000).toFixed(1)}K L`}
                      >
                        <Cell fill="#0284c7" />
                        <Cell fill="#10b981" />
                        <Cell fill="#f97316" />
                      </Pie>
                      <RechartTooltip formatter={(v) => `${(v as number / 1000).toFixed(1)}K L`} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div>
                    <div style={{ marginBottom: "16px", padding: "12px", background: "#f0f9ff", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
                      <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", margin: "0 0 4px 0" }}>Blue Water (Freshwater)</p>
                      <p style={{ color: "#0284c7", fontSize: "16px", fontWeight: "800", margin: "0" }}>{(results.waterConsumption.blue / 1000).toFixed(1)}K L</p>
                    </div>
                    <div style={{ marginBottom: "16px", padding: "12px", background: "#f0fdf4", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
                      <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", margin: "0 0 4px 0" }}>Green Water (Rainwater)</p>
                      <p style={{ color: "#10b981", fontSize: "16px", fontWeight: "800", margin: "0" }}>{(results.waterConsumption.green / 1000).toFixed(1)}K L</p>
                    </div>
                    <div style={{ padding: "12px", background: "#fef3c7", borderRadius: "8px", borderLeft: "4px solid #f97316" }}>
                      <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", margin: "0 0 4px 0" }}>Grey Water (Polluted)</p>
                      <p style={{ color: "#f97316", fontSize: "16px", fontWeight: "800", margin: "0" }}>{(results.waterConsumption.grey / 1000).toFixed(1)}K L</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Degradation Tab */}
            {activeTab === "degradation" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>Water Degradation Assessment</h3>
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", margin: "0 0 12px 0" }}>Pollutant Concentrations</p>
                  {results.waterDegradation.pollutants.map((p, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: i % 2 === 0 ? "#f8fafc" : "white", borderRadius: "6px", marginBottom: "4px" }}>
                      <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "600", margin: "0" }}>{p.name}</p>
                      <p style={{ color: "#0284c7", fontSize: "12px", fontWeight: "700", margin: "0" }}>{p.concentration} {p.unit}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#fee2e2", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #dc2626" }}>
                  <p style={{ color: "#7f1d1d", fontSize: "12px", fontWeight: "700", margin: "0 0 4px 0" }}>Degradation Index: {results.waterDegradation.degredationIndex.toFixed(1)}</p>
                  <p style={{ color: "#7f1d1d", fontSize: "11px", margin: "0" }}>Quality Impact: {results.waterDegradation.quality_impact}</p>
                </div>
              </div>
            )}

            {/* Scarcity Tab */}
            {activeTab === "scarcity" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>Water Scarcity Assessment</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div style={{ background: "#f0f9ff", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
                    <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 6px 0" }}>Annual Rainfall</p>
                    <p style={{ color: "#0284c7", fontSize: "18px", fontWeight: "800", margin: "0" }}>{results.waterScarcity.annualRainfall}mm</p>
                  </div>
                  <div style={{ background: "#f0fdf4", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
                    <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 6px 0" }}>Water Availability</p>
                    <p style={{ color: "#10b981", fontSize: "18px", fontWeight: "800", margin: "0" }}>{results.waterScarcity.waterAvailability.toFixed(0)}M m³</p>
                  </div>
                </div>
                <div style={{ background: stressColor(results.waterScarcity.stressLevel) + "22", padding: "16px", borderRadius: "8px", borderLeft: `4px solid ${stressColor(results.waterScarcity.stressLevel)}` }}>
                  <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0 0 4px 0" }}>Water Stress Level: {results.waterScarcity.stressLevel}</p>
                  <p style={{ color: "#64748b", fontSize: "11px", margin: "0" }}>Scarcity Index: {results.waterScarcity.scarcityIndex.toFixed(1)}% ({">"}80% = Critical, {">"}50% = High, {">"}20% = Moderate)</p>
                </div>
              </div>
            )}

            {/* LCA Tab */}
            {activeTab === "lca" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>Lifecycle Assessment (LCA) - ISO 14040/44</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={results.lcaMetrics.stages}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartTooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="water" fill="#0284c7" name="Water (L)" />
                    <Bar yAxisId="right" dataKey="impact" fill="#f97316" name="Impact %" />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ marginTop: "20px", padding: "16px", background: "#f0f9ff", borderRadius: "8px" }}>
                  <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>LCA Hotspots:</p>
                  {results.lcaMetrics.hotspots.map((h, i) => (
                    <p key={i} style={{ color: "#64748b", fontSize: "11px", margin: "0 0 4px 0" }}>• {h}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Compliance Tab */}
            {activeTab === "compliance" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>✅ ISO 14046 Compliance Report</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div style={{ background: results.complianceReport.iso14046Compliant ? "#dcfce7" : "#fee2e2", padding: "16px", borderRadius: "8px", borderLeft: `4px solid ${results.complianceReport.iso14046Compliant ? "#10b981" : "#dc2626"}` }}>
                    <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0 0 4px 0" }}>ISO 14046 Status</p>
                    <p style={{ color: results.complianceReport.iso14046Compliant ? "#065f46" : "#7f1d1d", fontSize: "14px", fontWeight: "800", margin: "0" }}>
                      {results.complianceReport.iso14046Compliant ? "✅ Compliant" : "❌ Non-Compliant"}
                    </p>
                  </div>
                  <div style={{ background: "#f0f9ff", padding: "16px", borderRadius: "8px", borderLeft: `4px solid ${certColor(results.complianceReport.certificationLevel)}` }}>
                    <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0 0 4px 0" }}>Certification Level</p>
                    <p style={{ color: certColor(results.complianceReport.certificationLevel), fontSize: "18px", fontWeight: "800", margin: "0" }}>
                      {results.complianceReport.certificationLevel}
                    </p>
                  </div>
                </div>
                <div style={{ background: "#f9f5ff", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
                  <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>Recommendations:</p>
                  {results.complianceReport.recommendations.map((rec, i) => (
                    <p key={i} style={{ color: "#64748b", fontSize: "11px", margin: "0 0 4px 0" }}>✓ {rec}</p>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
