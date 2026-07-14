import Layout from "../components/Layout";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface QualityParameter {
  parameter: string;
  who_limit: number;
  is_limit: number;
  unit: string;
  sources: string;
  affectedAquifers: number;
  population_affected: number;
}

interface RockTypeAssessment {
  rock_type: string;
  category: string;
  characterization: string;
  specific_yield: number;
  storage_coefficient: number;
  area_km2: number;
  gw_potential: string;
}

export default function GEC2015GroundWaterEstimation() {
  const [selectedAquifer, setSelectedAquifer] = useState("gangetic");

  // GEC 2015 - Key Methodological Changes
  const gecMethodologyChanges = [
    { aspect: "Assessment Unit", gec1997: "District-wise", gec2015: "Aquifer-wise (sub-basin, watershed)", benefit: "More accurate localized evaluation" },
    { aspect: "Hydrogeology", gec1997: "Simple classification", gec2015: "Detailed hard & soft rock characterization", benefit: "Better GW potential mapping" },
    { aspect: "Water Quality", gec1997: "Not systematic", gec2015: "Salinity, fluoride, arsenic, iron integrated", benefit: "Usable GW vs total availability" },
    { aspect: "Recharge", gec1997: "Rainfall-runoff primary", gec2015: "Multi-method + GIS/RS, water budget", benefit: "More robust calculations" },
    { aspect: "Stage of Extraction", gec1997: "Simple ratio", gec2015: "Extraction/Availability with quality adjustments", benefit: "Accounts for contamination" },
    { aspect: "Data Integration", gec1997: "Manual compilation", gec2015: "GIS, satellite, geophysical surveys", benefit: "Real-time database support" },
  ];

  // Indian Aquifer Types
  const aquiferTypes = [
    {
      id: "gangetic",
      name: "Gangetic Alluvial",
      state: "UP, Bihar, WB",
      classification: "Soft Rock - Alluvial",
      area: 86500,
      specific_yield: 0.15,
      annual_recharge: 145.2,
      gw_availability: 65.8,
      gw_extraction: 58.4,
      stage: 88.7,
      quality_issues: ["Arsenic (As)", "Iron (Fe)", "Nitrate"],
      fluoride: 0.8,
      arsenic: 15.2,
      salinity: 420,
    },
    {
      id: "deccan",
      name: "Deccan Trap Basalt",
      state: "MS, KA, TG, AP",
      classification: "Hard Rock - Vesicular",
      area: 195000,
      specific_yield: 0.08,
      annual_recharge: 92.4,
      gw_availability: 42.1,
      gw_extraction: 38.6,
      stage: 91.6,
      quality_issues: ["Salinity", "Iron (Fe)", "Fluoride"],
      fluoride: 1.2,
      arsenic: 2.5,
      salinity: 820,
    },
    {
      id: "aravalli",
      name: "Aravalli Metamorphic",
      state: "RJ, GJ, HP",
      classification: "Hard Rock - Metamorphic",
      area: 142500,
      specific_yield: 0.05,
      annual_recharge: 58.3,
      gw_availability: 18.2,
      gw_extraction: 16.8,
      stage: 92.3,
      quality_issues: ["Fluoride", "Salinity"],
      fluoride: 1.8,
      arsenic: 1.2,
      salinity: 920,
    },
    {
      id: "brahmaputra",
      name: "Brahmaputra Alluvial",
      state: "Assam, Arunachal",
      classification: "Soft Rock - Alluvial",
      area: 71200,
      specific_yield: 0.18,
      annual_recharge: 156.8,
      gw_availability: 98.5,
      gw_extraction: 22.4,
      stage: 22.7,
      quality_issues: ["Iron (Fe)", "Arsenic"],
      fluoride: 0.6,
      arsenic: 12.8,
      salinity: 280,
    },
    {
      id: "coastal",
      name: "Coastal Alluvial",
      state: "TN, AP, KA, MH",
      classification: "Soft Rock - Coastal",
      area: 58300,
      specific_yield: 0.16,
      annual_recharge: 42.1,
      gw_availability: 24.3,
      gw_extraction: 21.8,
      stage: 89.6,
      quality_issues: ["Salinity", "TDS", "Seawater Intrusion"],
      fluoride: 0.9,
      arsenic: 3.2,
      salinity: 3200,
    },
    {
      id: "himalayan",
      name: "Himalayan Sedimentary",
      state: "HP, J&K, UK",
      classification: "Soft Rock - Sedimentary",
      area: 94800,
      specific_yield: 0.14,
      annual_recharge: 184.2,
      gw_availability: 112.4,
      gw_extraction: 18.6,
      stage: 16.6,
      quality_issues: ["Salinity", "Nitrate"],
      fluoride: 0.5,
      arsenic: 1.8,
      salinity: 680,
    },
  ];

  // Water Quality Parameters
  const qualityParameters: QualityParameter[] = [
    { parameter: "Fluoride (F)", who_limit: 1.5, is_limit: 1.0, unit: "mg/L", sources: "Granitic rocks, geothermal", affectedAquifers: 4, population_affected: 65000000 },
    { parameter: "Arsenic (As)", who_limit: 0.01, is_limit: 0.01, unit: "µg/L", sources: "Geogenic deposits, Fe-hydroxides", affectedAquifers: 3, population_affected: 45000000 },
    { parameter: "Iron (Fe)", who_limit: 0.3, is_limit: 0.3, unit: "mg/L", sources: "Laterite, weathered rocks", affectedAquifers: 5, population_affected: 78000000 },
    { parameter: "Salinity/TDS", who_limit: 1000, is_limit: 500, unit: "mg/L", sources: "Seawater intrusion, evaporites", affectedAquifers: 3, population_affected: 32000000 },
    { parameter: "Nitrate (NO₃)", who_limit: 50, is_limit: 45, unit: "mg/L", sources: "Agricultural runoff", affectedAquifers: 2, population_affected: 28000000 },
    { parameter: "Uranium (U)", who_limit: 0.015, is_limit: 0.015, unit: "mg/L", sources: "Granitic basement", affectedAquifers: 2, population_affected: 12000000 },
  ];

  // Hard Rock vs Soft Rock
  const rockTypeCharacterization: RockTypeAssessment[] = [
    { rock_type: "Alluvial Sediments", category: "Soft Rock", characterization: "Multiple layers, high storage", specific_yield: 0.15, storage_coefficient: 0.001, area_km2: 298000, gw_potential: "Very High" },
    { rock_type: "Basalt (Deccan)", category: "Hard Rock", characterization: "Fractured zones, vesicular", specific_yield: 0.08, storage_coefficient: 0.0001, area_km2: 195000, gw_potential: "Moderate-High" },
    { rock_type: "Metamorphic", category: "Hard Rock", characterization: "Limited storage, fracture-dependent", specific_yield: 0.05, storage_coefficient: 0.00005, area_km2: 185000, gw_potential: "Low-Moderate" },
    { rock_type: "Sedimentary", category: "Soft Rock", characterization: "Variable storage, thick sequences", specific_yield: 0.12, storage_coefficient: 0.0005, area_km2: 125000, gw_potential: "Moderate-High" },
    { rock_type: "Laterite", category: "Hard Rock (Weathered)", characterization: "Limited thickness, secondary porosity", specific_yield: 0.06, storage_coefficient: 0.0002, area_km2: 180000, gw_potential: "Low" },
  ];



  const stageOfExtractionData = [
    { stage: "Safe", range: "<70%", color: "#10b981", count: 85, area: 156200, issues: "No restrictions" },
    { stage: "Semi-Critical", range: "70-90%", color: "#ca8a04", count: 142, area: 298500, issues: "Monitoring needed" },
    { stage: "Critical", range: ">90%", color: "#f97316", count: 98, area: 185600, issues: "Regulation required" },
    { stage: "Over-exploited", range: ">100%", color: "#dc2626", count: 62, area: 121300, issues: "Immediate intervention" },
  ];

  const qualityIssuesByState = [
    { state: "Rajasthan", fluoride: 45, arsenic: 12, salinity: 38, iron: 28, nitrate: 8 },
    { state: "Uttar Pradesh", fluoride: 38, arsenic: 52, salinity: 15, iron: 42, nitrate: 35 },
    { state: "Bihar", fluoride: 22, arsenic: 68, salinity: 8, iron: 38, nitrate: 28 },
    { state: "Maharashtra", fluoride: 58, arsenic: 18, salinity: 22, iron: 32, nitrate: 15 },
    { state: "Tamil Nadu", fluoride: 62, arsenic: 25, salinity: 45, iron: 18, nitrate: 12 },
    { state: "Assam", fluoride: 12, arsenic: 48, salinity: 5, iron: 72, nitrate: 8 },
  ];



  const selectedAquifer_data = aquiferTypes.find(a => a.id === selectedAquifer);

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "36px", fontWeight: "800", margin: "0 0 10px 0" }}>
          💧 GEC 2015 Ground Water Estimation - Aquifer-wise Assessment
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 40px 0" }}>
          Ground Water Estimation Committee 2015 revised methodology with aquifer-wise assessment, hard/soft rock characterization, and water quality considerations
        </p>

        {/* GEC 2015 Overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #0284c7" }}>
            <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 8px 0", textTransform: "uppercase" }}>GEC 2015 Status</p>
            <p style={{ color: "#0284c7", fontSize: "28px", fontWeight: "800", margin: "0 0 5px 0" }}>✓ IMPLEMENTED</p>
            <p style={{ color: "#0c4a6e", fontSize: "12px", margin: "0" }}>All 6 aquifer types assessed</p>
          </div>
          <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #10b981" }}>
            <p style={{ color: "#065f46", fontSize: "11px", fontWeight: "700", margin: "0 0 8px 0", textTransform: "uppercase" }}>Aquifers Mapped</p>
            <p style={{ color: "#10b981", fontSize: "28px", fontWeight: "800", margin: "0 0 5px 0" }}>6</p>
            <p style={{ color: "#065f46", fontSize: "12px", margin: "0" }}>Major aquifer systems</p>
          </div>
          <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #ca8a04" }}>
            <p style={{ color: "#854d0e", fontSize: "11px", fontWeight: "700", margin: "0 0 8px 0", textTransform: "uppercase" }}>Area Coverage</p>
            <p style={{ color: "#ca8a04", fontSize: "28px", fontWeight: "800", margin: "0 0 5px 0" }}>1.2M</p>
            <p style={{ color: "#854d0e", fontSize: "12px", margin: "0" }}>km² assessed</p>
          </div>
          <div style={{ background: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #ec4899" }}>
            <p style={{ color: "#831843", fontSize: "11px", fontWeight: "700", margin: "0 0 8px 0", textTransform: "uppercase" }}>Quality Parameters</p>
            <p style={{ color: "#ec4899", fontSize: "28px", fontWeight: "800", margin: "0 0 5px 0" }}>6</p>
            <p style={{ color: "#831843", fontSize: "12px", margin: "0" }}>Monitored parameters</p>
          </div>
        </div>

        {/* GEC 2015 vs 1997 */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>📋 GEC 2015 vs GEC 1997 - Key Methodological Changes</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ background: "#f0f9ff", borderBottom: "2px solid #0284c7" }}>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>Aspect</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>GEC 1997</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>GEC 2015</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>Benefit</th>
                </tr>
              </thead>
              <tbody>
                {gecMethodologyChanges.map((change, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "12px", color: "#0f172a", fontWeight: "600" }}>{change.aspect}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{change.gec1997}</td>
                    <td style={{ padding: "12px", color: "#0284c7", fontWeight: "600" }}>{change.gec2015}</td>
                    <td style={{ padding: "12px", color: "#10b981", fontWeight: "600" }}>{change.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aquifer Selection */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🗺️ Major Indian Aquifer Systems</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "15px" }}>
            {aquiferTypes.map((aquifer, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedAquifer(aquifer.id)}
                style={{
                  background: selectedAquifer === aquifer.id ? "#f0f9ff" : "#f9fafb",
                  padding: "15px",
                  borderRadius: "10px",
                  border: selectedAquifer === aquifer.id ? "3px solid #0284c7" : "1px solid #e5e7eb",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(2,132,199,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <h3 style={{ color: "#0284c7", fontSize: "14px", fontWeight: "700", margin: "0 0 8px 0" }}>{aquifer.name}</h3>
                <div style={{ fontSize: "11px", color: "#666", display: "grid", gap: "3px", marginBottom: "8px" }}>
                  <p style={{ margin: "0" }}>📍 {aquifer.state}</p>
                  <p style={{ margin: "0" }}>🪨 {aquifer.classification}</p>
                  <p style={{ margin: "0" }}>Area: {aquifer.area}k km²</p>
                  <p style={{ margin: "0" }}>Sy: {aquifer.specific_yield} | Recharge: {aquifer.annual_recharge} BCM</p>
                </div>
                <div style={{ display: "flex", gap: "8px", fontSize: "10px" }}>
                  <span style={{ background: "#fef3c7", color: "#854d0e", padding: "2px 6px", borderRadius: "3px", fontWeight: "700" }}>Stage: {aquifer.stage}%</span>
                  <span style={{ background: "#fee2e2", color: "#7f1d1d", padding: "2px 6px", borderRadius: "3px", fontWeight: "700" }}>Issues: {aquifer.quality_issues.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Aquifer Details */}
        {selectedAquifer_data && (
          <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #0284c7", marginBottom: "40px" }}>
            <h2 style={{ color: "#0c4a6e", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>📊 {selectedAquifer_data.name} - Detailed Assessment</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "15px", marginBottom: "20px" }}>
              <div style={{ background: "white", padding: "12px", borderRadius: "8px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "10px", fontWeight: "700", margin: "0 0 4px 0" }}>Annual Recharge</p>
                <p style={{ color: "#0284c7", fontSize: "18px", fontWeight: "800", margin: "0" }}>{selectedAquifer_data.annual_recharge} BCM</p>
              </div>
              <div style={{ background: "white", padding: "12px", borderRadius: "8px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "10px", fontWeight: "700", margin: "0 0 4px 0" }}>GW Availability</p>
                <p style={{ color: "#10b981", fontSize: "18px", fontWeight: "800", margin: "0" }}>{selectedAquifer_data.gw_availability} BCM</p>
              </div>
              <div style={{ background: "white", padding: "12px", borderRadius: "8px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "10px", fontWeight: "700", margin: "0 0 4px 0" }}>Extraction</p>
                <p style={{ color: "#ca8a04", fontSize: "18px", fontWeight: "800", margin: "0" }}>{selectedAquifer_data.gw_extraction} BCM</p>
              </div>
              <div style={{ background: "white", padding: "12px", borderRadius: "8px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "10px", fontWeight: "700", margin: "0 0 4px 0" }}>Stage of Extraction</p>
                <p style={{ color: selectedAquifer_data.stage > 90 ? "#dc2626" : "#10b981", fontSize: "18px", fontWeight: "800", margin: "0" }}>{selectedAquifer_data.stage}%</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              <div style={{ background: "white", padding: "10px", borderRadius: "6px", textAlign: "center" }}>
                <p style={{ color: "#7f1d1d", fontSize: "10px", fontWeight: "700", margin: "0 0 3px 0" }}>Fluoride</p>
                <p style={{ color: "#dc2626", fontSize: "14px", fontWeight: "800", margin: "0" }}>{selectedAquifer_data.fluoride} mg/L</p>
              </div>
              <div style={{ background: "white", padding: "10px", borderRadius: "6px", textAlign: "center" }}>
                <p style={{ color: "#7f1d1d", fontSize: "10px", fontWeight: "700", margin: "0 0 3px 0" }}>Arsenic</p>
                <p style={{ color: "#dc2626", fontSize: "14px", fontWeight: "800", margin: "0" }}>{selectedAquifer_data.arsenic} µg/L</p>
              </div>
              <div style={{ background: "white", padding: "10px", borderRadius: "6px", textAlign: "center" }}>
                <p style={{ color: "#7f1d1d", fontSize: "10px", fontWeight: "700", margin: "0 0 3px 0" }}>Salinity</p>
                <p style={{ color: "#dc2626", fontSize: "14px", fontWeight: "800", margin: "0" }}>{selectedAquifer_data.salinity} mg/L</p>
              </div>
            </div>
          </div>
        )}

        {/* Hard Rock vs Soft Rock */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🪨 Hard Rock vs Soft Rock Characterization</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
              <thead>
                <tr style={{ background: "#f0f9ff", borderBottom: "2px solid #0284c7" }}>
                  <th style={{ padding: "10px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>Rock Type</th>
                  <th style={{ padding: "10px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Category</th>
                  <th style={{ padding: "10px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>Characterization</th>
                  <th style={{ padding: "10px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Sy</th>
                  <th style={{ padding: "10px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Potential</th>
                </tr>
              </thead>
              <tbody>
                {rockTypeCharacterization.map((rock, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "10px", color: "#0f172a", fontWeight: "600" }}>{rock.rock_type}</td>
                    <td style={{ padding: "10px", textAlign: "center", color: "#0284c7", fontWeight: "600" }}>{rock.category}</td>
                    <td style={{ padding: "10px", color: "#666", fontSize: "10px" }}>{rock.characterization}</td>
                    <td style={{ padding: "10px", textAlign: "center", color: "#ca8a04", fontWeight: "600" }}>{rock.specific_yield}</td>
                    <td style={{ padding: "10px", textAlign: "center", color: "#10b981", fontWeight: "700", fontSize: "10px" }}>{rock.gw_potential}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Water Quality */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🧪 Water Quality Parameters - GEC 2015</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
            {qualityParameters.map((param, idx) => (
              <div key={idx} style={{ background: "#f9fafb", padding: "12px", borderRadius: "8px", borderLeft: "3px solid #0284c7" }}>
                <h4 style={{ color: "#0284c7", fontSize: "12px", fontWeight: "700", margin: "0 0 6px 0" }}>{param.parameter}</h4>
                <div style={{ fontSize: "10px", color: "#666", display: "grid", gap: "2px" }}>
                  <p style={{ margin: "0" }}>WHO: {param.who_limit} {param.unit}</p>
                  <p style={{ margin: "0" }}>IS: {param.is_limit} {param.unit}</p>
                  <p style={{ margin: "0" }}>Aquifers: {param.affectedAquifers} | People: {(param.population_affected / 1000000).toFixed(0)}M</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* State-wise Quality Issues */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🗺️ Water Quality Issues - State-wise (%)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={qualityIssuesByState}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="fluoride" fill="#ca8a04" name="Fluoride" radius={[3, 3, 0, 0]} />
              <Bar dataKey="arsenic" fill="#dc2626" name="Arsenic" radius={[3, 3, 0, 0]} />
              <Bar dataKey="salinity" fill="#0284c7" name="Salinity" radius={[3, 3, 0, 0]} />
              <Bar dataKey="iron" fill="#8b5cf6" name="Iron" radius={[3, 3, 0, 0]} />
              <Bar dataKey="nitrate" fill="#10b981" name="Nitrate" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stage of Extraction */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>📈 Stage of Extraction Classification</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            {stageOfExtractionData.map((stage, idx) => (
              <div key={idx} style={{ background: "#f9fafb", padding: "12px", borderRadius: "8px", borderLeft: `3px solid ${stage.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h4 style={{ color: stage.color, fontSize: "13px", fontWeight: "700", margin: "0" }}>{stage.stage}</h4>
                  <span style={{ background: stage.color, color: "white", padding: "2px 6px", borderRadius: "3px", fontSize: "10px", fontWeight: "700" }}>{stage.range}</span>
                </div>
                <div style={{ fontSize: "11px", color: "#666", display: "grid", gap: "2px" }}>
                  <p style={{ margin: "0" }}>Aquifers: {stage.count}</p>
                  <p style={{ margin: "0" }}>Area: {stage.area}k km²</p>
                  <p style={{ margin: "0", color: stage.color, fontWeight: "600" }}>{stage.issues}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #10b981" }}>
          <h2 style={{ color: "#065f46", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>🚀 GEC 2015 Implementation Resources</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "15px" }}>
            <div style={{ background: "white", padding: "12px", borderRadius: "8px" }}>
              <p style={{ color: "#065f46", fontSize: "11px", fontWeight: "700", margin: "0 0 8px 0" }}>📚 Documents</p>
              <ul style={{ color: "#666", fontSize: "10px", margin: "0", paddingLeft: "18px", lineHeight: "1.5" }}>
                <li>GEC 2015 Report - Ministry of Water Resources</li>
                <li>CGWB Aquifer Guidelines</li>
                <li>State GW Master Plans (Basin-wise)</li>
              </ul>
            </div>
            <div style={{ background: "white", padding: "12px", borderRadius: "8px" }}>
              <p style={{ color: "#065f46", fontSize: "11px", fontWeight: "700", margin: "0 0 8px 0" }}>🔗 Databases</p>
              <ul style={{ color: "#666", fontSize: "10px", margin: "0", paddingLeft: "18px", lineHeight: "1.5" }}>
                <li>CGWB Groundwater Information System</li>
                <li>State Water Resources Departments</li>
                <li>AQUIFER GIS Database</li>
              </ul>
            </div>
            <div style={{ background: "white", padding: "12px", borderRadius: "8px" }}>
              <p style={{ color: "#065f46", fontSize: "11px", fontWeight: "700", margin: "0 0 8px 0" }}>📊 Networks</p>
              <ul style={{ color: "#666", fontSize: "10px", margin: "0", paddingLeft: "18px", lineHeight: "1.5" }}>
                <li>WTM: 25k+ wells</li>
                <li>WQM: 8k+ points</li>
                <li>Satellite: Sentinel, INSAT</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
