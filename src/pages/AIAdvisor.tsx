import Layout from "../components/Layout";
import { useState } from "react";

export default function AIAdvisor() {
  const [waterInput, setWaterInput] = useState(50000);
  const [systemLoad, setSystemLoad] = useState(75);

  const recommendations = [
    { icon: "💡", title: "Optimize Cooling Tower", detail: "Current efficiency at 82%. Increase water circulation by 15% to reach 90%.", priority: "High" },
    { icon: "🌊", title: "Reuse Water Cycle", detail: "58% of discharge water can be reused. Install additional filtration for 5-10% cost savings.", priority: "High" },
    { icon: "🔧", title: "Preventive Maintenance", detail: "Scheduled maintenance due in 3 days. Inspect pump bearings and heat exchanger.", priority: "Medium" },
    { icon: "📉", title: "Reduce Peak Load", detail: "Shift 20% of daytime operations to night hours to reduce energy costs by 8%.", priority: "Medium" },
    { icon: "🎯", title: "Quality Monitoring", detail: "Increase monitoring frequency from 4 to 6 tests daily for better compliance tracking.", priority: "Low" },
  ];

  const getAIInsight = () => {
    if (systemLoad > 85) return "⚠ System overloaded. Recommend load balancing immediately.";
    if (waterInput > 80000) return "💧 High water input detected. Consider alternative sources.";
    return "✓ System operating normally. All parameters within safe limits.";
  };

  return (
    <Layout>
      <div style={{ padding: "40px" }}>
        <h1>🤖 AI Advisor</h1>
        <p style={{ color: "#666", marginTop: "10px" }}>Machine learning-powered insights and recommendations</p>

        <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "#eff6ff", padding: "20px", borderRadius: "8px" }}>
            <label>System Water Input (m³/day)</label>
            <input
              type="range"
              min="20000"
              max="100000"
              step="5000"
              value={waterInput}
              onChange={(e) => setWaterInput(Number(e.target.value))}
              style={{ width: "100%", marginTop: "10px" }}
            />
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#0369a1", marginTop: "10px" }}>{waterInput.toLocaleString()} m³</p>
          </div>

          <div style={{ background: "#fef3c7", padding: "20px", borderRadius: "8px" }}>
            <label>System Load</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={systemLoad}
              onChange={(e) => setSystemLoad(Number(e.target.value))}
              style={{ width: "100%", marginTop: "10px" }}
            />
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#b45309", marginTop: "10px" }}>{systemLoad}%</p>
          </div>
        </div>

        <div style={{ marginTop: "30px", background: "#f0fdf4", padding: "25px", borderRadius: "8px", border: "2px solid #16a34a" }}>
          <h3>Current AI Analysis</h3>
          <p style={{ fontSize: "16px", marginTop: "15px", lineHeight: "1.6" }}>{getAIInsight()}</p>
        </div>

        <div style={{ marginTop: "40px" }}>
          <h2>Recommendations</h2>
          <div style={{ marginTop: "20px", display: "grid", gap: "15px" }}>
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  border: `2px solid ${rec.priority === "High" ? "#dc2626" : rec.priority === "Medium" ? "#b45309" : "#6b7280"}`,
                  display: "grid",
                  gridTemplateColumns: "50px 1fr auto",
                  gap: "15px",
                  alignItems: "start",
                }}
              >
                <span style={{ fontSize: "28px" }}>{rec.icon}</span>
                <div>
                  <h4 style={{ margin: "0 0 5px 0" }}>{rec.title}</h4>
                  <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>{rec.detail}</p>
                </div>
                <span
                  style={{
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    background: rec.priority === "High" ? "#fee2e2" : rec.priority === "Medium" ? "#fef3c7" : "#f3f4f6",
                    color: rec.priority === "High" ? "#dc2626" : rec.priority === "Medium" ? "#b45309" : "#6b7280",
                  }}
                >
                  {rec.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "30px", background: "#f8fafc", padding: "20px", borderRadius: "8px" }}>
          <h3>AI Model Performance</h3>
          <p style={{ marginTop: "10px", color: "#666" }}>
            Accuracy: 94.2% | Last Updated: Today at 14:32 | Training Data: 180 days
          </p>
        </div>
      </div>
    </Layout>
  );
}
