import Layout from "../components/Layout";
import { useState } from "react";

export default function Neutrality() {
  const [acidity, setAcidity] = useState(5);
  const [alkalinity, setAlkalinity] = useState(8);
  const [treatmentDose, setTreatmentDose] = useState(0);

  const neutralityIndex = Math.abs(acidity - alkalinity);
  const requiresTreatment = neutralityIndex > 2;
  const recommendedDose = requiresTreatment ? (neutralityIndex * 50) : 0;

  return (
    <Layout>
      <div style={{ padding: "40px" }}>
        <h1>🌱 Water Neutrality Management</h1>
        
        <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "#fef2f2", padding: "20px", borderRadius: "8px" }}>
            <label>Acidity (mmol/L)</label>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={acidity}
              onChange={(e) => setAcidity(Number(e.target.value))}
              style={{ width: "100%", marginTop: "10px" }}
            />
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#dc2626", marginTop: "10px" }}>{acidity.toFixed(1)}</p>
          </div>

          <div style={{ background: "#f0fdf4", padding: "20px", borderRadius: "8px" }}>
            <label>Alkalinity (mmol/L)</label>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={alkalinity}
              onChange={(e) => setAlkalinity(Number(e.target.value))}
              style={{ width: "100%", marginTop: "10px" }}
            />
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#16a34a", marginTop: "10px" }}>{alkalinity.toFixed(1)}</p>
          </div>
        </div>

        <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "#eff6ff", padding: "20px", borderRadius: "8px", border: "2px solid #0369a1" }}>
            <h3>Neutrality Index</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#0369a1", marginTop: "10px" }}>
              {neutralityIndex.toFixed(2)}
            </p>
            <small>Lower is better (target &lt; 2)</small>
          </div>

          <div style={{ background: requiresTreatment ? "#fef2f2" : "#f0fdf4", padding: "20px", borderRadius: "8px", border: `2px solid ${requiresTreatment ? "#dc2626" : "#16a34a"}` }}>
            <h3>Status</h3>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: requiresTreatment ? "#dc2626" : "#16a34a", marginTop: "10px" }}>
              {requiresTreatment ? "⚠ Treatment Required" : "✓ Balanced"}
            </p>
          </div>
        </div>

        {requiresTreatment && (
          <div style={{ marginTop: "30px", background: "#fef2f2", padding: "20px", borderRadius: "8px", border: "1px solid #fca5a5" }}>
            <h3>Treatment Recommendation</h3>
            <label style={{ marginTop: "15px", display: "block" }}>Recommended Dose (mg/L)</label>
            <input
              type="number"
              value={treatmentDose}
              onChange={(e) => setTreatmentDose(Number(e.target.value))}
              placeholder={recommendedDose.toFixed(0)}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", marginTop: "10px" }}
            />
            <p style={{ marginTop: "15px", color: "#666" }}>
              Suggested dose: {recommendedDose.toFixed(0)} mg/L to achieve neutrality
            </p>
          </div>
        )}

        <div style={{ marginTop: "30px", background: "#f8fafc", padding: "20px", borderRadius: "8px" }}>
          <h3>Balance Analysis</h3>
          <ul style={{ marginTop: "10px", lineHeight: "1.8" }}>
            <li>Acidity Level: {acidity <= 6 ? "Low" : acidity <= 8 ? "Neutral" : "High"}</li>
            <li>Alkalinity Level: {alkalinity <= 6 ? "Low" : alkalinity <= 8 ? "Neutral" : "High"}</li>
            <li>Treatment Status: {requiresTreatment ? "Active monitoring recommended" : "Within acceptable range"}</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
