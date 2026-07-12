import { useState } from "react";
import Layout from "../components/Layout";

export default function WaterQuality() {
  const [ph, setPh] = useState(7.0);
  const [turbidity, setTurbidity] = useState(0.5);
  const [tds, setTds] = useState(500);

  const getQualityStatus = () => {
    if (ph < 6.5 || ph > 8.5) return "Poor";
    if (turbidity > 1) return "Fair";
    if (tds > 1000) return "Fair";
    return "Excellent";
  };

  return (
    <Layout>
      <div style={{ padding: "40px" }}>
        <h1>🧪 Water Quality Analysis</h1>
        
        <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "#f0f9ff", padding: "20px", borderRadius: "8px" }}>
            <label>pH Level</label>
            <input
              type="range"
              min="0"
              max="14"
              step="0.1"
              value={ph}
              onChange={(e) => setPh(Number(e.target.value))}
              style={{ width: "100%", marginTop: "10px" }}
            />
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#0369a1" }}>{ph.toFixed(1)}</p>
          </div>

          <div style={{ background: "#f0fdf4", padding: "20px", borderRadius: "8px" }}>
            <label>Turbidity (NTU)</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={turbidity}
              onChange={(e) => setTurbidity(Number(e.target.value))}
              style={{ width: "100%", marginTop: "10px" }}
            />
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#16a34a" }}>{turbidity.toFixed(1)}</p>
          </div>

          <div style={{ background: "#fef3c7", padding: "20px", borderRadius: "8px" }}>
            <label>TDS (mg/L)</label>
            <input
              type="range"
              min="0"
              max="2000"
              step="10"
              value={tds}
              onChange={(e) => setTds(Number(e.target.value))}
              style={{ width: "100%", marginTop: "10px" }}
            />
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#b45309" }}>{tds}</p>
          </div>

          <div style={{ background: "#fecaca", padding: "20px", borderRadius: "8px" }}>
            <label>Overall Quality</label>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#dc2626", marginTop: "10px" }}>
              {getQualityStatus()}
            </p>
          </div>
        </div>

        <div style={{ marginTop: "30px", background: "#f8fafc", padding: "20px", borderRadius: "8px" }}>
          <h3>Quality Standards Met:</h3>
          <ul style={{ marginTop: "10px", lineHeight: "1.8" }}>
            <li>✓ pH: {ph >= 6.5 && ph <= 8.5 ? "Compliant" : "Out of Range"}</li>
            <li>✓ Turbidity: {turbidity <= 1 ? "Compliant" : "Exceeds Limit"}</li>
            <li>✓ TDS: {tds <= 1000 ? "Compliant" : "Exceeds Limit"}</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
