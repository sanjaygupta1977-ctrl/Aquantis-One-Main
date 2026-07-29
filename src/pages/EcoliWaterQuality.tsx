import Layout from "../components/Layout";
import { useState } from "react";
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE = "/api";

interface EcoliResult {
  sampleAnalysis: {
    ecoli_count: number;
    unit: string;
    detection_method: string;
    temperature: number;
    ph: number;
    turbidity: number;
  };
  riskAssessment: {
    risk_level: string;
    safety_status: string;
    health_implications: string[];
    vulnerable_populations: string[];
  };
  standards: {
    who_standard: number;
    epa_standard: number;
    india_standard: number;
    user_standard_compliant: boolean;
  };
  treatment: {
    recommended_methods: string[];
    chlorination_dose: number;
    uv_intensity: number;
    boiling_time: number;
    effectiveness: number;
  };
  monitoring: {
    repeat_test_interval: string;
    monitoring_points: string[];
    compliance_tracking: boolean;
  };
  reportData: Array<{ method: string; effectiveness: number }>;
}

function calculateEcoliQuality(ecoli_count: number, detection_method: string, _water_source: string): EcoliResult {
  // Risk levels based on CFU/100mL
  const getRiskLevel = (count: number) => {
    if (count === 0) return "Safe";
    if (count <= 2.2) return "Low Risk";
    if (count <= 10) return "Moderate Risk";
    if (count <= 100) return "High Risk";
    return "Critical Risk";
  };

  const getHealthImplications = (count: number) => {
    if (count === 0) return ["No health risk from E. coli"];
    if (count <= 2.2) return ["Minimal risk for healthy individuals", "Potential risk for immunocompromised"];
    if (count <= 10) return ["Risk of gastrointestinal illness", "Avoid for drinking without treatment"];
    if (count <= 100) return ["Significant health hazard", "Risk of severe illness", "Treatment mandatory"];
    return ["Critical public health emergency", "Do not consume", "Immediate treatment required", "Risk of outbreak"];
  };

  const riskLevel = getRiskLevel(ecoli_count);
  const healthImplications = getHealthImplications(ecoli_count);

  // Treatment recommendations
  const getTreatmentMethods = (count: number) => {
    if (count === 0) return ["No treatment needed"];
    if (count <= 2.2) return ["Boiling (1 minute)", "Filtration"];
    if (count <= 10) return ["Chlorination (0.2-0.5 mg/L)", "UV treatment", "Boiling"];
    if (count <= 100) return ["Advanced oxidation", "Combined chlorination + filtration", "Membrane filtration"];
    return ["Multiple treatment stages", "Ozone treatment", "Reverse osmosis", "Professional intervention needed"];
  };

  const treatmentMethods = getTreatmentMethods(ecoli_count);
  
  // Chlorination dose (mg/L) - adjusted for MPN
  const chlorinationDose = Math.max(0.2, Math.min(5, ecoli_count / 20));
  
  // UV intensity (mJ/cm²) - adjusted for MPN
  const uvIntensity = Math.max(10, Math.min(400, ecoli_count * 2));
  
  // Boiling time (minutes) - adjusted for MPN
  const boilingTime = ecoli_count === 0 ? 0 : Math.max(1, Math.min(10, ecoli_count / 20));

  return {
    sampleAnalysis: {
      ecoli_count,
      unit: "MPN/100mL",
      detection_method,
      temperature: 22,
      ph: 7.2,
      turbidity: 0.5,
    },
    riskAssessment: {
      risk_level: riskLevel,
      safety_status: ecoli_count === 0 ? "SAFE - Meets all standards" : "NOT SAFE",
      health_implications: healthImplications,
      vulnerable_populations: ["Infants", "Elderly", "Immunocompromised", "Pregnant women"],
    },
    standards: {
      who_standard: 0,
      epa_standard: 0,
      india_standard: 0,
      user_standard_compliant: ecoli_count === 0,
    },
    treatment: {
      recommended_methods: treatmentMethods,
      chlorination_dose: chlorinationDose,
      uv_intensity: uvIntensity,
      boiling_time: boilingTime,
      effectiveness: Math.min(99.99, 95 + (ecoli_count > 0 ? 4.99 : 0)),
    },
    monitoring: {
      repeat_test_interval: ecoli_count === 0 ? "Monthly" : ecoli_count <= 10 ? "Weekly" : "Daily",
      monitoring_points: ["Intake", "Distribution", "End-user", "Treatment plant"],
      compliance_tracking: true,
    },
    reportData: [
      { method: "Boiling", effectiveness: 99.99 },
      { method: "Chlorination", effectiveness: 95 },
      { method: "UV Treatment", effectiveness: 99.8 },
      { method: "Filtration", effectiveness: 85 },
      { method: "RO", effectiveness: 99.95 },
    ],
  };
}

