import Layout from "../components/Layout";
import LinkedFilesSection from "../components/LinkedFilesSection";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const API_BASE = "/api";

const WATER_QUALITY_PARAMETERS = [
  { name: 'pH', unit: '-', indian: '6.5-8.5', international: '6.5-8.5', typical: 7.2 },
  { name: 'Dissolved Oxygen', unit: 'mg/L', indian: '>5.0', international: '>6.0', typical: 6.5 },
  { name: 'Total Suspended Solids', unit: 'mg/L', indian: '<100', international: '<50', typical: 45 },
  { name: 'Turbidity', unit: 'NTU', indian: '<5', international: '<1', typical: 2 },
  { name: 'BOD', unit: 'mg/L', indian: '<30', international: '<10', typical: 8 },
  { name: 'COD', unit: 'mg/L', indian: '<250', international: '<100', typical: 75 },
  { name: 'Total Nitrogen', unit: 'mg/L', indian: '<100', international: '<50', typical: 35 },
  { name: 'Total Phosphorus', unit: 'mg/L', indian: '<5', international: '<1', typical: 0.8 },
  { name: 'Temperature', unit: '°C', indian: '<35', international: '<33', typical: 28 },
  { name: 'Conductivity', unit: 'µS/cm', indian: '<2250', international: '<1500', typical: 1200 },
  { name: 'Iron', unit: 'mg/L', indian: '<0.3', international: '<0.2', typical: 0.15 },
  { name: 'Copper', unit: 'mg/L', indian: '<1.3', international: '<1.0', typical: 0.5 },
];

interface PlantData {
  plant_id: string;
  plant_name: string;
  latitude: number;
  longitude: number;
  capacity_mw: number;
  water_source: string;
  water_intake_m3_day: number;
  cooling_type: string;
}

