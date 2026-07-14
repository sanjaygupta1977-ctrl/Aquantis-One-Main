import Layout from "../components/Layout";
import { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function IntegratedResourceManagement() {
  const [selectedView, setSelectedView] = useState("overview");

  // Water flow data from all systems
  const waterFlowData = [
    { source: "Cooling Towers", volume: 200, color: "#0284c7" },
    { source: "Drinking Water", volume: 45, color: "#10b981" },
    { source: "Process Water", volume: 120, color: "#8b5cf6" },
    { source: "Recycled Water", volume: 85, color: "#ca8a04" },
  ];

  // Carbon footprint breakdown
  const carbonBreakdown = [
    { category: "Energy", emissions: 2500, percentage: 35 },
    { category: "Transportation", emissions: 1800, percentage: 25 },
    { category: "Water Treatment", emissions: 1200, percentage: 17 },
    { category: "Chemicals", emissions: 900, percentage: 13 },
    { category: "Waste", emissions: 600, percentage: 10 },
  ];

  // System health metrics
  const systemHealth = [
    { system: "Cooling Towers", health: 78, status: "GOOD", issues: 2 },
    { system: "Drinking Water", health: 92, status: "EXCELLENT", issues: 0 },
    { system: "Carbon Management", health: 65, status: "FAIR", issues: 3 },
    { system: "Water Footprint", health: 81, status: "GOOD", issues: 1 },
    { system: "Energy Efficiency", health: 76, status: "GOOD", issues: 2 },
  ];

  // Daily resource usage trend
  const dailyTrend = [
    { time: "00:00", water: 280, energy: 450, waste: 12 },
    { time: "04:00", water: 200, energy: 350, waste: 8 },
    { time: "08:00", water: 380, energy: 650, waste: 18 },
    { time: "12:00", water: 420, energy: 720, waste: 22 },
    { time: "16:00", water: 450, energy: 780, waste: 25 },
    { time: "20:00", water: 400, energy: 600, waste: 20 },
    { time: "24:00", water: 320, energy: 500, waste: 15 },
  ];

  // Resource efficiency recommendations
  const recommendations = [
    {
      priority: "HIGH",
      system: "Cooling Tower B",
      issue: "High TDS (1520 mg/L)",
      action: "Increase blowdown rate by 2%",
      savings: "450 GPM water/day",
      impact: "Reduce cycles, improve efficiency",
    },
    {
      priority: "HIGH",
      system: "Carbon Footprint",
      issue: "Biodiversity index at 58%",
      action: "Plant 100 trees for offset",
      savings: "2 tons CO2e/year",
      impact: "ESG compliance +15%",
    },
    {
      priority: "MEDIUM",
      system: "Energy Management",
      issue: "Peak load at 16:00",
      action: "Shift non-critical loads to 22:00",
      savings: "180 kWh/day",
      impact: "Reduce peak demand charges",
    },
    {
      priority: "MEDIUM",
      system: "Drinking Water",
      issue: "pH drifting to 7.2",
      action: "Adjust buffer capacity",
      savings: "5% treatment chemical cost",
      impact: "Improve water stability",
    },
  ];

  // System interconnections
  const connections = [
    { from: "Cooling Towers", to: "Water Footprint", flow: "45%" },
    { from: "Process Water", to: "Carbon Management", flow: "30%" },
    { from: "Recycled Water", to: "Cooling Towers", flow: "60%" },
    { from: "Drinking Water", to: "Process Water", flow: "25%" },
    { from: "Energy", to: "All Systems", flow: "100%" },
  ];

  // KPIs
  const totalWaterUsage = waterFlowData.reduce((sum, item) => sum + item.volume, 0);
  const totalCarbonEmissions = carbonBreakdown.reduce((sum, item) => sum + item.emissions, 0);
  const averageSystemHealth = (systemHealth.reduce((sum, item) => sum + item.health, 0) / systemHealth.length).toFixed(1);
  const totalIssues = systemHealth.reduce((sum, item) => sum + item.issues, 0);

  // Water efficiency calculation
  const waterEfficiency = 78; // % - calculated from all systems
  const carbonReduction = 24; // % vs baseline
  const costSavings = 12500; // monthly savings from optimization

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "36px", fontWeight: "800", margin: "0 0 10px 0" }}>
          🔗 Integrated Resource Management Dashboard
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 40px 0" }}>
          Connected view of all water, carbon, energy, and ecosystem management systems for holistic optimization
        </p>

        {/* KPI Overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #0284c7" }}>
            <p style={{ color: "#0c2340", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>Total Water Usage</p>
            <p style={{ color: "#0284c7", fontSize: "40px", fontWeight: "800", margin: "0" }}>{totalWaterUsage}</p>
            <p style={{ color: "#0c2340", fontSize: "12px", margin: "8px 0 0 0" }}>Million GPM Daily</p>
          </div>

          <div style={{ background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #dc2626" }}>
            <p style={{ color: "#7f1d1d", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>Carbon Emissions</p>
            <p style={{ color: "#dc2626", fontSize: "40px", fontWeight: "800", margin: "0" }}>{(totalCarbonEmissions / 1000).toFixed(1)}</p>
            <p style={{ color: "#7f1d1d", fontSize: "12px", margin: "8px 0 0 0" }}>Metric Tons CO2e</p>
          </div>

          <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #10b981" }}>
            <p style={{ color: "#065f46", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>System Health</p>
            <p style={{ color: "#10b981", fontSize: "40px", fontWeight: "800", margin: "0" }}>{averageSystemHealth}%</p>
            <p style={{ color: "#065f46", fontSize: "12px", margin: "8px 0 0 0" }}>Average Across All</p>
          </div>

          <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #ca8a04" }}>
            <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>Monthly Cost Savings</p>
            <p style={{ color: "#ca8a04", fontSize: "40px", fontWeight: "800", margin: "0" }}>${(costSavings / 1000).toFixed(0)}k</p>
            <p style={{ color: "#854d0e", fontSize: "12px", margin: "8px 0 0 0" }}>From Optimization</p>
          </div>
        </div>

        {/* View Selector */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
          {["overview", "systems", "recommendations", "connections"].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "2px solid",
                background: selectedView === view ? "#0284c7" : "white",
                color: selectedView === view ? "white" : "#0284c7",
                borderColor: "#0284c7",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s",
                textTransform: "capitalize",
              }}
            >
              {view}
            </button>
          ))}
        </div>

        {/* OVERVIEW VIEW */}
        {selectedView === "overview" && (
          <>
            {/* Water & Carbon Distribution */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px", marginBottom: "40px" }}>
              <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <h2 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>💧 Water Sources Distribution</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={waterFlowData} cx="50%" cy="50%" labelLine={false} label={({ value }) => `${value}M`} outerRadius={80}>
                      {waterFlowData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <h2 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>🌍 Carbon Emissions Breakdown</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={carbonBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="emissions" fill="#dc2626" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Resource Trend */}
            <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
              <h2 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>📊 Daily Resource Usage Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="water" stroke="#0284c7" name="Water (GPM)" strokeWidth={2} />
                  <Line type="monotone" dataKey="energy" stroke="#f59e0b" name="Energy (kWh)" strokeWidth={2} />
                  <Line type="monotone" dataKey="waste" stroke="#8b5cf6" name="Waste (tons)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* SYSTEMS VIEW */}
        {selectedView === "systems" && (
          <div style={{ display: "grid", gap: "15px" }}>
            <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>System Health & Status</h2>
            {systemHealth.map((system, idx) => {
              const statusColor = system.status === "EXCELLENT" ? "#10b981" : system.status === "GOOD" ? "#0284c7" : "#ca8a04";
              return (
                <div key={idx} style={{ background: "white", padding: "20px", borderRadius: "12px", borderLeft: `4px solid ${statusColor}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div>
                      <p style={{ color: "#0f172a", fontSize: "15px", fontWeight: "700", margin: "0 0 5px 0" }}>{system.system}</p>
                      <p style={{ color: "#666", fontSize: "12px", margin: "0" }}>{system.issues} active issues</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ color: statusColor, fontSize: "28px", fontWeight: "800", margin: "0" }}>{system.health}%</p>
                      <p style={{ color: statusColor, fontSize: "12px", fontWeight: "700", margin: "5px 0 0 0", textTransform: "uppercase" }}>
                        {system.status}
                      </p>
                    </div>
                  </div>
                  <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: statusColor, width: `${system.health}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* RECOMMENDATIONS VIEW */}
        {selectedView === "recommendations" && (
          <div style={{ display: "grid", gap: "20px" }}>
            <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🎯 Priority Actions & Recommendations</h2>
            {recommendations.map((rec, idx) => {
              const priorityColor = rec.priority === "HIGH" ? "#dc2626" : rec.priority === "MEDIUM" ? "#ca8a04" : "#0284c7";
              return (
                <div key={idx} style={{ background: "white", padding: "25px", borderRadius: "12px", border: `2px solid ${priorityColor}`, borderLeft: `6px solid ${priorityColor}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                    <div>
                      <p style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 5px 0" }}>{rec.system}</p>
                      <p style={{ color: priorityColor, fontSize: "12px", fontWeight: "700", margin: "0", textTransform: "uppercase" }}>
                        {rec.priority} PRIORITY
                      </p>
                    </div>
                    <span style={{ background: priorityColor, color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>
                      {rec.priority}
                    </span>
                  </div>

                  <div style={{ background: "#f9fafb", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
                    <p style={{ color: "#666", fontSize: "13px", margin: "0 0 8px 0" }}>
                      <strong>Issue:</strong> {rec.issue}
                    </p>
                    <p style={{ color: "#666", fontSize: "13px", margin: "0" }}>
                      <strong>Action:</strong> {rec.action}
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <div style={{ background: "#f0fdf4", padding: "12px", borderRadius: "8px" }}>
                      <p style={{ color: "#065f46", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0" }}>💰 Savings</p>
                      <p style={{ color: "#10b981", fontSize: "14px", fontWeight: "700", margin: "0" }}>{rec.savings}</p>
                    </div>
                    <div style={{ background: "#f0f9ff", padding: "12px", borderRadius: "8px" }}>
                      <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0" }}>📈 Impact</p>
                      <p style={{ color: "#0284c7", fontSize: "14px", fontWeight: "700", margin: "0" }}>{rec.impact}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CONNECTIONS VIEW */}
        {selectedView === "connections" && (
          <>
            <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
              <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🔄 System Interconnections</h2>
              <div style={{ display: "grid", gap: "15px" }}>
                {connections.map((conn, idx) => (
                  <div key={idx} style={{ background: "#f9fafb", padding: "15px", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: "#666", fontSize: "12px", margin: "0" }}>FROM</p>
                        <p style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "3px 0 0 0" }}>{conn.from}</p>
                      </div>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <p style={{ color: "#0284c7", fontSize: "20px", margin: "0" }}>→</p>
                        <p style={{ color: "#0284c7", fontSize: "12px", fontWeight: "700", margin: "5px 0 0 0" }}>{conn.flow}</p>
                      </div>
                      <div style={{ flex: 1, textAlign: "right" }}>
                        <p style={{ color: "#666", fontSize: "12px", margin: "0" }}>TO</p>
                        <p style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "3px 0 0 0" }}>{conn.to}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #0284c7" }}>
              <h2 style={{ color: "#0c4a6e", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>💡 Integration Benefits</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
                  <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 8px 0" }}>📊 Real-Time Data Sync</p>
                  <p style={{ color: "#0369a1", fontSize: "12px", margin: "0" }}>All systems share live metrics for immediate decision-making</p>
                </div>
                <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
                  <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 8px 0" }}>🎯 Smart Optimization</p>
                  <p style={{ color: "#0369a1", fontSize: "12px", margin: "0" }}>Adjust one system, automatically optimize dependent systems</p>
                </div>
                <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
                  <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 8px 0" }}>💰 Cost Reduction</p>
                  <p style={{ color: "#0369a1", fontSize: "12px", margin: "0" }}>Cross-system efficiency gains reduce overall operational costs</p>
                </div>
                <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
                  <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 8px 0" }}>🌱 ESG Compliance</p>
                  <p style={{ color: "#0369a1", fontSize: "12px", margin: "0" }}>Unified reporting for environmental, social, governance goals</p>
                </div>
                <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
                  <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 8px 0" }}>⚠️ Risk Management</p>
                  <p style={{ color: "#0369a1", fontSize: "12px", margin: "0" }}>Early warning system detects cascading failures across systems</p>
                </div>
                <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
                  <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 8px 0" }}>📈 Scalability</p>
                  <p style={{ color: "#0369a1", fontSize: "12px", margin: "0" }}>Easy to add new systems and integrate third-party tools</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Integration Summary */}
        <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #ca8a04", marginTop: "40px" }}>
          <h2 style={{ color: "#854d0e", fontSize: "18px", fontWeight: "700", margin: "0 0 15px 0" }}>📋 Current Integration Status</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            <div>
              <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 5px 0" }}>✓ Water Efficiency</p>
              <p style={{ color: "#92400e", fontSize: "16px", fontWeight: "800", margin: "0" }}>{waterEfficiency}%</p>
            </div>
            <div>
              <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 5px 0" }}>↓ Carbon Reduction</p>
              <p style={{ color: "#92400e", fontSize: "16px", fontWeight: "800", margin: "0" }}>-{carbonReduction}%</p>
            </div>
            <div>
              <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 5px 0" }}>🔧 Total Issues</p>
              <p style={{ color: "#92400e", fontSize: "16px", fontWeight: "800", margin: "0" }}>{totalIssues}</p>
            </div>
            <div>
              <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 5px 0" }}>✓ Systems Connected</p>
              <p style={{ color: "#92400e", fontSize: "16px", fontWeight: "800", margin: "0" }}>13 / 13</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
