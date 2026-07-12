import Layout from "../components/Layout";
import { useState } from "react";

export default function CoolingTower() {
  const [inletTemp, setInletTemp] = useState(42);
  const [outletTemp, setOutletTemp] = useState(32);
  const [ambientTemp, setAmbientTemp] = useState(28);
  const [flowRate, setFlowRate] = useState(1000);

  const approachTemp = outletTemp - ambientTemp;
  const rangeTemp = inletTemp - outletTemp;
  const effectiveness = rangeTemp > 0 ? ((rangeTemp) / (inletTemp - ambientTemp) * 100) : 0;

  return (
    <Layout>
      <div style={{ padding: "40px" }}>
        <h1>🏭 Cooling Tower Management</h1>
        
        <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "#fef2f2", padding: "20px", borderRadius: "8px" }}>
            <label>Inlet Temperature (°C)</label>
            <input
              type="number"
              value={inletTemp}
              onChange={(e) => setInletTemp(Number(e.target.value))}
              style={{ width: "100%", marginTop: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#dc2626", marginTop: "10px" }}>{inletTemp}°C</p>
          </div>

          <div style={{ background: "#f0fdf4", padding: "20px", borderRadius: "8px" }}>
            <label>Outlet Temperature (°C)</label>
            <input
              type="number"
              value={outletTemp}
              onChange={(e) => setOutletTemp(Number(e.target.value))}
              style={{ width: "100%", marginTop: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#16a34a", marginTop: "10px" }}>{outletTemp}°C</p>
          </div>

          <div style={{ background: "#eff6ff", padding: "20px", borderRadius: "8px" }}>
            <label>Ambient Temperature (°C)</label>
            <input
              type="number"
              value={ambientTemp}
              onChange={(e) => setAmbientTemp(Number(e.target.value))}
              style={{ width: "100%", marginTop: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#0369a1", marginTop: "10px" }}>{ambientTemp}°C</p>
          </div>

          <div style={{ background: "#fef3c7", padding: "20px", borderRadius: "8px" }}>
            <label>Flow Rate (m³/h)</label>
            <input
              type="number"
              value={flowRate}
              onChange={(e) => setFlowRate(Number(e.target.value))}
              style={{ width: "100%", marginTop: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#b45309", marginTop: "10px" }}>{flowRate} m³/h</p>
          </div>
        </div>

        <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
          <div style={{ background: "#f9fafb", padding: "20px", borderRadius: "8px", border: "2px solid #38bdf8" }}>
            <h3>Range (°C)</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#38bdf8", marginTop: "10px" }}>{rangeTemp.toFixed(1)}</p>
            <small>Temperature drop through tower</small>
          </div>

          <div style={{ background: "#f9fafb", padding: "20px", borderRadius: "8px", border: "2px solid #06b6d4" }}>
            <h3>Approach (°C)</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#06b6d4", marginTop: "10px" }}>{approachTemp.toFixed(1)}</p>
            <small>Outlet temp above ambient</small>
          </div>

          <div style={{ background: "#f9fafb", padding: "20px", borderRadius: "8px", border: "2px solid #14b8a6" }}>
            <h3>Effectiveness (%)</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#14b8a6", marginTop: "10px" }}>{effectiveness.toFixed(1)}</p>
            <small>Cooling efficiency</small>
          </div>
        </div>

        <div style={{ marginTop: "30px", background: "#f8fafc", padding: "20px", borderRadius: "8px" }}>
          <h3>System Status</h3>
          <p style={{ marginTop: "10px", lineHeight: "1.8" }}>
            {effectiveness > 80 ? "✓ Excellent performance" : "⚠ Check cooling efficiency"}
          </p>
        </div>
      </div>
    </Layout>
  );
}
