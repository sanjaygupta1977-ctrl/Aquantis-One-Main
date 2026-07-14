import Layout from "../components/Layout";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [units, setUnits] = useState(1000);
  const [directWater, setDirectWater] = useState(100000);
  const [indirectWater, setIndirectWater] = useState(1080000);
  const [showVirtualWaterResult, setShowVirtualWaterResult] = useState(false);

  const totalVirtualWater = directWater + indirectWater;
  const perUnitWater = units > 0 ? totalVirtualWater / units : 0;

  const waterTrendData = [
    { time: "6 AM", usage: 12000 },
    { time: "9 AM", usage: 18000 },
    { time: "12 PM", usage: 22000 },
    { time: "3 PM", usage: 19000 },
    { time: "6 PM", usage: 16000 },
    { time: "9 PM", usage: 14000 },
  ];

  const summaryCards = [
    { title: "Today's Water Usage", value: "45.2K", unit: "m³", change: "+8.2%", status: "normal", icon: "💧", borderColor: "#0284c7" },
    { title: "System Efficiency", value: "87.3", unit: "%", change: "+2.1%", status: "good", icon: "⚡", borderColor: "#16a34a" },
    { title: "Water Quality", value: "94", unit: "/100", change: "Optimal", status: "good", icon: "✓", borderColor: "#ca8a04" },
    { title: "Active Alerts", value: "2", unit: "alerts", change: "1 warning", status: "warning", icon: "🔔", borderColor: "#dc2626" },
  ];

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "50px" }}>
          <h1 style={{ color: "#0f172a", fontSize: "48px", fontWeight: "800", margin: "0 0 10px 0", letterSpacing: "-1px" }}>
            Water Intelligence Platform
          </h1>
          <p style={{ color: "#64748b", fontSize: "16px", margin: "0" }}>
            Real-time monitoring and analytics for optimal water management
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "50px" }}>
          {summaryCards.map((card, idx) => (
            <div
              key={idx}
              style={{
                background: "white",
                padding: "28px",
                borderRadius: "16px",
                border: `3px solid ${card.borderColor}`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <p style={{ color: "#64748b", fontSize: "13px", fontWeight: "600", margin: "0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {card.title}
                </p>
                <span style={{ fontSize: "36px" }}>{card.icon}</span>
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "42px", fontWeight: "800", color: card.borderColor, margin: "0" }}>
                  {card.value}
                  <span style={{ fontSize: "20px", color: "#94a3b8", marginLeft: "8px" }}>{card.unit}</span>
                </div>
              </div>

              <div style={{
                padding: "10px 14px",
                background: card.status === "good" ? "#dcfce7" : card.status === "warning" ? "#fef08a" : "#e0f2fe",
                color: card.status === "good" ? "#166534" : card.status === "warning" ? "#854d0e" : "#0c4a6e",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                textAlign: "center",
              }}>
                {card.change}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "50px" }}>
          {/* Water Usage Trend */}
          <div style={{ background: "white", padding: "32px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 24px 0" }}>
              💧 Water Usage Trend
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={waterTrendData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "white" }} />
                <Area type="monotone" dataKey="usage" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats */}
          <div style={{ background: "white", padding: "32px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 24px 0" }}>⚡ Quick Stats</h2>
            
            <div style={{ padding: "16px 0", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>♻️</span>
                <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "500" }}>Reuse Rate</span>
              </div>
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#16a34a" }}>62.3%</span>
            </div>

            <div style={{ padding: "16px 0", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>❤️</span>
                <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "500" }}>System Health</span>
              </div>
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#dc2626" }}>94%</span>
            </div>

            <div style={{ padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>🌡️</span>
                <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "500" }}>Avg Temp</span>
              </div>
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#f59e0b" }}>28.5°C</span>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "50px" }}>
          {/* Quality Metrics */}
          <div style={{ background: "white", padding: "32px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 24px 0" }}>🧪 Water Quality</h2>
            
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>pH Level</span>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#0284c7" }}>7.2</span>
              </div>
              <div style={{ height: "12px", background: "#e2e8f0", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#0284c7", width: "35%", borderRadius: "6px" }} />
              </div>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "6px 0 0 0" }}>Target: 7.0</p>
            </div>
            
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>Turbidity</span>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#16a34a" }}>0.4</span>
              </div>
              <div style={{ height: "12px", background: "#e2e8f0", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#16a34a", width: "40%", borderRadius: "6px" }} />
              </div>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "6px 0 0 0" }}>Target: 0.5</p>
            </div>
            
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>TDS</span>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#f59e0b" }}>480</span>
              </div>
              <div style={{ height: "12px", background: "#e2e8f0", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#f59e0b", width: "48%", borderRadius: "6px" }} />
              </div>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "6px 0 0 0" }}>Target: 500</p>
            </div>
          </div>

          {/* Status & Alerts */}
          <div style={{ background: "white", padding: "32px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 24px 0" }}>📊 System Status</h2>
            
            <div style={{ padding: "16px", marginBottom: "12px", borderRadius: "10px", background: "#dcfce7", borderLeft: "4px solid #16a34a", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "18px" }}>✓</span>
              <span style={{ color: "#166534", fontSize: "13px", fontWeight: "500" }}>All systems operational</span>
            </div>

            <div style={{ padding: "16px", marginBottom: "12px", borderRadius: "10px", background: "#fef08a", borderLeft: "4px solid #ca8a04", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "18px" }}>⚠</span>
              <span style={{ color: "#854d0e", fontSize: "13px", fontWeight: "500" }}>Maintenance scheduled in 3 days</span>
            </div>

            <div style={{ padding: "16px", borderRadius: "10px", background: "#dbeafe", borderLeft: "4px solid #0284c7", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "18px" }}>ℹ</span>
              <span style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "500" }}>Latest backup completed</span>
            </div>
          </div>
        </div>

        {/* Water Neutrality Section */}
        <div style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)", padding: "40px", borderRadius: "16px", border: "2px solid #0284c7", marginBottom: "50px" }}>
          <h2 style={{ color: "#0c4a6e", fontSize: "28px", fontWeight: "800", margin: "0 0 20px 0" }}>🌍 Water Neutrality: A Noble Concept</h2>
          
          <p style={{ color: "#0c4a6e", fontSize: "16px", lineHeight: "1.8", margin: "0 0 20px 0" }}>
            Water neutrality represents a paradigm shift in sustainable water management. It's about creating a balance where industrial operations don't deplete natural water resources or degrade water quality for future generations.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            <div style={{ background: "white", padding: "20px", borderRadius: "12px", borderLeft: "4px solid #0284c7" }}>
              <h3 style={{ color: "#0284c7", fontSize: "16px", fontWeight: "700", margin: "0 0 10px 0" }}>Reduce</h3>
              <p style={{ color: "#475569", fontSize: "14px", margin: "0", lineHeight: "1.6" }}>Minimize water consumption through process optimization, leak detection, and water-efficient equipment. Typical facilities reduce consumption by 30-50%.</p>
            </div>

            <div style={{ background: "white", padding: "20px", borderRadius: "12px", borderLeft: "4px solid #16a34a" }}>
              <h3 style={{ color: "#16a34a", fontSize: "16px", fontWeight: "700", margin: "0 0 10px 0" }}>Reuse</h3>
              <p style={{ color: "#475569", fontSize: "14px", margin: "0", lineHeight: "1.6" }}>Implement circular water economy through rainwater harvesting, wastewater recycling, and cascading water use. Achieve 70%+ reuse rates.</p>
            </div>

            <div style={{ background: "white", padding: "20px", borderRadius: "12px", borderLeft: "4px solid #ca8a04" }}>
              <h3 style={{ color: "#ca8a04", fontSize: "16px", fontWeight: "700", margin: "0 0 10px 0" }}>Restore</h3>
              <p style={{ color: "#475569", fontSize: "14px", margin: "0", lineHeight: "1.6" }}>Return treated water to the environment. Advanced treatment removes contaminants; aquifer recharge restores groundwater systems.</p>
            </div>
          </div>
        </div>

        {/* Interactive Virtual Water Calculator */}
        <div style={{ marginTop: "50px", background: "linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%)", padding: "40px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "2px solid #8b5cf6" }}>
          <h2 style={{ color: "#6d28d9", fontSize: "28px", fontWeight: "800", margin: "0 0 30px 0" }}>🔧 Virtual Water Calculator - Run Live</h2>

          <div style={{ background: "white", padding: "30px", borderRadius: "12px", marginBottom: "30px" }}>
            <h3 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>Calculate Your Virtual Water Footprint</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", color: "#0f172a", fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>Number of Units (production)</label>
                <input
                  type="number"
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "2px solid #8b5cf6", fontSize: "14px", boxSizing: "border-box" }}
                />
                <p style={{ color: "#666", fontSize: "12px", margin: "8px 0 0 0" }}>Units: {units.toLocaleString()}</p>
              </div>

              <div>
                <label style={{ display: "block", color: "#0f172a", fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>Direct Water Use (L)</label>
                <input
                  type="number"
                  value={directWater}
                  onChange={(e) => setDirectWater(Number(e.target.value))}
                  style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "2px solid #8b5cf6", fontSize: "14px", boxSizing: "border-box" }}
                />
                <p style={{ color: "#666", fontSize: "12px", margin: "8px 0 0 0" }}>Direct: {directWater.toLocaleString()} L</p>
              </div>

              <div>
                <label style={{ display: "block", color: "#0f172a", fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>Indirect Water Use (L)</label>
                <input
                  type="number"
                  value={indirectWater}
                  onChange={(e) => setIndirectWater(Number(e.target.value))}
                  style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "2px solid #8b5cf6", fontSize: "14px", boxSizing: "border-box" }}
                />
                <p style={{ color: "#666", fontSize: "12px", margin: "8px 0 0 0" }}>Indirect: {indirectWater.toLocaleString()} L</p>
              </div>
            </div>

            <button
              onClick={() => setShowVirtualWaterResult(!showVirtualWaterResult)}
              style={{
                width: "100%",
                padding: "14px",
                background: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#7c3aed"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#8b5cf6"}
            >
              {showVirtualWaterResult ? "Hide Results" : "Calculate Virtual Water"}
            </button>
          </div>

          {showVirtualWaterResult && (
            <div style={{ background: "white", padding: "30px", borderRadius: "12px", border: "2px solid #8b5cf6" }}>
              <h3 style={{ color: "#6d28d9", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>Your Virtual Water Results</h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginBottom: "20px" }}>
                <div style={{ background: "#f3e8ff", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                  <p style={{ color: "#666", fontSize: "12px", margin: "0 0 8px 0", textTransform: "uppercase" }}>Direct Water</p>
                  <p style={{ color: "#6d28d9", fontSize: "24px", fontWeight: "800", margin: "0" }}>{directWater.toLocaleString()}</p>
                  <p style={{ color: "#666", fontSize: "12px", margin: "5px 0 0 0" }}>Liters</p>
                </div>

                <div style={{ background: "#f3e8ff", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                  <p style={{ color: "#666", fontSize: "12px", margin: "0 0 8px 0", textTransform: "uppercase" }}>Indirect Water</p>
                  <p style={{ color: "#6d28d9", fontSize: "24px", fontWeight: "800", margin: "0" }}>{indirectWater.toLocaleString()}</p>
                  <p style={{ color: "#666", fontSize: "12px", margin: "5px 0 0 0" }}>Liters</p>
                </div>

                <div style={{ background: "#fef3c7", padding: "20px", borderRadius: "8px", textAlign: "center", border: "3px solid #ca8a04" }}>
                  <p style={{ color: "#854d0e", fontSize: "12px", margin: "0 0 8px 0", textTransform: "uppercase", fontWeight: "700" }}>Total Virtual Water</p>
                  <p style={{ color: "#ca8a04", fontSize: "28px", fontWeight: "800", margin: "0" }}>{totalVirtualWater.toLocaleString()}</p>
                  <p style={{ color: "#854d0e", fontSize: "12px", margin: "5px 0 0 0", fontWeight: "700" }}>Liters</p>
                </div>

                <div style={{ background: "#e0e7ff", padding: "20px", borderRadius: "8px", textAlign: "center", border: "3px solid #6366f1" }}>
                  <p style={{ color: "#4338ca", fontSize: "12px", margin: "0 0 8px 0", textTransform: "uppercase", fontWeight: "700" }}>Per Unit</p>
                  <p style={{ color: "#6366f1", fontSize: "28px", fontWeight: "800", margin: "0" }}>{perUnitWater.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
                  <p style={{ color: "#4338ca", fontSize: "12px", margin: "5px 0 0 0", fontWeight: "700" }}>L/unit</p>
                </div>
              </div>

              <div style={{ background: "#fef08a", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #ca8a04" }}>
                <p style={{ color: "#0f172a", margin: "0 0 10px 0", fontWeight: "700" }}>Formula Used:</p>
                <p style={{ color: "#854d0e", margin: "0 0 5px 0", fontSize: "14px", fontFamily: "monospace" }}>Total Virtual Water = Direct ({directWater.toLocaleString()} L) + Indirect ({indirectWater.toLocaleString()} L)</p>
                <p style={{ color: "#854d0e", margin: "0", fontSize: "14px", fontFamily: "monospace" }}>Per Unit = {totalVirtualWater.toLocaleString()} L ÷ {units} units = {perUnitWater.toLocaleString("en-US", { maximumFractionDigits: 2 })} L/unit</p>
              </div>

              <div style={{ background: "#dbeafe", padding: "20px", borderRadius: "8px", marginTop: "15px", borderLeft: "4px solid #0284c7" }}>
                <p style={{ color: "#0c4a6e", fontSize: "13px", margin: "0" }}>
                  <strong>Impact:</strong> Your production of {units.toLocaleString()} units uses {(totalVirtualWater / 1000000).toFixed(2)} million liters of virtual water. Reducing by 10% would save {(totalVirtualWater * 0.1 / 1000000).toFixed(2)} million liters annually.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
