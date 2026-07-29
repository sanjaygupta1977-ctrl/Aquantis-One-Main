import Layout from "../components/Layout";
import { useState } from "react";
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE = "/api";

interface GEC2015Result {
  inputParameters: {
    lakeArea: number;
    catchmentArea: number;
    annualRainfall: number;
    soilType: string;
    landUse: string;
    monsoonMonths: number;
  };
  rainfallAnalysis: {
    totalRainfall: number;
    monsoonRainfall: number;
    nonMonsoonRainfall: number;
    rainfallCoefficient: number;
  };
  runoffCalculation: {
    totalRunoff: number;
    monsoonRunoff: number;
    nonMonsoonRunoff: number;
    runoffCoefficient: number;
  };
  infiltrationAnalysis: {
    infiltrationCapacity: number;
    permeability: number;
    soilInfiltrationRate: number;
    totalInfiltration: number;
  };
  rechargeZone: Array<{
    zone: string;
    percentage: number;
    rechargeRate: number;
    area: number;
    totalRecharge: number;
  }>;
  lakeRechargeImpact: {
    directRecharge: number;
    baseFlowContribution: number;
    totalLakeRecharge: number;
    rechargePercentageOfRainfall: number;
    annualStorageIncrement: number;
  };
  storageCapacity: {
    optimalCapacity: number;
    currentCapacity: number;
    deficitOrSurplus: number;
    capacityUtilization: number;
  };
  environmentalImpact: {
    groundwaterTable: number;
    springDischargePotential: number;
    wetlandRecharge: number;
    biodiversityIndex: number;
  };
  recommendations: string[];
}

