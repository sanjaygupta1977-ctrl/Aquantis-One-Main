import Layout from "../components/Layout";
import { useState } from "react";

interface WaterParameter {
  id: number;
  name: string;
  value: number;
  unit: string;
  category: string;
}

export default function DrinkingWaterQualityCalculator() {
  const [parameters, setParameters] = useState<WaterParameter[]>([
    { id: 1, name: "pH", value: 7.2, unit: "", category: "physical" },
    { id: 2, name: "Turbidity", value: 0.3, unit: "NTU", category: "physical" },
    { id: 3, name: "TDS", value: 350, unit: "mg/L", category: "physical" },
    { id: 4, name: "Chlorine", value: 0.5, unit: "mg/L", category: "disinfectant" },
    { id: 5, name: "E. coli", value: 0, unit: "CFU/100mL", category: "microbiological" },
    { id: 6, name: "Iron", value: 0.15, unit: "mg/L", category: "chemical" },
  ]);
  const [newParam, setNewParam] = useState<WaterParameter>({ id: 0, name: "", value: 0, unit: "", category: "physical" });
  const [nextId, setNextId] = useState(7);

  // WHO & EPA drinking water standards
  const standards: Record<string, Record<string, { whoLimit: string; epaLimit: string; unit: string; health: string }>> = {
    physical: {
      "pH": { whoLimit: "6.5-8.5", epaLimit: "6.5-8.5", unit: "", health: "Affects corrosion & disinfection" },
      "Turbidity": { whoLimit: "<1 NTU", epaLimit: "<0.3 NTU (treatment plant)", unit: "NTU", health: "Indicates particle contamination" },
      "TDS": { whoLimit: "<500 mg/L", epaLimit: "No standard", unit: "mg/L", health: "Total dissolved solids" },
      "Color": { whoLimit: "<15 TCU", epaLimit: "<15 TCU", unit: "TCU", health: "Indicates organic matter" },
      "Temperature": { whoLimit: "No limit", epaLimit: "No limit", unit: "°C", health: "Affects taste & disinfection" },
      "Hardness": { whoLimit: "<300 mg/L", epaLimit: "No standard", unit: "mg/L", health: "Calcium & magnesium content" },
    },
    microbiological: {
      "E. coli": { whoLimit: "0 CFU/100mL", epaLimit: "0 CFU/100mL", unit: "CFU/100mL", health: "Must be absent - indicates fecal contamination" },
      "Total Coliforms": { whoLimit: "0 CFU/100mL", epaLimit: "0 CFU/100mL", unit: "CFU/100mL", health: "Should be absent in treated water" },
      "Enterococci": { whoLimit: "0 CFU/100mL", epaLimit: "0 CFU/100mL", unit: "CFU/100mL", health: "Marine bacteria - fecal indicator" },
      "Vibrio cholerae": { whoLimit: "0 CFU/100mL", epaLimit: "0 CFU/100mL", unit: "CFU/100mL", health: "Causes cholera - must be absent" },
    },
    chemical: {
      "Arsenic": { whoLimit: "0.010 mg/L", epaLimit: "0.010 mg/L", unit: "mg/L", health: "Carcinogenic - highly toxic" },
      "Lead": { whoLimit: "0.015 mg/L", epaLimit: "0.015 mg/L", unit: "mg/L", health: "Neurotoxin - especially for children" },
      "Cadmium": { whoLimit: "0.003 mg/L", epaLimit: "0.005 mg/L", unit: "mg/L", health: "Kidney damage at high levels" },
      "Chromium": { whoLimit: "0.05 mg/L", epaLimit: "0.1 mg/L", unit: "mg/L", health: "Potential carcinogen (Cr-VI)" },
      "Mercury": { whoLimit: "0.002 mg/L", epaLimit: "0.002 mg/L", unit: "mg/L", health: "Toxic - affects nervous system" },
      "Iron": { whoLimit: "0.2 mg/L", epaLimit: "0.3 mg/L", unit: "mg/L", health: "Affects taste & color, feeds bacteria" },
      "Manganese": { whoLimit: "0.5 mg/L", epaLimit: "0.05 mg/L", unit: "mg/L", health: "Affects taste & staining" },
      "Copper": { whoLimit: "2 mg/L", epaLimit: "1.3 mg/L (action level)", unit: "mg/L", health: "GI distress at high levels" },
      "Nitrate": { whoLimit: "50 mg/L", epaLimit: "10 mg/L", unit: "mg/L", health: "Methemoglobinemia in infants (Blue Baby)" },
      "Nitrite": { whoLimit: "3 mg/L", epaLimit: "1 mg/L", unit: "mg/L", health: "Combines with hemoglobin" },
      "Fluoride": { whoLimit: "1.5 mg/L", epaLimit: "4 mg/L", unit: "mg/L", health: "Dental fluorosis above 2 mg/L" },
      "Cyanide": { whoLimit: "0.07 mg/L", epaLimit: "0.2 mg/L", unit: "mg/L", health: "Highly toxic" },
      "Chlorine": { whoLimit: "5 mg/L", epaLimit: "4 mg/L", unit: "mg/L", health: "Disinfectant - excess causes taste issues" },
    },
    biological: {
      "Giardia": { whoLimit: "0 cysts/L", epaLimit: "0 cysts/L", unit: "cysts/L", health: "Causes severe diarrhea" },
      "Cryptosporidium": { whoLimit: "0 oocysts/L", epaLimit: "0 oocysts/L", unit: "oocysts/L", health: "Resistant to chlorine - filtration needed" },
      "Legionella": { whoLimit: "0 CFU/L", epaLimit: "0 CFU/L", unit: "CFU/L", health: "Causes Legionnaires' disease" },
      "Hepatitis A": { whoLimit: "0 viruses/L", epaLimit: "0 viruses/L", unit: "viruses/L", health: "Viral infection - fecal-oral route" },
    },
    disinfectant: {
      "Chlorine": { whoLimit: "5 mg/L", epaLimit: "4 mg/L", unit: "mg/L", health: "Free chlorine residual required" },
      "Chlorine Dioxide": { whoLimit: "0.8 mg/L", epaLimit: "0.8 mg/L", unit: "mg/L", health: "Potent disinfectant alternative" },
      "Ozone": { whoLimit: "0.3 mg/L", epaLimit: "0.3 mg/L", unit: "mg/L", health: "Disinfectant that doesn't leave residual" },
      "THM (Trihalomethanes)": { whoLimit: "0.1 mg/L", epaLimit: "0.08 mg/L", unit: "mg/L", health: "Chlorine byproducts - potential carcinogen" },
    },
  };

  const categories = ["physical", "microbiological", "chemical", "biological", "disinfectant"];
  const categoryLabels: Record<string, string> = {
    physical: "Physical Properties",
    microbiological: "Microbiological",
    chemical: "Chemical Contaminants",
    biological: "Biological",
    disinfectant: "Disinfectants & Byproducts",
  };

  const addParameter = () => {
    if (newParam.name && newParam.value >= 0) {
      setParameters([...parameters, { ...newParam, id: nextId }]);
      setNextId(nextId + 1);
      setNewParam({ id: 0, name: "", value: 0, unit: "", category: "physical" });
    }
  };

  const removeParameter = (id: number) => {
    setParameters(parameters.filter((param) => param.id !== id));
  };

  const updateParameter = (id: number, field: keyof WaterParameter, value: string | number) => {
    setParameters(parameters.map((param) => (param.id === id ? { ...param, [field]: value } : param)));
  };

  // Check compliance
  const checkCompliance = (paramName: string, value: number): { status: string; color: string; message: string } => {
    for (const category of categories) {
      if (standards[category] && standards[category][paramName]) {
        const std = standards[category][paramName];
        if (paramName === "E. coli" || paramName === "Total Coliforms" || paramName === "Enterococci" || paramName === "Vibrio cholerae") {
          return value === 0 ? { status: "✓ PASS", color: "#10b981", message: "Compliant with WHO/EPA" } : { status: "✗ FAIL", color: "#dc2626", message: "Must be absent" };
        }
        if (paramName === "pH") {
          const num = value;
          return num >= 6.5 && num <= 8.5 ? { status: "✓ PASS", color: "#10b981", message: "Compliant" } : { status: "✗ FAIL", color: "#dc2626", message: "Out of range" };
        }
        // For other parameters, extract numeric limits
        const whoStr = std.whoLimit.split("-")[0].replace(/[^\d.]/g, "");
        const whoLimit = whoStr ? parseFloat(whoStr) : 0;
        return value <= whoLimit ? { status: "✓ PASS", color: "#10b981", message: "Compliant with WHO/EPA" } : { status: "⚠ EXCEEDS", color: "#dc2626", message: `Exceeds limit of ${std.whoLimit}` };
      }
    }
    return { status: "?", color: "#999", message: "No standard found" };
  };

  const complianceResults = parameters.map((p) => ({
    ...p,
    compliance: checkCompliance(p.name, p.value),
  }));

  const passCount = complianceResults.filter((p) => p.compliance.status.includes("PASS")).length;
  const failCount = complianceResults.filter((p) => p.compliance.status.includes("FAIL") || p.compliance.status.includes("EXCEEDS")).length;
  const compliancePercentage = parameters.length > 0 ? Math.round((passCount / parameters.length) * 100) : 0;

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "36px", fontWeight: "800", margin: "0 0 10px 0" }}>
          💧 Drinking Water Quality Calculator
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 40px 0" }}>
          Test water samples against WHO & EPA drinking water quality standards
        </p>

        {/* Standards Banner */}
        <div style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #0284c7", marginBottom: "30px" }}>
          <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 8px 0" }}>🏛️ International Standards:</p>
          <p style={{ color: "#0369a1", fontSize: "13px", margin: "0" }}>
            WHO Guidelines for Drinking Water Quality • US EPA Safe Drinking Water Act • ISO 3696 • EU Directive 98/83/EC
          </p>
        </div>

        {/* Add Parameter Form */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>Add Test Parameter</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", color: "#0f172a", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>Category</label>
              <select
                value={newParam.category}
                onChange={(e) => setNewParam({ ...newParam, category: e.target.value, name: "" })}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px" }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", color: "#0f172a", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>Parameter</label>
              <select
                value={newParam.name}
                onChange={(e) => {
                  const selected = e.target.value;
                  const categoryData = standards[newParam.category];
                  if (categoryData && categoryData[selected]) {
                    setNewParam({
                      ...newParam,
                      name: selected,
                      unit: categoryData[selected].unit,
                    });
                  }
                }}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px" }}
              >
                <option value="">Select parameter...</option>
                {Object.keys(standards[newParam.category] || {}).map((param) => (
                  <option key={param} value={param}>
                    {param}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", color: "#0f172a", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>Test Value</label>
              <input
                type="number"
                value={newParam.value}
                onChange={(e) => setNewParam({ ...newParam, value: Number(e.target.value) })}
                placeholder="e.g., 0.5"
                step="0.01"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "#0f172a", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>Unit</label>
              <input
                type="text"
                value={newParam.unit}
                readOnly
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px", boxSizing: "border-box", background: "#f5f5f5" }}
              />
            </div>
          </div>

          <button
            onClick={addParameter}
            style={{
              width: "100%",
              padding: "12px",
              background: "#0284c7",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#0369a1"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#0284c7"}
          >
            + Add Parameter
          </button>
        </div>

        {/* Compliance Score Card */}
        {parameters.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #0284c7" }}>
              <p style={{ color: "#0c2340", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>Overall Compliance Score</p>
              <p style={{ color: "#0284c7", fontSize: "48px", fontWeight: "800", margin: "0" }}>
                {compliancePercentage}%
              </p>
              <p style={{ color: "#0c2340", fontSize: "12px", margin: "8px 0 0 0" }}>{passCount} of {parameters.length} parameters pass</p>
            </div>

            <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #10b981" }}>
              <p style={{ color: "#065f46", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>✓ Passing Tests</p>
              <p style={{ color: "#10b981", fontSize: "48px", fontWeight: "800", margin: "0" }}>
                {passCount}
              </p>
              <p style={{ color: "#065f46", fontSize: "12px", margin: "8px 0 0 0" }}>Compliant with standards</p>
            </div>

            <div style={{ background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #dc2626" }}>
              <p style={{ color: "#7f1d1d", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>✗ Failing Tests</p>
              <p style={{ color: "#dc2626", fontSize: "48px", fontWeight: "800", margin: "0" }}>
                {failCount}
              </p>
              <p style={{ color: "#7f1d1d", fontSize: "12px", margin: "8px 0 0 0" }}>Exceeds safe limits</p>
            </div>

            {failCount > 0 && (
              <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #ca8a04" }}>
                <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>⚠️ Action Required</p>
                <p style={{ color: "#ca8a04", fontSize: "36px", fontWeight: "800", margin: "0" }}>
                  UNSAFE
                </p>
                <p style={{ color: "#854d0e", fontSize: "12px", margin: "8px 0 0 0" }}>Water not safe to drink</p>
              </div>
            )}
          </div>
        )}

        {/* Results Table */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>Test Results & Compliance</h2>

          {parameters.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center", padding: "40px" }}>No parameters added yet. Add test results above.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f0f9ff", borderBottom: "2px solid #0284c7" }}>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>Parameter</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Test Value</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>WHO Limit</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>EPA Limit</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Status</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Health Info</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceResults.map((param) => {
                    const catData = standards[param.category]?.[param.name];
                    return (
                      <tr key={param.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "12px", color: "#0f172a", fontWeight: "600" }}>{param.name}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#0f172a" }}>
                          <input
                            type="number"
                            value={param.value}
                            onChange={(e) => updateParameter(param.id, "value", Number(e.target.value))}
                            step="0.01"
                            style={{ width: "80px", padding: "6px", borderRadius: "4px", border: "1px solid #ddd", textAlign: "center" }}
                          />
                          <span style={{ marginLeft: "5px", color: "#666", fontSize: "11px" }}>{param.unit}</span>
                        </td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#0369a1", fontWeight: "600" }}>
                          {catData?.whoLimit || "N/A"}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#0369a1", fontWeight: "600" }}>
                          {catData?.epaLimit || "N/A"}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: param.compliance.color }}>
                          {param.compliance.status}
                        </td>
                        <td style={{ padding: "12px", textAlign: "left", fontSize: "11px", color: "#666" }}>
                          {catData?.health || "N/A"}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <button
                            onClick={() => removeParameter(param.id)}
                            style={{
                              padding: "6px 12px",
                              background: "#fee2e2",
                              color: "#dc2626",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Safety Recommendations */}
        {parameters.length > 0 && (
          <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f3faf7 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #10b981", marginBottom: "40px" }}>
            <h2 style={{ color: "#065f46", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🛡️ Water Safety Recommendations</h2>

            {failCount === 0 ? (
              <div style={{ background: "white", padding: "20px", borderRadius: "10px", borderLeft: "4px solid #10b981" }}>
                <p style={{ color: "#065f46", fontSize: "14px", fontWeight: "700", margin: "0 0 10px 0" }}>✓ Water is Safe to Drink</p>
                <p style={{ color: "#047857", fontSize: "13px", margin: "0" }}>
                  All tested parameters comply with WHO and EPA drinking water quality standards. Regular testing is recommended quarterly.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "15px" }}>
                {complianceResults
                  .filter((p) => p.compliance.status.includes("FAIL") || p.compliance.status.includes("EXCEEDS"))
                  .map((param) => (
                    <div key={param.id} style={{ background: "white", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #dc2626" }}>
                      <p style={{ color: "#7f1d1d", fontSize: "13px", fontWeight: "700", margin: "0 0 8px 0" }}>⚠️ {param.name} - {param.compliance.message}</p>
                      <p style={{ color: "#9f1239", fontSize: "12px", margin: "0" }}>
                        Current: {param.value} {param.unit} | Action: Consider treatment (filtration, reverse osmosis, or ion exchange)
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Standards Reference */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>📚 Water Quality Standards Reference</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "15px" }}>
            <div style={{ padding: "15px", background: "#f0f9ff", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
              <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>WHO Guidelines</p>
              <p style={{ color: "#475569", fontSize: "12px", margin: "0" }}>
                World Health Organization guidelines for drinking water quality - updated 2023. Covers microbiological, chemical, and radiological hazards.
              </p>
            </div>
            <div style={{ padding: "15px", background: "#f0f9ff", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
              <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>US EPA SDWA</p>
              <p style={{ color: "#475569", fontSize: "12px", margin: "0" }}>
                Safe Drinking Water Act - US Environmental Protection Agency maximum contaminant levels (MCLs) for 90+ contaminants.
              </p>
            </div>
            <div style={{ padding: "15px", background: "#f0f9ff", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
              <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>ISO 3696</p>
              <p style={{ color: "#475569", fontSize: "12px", margin: "0" }}>
                International Organization for Standardization specifications for reagent water and other analytical purposes.
              </p>
            </div>
            <div style={{ padding: "15px", background: "#f0f9ff", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
              <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>EU Directive</p>
              <p style={{ color: "#475569", fontSize: "12px", margin: "0" }}>
                European Union 98/83/EC directive on quality of water intended for human consumption. Similar to WHO standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
