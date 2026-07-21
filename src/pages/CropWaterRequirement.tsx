import Layout from "../components/Layout";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const API_BASE = "/api";

// Fallback crop data if API fails
const FALLBACK_CROPS = [
  { cropKey: "rice", cropName: "Rice (Paddy)", season: "Kharif", cropType: "Cereal", durationDays: 120, waterRequirementMM: 1200, waterRequirementMLHa: 12, irrigationMethod: "Flood/Drip", states: ["Punjab", "Haryana", "Odisha"] },
  { cropKey: "wheat", cropName: "Wheat", season: "Rabi", cropType: "Cereal", durationDays: 140, waterRequirementMM: 450, waterRequirementMLHa: 4.5, irrigationMethod: "Flood/Sprinkler", states: ["Punjab", "Haryana", "UP"] },
  { cropKey: "cotton", cropName: "Cotton", season: "Kharif", cropType: "Cash Crop", durationDays: 180, waterRequirementMM: 650, waterRequirementMLHa: 6.5, irrigationMethod: "Drip/Sprinkler", states: ["Gujarat", "Maharashtra"] },
  { cropKey: "sugarcane", cropName: "Sugarcane", season: "Kharif/Rabi", cropType: "Cash Crop", durationDays: 360, waterRequirementMM: 2000, waterRequirementMLHa: 20, irrigationMethod: "Flood/Drip", states: ["UP", "Maharashtra", "Karnataka"] },
  { cropKey: "maize", cropName: "Maize (Corn)", season: "Kharif/Rabi", cropType: "Cereal", durationDays: 120, waterRequirementMM: 450, waterRequirementMLHa: 4.5, irrigationMethod: "Sprinkler/Drip", states: ["Karnataka", "MP"] },
  { cropKey: "potato", cropName: "Potato", season: "Rabi", cropType: "Vegetable", durationDays: 90, waterRequirementMM: 450, waterRequirementMLHa: 4.5, irrigationMethod: "Drip/Sprinkler", states: ["UP", "Bihar", "Punjab"] },
];

interface CropCalcResult {
  cropKey: string;
  cropName: string;
  areaHectares: number;
  season: string;
  seasonalFactor: number;
  waterRequirementMLHa: number;
  totalWaterML: string;
  totalWaterM3: string;
  estimatedCostRupees: string;
  growthStages: Record<string, { days: number; waterMM: number }>;
  irrigationSchedule: string;
  fieldCapacity: number;
  wiltingPoint: number;
}