export default function EcoliWaterQuality() {
  const [ecoli_count, setEcoliCount] = useState(0);
  const [detection_method, setDetectionMethod] = useState("membrane_filter");
  const [water_source, setWaterSource] = useState("groundwater");

  const [results, setResults] = useState<EcoliResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/ecoli/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ecoli_count, detection_method, water_source }),
      });

      if (!response.ok) throw new Error("API unavailable");
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.log("Using fallback");
      setResults(calculateEcoliQuality(ecoli_count, detection_method, water_source));
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    if (level === "Safe") return "#10b981";
    if (level === "Low Risk") return "#06b6d4";
    if (level === "Moderate Risk") return "#ca8a04";
    if (level === "High Risk") return "#ef4444";
    return "#7f1d1d";
  };

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "risk", label: "⚠️ Risk" },
    { id: "standards", label: "✓ Standards" },
    { id: "treatment", label: "🔬 Treatment" },
    { id: "monitoring", label: "📈 Monitoring" },
  ];

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" }}>
          🧬 E. coli Water Quality Analyzer
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 32px 0" }}>
          E. coli (MPN/100mL) detection, risk assessment & treatment recommendations
        </p>

        {/* Input */}
        <div style={{ background: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>⚙️ Sample Analysis</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>E. coli Count (MPN/100mL)</label>
              <input type="number" value={ecoli_count} onChange={e => setEcoliCount(parseFloat(e.target.value) || 0)} min="0" max="100000" step="10" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Detection Method</label>
              <select value={detection_method} onChange={e => setDetectionMethod(e.target.value)} style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a", background: "white", cursor: "pointer" }}>
                <option value="membrane_filter">Membrane Filter</option>
                <option value="most_probable_number">MPN (Most Probable Number)</option>
                <option value="chromogenic_substrate">Chromogenic Substrate</option>
                <option value="molecular_pcr">Molecular (PCR)</option>
              </select>
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Water Source</label>
              <select value={water_source} onChange={e => setWaterSource(e.target.value)} style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a", background: "white", cursor: "pointer" }}>
                <option value="groundwater">Groundwater</option>
                <option value="surface_water">Surface Water</option>
                <option value="tap_water">Tap Water</option>
                <option value="wastewater">Wastewater</option>
                <option value="lake">Lake Water</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={handleCalculate} disabled={loading} style={{ padding: "10px 32px", borderRadius: "8px", border: "none", background: loading ? "#cbd5e1" : "#dc2626", color: "white", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", width: "100%" }}>
                {loading ? "🔄 Analyzing..." : "🧬 Analyze"}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {results && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "28px" }}>
              {[
                { label: "E. coli Count", val: results.sampleAnalysis.ecoli_count, unit: "MPN/100mL", color: getRiskColor(results.riskAssessment.risk_level) },
                { label: "Risk Level", val: results.riskAssessment.risk_level, unit: "", color: getRiskColor(results.riskAssessment.risk_level) },
                { label: "Safety Status", val: results.riskAssessment.safety_status === "SAFE - Meets all standards" ? "✓ SAFE" : "✗ NOT SAFE", unit: "", color: results.riskAssessment.safety_status === "SAFE - Meets all standards" ? "#10b981" : "#dc2626" },
                { label: "Test Interval", val: results.monitoring.repeat_test_interval, unit: "", color: "#0284c7" },
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
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "8px 12px", borderRadius: "8px", border: "2px solid", background: activeTab === t.id ? "#dc2626" : "white", color: activeTab === t.id ? "white" : "#dc2626", borderColor: "#dc2626", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === "overview" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Sample Details</h3>
                  {[
                    { label: "E. coli Count", val: results.sampleAnalysis.ecoli_count + " MPN/100mL" },
                    { label: "Detection Method", val: results.sampleAnalysis.detection_method },
                    { label: "pH", val: results.sampleAnalysis.ph },
                    { label: "Temperature", val: results.sampleAnalysis.temperature + "°C" },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: "8px 0", borderBottom: i < 3 ? "1px solid #f1f5f9" : "none" }}>
                      <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>{item.label}</p>
                      <p style={{ color: "#0f172a", fontSize: "12px", margin: "0" }}>{item.val}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Safety Assessment</h3>
                  <div style={{ padding: "12px", background: getRiskColor(results.riskAssessment.risk_level) + "22", borderRadius: "8px", marginBottom: "12px", borderLeft: `4px solid ${getRiskColor(results.riskAssessment.risk_level)}` }}>
                    <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0 0 4px 0" }}>Status: {results.riskAssessment.safety_status}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Risk */}
            {activeTab === "risk" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Risk Assessment</h3>
                {[
                  { title: "Health Implications", items: results.riskAssessment.health_implications },
                  { title: "Vulnerable Populations", items: results.riskAssessment.vulnerable_populations },
                ].map((section, si) => (
                  <div key={si} style={{ marginBottom: si === 0 ? "16px" : "0" }}>
                    <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>{section.title}</p>
                    {section.items.map((item, i) => (
                      <p key={i} style={{ color: "#64748b", fontSize: "11px", margin: "0 0 4px 0" }}>• {item}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Standards */}
            {activeTab === "standards" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Compliance Standards</h3>
                {[
                  { label: "WHO Standard", val: "0 MPN/100mL (No Detection)" },
                  { label: "US EPA Standard", val: "0 MPN/100mL (Total Coliforms)" },
                  { label: "India Standards", val: "0 MPN/100mL (IS 10500:2012)" },
                  { label: "Your Sample", val: results.sampleAnalysis.ecoli_count === 0 ? "✓ COMPLIANT" : "✗ NON-COMPLIANT" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "12px", background: i === 3 ? (results.sampleAnalysis.ecoli_count === 0 ? "#dcfce7" : "#fee2e2") : "#f8fafc", borderRadius: "8px", marginBottom: "8px" }}>
                    <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>{item.label}</p>
                    <p style={{ color: i === 3 ? (results.sampleAnalysis.ecoli_count === 0 ? "#10b981" : "#dc2626") : "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0" }}>{item.val}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Treatment */}
            {activeTab === "treatment" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Treatment Recommendations</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={results.reportData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="method" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <RechartTooltip />
                    <Bar dataKey="effectiveness" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ marginTop: "16px" }}>
                  {[
                    { label: "Chlorination Dose", val: results.treatment.chlorination_dose.toFixed(2) + " mg/L" },
                    { label: "UV Intensity", val: results.treatment.uv_intensity.toFixed(0) + " mJ/cm²" },
                    { label: "Boiling Time", val: results.treatment.boiling_time.toFixed(1) + " minutes" },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: "8px 0", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                      <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>{item.label}</p>
                      <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0" }}>{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Monitoring */}
            {activeTab === "monitoring" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Monitoring Protocol</h3>
                {[
                  { label: "Test Frequency", val: results.monitoring.repeat_test_interval },
                  { label: "Monitoring Points", val: results.monitoring.monitoring_points.join(", ") },
                  { label: "Compliance Tracking", val: results.monitoring.compliance_tracking ? "✓ Enabled" : "✗ Disabled" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "12px", background: "#f0f9ff", borderRadius: "8px", marginBottom: "8px", borderLeft: "4px solid #0284c7" }}>
                    <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>{item.label}</p>
                    <p style={{ color: "#0f172a", fontSize: "12px", margin: "0" }}>{item.val}</p>
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
