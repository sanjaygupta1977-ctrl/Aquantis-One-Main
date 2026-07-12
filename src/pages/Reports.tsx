import Layout from "../components/Layout";
import { useState } from "react";

export default function Reports() {
  const [dateRange, setDateRange] = useState("week");

  const reports = [
    { name: "Daily Operations Report", date: "2024-01-15", size: "2.4 MB", type: "PDF" },
    { name: "Water Quality Summary", date: "2024-01-14", size: "1.8 MB", type: "PDF" },
    { name: "System Performance Analysis", date: "2024-01-13", size: "3.2 MB", type: "PDF" },
    { name: "Compliance Audit Trail", date: "2024-01-12", size: "5.1 MB", type: "XLSX" },
    { name: "Cost Optimization Report", date: "2024-01-11", size: "1.5 MB", type: "PDF" },
    { name: "Energy Consumption Analysis", date: "2024-01-10", size: "2.9 MB", type: "PDF" },
  ];

  return (
    <Layout>
      <div style={{ padding: "40px" }}>
        <h1>📄 Reports & Analytics</h1>
        <p style={{ color: "#666", marginTop: "10px" }}>Generate, download, and manage system reports</p>

        <div style={{ marginTop: "30px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <button
            onClick={() => setDateRange("week")}
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              background: dateRange === "week" ? "#2563eb" : "#e5e7eb",
              color: dateRange === "week" ? "white" : "#111",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            This Week
          </button>
          <button
            onClick={() => setDateRange("month")}
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              background: dateRange === "month" ? "#2563eb" : "#e5e7eb",
              color: dateRange === "month" ? "white" : "#111",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            This Month
          </button>
          <button
            onClick={() => setDateRange("year")}
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              background: dateRange === "year" ? "#2563eb" : "#e5e7eb",
              color: dateRange === "year" ? "white" : "#111",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            This Year
          </button>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h3>Available Reports ({dateRange})</h3>
          <div style={{ marginTop: "15px", display: "grid", gap: "10px" }}>
            {reports.map((report, idx) => (
              <div
                key={idx}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "20px",
                  alignItems: "center",
                  border: "1px solid #e5e7eb",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f9fafb";
                  e.currentTarget.style.borderColor = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                <div>
                  <h4 style={{ margin: "0 0 8px 0" }}>{report.name}</h4>
                  <p style={{ margin: 0, color: "#999", fontSize: "14px" }}>
                    {report.date} • {report.size} • {report.type}
                  </p>
                </div>
                <button
                  style={{
                    padding: "10px 20px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={() => alert(`Downloading: ${report.name}`)}
                >
                  ⬇ Download
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "#eff6ff", padding: "25px", borderRadius: "8px" }}>
            <h3>Generate Custom Report</h3>
            <div style={{ marginTop: "15px", display: "grid", gap: "10px" }}>
              <select style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}>
                <option>Water Quality Report</option>
                <option>System Performance</option>
                <option>Cost Analysis</option>
                <option>Compliance Report</option>
              </select>
              <button
                style={{
                  padding: "10px 20px",
                  background: "#0369a1",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => alert("Custom report generated!")}
              >
                Generate Report
              </button>
            </div>
          </div>

          <div style={{ background: "#f0fdf4", padding: "25px", borderRadius: "8px" }}>
            <h3>Export Data</h3>
            <div style={{ marginTop: "15px", display: "grid", gap: "10px" }}>
              <select style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}>
                <option>CSV Format</option>
                <option>Excel (XLSX)</option>
                <option>JSON Format</option>
              </select>
              <button
                style={{
                  padding: "10px 20px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => alert("Data exported!")}
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