export default function CropWaterRequirement() {
  const [crops] = useState(FALLBACK_CROPS);
  const [selectedCrop, setSelectedCrop] = useState("rice");
  const [areaHa, setAreaHa] = useState(10);
  const [season, setSeason] = useState("normal");
  const [result, setResult] = useState<CropCalcResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/crop-water/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropKey: selectedCrop,
          areaHectares: areaHa,
          season,
        }),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Calculation error:", err);
      // Use fallback calculation
      const crop = crops.find(c => c.cropKey === selectedCrop);
      if (crop) {
        const waterPerHa = crop.waterRequirementMLHa;
        let seasonalFactor = 1.0;
        if (season === "dry") seasonalFactor = 1.2;
        if (season === "wet") seasonalFactor = 0.8;
        
        const totalWaterML = areaHa * waterPerHa;
        const totalWaterM3 = totalWaterML * 1000 * seasonalFactor;
        const costPerM3 = 6;
        const totalCost = totalWaterM3 * costPerM3;

        setResult({
          cropKey: selectedCrop,
          cropName: crop.cropName,
          areaHectares: areaHa,
          season,
          seasonalFactor,
          waterRequirementMLHa: waterPerHa,
          totalWaterML: totalWaterML.toFixed(2),
          totalWaterM3: totalWaterM3.toFixed(2),
          estimatedCostRupees: totalCost.toFixed(2),
          growthStages: { stage1: { days: 40, waterMM: 300 }, stage2: { days: 60, waterMM: 700 }, stage3: { days: 20, waterMM: 200 } },
          irrigationSchedule: "Multiple irrigations based on soil moisture",
          fieldCapacity: 0.28,
          wiltingPoint: 0.12,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const currentCrop = crops.find(c => c.cropKey === selectedCrop);

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" }}>
          🌾 Crop-wise Water Requirement
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 32px 0" }}>
          Latest data for Indian crops with seasonal variations
        </p>

        {/* Input */}
        <div style={{ background: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Crop</label>
              <select value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)} style={{
                width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#0f172a", background: "white", cursor: "pointer",
              }}>
                {crops.map(c => (
                  <option key={c.cropKey} value={c.cropKey}>{c.cropName} ({c.season})</option>
                ))}
              </select>
              {currentCrop && (
                <p style={{ color: "#94a3b8", fontSize: "11px", margin: "6px 0 0 0" }}>
                  Duration: {currentCrop.durationDays} days | Water: {currentCrop.waterRequirementMLHa} ML/ha
                </p>
              )}
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Area (Hectares)</label>
              <input type="number" value={areaHa} onChange={e => setAreaHa(parseFloat(e.target.value) || 0)} min="0.1" max="10000" style={{
                width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#0f172a",
              }} />
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Season</label>
              <select value={season} onChange={e => setSeason(e.target.value)} style={{
                width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#0f172a", background: "white", cursor: "pointer",
              }}>
                <option value="wet">Wet (Low need)</option>
                <option value="normal">Normal</option>
                <option value="dry">Dry (High need)</option>
              </select>
            </div>
          </div>

          <button onClick={handleCalculate} disabled={loading} style={{
            padding: "12px 36px", borderRadius: "8px", border: "none", background: loading ? "#cbd5e1" : "#0284c7",
            color: "white", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "🔄 Calculating..." : "📊 Calculate"}
          </button>
          {error && <div style={{ color: "#dc2626", fontSize: "12px", marginTop: "8px" }}>⚠️ {error}</div>}
        </div>

        {/* Results */}
        {result && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              {[
                { label: "Total Water (ML)", val: parseFloat(result.totalWaterML).toFixed(1), color: "#0284c7" },
                { label: "Total Water (m³)", val: (parseFloat(result.totalWaterM3) / 1000).toFixed(1) + "K", color: "#10b981" },
                { label: "Cost (₹)", val: "₹" + (parseFloat(result.estimatedCostRupees) / 100000).toFixed(1) + "L", color: "#f97316" },
                { label: "Seasonal Factor", val: result.seasonalFactor.toFixed(2) + "x", color: "#8b5cf6" },
              ].map((item, i) => (
                <div key={i} style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: `4px solid ${item.color}` }}>
                  <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 6px 0" }}>{item.label}</p>
                  <p style={{ color: item.color, fontSize: "24px", fontWeight: "800", margin: "0" }}>{item.val}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>📋 Crop Details</h3>
                {[
                  { label: "Crop", val: result.cropName },
                  { label: "Area", val: `${result.areaHectares} ha` },
                  { label: "Water/ha", val: `${result.waterRequirementMLHa} ML` },
                  { label: "Field Capacity", val: `${(result.fieldCapacity * 100).toFixed(0)}%` },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 3 ? "1px solid #f1f5f9" : "none" }}>
                    <p style={{ color: "#64748b", fontSize: "12px", margin: "0" }}>{item.label}</p>
                    <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "700", margin: "0" }}>{item.val}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>🚜 Irrigation Schedule</h3>
                <p style={{ color: "#0f172a", fontSize: "13px", lineHeight: "1.6", margin: "0" }}>
                  {result.irrigationSchedule}
                </p>
              </div>
            </div>

            {/* Growth Stages Chart */}
            {Object.keys(result.growthStages).length > 0 && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>📈 Growth Stages</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Object.entries(result.growthStages).map(([stage, data]) => ({
                    stage: stage.replace(/_/g, ' '),
                    days: data.days,
                    waterMM: data.waterMM,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="waterMM" fill="#0284c7" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
