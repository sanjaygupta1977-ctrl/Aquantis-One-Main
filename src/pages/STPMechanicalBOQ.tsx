import Layout from "../components/Layout";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API_BASE = "/api";

export default function STPMechanicalBOQ() {
  const [stp, setStp] = useState({
    stp_id: `STP-MECH-${Date.now()}`,
    stp_name: "Sewage Treatment Plant",
    design_capacity_mld: 10,
    // Inlet Pump
    inlet_pump_type: "Centrifugal",
    inlet_pump_head_m: 5,
    inlet_pump_flow_lps: 120,
    inlet_pump_power_kw: 15,
    inlet_pump_efficiency_percent: 85,
    inlet_pump_material: "Cast Iron",
    inlet_pump_qty: 2,
    inlet_pump_unit_cost: 250000,
    // Grit Pump
    grit_pump_type: "Centrifugal",
    grit_pump_flow_lps: 50,
    grit_pump_power_kw: 5,
    grit_pump_efficiency_percent: 80,
    grit_pump_material: "Cast Iron",
    grit_pump_qty: 1,
    grit_pump_unit_cost: 150000,
    // RAS Pump
    ras_pump_type: "Centrifugal",
    ras_pump_flow_lps: 80,
    ras_pump_head_m: 3,
    ras_pump_power_kw: 7.5,
    ras_pump_efficiency_percent: 82,
    ras_pump_material: "Cast Iron",
    ras_pump_qty: 2,
    ras_pump_unit_cost: 180000,
    // WAS Pump
    was_pump_type: "Centrifugal",
    was_pump_flow_lps: 15,
    was_pump_power_kw: 2,
    was_pump_efficiency_percent: 78,
    was_pump_material: "Cast Iron",
    was_pump_qty: 1,
    was_pump_unit_cost: 120000,
    // Effluent Pump
    effluent_pump_type: "Centrifugal",
    effluent_pump_flow_lps: 120,
    effluent_pump_head_m: 4,
    effluent_pump_power_kw: 12,
    effluent_pump_efficiency_percent: 85,
    effluent_pump_material: "Cast Iron",
    effluent_pump_qty: 2,
    effluent_pump_unit_cost: 200000,
    // Blower
    blower_type: "Rotary Screw",
    blower_capacity_m3_min: 500,
    blower_power_kw: 30,
    blower_efficiency_percent: 88,
    blower_qty: 2,
    blower_unit_cost: 400000,
    // Diffuser
    diffuser_type: "Fine Bubble",
    diffuser_qty: 100,
    diffuser_unit_cost: 5000,
    // Membrane
    membrane_type: "MBR",
    membrane_material: "SS 316",
    membrane_area_m2: 500,
    membrane_pore_micron: 0.4,
    membrane_qty: 1,
    membrane_unit_cost: 5000000,
    // Piping
    piping_material: "MS/GI",
    piping_length_m: 2000,
    piping_unit_cost: 500,
    valve_qty: 50,
    valve_unit_cost: 8000,
    misc_items_cost: 500000,
    contingency_percent: 8,
  });

  const [boq, setBoq] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setStp({ ...stp, [field]: value });
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/stp-mechanical-boq/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stp),
      });
      const result = await response.json();
      if (result.success) {
        const boqData = await fetch(`${API_BASE}/stp-mechanical-boq/${stp.stp_id}`).then(r => r.json());
        setBoq(boqData);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const equipmentData = boq ? [
    { name: 'Inlet Pump', cost: parseFloat(boq.inlet_pump_total_cost || 0) },
    { name: 'Grit Pump', cost: parseFloat(boq.grit_pump_total_cost || 0) },
    { name: 'RAS Pump', cost: parseFloat(boq.ras_pump_total_cost || 0) },
    { name: 'WAS Pump', cost: parseFloat(boq.was_pump_total_cost || 0) },
    { name: 'Effluent Pump', cost: parseFloat(boq.effluent_pump_total_cost || 0) },
    { name: 'Blower', cost: parseFloat(boq.blower_total_cost || 0) },
    { name: 'Diffuser', cost: parseFloat(boq.diffuser_total_cost || 0) },
    { name: 'Membrane (SS 316)', cost: parseFloat(boq.membrane_total_cost || 0) },
  ] : [];

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" }}>
          ⚙️ STP Mechanical Works BOQ
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 32px 0" }}>
          Pump Specifications, Efficiency, Materials (SS 316 for Membranes)
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
          </div>
        </div>

        {/* Pumps Section */}
        {['inlet', 'grit', 'ras', 'was', 'effluent'].map((pumpType) => {
          const label = pumpType.toUpperCase() === 'RAS' ? 'RAS (Return Activated Sludge)' :
                       pumpType.toUpperCase() === 'WAS' ? 'WAS (Waste Activated Sludge)' :
                       pumpType.toUpperCase() === 'INLET' ? 'Inlet Pump' :
                       pumpType.toUpperCase() === 'GRIT' ? 'Grit Chamber Pump' : 'Effluent Pump';
          const prefix = `${pumpType}_pump_`;
          
          return (
            <div key={pumpType} style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
              <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>💧 {label}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Type</label>
                  <select
                    value={stp[`${prefix}type`]}
                    onChange={(e) => handleInputChange(`${prefix}type`, e.target.value)}
                    style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
                  >
                    <option>Centrifugal</option>
                    <option>Submersible</option>
                    <option>Turbine</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Flow (LPS)</label>
                  <input
                    type="number"
                    value={stp[`${prefix}flow_lps`]}
                    onChange={(e) => handleInputChange(`${prefix}flow_lps`, parseFloat(e.target.value))}
                    style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
                  />
                </div>
                {['inlet', 'ras', 'effluent'].includes(pumpType) && (
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Head (m)</label>
                    <input
                      type="number"
                      value={stp[`${prefix}head_m`]}
                      onChange={(e) => handleInputChange(`${prefix}head_m`, parseFloat(e.target.value))}
                      style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
                    />
                  </div>
                )}
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Power (kW)</label>
                  <input
                    type="number"
                    value={stp[`${prefix}power_kw`]}
                    onChange={(e) => handleInputChange(`${prefix}power_kw`, parseFloat(e.target.value))}
                    step="0.5"
                    style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Efficiency (%)</label>
                  <input
                    type="number"
                    value={stp[`${prefix}efficiency_percent`]}
                    onChange={(e) => handleInputChange(`${prefix}efficiency_percent`, parseFloat(e.target.value))}
                    min="70"
                    max="95"
                    style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Material</label>
                  <select
                    value={stp[`${prefix}material`]}
                    onChange={(e) => handleInputChange(`${prefix}material`, e.target.value)}
                    style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
                  >
                    <option>Cast Iron</option>
                    <option>SS 304</option>
                    <option>SS 316</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Qty</label>
                  <input
                    type="number"
                    value={stp[`${prefix}qty`]}
                    onChange={(e) => handleInputChange(`${prefix}qty`, parseInt(e.target.value))}
                    min="1"
                    style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Unit Cost (₹)</label>
                  <input
                    type="number"
                    value={stp[`${prefix}unit_cost`]}
                    onChange={(e) => handleInputChange(`${prefix}unit_cost`, parseFloat(e.target.value))}
                    style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Blower & Aeration */}
        <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>💨 Aeration System</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Blower Type</label>
              <select
                value={stp.blower_type}
                onChange={(e) => handleInputChange('blower_type', e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              >
                <option>Rotary Screw</option>
                <option>Centrifugal</option>
                <option>Positive Displacement</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Capacity (m³/min)</label>
              <input
                type="number"
                value={stp.blower_capacity_m3_min}
                onChange={(e) => handleInputChange('blower_capacity_m3_min', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Power (kW)</label>
              <input
                type="number"
                value={stp.blower_power_kw}
                onChange={(e) => handleInputChange('blower_power_kw', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Efficiency (%)</label>
              <input
                type="number"
                value={stp.blower_efficiency_percent}
                onChange={(e) => handleInputChange('blower_efficiency_percent', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Qty</label>
              <input
                type="number"
                value={stp.blower_qty}
                onChange={(e) => handleInputChange('blower_qty', parseInt(e.target.value))}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Unit Cost (₹)</label>
              <input
                type="number"
                value={stp.blower_unit_cost}
                onChange={(e) => handleInputChange('blower_unit_cost', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Diffuser Type</label>
              <select
                value={stp.diffuser_type}
                onChange={(e) => handleInputChange('diffuser_type', e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              >
                <option>Fine Bubble</option>
                <option>Coarse Bubble</option>
                <option>Grid</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Diffuser Qty</label>
              <input
                type="number"
                value={stp.diffuser_qty}
                onChange={(e) => handleInputChange('diffuser_qty', parseInt(e.target.value))}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Diffuser Unit Cost (₹)</label>
              <input
                type="number"
                value={stp.diffuser_unit_cost}
                onChange={(e) => handleInputChange('diffuser_unit_cost', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              />
            </div>
          </div>
        </div>

        {/* Membrane Section - SS 316 */}
        <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>🧬 Membrane Filter (SS 316)</h3>
          <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 16px 0" }}>Stainless Steel 316 provides superior corrosion resistance for wastewater applications</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Membrane Type</label>
              <select
                value={stp.membrane_type}
                onChange={(e) => handleInputChange('membrane_type', e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              >
                <option>MBR (Membrane Bioreactor)</option>
                <option>UF (Ultrafiltration)</option>
                <option>Hollow Fiber</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Material</label>
              <select
                value={stp.membrane_material}
                onChange={(e) => handleInputChange('membrane_material', e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              >
                <option>SS 316 ⭐ (Premium)</option>
                <option>SS 304 (Standard)</option>
                <option>PVDF</option>
                <option>PTFE</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Area (m²)</label>
              <input
                type="number"
                value={stp.membrane_area_m2}
                onChange={(e) => handleInputChange('membrane_area_m2', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Pore Size (µm)</label>
              <input
                type="number"
                value={stp.membrane_pore_micron}
                onChange={(e) => handleInputChange('membrane_pore_micron', parseFloat(e.target.value))}
                step="0.1"
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Unit Cost (₹)</label>
              <input
                type="number"
                value={stp.membrane_unit_cost}
                onChange={(e) => handleInputChange('membrane_unit_cost', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              />
            </div>
          </div>
        </div>

        {/* Piping & Valves */}
        <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
          <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>🔧 Piping & Valves</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Piping Material</label>
              <select
                value={stp.piping_material}
                onChange={(e) => handleInputChange('piping_material', e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              >
                <option>MS/GI</option>
                <option>PVC</option>
                <option>SS 304</option>
                <option>HDPE</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Piping Length (m)</label>
              <input
                type="number"
                value={stp.piping_length_m}
                onChange={(e) => handleInputChange('piping_length_m', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Piping Unit Cost (₹/m)</label>
              <input
                type="number"
                value={stp.piping_unit_cost}
                onChange={(e) => handleInputChange('piping_unit_cost', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Valve Qty</label>
              <input
                type="number"
                value={stp.valve_qty}
                onChange={(e) => handleInputChange('valve_qty', parseInt(e.target.value))}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Valve Unit Cost (₹)</label>
              <input
                type="number"
                value={stp.valve_unit_cost}
                onChange={(e) => handleInputChange('valve_unit_cost', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "4px" }}>Misc Items (₹)</label>
              <input
                type="number"
                value={stp.misc_items_cost}
                onChange={(e) => handleInputChange('misc_items_cost', parseFloat(e.target.value))}
                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
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

        {/* Results */}
        {boq && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              {[
                { label: "Total Power (kW)", value: boq.total_power_kw, color: "#ef4444" },
                { label: "Equipment Cost", value: `₹${(boq.final_mechanical_cost / 10000000).toFixed(2)}Cr`, color: "#0284c7" },
              ].map((item, i) => (
                <div key={i} style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: `4px solid ${item.color}` }}>
                  <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", margin: "0 0 6px 0" }}>{item.label}</p>
                  <p style={{ color: item.color, fontSize: "18px", fontWeight: "800", margin: "0" }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Equipment Cost Chart */}
            <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
              <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Equipment-wise Cost Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={equipmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${(value / 1000000).toFixed(1)}L`} />
                  <Bar dataKey="cost" fill="#0284c7" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed BOQ */}
            <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>📋 Detailed Equipment List</h3>
              <div style={{ fontSize: "12px", lineHeight: "1.8" }}>
                {[
                  { name: 'Inlet Pump', qty: boq.inlet_pump_qty, power: boq.inlet_pump_power_kw, eff: boq.inlet_pump_efficiency_percent, cost: boq.inlet_pump_total_cost },
                  { name: 'Grit Pump', qty: boq.grit_pump_qty, power: boq.grit_pump_power_kw, eff: boq.grit_pump_efficiency_percent, cost: boq.grit_pump_total_cost },
                  { name: 'RAS Pump', qty: boq.ras_pump_qty, power: boq.ras_pump_power_kw, eff: boq.ras_pump_efficiency_percent, cost: boq.ras_pump_total_cost },
                  { name: 'WAS Pump', qty: boq.was_pump_qty, power: boq.was_pump_power_kw, eff: boq.was_pump_efficiency_percent, cost: boq.was_pump_total_cost },
                  { name: 'Effluent Pump', qty: boq.effluent_pump_qty, power: boq.effluent_pump_power_kw, eff: boq.effluent_pump_efficiency_percent, cost: boq.effluent_pump_total_cost },
                  { name: 'Blower', qty: boq.blower_qty, power: boq.blower_power_kw, eff: boq.blower_efficiency_percent, cost: boq.blower_total_cost },
                  { name: 'Membrane (SS 316)', qty: 1, power: 0, eff: 99, cost: boq.membrane_total_cost },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fafafa" : "white" }}>
                    <div>
                      <span style={{ color: "#0f172a", fontWeight: "700" }}>{item.name}</span>
                      <span style={{ color: "#94a3b8", fontSize: "11px", marginLeft: "8px" }}>Qty: {item.qty} | Power: {item.power}kW | Eff: {item.eff}%</span>
                    </div>
                    <span style={{ color: "#0284c7", fontWeight: "700" }}>₹{parseFloat(item.cost || 0).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 10px", background: "#f0f9ff", fontWeight: "700", borderRadius: "6px", marginTop: "8px" }}>
                  <span>TOTAL (with {boq.contingency_percent}% contingency)</span>
                  <span style={{ color: "#0284c7" }}>₹{(boq.final_mechanical_cost || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
