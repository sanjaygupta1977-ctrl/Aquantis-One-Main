import Layout from "../components/Layout";
import { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const API_BASE = "/api";

const FALLBACK_LULC_CLASSES = [
  { lulcKey: "built_up", code: "BuiltUp", name: "Built-up Area", description: "Urban, towns, villages", color: "#FF0000", waterDemandMLHa: 2.5, waterUsageType: "Domestic", percentageInIndia: 8.5 },
  { lulcKey: "agricultural_kharif", code: "AgriKharif", name: "Agricultural Kharif", description: "Rainfed/Irrigated crops", color: "#FFFF00", waterDemandMLHa: 8.0, waterUsageType: "Irrigation", percentageInIndia: 22 },
  { lulcKey: "agricultural_rabi", code: "AgriRabi", name: "Agricultural Rabi", description: "Winter season crops", color: "#90EE90", waterDemandMLHa: 5.5, waterUsageType: "Irrigation", percentageInIndia: 18 },
  { lulcKey: "forests", code: "Forest", name: "Forests", description: "Dense vegetation", color: "#228B22", waterDemandMLHa: 3.2, waterUsageType: "ET", percentageInIndia: 21 },
  { lulcKey: "scrubland", code: "Scrub", name: "Scrub Land", description: "Sparse vegetation", color: "#CD853F", waterDemandMLHa: 1.5, waterUsageType: "Limited ET", percentageInIndia: 12 },
  { lulcKey: "water_bodies", code: "Water", name: "Water Bodies", description: "Rivers, lakes", color: "#0099FF", waterDemandMLHa: 0, waterUsageType: "Source", percentageInIndia: 5 },
  { lulcKey: "barren", code: "Barren", name: "Barren Terrain", description: "Rocks, desert", color: "#999999", waterDemandMLHa: 0, waterUsageType: "None", percentageInIndia: 10 },
  { lulcKey: "plantation", code: "Plantation", name: "Plantations", description: "Tea, Coffee", color: "#CCFF00", waterDemandMLHa: 6.0, waterUsageType: "Irrigation", percentageInIndia: 3.5 },
];

interface LULCAnalysisResult {
  totalAreaHectares: number;
  averageWaterDemandMLHa: string;
  totalWaterDemandML: string;
  totalWaterDemandM3: string;
  breakdown: Array<{
    lulcClass: string;
    percentage: number;
    areaHectares: string;
    waterDemandMLHa: number;
    totalWaterML: string;
  }>;
}

export default function LULCAnalysis() {
  const [lulcClasses] = useState(FALLBACK_LULC_CLASSES);
  const [totalAreaHa, setTotalAreaHa] = useState(1000);
  const [distribution, setDistribution] = useState<Record<string, number>>({
    built_up: 8.5,
    agricultural_kharif: 22,
    agricultural_rabi: 18,
    forests: 21,
    scrubland: 12,
    water_bodies: 5,
    barren: 10,
    plantation: 3.5,
  });
  const [result, setResult] = useState<LULCAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/crop-water/lulc/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lulcDistribution: distribution,
          totalAreaHa: totalAreaHa,
        }),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      // Fallback calculation
      let totalWaterDemandMLHa = 0;
      let breakdown: Array<{ lulcClass: string; percentage: number; areaHectares: string; waterDemandMLHa: number; totalWaterML: string }> = [];

      Object.entries(distribution).forEach(([lulcKey, percentage]) => {
        const lulcClass = lulcClasses.find(l => l.lulcKey === lulcKey);
        if (lulcClass) {
          const areaHa = (percentage / 100) * totalAreaHa;
          const waterMLHa = lulcClass.waterDemandMLHa;
          const totalWaterML = areaHa * waterMLHa;
          const contribution = (waterMLHa * percentage) / 100;

          totalWaterDemandMLHa += contribution;
          breakdown.push({
            lulcClass: lulcClass.name,
            percentage,
            areaHectares: areaHa.toFixed(2),
            waterDemandMLHa: waterMLHa,
            totalWaterML: totalWaterML.toFixed(2),
          });
        }
      });

      const totalWaterDemandML = (totalWaterDemandMLHa * totalAreaHa).toFixed(2);
      const totalWaterDemandM3 = (totalWaterDemandML as any * 1000).toFixed(2);

      setResult({
        totalAreaHectares: totalAreaHa,
        averageWaterDemandMLHa: totalWaterDemandMLHa.toFixed(2),
        totalWaterDemandML,
        totalWaterDemandM3,
        breakdown,
      });
    } finally {
      setLoading(false);
    }
  };

  const pieData = lulcClasses.map(lc => ({
    name: lc.code,
    value: distribution[lc.lulcKey] || 0,
    color: lc.color,
  })).filter(d => d.value > 0);

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" }}>
          🗺️ LULC Analysis & Water Demand
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 32px 0" }}>
          Land Use/Land Cover classification with water demand assessment
        </p>

        {/* Input */}
        <div style={{ background: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Total Area (Hectares)</label>
            <input type="number" value={totalAreaHa} onChange={e => setTotalAreaHa(parseFloat(e.target.value) || 0)} min="10" max="1000000" style={{
              width: "100%", maxWidth: "300px", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#0f172a",
            }} />
          </div>

          {/* LULC Distribution */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>📊 LULC Distribution (%)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
              {lulcClasses.map(lc => (
                <div key={lc.lulcKey} style={{ background: "#f0f9ff", padding: "14px", borderRadius: "10px", borderLeft: `4px solid ${lc.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0" }}>{lc.name}</label>
                    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                      <input type="number" value={distribution[lc.lulcKey] || 0} onChange={e => setDistribution({ ...distribution, [lc.lulcKey]: parseFloat(e.target.value) || 0 })} min="0" max="100" style={{
                        width: "50px", padding: "4px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "12px", textAlign: "center",
                      }} />
                      <span style={{ color: "#64748b", fontSize: "11px" }}>%</span>
                    </div>
                  </div>
                  <p style={{ color: "#64748b", fontSize: "11px", margin: "0 0 4px 0" }}>{lc.description}</p>
                  <p style={{ color: "#0284c7", fontSize: "11px", fontWeight: "700", margin: "0" }}>Demand: {lc.waterDemandMLHa} ML/ha</p>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleCalculate} disabled={loading} style={{
            padding: "12px 36px", borderRadius: "8px", border: "none", background: loading ? "#cbd5e1" : "#0284c7",
            color: "white", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "🔄 Analyzing..." : "🔍 Analyze Water Demand"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              {[
                { label: "Total Water (ML)", val: parseFloat(result.totalWaterDemandML).toFixed(1), color: "#0284c7" },
                { label: "Total Water (m³)", val: (parseFloat(result.totalWaterDemandM3) / 1000).toFixed(2) + "K", color: "#10b981" },
                { label: "Avg Demand/ha", val: parseFloat(result.averageWaterDemandMLHa).toFixed(2) + " ML", color: "#f97316" },
                { label: "Total Area", val: result.totalAreaHectares + " ha", color: "#8b5cf6" },
              ].map((item, i) => (
                <div key={i} style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: `4px solid ${item.color}` }}>
                  <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 6px 0" }}>{item.label}</p>
                  <p style={{ color: item.color, fontSize: "20px", fontWeight: "800", margin: "0" }}>{item.val}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>LULC Distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value.toFixed(1)}%`} outerRadius={80} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${(value as number).toFixed(1)}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>Water Demand by LULC</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={result.breakdown.sort((a, b) => parseFloat(b.totalWaterML) - parseFloat(a.totalWaterML))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="lulcClass" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(v) => `${parseFloat(v as string).toFixed(1)} ML`} />
                    <Bar dataKey="totalWaterML" fill="#0284c7" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>📋 Detailed Breakdown</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ background: "#f0f9ff", borderBottom: "2px solid #0284c7" }}>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>LULC Class</th>
                      <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>%</th>
                      <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Area (ha)</th>
                      <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Demand/ha</th>
                      <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Total (ML)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.breakdown.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                        <td style={{ padding: "10px 12px", color: "#0f172a" }}>{row.lulcClass}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center", color: "#0284c7", fontWeight: "700" }}>{row.percentage.toFixed(1)}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center", color: "#0f172a" }}>{parseFloat(row.areaHectares).toFixed(0)}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center", color: "#0f172a" }}>{row.waterDemandMLHa}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center", color: "#10b981", fontWeight: "700" }}>{parseFloat(row.totalWaterML).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