// Fallback GEC 2015 calculation
function calculateGEC2015Fallback(
  lakeArea: number,
  catchmentArea: number,
  annualRainfall: number,
  soilType: string,
  landUse: string
): GEC2015Result {
  const soilInfiltrationRates: Record<string, number> = {
    sandy: 150,
    loamy: 75,
    clayey: 25,
    clay: 5,
  };

  const runoffCoefficients: Record<string, number> = {
    urban: 0.85,
    agricultural: 0.35,
    forest: 0.15,
    barren: 0.60,
  };

  const rechargePercentages: Record<string, number> = {
    sandy: 80,
    loamy: 50,
    clayey: 20,
    clay: 5,
  };

  const soilInfRate = soilInfiltrationRates[soilType] || 75;
  const runoffCoeff = runoffCoefficients[landUse] || 0.35;
  const rechargePerc = rechargePercentages[soilType] || 50;
  const monsoonMonths = 4;

  const monsoonRainfall = (annualRainfall * 0.75) * (monsoonMonths / 12);
  const nonMonsoonRainfall = annualRainfall * 0.25;
  const totalRainfall = annualRainfall * (catchmentArea / 10000);

  const monsoonRunoff = (monsoonRainfall * runoffCoeff * (catchmentArea / 10000)) / 1000;
  const nonMonsoonRunoff = (nonMonsoonRainfall * runoffCoeff * (catchmentArea / 10000)) / 1000;
  const totalRunoff = monsoonRunoff + nonMonsoonRunoff;

  const directInfiltration = (totalRainfall / 1000) * (rechargePerc / 100);

  const rechargeZones = [
    {
      zone: "High Recharge (Sandy soils, flat terrain)",
      percentage: soilType === "sandy" ? 60 : 30,
      rechargeRate: soilInfRate * 0.8,
    },
    {
      zone: "Medium Recharge (Loamy soils, moderate slope)",
      percentage: soilType === "loamy" ? 50 : 40,
      rechargeRate: soilInfRate * 0.5,
    },
    {
      zone: "Low Recharge (Clay soils, high slope)",
      percentage: soilType === "clay" ? 40 : 30,
      rechargeRate: soilInfRate * 0.2,
    },
  ];

  const directRecharge = (totalRainfall / 1000) * 0.95;
  const baseFlowContribution = (totalRunoff * 0.3);
  const totalLakeRecharge = directRecharge + baseFlowContribution;

  const optimalCapacity = annualRainfall * (catchmentArea / 10000) * 0.4;
  const storageIncrement = totalLakeRecharge * 0.7;

  const gwTableRise = (totalLakeRecharge / (catchmentArea / 10000)) * 10;
  const springPotential = totalLakeRecharge * 0.25;
  const wetlandRecharge = totalLakeRecharge * 0.15;

  return {
    inputParameters: {
      lakeArea,
      catchmentArea,
      annualRainfall,
      soilType,
      landUse,
      monsoonMonths,
    },
    rainfallAnalysis: {
      totalRainfall: totalRainfall / 1000,
      monsoonRainfall: monsoonRainfall / 1000,
      nonMonsoonRainfall: nonMonsoonRainfall / 1000,
      rainfallCoefficient: 0.95,
    },
    runoffCalculation: {
      totalRunoff,
      monsoonRunoff,
      nonMonsoonRunoff,
      runoffCoefficient: runoffCoeff,
    },
    infiltrationAnalysis: {
      infiltrationCapacity: soilInfRate,
      permeability: soilType === "sandy" ? 10 : soilType === "loamy" ? 5 : 1,
      soilInfiltrationRate: soilInfRate,
      totalInfiltration: directInfiltration,
    },
    rechargeZone: rechargeZones.map((z) => ({
      ...z,
      area: (catchmentArea * z.percentage) / 100,
      totalRecharge: ((catchmentArea * z.percentage) / 100) * (z.rechargeRate / 100),
    })),
    lakeRechargeImpact: {
      directRecharge,
      baseFlowContribution,
      totalLakeRecharge,
      rechargePercentageOfRainfall: (totalLakeRecharge / (totalRainfall / 1000)) * 100,
      annualStorageIncrement: storageIncrement,
    },
    storageCapacity: {
      optimalCapacity,
      currentCapacity: lakeArea * 0.5,
      deficitOrSurplus: (lakeArea * 0.5) - optimalCapacity,
      capacityUtilization: ((lakeArea * 0.5) / optimalCapacity) * 100,
    },
    environmentalImpact: {
      groundwaterTable: gwTableRise,
      springDischargePotential: springPotential,
      wetlandRecharge: wetlandRecharge,
      biodiversityIndex: 65 + (gwTableRise * 5),
    },
    recommendations: [
      `Promote ${soilType} soil conservation for enhanced infiltration`,
      `Implement ${landUse === "urban" ? "rainwater harvesting in urban areas" : "check dams and farm ponds"}`,
      `Focus on High Recharge zones for groundwater development`,
      `Monitor groundwater table rise of ${gwTableRise.toFixed(1)} mm/year`,
      `Maintain minimum ${(optimalCapacity * 0.3).toFixed(1)} Mm³ for ecological flow`,
    ],
  };
}

