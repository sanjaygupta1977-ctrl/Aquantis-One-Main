import Layout from "../components/Layout";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const API_BASE = "/api";

export default function STPCivilBOQ() {
  const [stp, setStp] = useState({
    stp_id: `STP-CIVIL-${Date.now()}`,
    stp_name: "Sewage Treatment Plant",
    design_capacity_mld: 10,
    treatment_type: "ASP (Activated Sludge Process)",
    inlet_chamber_m3: 50,
    grit_chamber_m3: 120,
    primary_settling_m3: 250,
    aeration_tank_m3: 1500,
    secondary_settling_m3: 400,
    tertiary_filter_m3: 150,
    chlorine_contact_m3: 80,
    sludge_thickening_m3: 100,
    sludge_dewatering_m3: 50,
    rcc_grade: "M35",
    rcc_unit_cost: 8500,
    steel_grade: "Fe500",
    steel_quantity_tons: 250,
    steel_percentage: 1.5,
    steel_unit_cost: 65000,
    waterproofing_type: "Bituminous Membrane",
    waterproofing_area_m2: 5000,
    waterproofing_thickness_mm: 4,
    waterproofing_unit_cost: 350,
    epoxy_coating_area_m2: 3000,
    epoxy_coating_unit_cost: 250,
    concrete_flooring_area_m2: 2000,
    concrete_flooring_unit_cost: 500,
    contingency_percent: 7,
  });

  const [boq, setBoq] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setStp({ ...stp, [field]: value });
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/stp-civil-boq/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stp),
      });
      const result = await response.json();
      if (result.success) {
        const boqData = await fetch(`${API_BASE}/stp-civil-boq/${stp.stp_id}`).then(r => r.json());
        setBoq(boqData);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const costBreakdown = boq ? [
    { name: 'RCC', value: parseFloat(boq.rcc_total_cost || 0), color: '#3b82f6' },
    { name: 'Steel', value: parseFloat(boq.steel_total_cost || 0), color: '#ef4444' },
    { name: 'Waterproofing', value: parseFloat(boq.waterproofing_total_cost || 0), color: '#8b5cf6' },
    { name: 'Epoxy', value: parseFloat(boq.epoxy_coating_total_cost || 0), color: '#f59e0b' },
    { name: 'Flooring', value: parseFloat(boq.concrete_flooring_total_cost || 0), color: '#10b981' },
  ] : [];

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" }}>
          🏗️ STP Civil Works BOQ
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 32px 0" }}>
          RCC Grade, Reinforcement Steel, Waterproofing & Finishing Details
        </p>

        {/* Project Details */}
        <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>📋 Project Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>STP Name</label>
              <input
                type="text"
                value={stp.stp_name}
                onChange={(e) => handleInputChange('stp_name', e.target.value)}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Capacity (MLD)</label>
              <input
                type="number"
                value={stp.design_capacity_mld}
                onChange={(e) => handleInputChange('design_capacity_mld', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Treatment Type</label>
              <select
                value={stp.treatment_type}
                onChange={(e) => handleInputChange('treatment_type', e.target.value)}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              >
                <option>ASP (Activated Sludge Process)</option>
                <option>SAFF (Sequential Aerobic-Anaerobic Fluidized Bed)</option>
                <option>MBBR (Moving Bed Biofilm Reactor)</option>
                <option>SBR (Sequencing Batch Reactor)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Treatment Structures */}
        <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>🏢 Treatment Structures Volume (m³)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
            {[
              { label: 'Inlet Chamber', key: 'inlet_chamber_m3' },
              { label: 'Grit Chamber', key: 'grit_chamber_m3' },
              { label: 'Primary Settling', key: 'primary_settling_m3' },
              { label: 'Aeration Tank', key: 'aeration_tank_m3' },
              { label: 'Secondary Settling', key: 'secondary_settling_m3' },
              { label: 'Tertiary Filter', key: 'tertiary_filter_m3' },
              { label: 'Chlorine Contact', key: 'chlorine_contact_m3' },
              { label: 'Sludge Thickening', key: 'sludge_thickening_m3' },
              { label: 'Sludge Dewatering', key: 'sludge_dewatering_m3' },
            ].map((item) => (
              <div key={item.key} style={{ background: "#f9fafb", padding: "12px", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#0f172a", display: "block", marginBottom: "4px" }}>{item.label}</label>
                <input
                  type="number"
                  value={stp[item.key]}
                  onChange={(e) => handleInputChange(item.key, parseFloat(e.target.value))}
                  step="10"
                  style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "13px" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RCC Specifications */}
        <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>🪨 RCC Specifications</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>RCC Grade</label>
              <select
                value={stp.rcc_grade}
                onChange={(e) => handleInputChange('rcc_grade', e.target.value)}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              >
                <option>M25</option>
                <option>M30</option>
                <option>M35</option>
                <option>M40</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>RCC Unit Cost (₹/m³)</label>
              <input
                type="number"
                value={stp.rcc_unit_cost}
                onChange={(e) => handleInputChange('rcc_unit_cost', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
          </div>
        </div>

        {/* Reinforcement Steel */}
        <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>⚙️ Reinforcement Steel</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Steel Grade</label>
              <select
                value={stp.steel_grade}
                onChange={(e) => handleInputChange('steel_grade', e.target.value)}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              >
                <option>Fe250</option>
                <option>Fe415</option>
                <option>Fe500</option>
                <option>Fe500D</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Steel Quantity (Tons)</label>
              <input
                type="number"
                value={stp.steel_quantity_tons}
                onChange={(e) => handleInputChange('steel_quantity_tons', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Steel Unit Cost (₹/Ton)</label>
              <input
                type="number"
                value={stp.steel_unit_cost}
                onChange={(e) => handleInputChange('steel_unit_cost', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
          </div>
        </div>

        {/* Waterproofing */}
        <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>💧 Waterproofing (Critical for STP)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Waterproofing Type</label>
              <select
                value={stp.waterproofing_type}
                onChange={(e) => handleInputChange('waterproofing_type', e.target.value)}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              >
                <option>Bituminous Membrane</option>
                <option>Cementitious Coating</option>
                <option>Polyurethane Coating</option>
                <option>PVC Lining</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Area (m²)</label>
              <input
                type="number"
                value={stp.waterproofing_area_m2}
                onChange={(e) => handleInputChange('waterproofing_area_m2', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Unit Cost (₹/m²)</label>
              <input
                type="number"
                value={stp.waterproofing_unit_cost}
                onChange={(e) => handleInputChange('waterproofing_unit_cost', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
          </div>
        </div>

        {/* Finishing */}
        <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>🎨 Internal Finishing</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Epoxy Coating Area (m²)</label>
              <input
                type="number"
                value={stp.epoxy_coating_area_m2}
                onChange={(e) => handleInputChange('epoxy_coating_area_m2', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Epoxy Unit Cost (₹/m²)</label>
              <input
                type="number"
                value={stp.epoxy_coating_unit_cost}
                onChange={(e) => handleInputChange('epoxy_coating_unit_cost', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Flooring Area (m²)</label>
              <input
                type="number"
                value={stp.concrete_flooring_area_m2}
                onChange={(e) => handleInputChange('concrete_flooring_area_m2', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>Flooring Unit Cost (₹/m²)</label>
              <input
                type="number"
                value={stp.concrete_flooring_unit_cost}
                onChange={(e) => handleInputChange('concrete_flooring_unit_cost', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "6px" }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={loading}
          style={{
            padding: "14px 40px",
            background: loading ? "#cbd5e1" : "#0284c7",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "28px",
          }}
        >
          {loading ? "🔄 Calculating..." : "📊 Generate BOQ"}
        </button>

        {/* BOQ Summary */}
        {boq && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              {[
                { label: "RCC Volume (m³)", value: boq.total_rcc_volume_m3, color: "#3b82f6" },
                { label: "Steel (Tons)", value: boq.steel_quantity_tons, color: "#ef4444" },
                { label: "RCC Cost", value: `₹${(boq.rcc_total_cost / 100000).toFixed(1)}L`, color: "#8b5cf6" },
                { label: "Steel Cost", value: `₹${(boq.steel_total_cost / 100000).toFixed(1)}L`, color: "#f59e0b" },
                { label: "Waterproofing Cost", value: `₹${(boq.waterproofing_total_cost / 100000).toFixed(1)}L`, color: "#10b981" },
                { label: "Final Cost (with Contingency)", value: `₹${(boq.final_civil_cost / 10000000).toFixed(2)}Cr`, color: "#0284c7" },
              ].map((item, i) => (
                <div key={i} style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: `4px solid ${item.color}` }}>
                  <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", margin: "0 0 6px 0" }}>{item.label}</p>
                  <p style={{ color: item.color, fontSize: "18px", fontWeight: "800", margin: "0" }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Cost Breakdown Chart */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Cost Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={costBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {costBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Cost Details</h3>
                <div style={{ fontSize: "12px", lineHeight: "1.8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ color: "#64748b", fontWeight: "700" }}>RCC Cost</span>
                    <span style={{ color: "#0f172a", fontWeight: "700" }}>₹{(boq.rcc_total_cost || 0).toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ color: "#64748b", fontWeight: "700" }}>Steel Cost</span>
                    <span style={{ color: "#0f172a", fontWeight: "700" }}>₹{(boq.steel_total_cost || 0).toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ color: "#64748b", fontWeight: "700" }}>Waterproofing</span>
                    <span style={{ color: "#0f172a", fontWeight: "700" }}>₹{(boq.waterproofing_total_cost || 0).toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ color: "#64748b", fontWeight: "700" }}>Epoxy Coating</span>
                    <span style={{ color: "#0f172a", fontWeight: "700" }}>₹{(boq.epoxy_coating_total_cost || 0).toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ color: "#64748b", fontWeight: "700" }}>Flooring</span>
                    <span style={{ color: "#0f172a", fontWeight: "700" }}>₹{(boq.concrete_flooring_total_cost || 0).toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 8px", background: "#f0f9ff", fontWeight: "700", borderRadius: "6px", marginTop: "8px" }}>
                    <span>Total (with {boq.contingency_percent}% contingency)</span>
                    <span style={{ color: "#0284c7" }}>₹{(boq.final_civil_cost || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Table */}
            <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>📋 Detailed BOQ Table</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ background: "#f0f9ff", borderBottom: "2px solid #0284c7" }}>
                      <th style={{ padding: "10px", textAlign: "left", fontWeight: "700" }}>Item</th>
                      <th style={{ padding: "10px", textAlign: "center", fontWeight: "700" }}>Qty</th>
                      <th style={{ padding: "10px", textAlign: "center", fontWeight: "700" }}>Unit</th>
                      <th style={{ padding: "10px", textAlign: "center", fontWeight: "700" }}>Rate</th>
                      <th style={{ padding: "10px", textAlign: "right", fontWeight: "700" }}>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { item: `RCC Grade ${boq.rcc_grade}`, qty: boq.total_rcc_volume_m3, unit: 'm³', rate: boq.rcc_unit_cost, total: boq.rcc_total_cost },
                      { item: `Steel Grade ${boq.steel_grade}`, qty: boq.steel_quantity_tons, unit: 'Ton', rate: boq.steel_unit_cost, total: boq.steel_total_cost },
                      { item: `${boq.waterproofing_type}`, qty: boq.waterproofing_area_m2, unit: 'm²', rate: boq.waterproofing_unit_cost, total: boq.waterproofing_total_cost },
                      { item: 'Epoxy Coating', qty: boq.epoxy_coating_area_m2, unit: 'm²', rate: boq.epoxy_coating_unit_cost, total: boq.epoxy_coating_total_cost },
                      { item: 'Concrete Flooring', qty: boq.concrete_flooring_area_m2, unit: 'm²', rate: boq.concrete_flooring_unit_cost, total: boq.concrete_flooring_total_cost },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                        <td style={{ padding: "10px", color: "#0f172a" }}>{row.item}</td>
                        <td style={{ padding: "10px", textAlign: "center", color: "#64748b" }}>{parseFloat(row.qty).toFixed(2)}</td>
                        <td style={{ padding: "10px", textAlign: "center", color: "#64748b" }}>{row.unit}</td>
                        <td style={{ padding: "10px", textAlign: "center", color: "#64748b" }}>₹{parseFloat(row.rate).toLocaleString()}</td>
                        <td style={{ padding: "10px", textAlign: "right", color: "#0284c7", fontWeight: "700" }}>₹{parseFloat(row.total || 0).toLocaleString()}</td>
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