export default function ThermalPowerPlantWaterQuality() {
  const [plantData, setPlantData] = useState<PlantData>({
    plant_id: `TPP-${Date.now()}`,
    plant_name: 'Thermal Power Plant - Unit 1',
    latitude: 20.5937,
    longitude: 78.9629,
    capacity_mw: 500,
    water_source: 'River',
    water_intake_m3_day: 50000,
    cooling_type: 'Closed-loop'
  });

  const [measurements, setMeasurements] = useState<Record<string, number>>({
    'pH': 7.2,
    'Dissolved Oxygen': 6.5,
    'Total Suspended Solids': 45,
    'Turbidity': 2,
    'BOD': 8,
    'COD': 75,
    'Total Nitrogen': 35,
    'Total Phosphorus': 0.8,
    'Temperature': 28,
    'Conductivity': 1200,
    'Iron': 0.15,
    'Copper': 0.5,
  });

  const [complianceReport, setComplianceReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleMeasurementChange = (param: string, value: number) => {
    setMeasurements({ ...measurements, [param]: value });
  };

  const handleSavePlant = async () => {
    try {
      await fetch(`${API_BASE}/thermal-power-plant/save-plant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plantData),
      });
    } catch (err) {
      console.error('Error saving plant:', err);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);

    // Save plant first
    await handleSavePlant();

    try {
      // Save quality parameters
      const parameters = WATER_QUALITY_PARAMETERS.map(p => ({
        parameter_name: p.name,
        value: measurements[p.name],
        unit: p.unit,
        water_type: 'intake',
        measurement_date: new Date().toISOString(),
      }));

      await fetch(`${API_BASE}/thermal-power-plant/save-quality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plant_id: plantData.plant_id,
          parameters,
        }),
      });

      // Get compliance report
      const response = await fetch(`${API_BASE}/thermal-power-plant/compliance/${plantData.plant_id}`);
      const report = await response.json();
      setComplianceReport(report);
    } catch (err) {
      console.error('Error analyzing:', err);
    } finally {
      setLoading(false);
    }
  };

  const complianceData = complianceReport
    ? [
        { name: 'Compliant', value: complianceReport.compliant, color: '#10b981' },
        { name: 'Warning', value: complianceReport.warning, color: '#f97316' },
        { name: 'Non-Compliant', value: complianceReport.non_compliant, color: '#dc2626' },
      ]
    : [];

  const chartData = WATER_QUALITY_PARAMETERS.map(p => ({
    parameter: p.name.substring(0, 10),
    value: measurements[p.name],
    indian: p.indian === '>5.0' ? 5 : p.indian === '>6.0' ? 6 : p.indian.includes('-') ? parseFloat(p.indian.split('-')[1]) : parseFloat(p.indian.replace('<', '')),
  }));

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" }}>
          🏭 Thermal Power Plant Water Quality
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 32px 0" }}>
          Monitor & benchmark water quality with Indian & international standards
        </p>

        {/* Linked Files Section */}
        <LinkedFilesSection moduleName="Thermal Power Plant Water Quality" />

        {/* Plant Information */}
        <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>🏢 Plant Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Plant Name</label>
              <input
                type="text"
                value={plantData.plant_name}
                onChange={(e) => setPlantData({ ...plantData, plant_name: e.target.value })}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Capacity (MW)</label>
              <input
                type="number"
                value={plantData.capacity_mw}
                onChange={(e) => setPlantData({ ...plantData, capacity_mw: parseFloat(e.target.value) })}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Water Source</label>
              <select
                value={plantData.water_source}
                onChange={(e) => setPlantData({ ...plantData, water_source: e.target.value })}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              >
                <option>River</option>
                <option>Lake</option>
                <option>Groundwater</option>
                <option>Recycled Water</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Water Intake (m³/day)</label>
              <input
                type="number"
                value={plantData.water_intake_m3_day}
                onChange={(e) => setPlantData({ ...plantData, water_intake_m3_day: parseFloat(e.target.value) })}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Latitude</label>
              <input
                type="number"
                value={plantData.latitude}
                onChange={(e) => setPlantData({ ...plantData, latitude: parseFloat(e.target.value) })}
                step="0.0001"
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Longitude</label>
              <input
                type="number"
                value={plantData.longitude}
                onChange={(e) => setPlantData({ ...plantData, longitude: parseFloat(e.target.value) })}
                step="0.0001"
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
          </div>
        </div>

        {/* Water Quality Measurements */}
        <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>💧 Water Quality Measurements</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {WATER_QUALITY_PARAMETERS.map((param) => (
              <div key={param.name} style={{ background: "#f9fafb", padding: "14px", borderRadius: "10px", borderLeft: "4px solid #0284c7" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{param.name}</label>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>{param.unit}</span>
                </div>
                <input
                  type="number"
                  value={measurements[param.name]}
                  onChange={(e) => handleMeasurementChange(param.name, parseFloat(e.target.value))}
                  step="0.1"
                  style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px", marginBottom: "8px" }}
                />
                <div style={{ fontSize: "9px", color: "#64748b" }}>
                  <p style={{ margin: "2px 0" }}><strong>IN:</strong> {param.indian}</p>
                  <p style={{ margin: "2px 0" }}><strong>INT:</strong> {param.international}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              marginTop: "20px",
              padding: "12px 36px",
              background: loading ? "#cbd5e1" : "#0284c7",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "🔄 Analyzing..." : "📊 Analyze & Generate Report"}
          </button>
        </div>

        {/* Compliance Report */}
        {complianceReport && (
          <>
            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              {[
                { label: "Compliance Rate", value: `${complianceReport.compliance_rate}%`, color: "#0284c7" },
                { label: "Compliant", value: complianceReport.compliant, color: "#10b981" },
                { label: "Warning", value: complianceReport.warning, color: "#f97316" },
                { label: "Non-Compliant", value: complianceReport.non_compliant, color: "#dc2626" },
              ].map((item, i) => (
                <div key={i} style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: `4px solid ${item.color}` }}>
                  <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", margin: "0 0 6px 0" }}>{item.label}</p>
                  <p style={{ color: item.color, fontSize: "24px", fontWeight: "800", margin: "0" }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Compliance Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={complianceData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {complianceData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>vs Indian Standards</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="parameter" tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#0284c7" name="Measured" />
                    <Bar dataKey="indian" fill="#e5e7eb" name="Indian Limit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Report */}
            <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>📋 Detailed Analysis</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ background: "#f0f9ff", borderBottom: "2px solid #0284c7" }}>
                      <th style={{ padding: "10px", textAlign: "left", fontWeight: "700" }}>Parameter</th>
                      <th style={{ padding: "10px", textAlign: "center", fontWeight: "700" }}>Value</th>
                      <th style={{ padding: "10px", textAlign: "center", fontWeight: "700" }}>Indian Std</th>
                      <th style={{ padding: "10px", textAlign: "center", fontWeight: "700" }}>International</th>
                      <th style={{ padding: "10px", textAlign: "center", fontWeight: "700" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complianceReport.parameters.map((param: any, i: number) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                        <td style={{ padding: "10px", color: "#0f172a" }}>{param.parameter_name}</td>
                        <td style={{ padding: "10px", textAlign: "center", fontWeight: "700", color: "#0284c7" }}>
                          {param.value.toFixed(2)} {param.unit}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center", color: "#64748b" }}>{param.benchmark_indian}</td>
                        <td style={{ padding: "10px", textAlign: "center", color: "#64748b" }}>{param.benchmark_international}</td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          <span style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: "700",
                            background: param.status === 'compliant' ? '#d1fae5' : param.status === 'warning' ? '#fed7aa' : '#fee2e2',
                            color: param.status === 'compliant' ? '#065f46' : param.status === 'warning' ? '#92400e' : '#991b1b',
                          }}>
                            {param.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
