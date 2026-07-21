import Layout from "../components/Layout";
import { useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, ResponsiveContainer } from "recharts";

const API_BASE = "/api";

interface Sector {
  sectorKey: string;
  sectorName: string;
  industry: string;
  typicalFlowRate: number;
  recoveryTarget: number;
}

const FALLBACK_SECTORS: Sector[] = [
  { sectorKey: "textile", sectorName: "Textile Mills", industry: "Textile", typicalFlowRate: 150, recoveryTarget: 0.85 },
  { sectorKey: "dairy", sectorName: "Dairy Processing", industry: "Dairy", typicalFlowRate: 80, recoveryTarget: 0.80 },
  { sectorKey: "pharma", sectorName: "Pharmaceutical Manufacturing", industry: "Pharma", typicalFlowRate: 50, recoveryTarget: 0.90 },
  { sectorKey: "food", sectorName: "Food & Beverage", industry: "Food", typicalFlowRate: 120, recoveryTarget: 0.82 },
  { sectorKey: "steel", sectorName: "Steel Manufacturing (Old)", industry: "Steel", typicalFlowRate: 300, recoveryTarget: 0.75 },
  { sectorKey: "ceramic", sectorName: "Ceramic & Tile", industry: "Ceramic", typicalFlowRate: 200, recoveryTarget: 0.70 },
  { sectorKey: "refinery", sectorName: "Petroleum Refinery", industry: "Refinery", typicalFlowRate: 250, recoveryTarget: 0.80 },
  { sectorKey: "pulpandpaper", sectorName: "Pulp & Paper Mills", industry: "Pulp & Paper", typicalFlowRate: 400, recoveryTarget: 0.75 },
  { sectorKey: "steelmanufacturing", sectorName: "Steel Manufacturing", industry: "Steel", typicalFlowRate: 500, recoveryTarget: 0.78 },
  { sectorKey: "automobile", sectorName: "Automobile Manufacturing", industry: "Automobile", typicalFlowRate: 250, recoveryTarget: 0.82 },
  { sectorKey: "datacenter", sectorName: "Data Center Cooling", industry: "Data Center", typicalFlowRate: 150, recoveryTarget: 0.90 },
  { sectorKey: "semiconductor", sectorName: "Semiconductor Fab", industry: "Semiconductor", typicalFlowRate: 100, recoveryTarget: 0.88 },
];

interface ZLDResult {
  waterBalance: {
    annualTotalWaterDemand: number;
    annualRecycledWater: number;
    annualFreshWaterRequired: number;
    percentageWaterRecycled: number;
  };
  zldMetrics: {
    zldAchievementRate: number;
    liquidDischargeEliminated: number;
    status: string;
  };
  financialMetrics: {
    capitalInvestment: number;
    annualFreshWaterCost: number;
    annualTreatmentCost: number;
    annualFreshWaterSavings: number;
    annualNetSavings: number;
    paybackPeriodYears: number;
    ROIPercentage: number;
  };
  pinchAnalysis: {
    reuseOpportunities: Array<{ stage: string; flowRate: number; efficiency: number; targetWater: string }>;
    cascadingStages: Array<{ stage: number; name: string; flowIn: number; flowOut: number; costPerM3: number; pollutantRemovalRate: { average: number } }>;
  };
}

  const calculateZLDFallback = (_sectorKey: string, waterFlowM3h: number): ZLDResult => {
  const annualWaterFlow = waterFlowM3h * 365 * 24;
  const reusableFraction = 0.4;
  const directReuseFlow = waterFlowM3h * reusableFraction * 0.85;
  const secondaryReuseFlow = waterFlowM3h * 0.25 * 0.75;
  const tertiaryReuseFlow = waterFlowM3h * 0.15 * 0.92;
  const totalRecycledFlow = directReuseFlow + secondaryReuseFlow + tertiaryReuseFlow;
  
  const annualRecycledWater = totalRecycledFlow * 365 * 24;
  const annualFreshWaterNeeded = (waterFlowM3h - totalRecycledFlow) * 365 * 24;
  const zldAchievementRate = (annualRecycledWater / annualWaterFlow) * 100;
  
  const freshWaterCost = 60;
  const annualFreshWaterCost = annualFreshWaterNeeded * freshWaterCost;
  const annualFreshWaterSavings = (annualWaterFlow - annualFreshWaterNeeded) * freshWaterCost;
  
  const treatmentCosts = [
    { flowIn: waterFlowM3h, costPerM3: 8 },
    { flowIn: waterFlowM3h - directReuseFlow, costPerM3: 35 },
    { flowIn: waterFlowM3h - directReuseFlow - secondaryReuseFlow, costPerM3: 80 },
    { flowIn: waterFlowM3h - totalRecycledFlow, costPerM3: 120 },
  ];
  const annualTreatmentCost = treatmentCosts.reduce((sum, tc) => sum + (tc.flowIn * tc.costPerM3 * 365 * 24), 0);
  
  const capitalCost = (waterFlowM3h * 150) * 1200000 / 100;
  const annualNetSavings = annualFreshWaterSavings - annualTreatmentCost;
  const paybackPeriod = annualNetSavings > 0 ? capitalCost / annualNetSavings : 999;
  
  return {
    waterBalance: {
      annualTotalWaterDemand: annualWaterFlow,
      annualRecycledWater,
      annualFreshWaterRequired: annualFreshWaterNeeded,
      percentageWaterRecycled: (annualRecycledWater / annualWaterFlow) * 100,
    },
    zldMetrics: {
      zldAchievementRate,
      liquidDischargeEliminated: (annualWaterFlow - annualFreshWaterNeeded) / 1000,
      status: zldAchievementRate > 95 ? "Achieved" : zldAchievementRate > 80 ? "Near ZLD" : "In Progress",
    },
    financialMetrics: {
      capitalInvestment: capitalCost,
      annualFreshWaterCost,
      annualTreatmentCost,
      annualFreshWaterSavings,
      annualNetSavings,
      paybackPeriodYears: parseFloat(paybackPeriod.toFixed(2)),
      ROIPercentage: parseFloat(((annualNetSavings / capitalCost) * 100).toFixed(2)),
    },
    pinchAnalysis: {
      reuseOpportunities: [
        { stage: "Primary Reuse", flowRate: directReuseFlow, efficiency: 0.85, targetWater: "Process Water" },
        { stage: "Secondary Reuse", flowRate: secondaryReuseFlow, efficiency: 0.75, targetWater: "Standard Uses" },
        { stage: "Tertiary Reuse", flowRate: tertiaryReuseFlow, efficiency: 0.92, targetWater: "Non-Critical Uses" },
      ],
      cascadingStages: [
        { stage: 1, name: "Pretreatment", flowIn: waterFlowM3h, flowOut: directReuseFlow, costPerM3: 8, pollutantRemovalRate: { average: 85 } },
        { stage: 2, name: "Primary Treatment", flowIn: waterFlowM3h - directReuseFlow, flowOut: secondaryReuseFlow, costPerM3: 35, pollutantRemovalRate: { average: 75 } },
        { stage: 3, name: "Tertiary Treatment", flowIn: waterFlowM3h - directReuseFlow - secondaryReuseFlow, flowOut: tertiaryReuseFlow, costPerM3: 80, pollutantRemovalRate: { average: 92 } },
        { stage: 4, name: "Final Disposal", flowIn: waterFlowM3h - totalRecycledFlow, flowOut: 0, costPerM3: 120, pollutantRemovalRate: { average: 100 } },
      ],
    },
  };
}

