import Layout from "../components/Layout";
import { useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE = "/api";

interface RODesignResult {
  feedWaterQuality: {
    tds: number;
    turbidity: number;
    sdi: number;
    cod: number;
    temperature: number;
  };
  membraneSelection: {
    type: string;
    material: string;
    poreSize: number;
    area: number;
    manufacturer: string;
  };
  systemDesign: {
    feedFlow: number;
    productFlow: number;
    rejectFlow: number;
    stages: number;
    membranesPerStage: number;
  };
  performancePrediction: {
    waterFlux: number;
    saltRejection: number;
    productTDS: number;
    recovery: number;
    operatingPressure: number;
  };
  energyCalculation: {
    hydraulicPower: number;
    pumpEfficiency: number;
    specificEnergyConsumption: number;
    annualEnergyCost: number;
  };
  maintenanceSchedule: {
    prefilterInterval: number;
    cartridgeInterval: number;
    membraneCleaningFrequency: string;
    membraneReplacementLife: number;
    cip: string;
  };
  costAnalysis: {
    capitalCost: number;
    annualOperatingCost: number;
    costPerM3: number;
    paybackPeriod: number;
  };
}

// Fallback RO calculation
function calculateRODesignFallback(
  feedFlow: number,
  feedTDS: number,
  _productTDS: number,
  temperature: number,
  feedType: string
): RODesignResult {
  // Van't Hoff equation for osmotic pressure
  const osmoPressure = (0.0831 * temperature * (feedTDS / 642)) / 0.987;
  
  // Design parameters by water type
  const designParams: Record<string, { sdi: number; turbidity: number; flux: number; rejection: number; recovery: number }> = {
    textile: { sdi: 3.0, turbidity: 2.0, flux: 12, rejection: 98.5, recovery: 75 },
    dairy: { sdi: 2.5, turbidity: 1.5, flux: 10, rejection: 99.0, recovery: 80 },
    semiconductor: { sdi: 1.0, turbidity: 0.5, flux: 8, rejection: 99.8, recovery: 85 },
    municipal: { sdi: 4.0, turbidity: 3.0, flux: 13, rejection: 98.0, recovery: 70 },
  };

  const params = designParams[feedType] || designParams.municipal;
  
  // Calculate required membrane area
  const membraneArea = (feedFlow / params.flux) * 1000 / 1000; // Convert m³/day to L/day, then to m²
  const numMembranes = Math.ceil(membraneArea / 40); // Each membrane ~40 m²
  const numStages = Math.ceil(numMembranes / 6); // Max 6 membranes per stage in series
  
  // Flow calculations
  const productFlow = (feedFlow * params.recovery) / 100;
  const rejectFlow = feedFlow - productFlow;
  
  // Pressure calculations
  const operatingPressure = osmoPressure * 1.3 + 2; // 30% safety margin + system losses
  
  // Product water quality
  const actualProductTDS = (feedTDS * (100 - params.rejection)) / 100;
  
  // Energy calculation
  const hydraulicPower = (operatingPressure * feedFlow * 100) / 3600 / 75; // Convert to kW
  const pumpEff = 0.85;
  const actualPower = hydraulicPower / pumpEff;
  const specificEnergy = (actualPower / productFlow) * 24; // kWh/m³
  const annualEnergy = actualPower * 365 * 24;
  
  // Cost analysis
  const capitalCost = numMembranes * 50000 + membraneArea * 2000 + 500000; // Membrane + housings + pump/motor
  const annualMembraneCost = (capitalCost * 0.15) / 10; // 15% for maintenance, 10-year life
  const annualEnergyCost = annualEnergy * 8; // ₹8 per kWh
  const annualOperatingCost = annualMembraneCost + annualEnergyCost + (productFlow * 365 * 10); // ₹10/m³ misc
  
  const costPerM3 = annualOperatingCost / (productFlow * 365);
  const payback = capitalCost / (annualOperatingCost * 1000); // Payback in months converted to years
  
  return {
    feedWaterQuality: {
      tds: feedTDS,
      turbidity: params.turbidity,
      sdi: params.sdi,
      cod: feedType === "textile" ? 150 : feedType === "dairy" ? 200 : 50,
      temperature,
    },
    membraneSelection: {
      type: "Thin-Film Composite (TFC)",
      material: "Polyamide",
      poreSize: 0.0001,
      area: membraneArea,
      manufacturer: "Dow/GE/Hydranautics",
    },
    systemDesign: {
      feedFlow,
      productFlow,
      rejectFlow,
      stages: numStages,
      membranesPerStage: Math.ceil(numMembranes / numStages),
    },
    performancePrediction: {
      waterFlux: params.flux,
      saltRejection: params.rejection,
      productTDS: actualProductTDS,
      recovery: params.recovery,
      operatingPressure,
    },
    energyCalculation: {
      hydraulicPower,
      pumpEfficiency: pumpEff,
      specificEnergyConsumption: specificEnergy,
      annualEnergyCost,
    },
    maintenanceSchedule: {
      prefilterInterval: 30,
      cartridgeInterval: 90,
      membraneCleaningFrequency: "Every 3-6 months or when pressure drop exceeds 0.5 bar",
      membraneReplacementLife: 10,
      cip: "Chemical-In-Place: Citric acid (pH 3.0), NaOH (pH 11.5), Biocide quarterly",
    },
    costAnalysis: {
      capitalCost,
      annualOperatingCost,
      costPerM3,
      paybackPeriod: payback,
    },
  };
}

export default function RODesignCalculator() {
  const [feedFlow, setFeedFlow] = useState(100);
  const [feedTDS, setFeedTDS] = useState(2000);
  const [temperature] = useState(25);
  const [feedType, setFeedType] = useState("textile");
  
  const [results, setResults] = useState<RODesignResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/ro-design/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedFlow, feedTDS, temperature, feedType }),
      });

      if (!response.ok) throw new Error("API unavailable");
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.log("Using fallback calculation");
      setResults(calculateRODesignFallback(feedFlow, feedTDS, 500, temperature, feedType));
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "feed", label: "💧 Feed Water" },
    { id: "membrane", label: "🔬 Membrane Selection" },
    { id: "design", label: "⚙️ System Design" },
    { id: "performance", label: "📊 Performance" },
    { id: "energy", label: "⚡ Energy" },
    { id: "maintenance", label: "🔧 Maintenance" },
    { id: "cost", label: "💰 Cost Analysis" },
  ];

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" }}>
          💧 Reverse Osmosis (RO) Design Calculator
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 32px 0" }}>
          Membrane system design, sizing, & performance prediction
        </p>

        {/* Input */}
        <div style={{ background: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>⚙️ RO System Parameters</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Feed Flow (m³/day)</label>
              <input type="number" value={feedFlow} onChange={e => setFeedFlow(parseFloat(e.target.value) || 0)} min="1" max="1000" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Feed TDS (mg/L)</label>
              <input type="number" value={feedTDS} onChange={e => setFeedTDS(parseFloat(e.target.value) || 0)} min="100" max="10000" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Feed Water Type</label>
              <select value={feedType} onChange={e => setFeedType(e.target.value)} style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a", background: "white", cursor: "pointer" }}>
                <option value="textile">Textile Wastewater</option>
                <option value="dairy">Dairy Wastewater</option>
                <option value="semiconductor">Semiconductor DI Water</option>
                <option value="municipal">Municipal Wastewater</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={handleCalculate} disabled={loading} style={{ padding: "10px 32px", borderRadius: "8px", border: "none", background: loading ? "#cbd5e1" : "#0284c7", color: "white", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", width: "100%" }}>
                {loading ? "🔄 Calculating..." : "🚀 Design RO System"}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {results && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "28px" }}>
              {[
                { label: "Product Flow", val: results.systemDesign.productFlow.toFixed(1), unit: "m³/day", color: "#0284c7" },
                { label: "Recovery", val: results.performancePrediction.recovery.toFixed(1), unit: "%", color: "#10b981" },
                { label: "Salt Rejection", val: results.performancePrediction.saltRejection.toFixed(1), unit: "%", color: "#8b5cf6" },
                { label: "Operating Pressure", val: results.performancePrediction.operatingPressure.toFixed(1), unit: "bar", color: "#f97316" },
                { label: "Energy/m³", val: results.energyCalculation.specificEnergyConsumption.toFixed(2), unit: "kWh", color: "#06b6d4" },
              ].map((item, i) => (
                <div key={i} style={{ background: "white", padding: "14px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: `4px solid ${item.color}` }}>
                  <p style={{ color: "#94a3b8", fontSize: "9px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 4px 0" }}>{item.label}</p>
                  <p style={{ color: item.color, fontSize: "16px", fontWeight: "800", margin: "0" }}>{item.val}</p>
                  <p style={{ color: "#64748b", fontSize: "9px", margin: "0" }}>{item.unit}</p>
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

            {/* Feed Water Tab */}
            {activeTab === "feed" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Feed Water Quality Analysis</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {[
                    { label: "TDS", val: results.feedWaterQuality.tds, unit: "mg/L" },
                    { label: "Turbidity", val: results.feedWaterQuality.turbidity, unit: "NTU" },
                    { label: "SDI", val: results.feedWaterQuality.sdi, unit: "SDI" },
                    { label: "COD", val: results.feedWaterQuality.cod, unit: "mg/L" },
                    { label: "Temperature", val: results.feedWaterQuality.temperature, unit: "°C" },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
                      <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", margin: "0 0 4px 0" }}>{item.label}</p>
                      <p style={{ color: "#0284c7", fontSize: "18px", fontWeight: "800", margin: "0 0 2px 0" }}>{item.val.toFixed(1)}</p>
                      <p style={{ color: "#94a3b8", fontSize: "10px", margin: "0" }}>{item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Membrane Tab */}
            {activeTab === "membrane" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Membrane Selection</h3>
                {[
                  { label: "Type", val: results.membraneSelection.type },
                  { label: "Material", val: results.membraneSelection.material },
                  { label: "Pore Size", val: results.membraneSelection.poreSize + " μm" },
                  { label: "Total Area", val: results.membraneSelection.area.toFixed(1) + " m²" },
                  { label: "Manufacturer", val: results.membraneSelection.manufacturer },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "12px", background: i % 2 === 0 ? "#f8fafc" : "white", borderBottom: i < 4 ? "1px solid #e2e8f0" : "none" }}>
                    <p style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", margin: "0 0 4px 0" }}>{item.label}</p>
                    <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "600", margin: "0" }}>{item.val}</p>
                  </div>
                ))}
              </div>
            )}

            {/* System Design Tab */}
            {activeTab === "design" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>System Design</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={[
                      { name: "Product", value: results.systemDesign.productFlow },
                      { name: "Reject", value: results.systemDesign.rejectFlow },
                    ]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value.toFixed(1)} m³/day`}>
                      <Cell fill="#0284c7" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <RechartTooltip formatter={(v) => `${(v as number).toFixed(1)} m³/day`} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[
                    { label: "Feed Flow", val: results.systemDesign.feedFlow.toFixed(1), unit: "m³/day" },
                    { label: "Product Flow", val: results.systemDesign.productFlow.toFixed(1), unit: "m³/day" },
                    { label: "Reject Flow", val: results.systemDesign.rejectFlow.toFixed(1), unit: "m³/day" },
                    { label: "Stages", val: results.systemDesign.stages, unit: "series" },
                    { label: "Membranes/Stage", val: results.systemDesign.membranesPerStage, unit: "parallel" },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: "12px", background: "#f0f9ff", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
                      <p style={{ color: "#64748b", fontSize: "10px", fontWeight: "700", margin: "0 0 4px 0" }}>{item.label}</p>
                      <p style={{ color: "#0284c7", fontSize: "16px", fontWeight: "800", margin: "0 0 2px 0" }}>{item.val}</p>
                      <p style={{ color: "#94a3b8", fontSize: "9px", margin: "0" }}>{item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === "performance" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Performance Prediction</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={[
                    { name: "Feed TDS", value: results.feedWaterQuality.tds },
                    { name: "Product TDS", value: results.performancePrediction.productTDS },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <RechartTooltip />
                    <Bar dataKey="value" fill="#0284c7" />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[
                    { label: "Water Flux", val: results.performancePrediction.waterFlux.toFixed(1), unit: "L/m²/h" },
                    { label: "Salt Rejection", val: results.performancePrediction.saltRejection.toFixed(1), unit: "%" },
                    { label: "Product TDS", val: results.performancePrediction.productTDS.toFixed(1), unit: "mg/L" },
                    { label: "Recovery", val: results.performancePrediction.recovery.toFixed(1), unit: "%" },
                    { label: "Operating Pressure", val: results.performancePrediction.operatingPressure.toFixed(1), unit: "bar" },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: "12px", background: "#f0fdf4", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
                      <p style={{ color: "#64748b", fontSize: "10px", fontWeight: "700", margin: "0 0 4px 0" }}>{item.label}</p>
                      <p style={{ color: "#10b981", fontSize: "16px", fontWeight: "800", margin: "0 0 2px 0" }}>{item.val}</p>
                      <p style={{ color: "#94a3b8", fontSize: "9px", margin: "0" }}>{item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Energy Tab */}
            {activeTab === "energy" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Energy Consumption Analysis</h3>
                {[
                  { label: "Hydraulic Power", val: results.energyCalculation.hydraulicPower.toFixed(2), unit: "kW" },
                  { label: "Pump Efficiency", val: (results.energyCalculation.pumpEfficiency * 100).toFixed(1), unit: "%" },
                  { label: "Specific Energy", val: results.energyCalculation.specificEnergyConsumption.toFixed(2), unit: "kWh/m³" },
                  { label: "Annual Energy", val: (results.energyCalculation.annualEnergyCost / 8).toFixed(0), unit: "kWh" },
                  { label: "Annual Energy Cost", val: "₹" + (results.energyCalculation.annualEnergyCost / 100000).toFixed(1), unit: "Lakh" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "12px", background: i % 2 === 0 ? "#fef3c7" : "white", borderBottom: i < 4 ? "1px solid #e2e8f0" : "none" }}>
                    <p style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", margin: "0 0 4px 0" }}>{item.label}</p>
                    <p style={{ color: "#f97316", fontSize: "16px", fontWeight: "800", margin: "0" }}>{item.val}</p>
                    <p style={{ color: "#94a3b8", fontSize: "9px", margin: "0" }}>{item.unit}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === "maintenance" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Maintenance Schedule</h3>
                {[
                  { label: "Prefilter Change", val: "Every " + results.maintenanceSchedule.prefilterInterval + " days" },
                  { label: "Cartridge Filter", val: "Every " + results.maintenanceSchedule.cartridgeInterval + " days" },
                  { label: "Membrane Cleaning", val: results.maintenanceSchedule.membraneCleaningFrequency },
                  { label: "Membrane Life", val: results.maintenanceSchedule.membraneReplacementLife + " years" },
                  { label: "CIP Protocol", val: results.maintenanceSchedule.cip },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "14px", background: "#f0f9ff", borderRadius: "8px", marginBottom: "8px", borderLeft: "4px solid #0284c7" }}>
                    <p style={{ color: "#0284c7", fontSize: "12px", fontWeight: "700", margin: "0 0 4px 0" }}>{item.label}</p>
                    <p style={{ color: "#0f172a", fontSize: "12px", margin: "0" }}>{item.val}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Cost Tab */}
            {activeTab === "cost" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Cost Analysis</h3>
                {[
                  { label: "Capital Cost", val: "₹" + (results.costAnalysis.capitalCost / 1000000).toFixed(1), unit: "Million" },
                  { label: "Annual Operating Cost", val: "₹" + (results.costAnalysis.annualOperatingCost / 100000).toFixed(1), unit: "Lakh" },
                  { label: "Cost per m³", val: "₹" + results.costAnalysis.costPerM3.toFixed(0), unit: "/m³" },
                  { label: "Payback Period", val: (results.costAnalysis.paybackPeriod * 12).toFixed(1), unit: "months" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "14px", background: "#f9f5ff", borderRadius: "8px", marginBottom: "8px", borderLeft: "4px solid #8b5cf6" }}>
                    <p style={{ color: "#8b5cf6", fontSize: "12px", fontWeight: "700", margin: "0 0 4px 0" }}>{item.label}</p>
                    <p style={{ color: "#0f172a", fontSize: "16px", fontWeight: "800", margin: "0" }}>{item.val}</p>
                    <p style={{ color: "#94a3b8", fontSize: "9px", margin: "0" }}>{item.unit}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
