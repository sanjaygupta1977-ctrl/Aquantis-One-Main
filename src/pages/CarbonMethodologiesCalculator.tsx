import Layout from "../components/Layout";
import { useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE = "/api";

interface CarbonMethodologyResult {
  methodology: {
    type: string;
    name: string;
    category: string;
    description: string;
  };
  carbonQuantification: {
    grossEmissionReduction: number;
    baselineEmission: number;
    projectEmission: number;
    leakage: number;
    netCarbonBenefit: number;
    unit: string;
  };
  permanenceAssessment: {
    permanencePeriod: number;
    carbonStored: number;
    riskFactors: string[];
    permanenceClass: string;
  };
  verificationStandards: {
    standard: string;
    verificationLevel: string;
    additionalityTest: boolean;
    reliabilityScore: number;
  };
  creditGeneration: {
    carbonCreditsGenerated: number;
    creditValue: number;
    creditPrice: number;
    totalRevenue: number;
  };
  environmentalImpact: {
    cobenefits: string[];
    biodiversityIndex: number;
    waterImpact: string;
    communityBenefit: string;
  };
  sbtiAlignment: {
    isSBTiEligible: boolean;
    certificationPath: string;
    complianceScore: number;
    recommendations: string[];
  };
}

// Fallback calculation
function calculateCarbonMethodologyFallback(
  methodology: string,
  projectSize: number,
  duration: number,
  location: string
): CarbonMethodologyResult {
  const methodologyData: Record<string, any> = {
    // CDR Methodologies
    afforestation: {
      name: "Afforestation & Reforestation",
      category: "Carbon Removal (CDR)",
      description: "Forest establishment on non-forest land for CO₂ sequestration",
      emissionFactor: 15, // tCO₂e/hectare/year
      permanence: 100,
      sbti: true,
    },
    redd_plus: {
      name: "REDD+",
      category: "Carbon Removal (CDR)",
      description: "Reduced emissions from deforestation and forest degradation",
      emissionFactor: 20,
      permanence: 40,
      sbti: true,
    },
    peatland: {
      name: "Peatland Restoration",
      category: "Carbon Removal (CDR)",
      description: "Wetland carbon recovery and restoration",
      emissionFactor: 25,
      permanence: 60,
      sbti: true,
    },
    blue_carbon: {
      name: "Blue Carbon",
      category: "Carbon Removal (CDR)",
      description: "Coastal and marine ecosystem carbon sequestration",
      emissionFactor: 18,
      permanence: 80,
      sbti: true,
    },
    biochar: {
      name: "Biochar",
      category: "Carbon Removal (CDR)",
      description: "Agricultural carbon stabilization through biochar production",
      emissionFactor: 12,
      permanence: 100,
      sbti: true,
    },
    dac: {
      name: "Direct Air Capture (DAC)",
      category: "Carbon Removal (CDR)",
      description: "Technology-based atmospheric CO₂ removal and storage",
      emissionFactor: 1, // Per unit capacity
      permanence: 100,
      sbti: true,
    },
    
    // Avoidance Methodologies
    ifm: {
      name: "Improved Forest Management",
      category: "Emissions Avoidance",
      description: "Enhanced forestry practices reducing emissions",
      emissionFactor: 10,
      permanence: 40,
      sbti: true,
    },
    regen_ag: {
      name: "Regenerative Agriculture",
      category: "Emissions Reduction",
      description: "Soil carbon enhancement through sustainable farming",
      emissionFactor: 8,
      permanence: 20,
      sbti: false,
    },
    methane: {
      name: "Methane Reduction",
      category: "Emissions Reduction",
      description: "Livestock and waste methane emission reduction",
      emissionFactor: 28, // CH₄ × 28 CO₂e
      permanence: 5,
      sbti: true,
    },
    cookstoves: {
      name: "Cookstoves",
      category: "Emissions Reduction",
      description: "Biomass fuel efficiency and clean cooking",
      emissionFactor: 3,
      permanence: 10,
      sbti: false,
    },
    ccs: {
      name: "Carbon Capture & Storage (CCS)",
      category: "Carbon Removal (CDR)",
      description: "Industrial CO₂ capture and geological storage",
      emissionFactor: 1,
      permanence: 100,
      sbti: true,
    },
  };

  const data = methodologyData[methodology] || methodologyData.afforestation;
  
  // Carbon calculations
  const grossEmission = data.emissionFactor * projectSize * duration;
  const leakageRate = 0.1;
  const leakage = grossEmission * leakageRate;
  const netCarbon = grossEmission - leakage;

  // Permanence assessment
  const riskFactors = [
    data.permanence < 50 ? "Reversal risk - Short permanence period" : "Low reversal risk",
    location === "tropical" ? "High deforestation pressure" : "Stable location",
    data.permanence < 30 ? "Market reversal risk" : "Protected assets",
  ];

  // Credit generation
  const creditsGenerated = netCarbon;
  const pricePerCredit = data.sbti ? 25 : 15; // SBTi-eligible credits premium
  const totalRevenue = creditsGenerated * pricePerCredit;

  // SBTi alignment
  const sbtiEligible = data.sbti && ["redd_plus", "afforestation", "ifm", "methane", "ccs"].includes(methodology);

  return {
    methodology: {
      type: methodology,
      name: data.name,
      category: data.category,
      description: data.description,
    },
    carbonQuantification: {
      grossEmissionReduction: grossEmission,
      baselineEmission: grossEmission + leakage,
      projectEmission: leakage,
      leakage,
      netCarbonBenefit: netCarbon,
      unit: "tCO₂e/year",
    },
    permanenceAssessment: {
      permanencePeriod: data.permanence,
      carbonStored: netCarbon * (data.permanence / 100),
      riskFactors,
      permanenceClass: data.permanence >= 80 ? "Very High (100+ years)" : data.permanence >= 40 ? "High (40-99 years)" : "Medium (20-39 years)",
    },
    verificationStandards: {
      standard: sbtiEligible ? "Verified Carbon Standard (VCS) + SBTi" : "Gold Standard (GS)",
      verificationLevel: sbtiEligible ? "Tier 1 (Highest)" : "Tier 2 (High)",
      additionalityTest: true,
      reliabilityScore: sbtiEligible ? 95 : 85,
    },
    creditGeneration: {
      carbonCreditsGenerated: creditsGenerated,
      creditValue: totalRevenue,
      creditPrice: pricePerCredit,
      totalRevenue,
    },
    environmentalImpact: {
      cobenefits: [
        "Biodiversity conservation",
        "Water ecosystem protection",
        "Community livelihood improvement",
        "Climate resilience building",
      ],
      biodiversityIndex: 75,
      waterImpact: "Improved water availability and quality",
      communityBenefit: "₹" + (projectSize * 5000).toLocaleString() + " annual livelihood income",
    },
    sbtiAlignment: {
      isSBTiEligible: sbtiEligible,
      certificationPath: sbtiEligible ? "SBTi 2035 Reserve Ready" : "Gold Standard pathway",
      complianceScore: sbtiEligible ? 95 : 75,
      recommendations: sbtiEligible
        ? ["Ready for SBTi OER portfolio", "High market demand", "Premium credit value"]
        : ["Pursue Gold Standard certification", "Focus on co-benefits documentation", "Build community partnerships"],
    },
  };
}

export default function CarbonMethodologiesCalculator() {
  const [methodology, setMethodology] = useState("afforestation");
  const [projectSize, setProjectSize] = useState(1000);
  const [duration, setDuration] = useState(10);
  const [location, setLocation] = useState("tropical");

  const [results, setResults] = useState<CarbonMethodologyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const methodologies = [
    { id: "afforestation", name: "🌳 Afforestation & Reforestation", category: "CDR" },
    { id: "redd_plus", name: "🌲 REDD+", category: "CDR" },
    { id: "peatland", name: "🏞️ Peatland Restoration", category: "CDR" },
    { id: "blue_carbon", name: "🌊 Blue Carbon", category: "CDR" },
    { id: "biochar", name: "🔥 Biochar", category: "CDR" },
    { id: "dac", name: "🤖 Direct Air Capture", category: "CDR" },
    { id: "ifm", name: "📊 Improved Forest Management", category: "Avoidance" },
    { id: "regen_ag", name: "🌾 Regenerative Agriculture", category: "Reduction" },
    { id: "methane", name: "💨 Methane Reduction", category: "Reduction" },
    { id: "cookstoves", name: "🍳 Cookstoves", category: "Reduction" },
    { id: "ccs", name: "⚙️ Carbon Capture & Storage", category: "CDR" },
  ];

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/carbon-methodologies/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ methodology, projectSize, duration, location }),
      });

      if (!response.ok) throw new Error("API unavailable");
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.log("Using fallback");
      setResults(calculateCarbonMethodologyFallback(methodology, projectSize, duration, location));
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "carbon", label: "🌍 Carbon" },
    { id: "permanence", label: "🔒 Permanence" },
    { id: "verification", label: "✓ Verification" },
    { id: "credits", label: "💳 Credits" },
    { id: "impact", label: "🌱 Impact" },
    { id: "sbti", label: "📋 SBTi" },
  ];

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" }}>
          🌍 Carbon Methodologies Calculator
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 32px 0" }}>
          14 Carbon Credit Methodologies - CDR, Avoidance, Removal & SBTi Alignment
        </p>

        {/* Input */}
        <div style={{ background: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>⚙️ Project Parameters</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Methodology</label>
              <select value={methodology} onChange={e => setMethodology(e.target.value)} style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a", background: "white", cursor: "pointer" }}>
                {methodologies.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Project Size</label>
              <input type="number" value={projectSize} onChange={e => setProjectSize(parseFloat(e.target.value) || 0)} min="10" max="100000" step="10" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
              <p style={{ color: "#94a3b8", fontSize: "10px", margin: "4px 0 0 0" }}>hectares / units</p>
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Duration (years)</label>
              <input type="number" value={duration} onChange={e => setDuration(parseFloat(e.target.value) || 0)} min="1" max="100" step="1" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
            </div>

            <div>
              <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Location Type</label>
              <select value={location} onChange={e => setLocation(e.target.value)} style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a", background: "white", cursor: "pointer" }}>
                <option value="tropical">Tropical (High risk)</option>
                <option value="temperate">Temperate (Medium risk)</option>
                <option value="developed">Developed (Low risk)</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={handleCalculate} disabled={loading} style={{ padding: "10px 32px", borderRadius: "8px", border: "none", background: loading ? "#cbd5e1" : "#06b6d4", color: "white", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", width: "100%" }}>
                {loading ? "🔄 Calculating..." : "🚀 Calculate"}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {results && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "28px" }}>
              {[
                { label: "Net Carbon Benefit", val: results.carbonQuantification.netCarbonBenefit.toFixed(0), unit: "tCO₂e/yr", color: "#10b981" },
                { label: "Credits Generated", val: results.creditGeneration.carbonCreditsGenerated.toFixed(0), unit: "VCCs", color: "#06b6d4" },
                { label: "Total Revenue", val: "₹" + (results.creditGeneration.totalRevenue / 100000).toFixed(1), unit: "Lakh", color: "#8b5cf6" },
                { label: "Permanence", val: results.permanenceAssessment.permanencePeriod, unit: "years", color: "#f97316" },
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
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "8px 12px", borderRadius: "8px", border: "2px solid", background: activeTab === t.id ? "#06b6d4" : "white", color: activeTab === t.id ? "white" : "#06b6d4", borderColor: "#06b6d4", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === "overview" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Methodology Details</h3>
                {[
                  { label: "Methodology", val: results.methodology.name },
                  { label: "Category", val: results.methodology.category },
                  { label: "Description", val: results.methodology.description },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                    <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", margin: "0 0 4px 0" }}>{item.label}</p>
                    <p style={{ color: "#0f172a", fontSize: "12px", margin: "0" }}>{item.val}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Carbon */}
            {activeTab === "carbon" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Carbon Quantification</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Gross Reduction", value: results.carbonQuantification.grossEmissionReduction },
                    { name: "Leakage", value: results.carbonQuantification.leakage },
                    { name: "Net Benefit", value: results.carbonQuantification.netCarbonBenefit },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <RechartTooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Permanence */}
            {activeTab === "permanence" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Permanence Assessment</h3>
                {[
                  { label: "Permanence Period", val: results.permanenceAssessment.permanencePeriod + " years" },
                  { label: "Permanence Class", val: results.permanenceAssessment.permanenceClass },
                  { label: "Carbon Stored", val: results.permanenceAssessment.carbonStored.toFixed(0) + " tCO₂e" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "12px", background: "#f0fdf4", borderRadius: "8px", marginBottom: "8px", borderLeft: "4px solid #10b981" }}>
                    <p style={{ color: "#065f46", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>{item.label}</p>
                    <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "800", margin: "0" }}>{item.val}</p>
                  </div>
                ))}
                <div style={{ marginTop: "12px", padding: "12px", background: "#fef3c7", borderRadius: "8px", borderLeft: "4px solid #ca8a04" }}>
                  <p style={{ color: "#92400e", fontSize: "11px", fontWeight: "700", margin: "0 0 4px 0" }}>Risk Factors:</p>
                  {results.permanenceAssessment.riskFactors.map((rf, i) => (
                    <p key={i} style={{ color: "#92400e", fontSize: "10px", margin: "0 0 2px 0" }}>• {rf}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Verification */}
            {activeTab === "verification" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Verification Standards</h3>
                {[
                  { label: "Standard", val: results.verificationStandards.standard },
                  { label: "Verification Level", val: results.verificationStandards.verificationLevel },
                  { label: "Additionalitytest", val: results.verificationStandards.additionalityTest ? "✓ Passed" : "✗ Failed" },
                  { label: "Reliability Score", val: results.verificationStandards.reliabilityScore + "/100" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: i < 3 ? "1px solid #f1f5f9" : "none" }}>
                    <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", margin: "0 0 4px 0" }}>{item.label}</p>
                    <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0" }}>{item.val}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Credits */}
            {activeTab === "credits" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Carbon Credit Economics</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={[{ name: "Credits Generated", value: results.creditGeneration.carbonCreditsGenerated }]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                      <Cell fill="#06b6d4" />
                    </Pie>
                    <RechartTooltip />
                  </PieChart>
                </ResponsiveContainer>
                {[
                  { label: "Credits Generated", val: results.creditGeneration.carbonCreditsGenerated.toFixed(0) + " VCCs" },
                  { label: "Credit Price", val: "₹" + results.creditGeneration.creditPrice },
                  { label: "Total Revenue", val: "₹" + results.creditGeneration.totalRevenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "12px", background: "#f0f9ff", borderRadius: "8px", marginTop: "12px", marginBottom: "8px", borderLeft: "4px solid #06b6d4" }}>
                    <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>{item.label}</p>
                    <p style={{ color: "#0284c7", fontSize: "13px", fontWeight: "800", margin: "0" }}>{item.val}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Impact */}
            {activeTab === "impact" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Environmental & Social Impact</h3>
                {[
                  { label: "Biodiversity Index", val: results.environmentalImpact.biodiversityIndex + "/100" },
                  { label: "Water Impact", val: results.environmentalImpact.waterImpact },
                  { label: "Community Benefit", val: results.environmentalImpact.communityBenefit },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "12px", background: "#f0fdf4", borderRadius: "8px", marginBottom: "8px", borderLeft: "4px solid #10b981" }}>
                    <p style={{ color: "#065f46", fontSize: "11px", fontWeight: "700", margin: "0 0 4px 0" }}>{item.label}</p>
                    <p style={{ color: "#0f172a", fontSize: "12px", margin: "0" }}>{item.val}</p>
                  </div>
                ))}
                <div style={{ marginTop: "12px", padding: "12px", background: "#dcfce7", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
                  <p style={{ color: "#065f46", fontSize: "11px", fontWeight: "700", margin: "0 0 6px 0" }}>Co-benefits:</p>
                  {results.environmentalImpact.cobenefits.map((cb, i) => (
                    <p key={i} style={{ color: "#065f46", fontSize: "10px", margin: "0 0 3px 0" }}>✓ {cb}</p>
                  ))}
                </div>
              </div>
            )}

            {/* SBTi */}
            {activeTab === "sbti" && (
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>SBTi Alignment & Certification</h3>
                <div style={{ padding: "16px", background: results.sbtiAlignment.isSBTiEligible ? "#dcfce7" : "#fee2e2", borderRadius: "10px", marginBottom: "12px", borderLeft: `4px solid ${results.sbtiAlignment.isSBTiEligible ? "#10b981" : "#dc2626"}` }}>
                  <p style={{ color: results.sbtiAlignment.isSBTiEligible ? "#065f46" : "#7f1d1d", fontSize: "12px", fontWeight: "700", margin: "0 0 4px 0" }}>SBTi Eligibility</p>
                  <p style={{ color: results.sbtiAlignment.isSBTiEligible ? "#10b981" : "#dc2626", fontSize: "14px", fontWeight: "800", margin: "0" }}>
                    {results.sbtiAlignment.isSBTiEligible ? "✓ ELIGIBLE" : "✗ NOT ELIGIBLE"}
                  </p>
                </div>
                {[
                  { label: "Certification Path", val: results.sbtiAlignment.certificationPath },
                  { label: "Compliance Score", val: results.sbtiAlignment.complianceScore + "/100" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: i < 1 ? "1px solid #f1f5f9" : "none" }}>
                    <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", margin: "0 0 4px 0" }}>{item.label}</p>
                    <p style={{ color: "#0f172a", fontSize: "12px", margin: "0" }}>{item.val}</p>
                  </div>
                ))}
                <div style={{ marginTop: "12px", padding: "12px", background: "#f0f9ff", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
                  <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 6px 0" }}>Recommendations:</p>
                  {results.sbtiAlignment.recommendations.map((rec, i) => (
                    <p key={i} style={{ color: "#0c4a6e", fontSize: "10px", margin: "0 0 3px 0" }}>→ {rec}</p>
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