export default function ZLDCalculator() {
  const [sectors] = useState<Sector[]>(FALLBACK_SECTORS);
  const [sector, setSector] = useState("textile");
  const [waterFlowM3h, setWaterFlowM3h] = useState(150);
  const [treatmentEfficiency] = useState({ pretreatment: 0.85, primary: 0.75, tertiary: 0.92 });
  
  const [results, setResults] = useState<ZLDResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const sectorProfile = sectors.find(s => s.sectorKey === sector);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/zld-calculator/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sector,
          totalWaterFlowM3PerHour: waterFlowM3h,
          treatmentEfficiency,
        }),
      });

      if (!response.ok) throw new Error("API unavailable");
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Using fallback calculation:", err);
      setResults(calculateZLDFallback(sector, waterFlowM3h));
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (rate: number) => {
    if (rate > 95) return "#10b981";
    if (rate > 80) return "#ca8a04";
    return "#dc2626";
  };

  const formatCurrency = (val: number) => `₹${(val / 10000000).toFixed(1)}Cr`;
  const formatWater = (val: number) => `${(val / 1000).toFixed(1)}ML`;

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "pinch", label: "🎯 Water Pinch" },
    { id: "treatment", label: "⚙️ Treatment" },
    { id: "financial", label: "💰 Economics" },
    { id: "environmental", label: "🌍 Impact" },
  ];

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" }}>
          💧 ZLD Calculator
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 32px 0" }}>
          Water Pinch Analysis & Zero Liquid Discharge Optimization
        </p>

        {/* Input */}
        <div style={{ background: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "24px" }}>
            <div>
              <label style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Sector</label>
              <select value={sector} onChange={e => setSector(e.target.value)} style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#0f172a", background: "white", cursor: "pointer" }}>
                {sectors.map(s => <option key={s.sectorKey} value={s.sectorKey}>{s.sectorName}</option>)}
              </select>
              {sectorProfile && <p style={{ color: "#94a3b8", fontSize: "11px", margin: "6px 0 0 0" }}>Typical: {sectorProfile.typicalFlowRate}m³/h</p>}
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Flow (m³/h)</label>
              <input type="number" value={waterFlowM3h} onChange={e => setWaterFlowM3h(parseFloat(e.target.value) || 0)} min="10" max="5000" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#0f172a" }} />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={handleCalculate} disabled={loading} style={{ padding: "10px 32px", borderRadius: "8px", border: "none", background: loading ? "#cbd5e1" : "#0284c7", color: "white", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", width: "100%" }}>
                {loading ? "🔄 Calculating..." : "🚀 Analyze"}
              </button>
            </div>
          </div>
          {error && <div style={{ color: "#dc2626", fontSize: "12px" }}>⚠️ {error}</div>}
        </div>

        {/* Results */}
        {results && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px", marginBottom: "28px" }}>
              {[
                { label: "ZLD %", val: results.zldMetrics.zldAchievementRate.toFixed(1), color: statusColor(results.zldMetrics.zldAchievementRate) },
                { label: "Water Recycled", val: formatWater(results.waterBalance.annualRecycledWater), color: "#10b981" },
                { label: "Net Savings", val: formatCurrency(results.financialMetrics.annualNetSavings), color: "#8b5cf6" },
                { label: "Payback", val: results.financialMetrics.paybackPeriodYears.toFixed(1) + "yr", color: "#f97316" },
                { label: "ROI", val: results.financialMetrics.ROIPercentage.toFixed(1) + "%", color: "#06b6d4" },
              ].map((item, i) => (
                <div key={i} style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: `4px solid ${item.color}` }}>
                  <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 6px 0" }}>{item.label}</p>
                  <p style={{ color: item.color, fontSize: "20px", fontWeight: "800", margin: "0" }}>{item.val}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "10px 14px", borderRadius: "8px", border: "2px solid", background: activeTab === t.id ? "#0284c7" : "white", color: activeTab === t.id ? "white" : "#0284c7", borderColor: "#0284c7", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === "overview" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>💧 Water Balance</h3>
                  {[
                    { label: "Total", val: (results.waterBalance.annualTotalWaterDemand / 1000).toFixed(1), unit: "ML" },
                    { label: "Recycled", val: (results.waterBalance.annualRecycledWater / 1000).toFixed(1), unit: "ML" },
                    { label: "Fresh Needed", val: (results.waterBalance.annualFreshWaterRequired / 1000).toFixed(1), unit: "ML" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                      <p style={{ color: "#64748b", fontSize: "12px", margin: "0" }}>{item.label}</p>
                      <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "700", margin: "0" }}>{item.val} {item.unit}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>💰 Costs</h3>
                  {[
                    { label: "CapEx", val: formatCurrency(results.financialMetrics.capitalInvestment) },
                    { label: "Fresh Water/yr", val: formatCurrency(results.financialMetrics.annualFreshWaterCost) },
                    { label: "Treatment/yr", val: formatCurrency(results.financialMetrics.annualTreatmentCost) },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                      <p style={{ color: "#64748b", fontSize: "12px", margin: "0" }}>{item.label}</p>
                      <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "700", margin: "0" }}>{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pinch */}
            {activeTab === "pinch" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>🎯 Reuse Opportunities</h3>
                <div style={{ display: "grid", gap: "12px" }}>
                  {results.pinchAnalysis?.reuseOpportunities?.map((opp, i) => (
                    <div key={i} style={{ background: "#f0f9ff", padding: "14px", borderRadius: "10px", borderLeft: "4px solid #0284c7" }}>
                      <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0 0 4px 0" }}>{opp.stage}</p>
                      <p style={{ color: "#64748b", fontSize: "11px", margin: "0 0 6px 0" }}>{opp.targetWater}</p>
                      <div style={{ display: "flex", gap: "12px", fontSize: "11px" }}>
                        <span style={{ color: "#0284c7", fontWeight: "700" }}>Flow: {opp.flowRate.toFixed(1)} m³/h</span>
                        <span style={{ color: "#10b981", fontWeight: "700" }}>Efficiency: {(opp.efficiency * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Treatment */}
            {activeTab === "treatment" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>⚙️ Treatment Cascade</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={results.pinchAnalysis?.cascadingStages || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                    <YAxis />
                    <RechartTooltip />
                    <Bar dataKey="costPerM3" fill="#0284c7" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Financial */}
            {activeTab === "financial" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>Cost Breakdown</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={[
                      { name: "Fresh Water", value: results.financialMetrics.annualFreshWaterCost },
                      { name: "Treatment", value: results.financialMetrics.annualTreatmentCost },
                    ]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ₹${((value as number) / 10000000).toFixed(1)}Cr`}>
                      <Cell fill="#0284c7" />
                      <Cell fill="#f97316" />
                    </Pie>
                    <RechartTooltip formatter={(v) => `₹${((v as number) / 10000000).toFixed(1)}Cr`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Environmental */}
            {activeTab === "environmental" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>🌍 Environmental Impact</h3>
                <div style={{ background: "#dcfce7", padding: "20px", borderRadius: "12px", border: "2px solid #10b981" }}>
                  <p style={{ color: "#065f46", fontSize: "12px", margin: "0 0 10px 0" }}>
                    <strong>ZLD Status:</strong> {results.zldMetrics.status}
                  </p>
                  <p style={{ color: "#065f46", fontSize: "12px", margin: "0 0 10px 0" }}>
                    <strong>Discharge Eliminated:</strong> {results.zldMetrics.liquidDischargeEliminated.toFixed(1)} Million Liters/year
                  </p>
                  <p style={{ color: "#065f46", fontSize: "12px", margin: "0" }}>
                    <strong>Water Conservation:</strong> {results.waterBalance.percentageWaterRecycled.toFixed(1)}% of demand met internally
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
