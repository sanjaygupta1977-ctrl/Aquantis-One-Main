import Layout from "../components/Layout";

export default function KPICard() {
  const metrics = [
    { title: "Daily Water Usage", value: "45,320", unit: "m³", trend: "+2.3%", color: "#0369a1" },
    { title: "System Efficiency", value: "87.5", unit: "%", trend: "+1.2%", color: "#16a34a" },
    { title: "Cost Per m³", value: "2.45", unit: "$", trend: "-0.8%", color: "#b45309" },
    { title: "Reuse Rate", value: "62.3", unit: "%", trend: "+3.1%", color: "#38bdf8" },
    { title: "Energy Consumed", value: "12.4", unit: "MWh", trend: "-2.1%", color: "#06b6d4" },
    { title: "Quality Score", value: "94", unit: "/100", trend: "+0.5%", color: "#14b8a6" },
  ];

  return (
    <Layout>
      <div style={{ padding: "40px" }}>
        <h1>📈 KPI Dashboard</h1>
        <p style={{ color: "#666", marginTop: "10px" }}>Real-time performance indicators for your water system</p>

        <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                border: `2px solid ${metric.color}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <p style={{ fontSize: "14px", color: "#999", margin: 0 }}>{metric.title}</p>
              <p style={{ fontSize: "32px", fontWeight: "bold", color: metric.color, margin: "10px 0" }}>
                {metric.value}
                <span style={{ fontSize: "18px", marginLeft: "8px" }}>{metric.unit}</span>
              </p>
              <p style={{ fontSize: "14px", color: metric.trend.startsWith("+") ? "#16a34a" : "#dc2626", margin: 0 }}>
                {metric.trend} vs last week
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
          <div style={{ background: "#f8fafc", padding: "25px", borderRadius: "12px" }}>
            <h3>System Overview</h3>
            <div style={{ marginTop: "15px", lineHeight: "2" }}>
              <p>• Total Capacity: 100,000 m³/day</p>
              <p>• Current Load: 78%</p>
              <p>• Peak Hour: 14:30</p>
              <p>• Avg Temperature: 28.5°C</p>
              <p>• Pressure: 4.2 bar</p>
            </div>
          </div>

          <div style={{ background: "#f0fdf4", padding: "25px", borderRadius: "12px" }}>
            <h3>Alerts</h3>
            <div style={{ marginTop: "15px" }}>
              <p style={{ color: "#16a34a", margin: "10px 0" }}>✓ All systems operational</p>
              <p style={{ color: "#b45309", margin: "10px 0" }}>⚠ Scheduled maintenance in 3 days</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