export default function GEC2015LakeRecharge() {
  const [lakeArea, setLakeArea] = useState(50);
  const [catchmentArea, setCatchmentArea] = useState(5000);
  const [annualRainfall, setAnnualRainfall] = useState(1200);
  const [soilType, setSoilType] = useState("loamy");
  const [landUse, setLandUse] = useState("agricultural");

  const [results, setResults] = useState<GEC2015Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/gec2015/lake-recharge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lakeArea, catchmentArea, annualRainfall, soilType, landUse }),
      });

      if (!response.ok) throw new Error("API unavailable");
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.log("Using fallback calculation");
      setResults(calculateGEC2015Fallback(lakeArea, catchmentArea, annualRainfall, soilType, landUse));
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "rainfall", label: "🌧️ Rainfall" },
    { id: "runoff", label: "🌊 Runoff" },
    { id: "recharge", label: "💧 Recharge" },
    { id: "zones", label: "🗺️ Zones" },
    { id: "storage", label: "🏞️ Storage" },
    { id: "impact", label: "🌍 Impact" },
  ];

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" }}>
          💧 GEC 2015 Lake Recharge Impact
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 32px 0" }}>
          Groundwater Estimation Committee 2015 - Rainfall-Runoff-Recharge Analysis
        </p>

        {/* Input */}
        <div style={{ background: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>⚙️ Lake & Catchment</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "16px" }}>
            <div>
              <label style={{ color: "#64748b", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Lake Area (km²)</label>
              <input type="number" value={lakeArea} onChange={e => setLakeArea(parseFloat(e.target.value) || 0)} min="0.1" max="500" step="0.1" style={{ width: "100%", padding: "8px", border: "2px solid #e2e8f0", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Catchment Area (km²)</label>
              <input type="number" value={catchmentArea} onChange={e => setCatchmentArea(parseFloat(e.target.value) || 0)} min="10" max="50000" step="10" style={{ width: "100%", padding: "8px", border: "2px solid #e2e8f0", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Annual Rainfall (mm)</label>
              <input type="number" value={annualRainfall} onChange={e => setAnnualRainfall(parseFloat(e.target.value) || 0)} min="200" max="5000" step="10" style={{ width: "100%", padding: "8px", border: "2px solid #e2e8f0", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Soil Type</label>
              <select value={soilType} onChange={e => setSoilType(e.target.value)} style={{ width: "100%", padding: "8px", border: "2px solid #e2e8f0", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: "#0f172a", background: "white", cursor: "pointer" }}>
                <option value="sandy">Sandy</option>
                <option value="loamy">Loamy</option>
                <option value="clayey">Clayey</option>
                <option value="clay">Clay</option>
              </select>
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Land Use</label>
              <select value={landUse} onChange={e => setLandUse(e.target.value)} style={{ width: "100%", padding: "8px", border: "2px solid #e2e8f0", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: "#0f172a", background: "white", cursor: "pointer" }}>
                <option value="urban">Urban</option>
                <option value="agricultural">Agricultural</option>
                <option value="forest">Forest</option>
                <option value="barren">Barren</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={handleCalculate} disabled={loading} style={{ padding: "8px 24px", borderRadius: "6px", border: "none", background: loading ? "#cbd5e1" : "#10b981", color: "white", fontSize: "13px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", width: "100%" }}>
                {loading ? "🔄 Computing..." : "🚀 Calculate"}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {results && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px", marginBottom: "24px" }}>
              {[
                { label: "Total Rainfall", val: results.rainfallAnalysis.totalRainfall.toFixed(1), unit: "Mm³", color: "#0284c7" },
                { label: "Total Runoff", val: results.runoffCalculation.totalRunoff.toFixed(2), unit: "Mm³", color: "#ef4444" },
                { label: "Lake Recharge", val: results.lakeRechargeImpact.totalLakeRecharge.toFixed(2), unit: "Mm³", color: "#10b981" },
                { label: "GW Rise", val: results.environmentalImpact.groundwaterTable.toFixed(1), unit: "mm/yr", color: "#06b6d4" },
              ].map((item, i) => (
                <div key={i} style={{ background: "white", padding: "12px", borderRadius: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.08)", borderLeft: `4px solid ${item.color}` }}>
                  <p style={{ color: "#94a3b8", fontSize: "8px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 3px 0" }}>{item.label}</p>
                  <p style={{ color: item.color, fontSize: "14px", fontWeight: "800", margin: "0" }}>{item.val}</p>
                  <p style={{ color: "#64748b", fontSize: "8px", margin: "0" }}>{item.unit}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "16px", flexWrap: "wrap" }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "6px 10px", borderRadius: "6px", border: "2px solid", background: activeTab === t.id ? "#10b981" : "white", color: activeTab === t.id ? "white" : "#10b981", borderColor: "#10b981", fontSize: "9px", fontWeight: "700", cursor: "pointer" }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Content Tabs */}
            {activeTab === "overview" && (
              <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "13px", fontWeight: "700", margin: "0 0 12px 0" }}>GEC 2015 Summary</h3>
                {[
                  { label: "Lake Recharge (Mm³/yr)", val: results.lakeRechargeImpact.totalLakeRecharge.toFixed(2) },
                  { label: "Storage Increment (Mm³)", val: results.lakeRechargeImpact.annualStorageIncrement.toFixed(2) },
                  { label: "GW Table Rise (mm/yr)", val: results.environmentalImpact.groundwaterTable.toFixed(1) },
                  { label: "Biodiversity Index", val: results.environmentalImpact.biodiversityIndex.toFixed(0) + "/100" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "8px 0", borderBottom: i < 3 ? "1px solid #f1f5f9" : "none" }}>
                    <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>{item.label}</p>
                    <p style={{ color: "#10b981", fontSize: "14px", fontWeight: "800", margin: "0" }}>{item.val}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "rainfall" && (
              <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { name: "Monsoon", value: results.rainfallAnalysis.monsoonRainfall },
                    { name: "Non-Monsoon", value: results.rainfallAnalysis.nonMonsoonRainfall },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <RechartTooltip />
                    <Bar dataKey="value" fill="#0284c7" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === "runoff" && (
              <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                {[
                  { label: "Total Runoff", val: results.runoffCalculation.totalRunoff.toFixed(2) + " Mm³/yr" },
                  { label: "Runoff Coefficient", val: (results.runoffCalculation.runoffCoefficient * 100).toFixed(0) + "%" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "10px", background: "#fef3c7", borderRadius: "6px", marginBottom: "8px" }}>
                    <p style={{ color: "#92400e", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>{item.label}</p>
                    <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "800", margin: "0" }}>{item.val}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "recharge" && (
              <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                {[
                  { label: "Direct Recharge", val: results.lakeRechargeImpact.directRecharge.toFixed(2) },
                  { label: "Baseflow Contribution", val: results.lakeRechargeImpact.baseFlowContribution.toFixed(2) },
                  { label: "Total", val: results.lakeRechargeImpact.totalLakeRecharge.toFixed(2), highlight: true },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "10px", background: item.highlight ? "#dcfce7" : "#f0fdf4", borderRadius: "6px", marginBottom: "8px" }}>
                    <p style={{ color: "#065f46", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>{item.label}</p>
                    <p style={{ color: item.highlight ? "#16a34a" : "#0f172a", fontSize: "13px", fontWeight: "800", margin: "0" }}>{item.val} Mm³/yr</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "zones" && (
              <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                {results.rechargeZone.map((zone, i) => (
                  <div key={i} style={{ padding: "10px", background: i === 0 ? "#dcfce7" : i === 1 ? "#fef3c7" : "#fee2e2", borderRadius: "6px", marginBottom: "8px" }}>
                    <p style={{ color: "#0f172a", fontSize: "11px", fontWeight: "700", margin: "0 0 4px 0" }}>{zone.zone}</p>
                    <p style={{ color: "#64748b", fontSize: "10px", margin: "0" }}>Area: {zone.area.toFixed(0)} km² | Recharge: {zone.totalRecharge.toFixed(1)} Mm³</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "storage" && (
              <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                {[
                  { label: "Optimal Capacity", val: results.storageCapacity.optimalCapacity.toFixed(2) },
                  { label: "Current Capacity", val: results.storageCapacity.currentCapacity.toFixed(2) },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "10px", background: "#f9f5ff", borderRadius: "6px", marginBottom: "8px" }}>
                    <p style={{ color: "#6b21a8", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>{item.label}</p>
                    <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "800", margin: "0" }}>{item.val} Mm³</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "impact" && (
              <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0 0 12px 0" }}>Recommendations</h3>
                {results.recommendations.map((rec, i) => (
                  <p key={i} style={{ color: "#065f46", fontSize: "10px", margin: "0 0 6px 0" }}>✓ {rec}</p>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
