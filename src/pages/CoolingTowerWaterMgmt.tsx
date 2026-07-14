import Layout from "../components/Layout";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface CoolingTowerData {
  id: number;
  name: string;
  capacity: number;
  inletTemp: number;
  outletTemp: number;
  ambientTemp: number;
  cyclesOfConcentration: number;
  blowdownRate: number;
  makeupWater: number;
  waterLoss: number;
  tds: number;
  ph: number;
  conductivity: number;
  status: "normal" | "warning" | "critical";
}

export default function CoolingTowerWaterManagement() {
  const [towers, setTowers] = useState<CoolingTowerData[]>([
    {
      id: 1,
      name: "Tower A - Production",
      capacity: 500,
      inletTemp: 45,
      outletTemp: 32,
      ambientTemp: 28,
      cyclesOfConcentration: 3.5,
      blowdownRate: 8.2,
      makeupWater: 45,
      waterLoss: 18,
      tds: 1250,
      ph: 7.8,
      conductivity: 2100,
      status: "normal",
    },
    {
      id: 2,
      name: "Tower B - Chiller",
      capacity: 750,
      inletTemp: 43,
      outletTemp: 30,
      ambientTemp: 28,
      cyclesOfConcentration: 4.2,
      blowdownRate: 7.5,
      makeupWater: 62,
      waterLoss: 25,
      tds: 1520,
      ph: 7.5,
      conductivity: 2450,
      status: "normal",
    },
  ]);

  const [selectedTower, setSelectedTower] = useState<number | null>(towers[0]?.id);
  const [newTower, setNewTower] = useState<Partial<CoolingTowerData>>({
    name: "",
    capacity: 500,
    inletTemp: 40,
    outletTemp: 30,
    ambientTemp: 25,
    cyclesOfConcentration: 3.5,
    blowdownRate: 8,
    makeupWater: 40,
    waterLoss: 15,
    tds: 1000,
    ph: 7.5,
    conductivity: 2000,
  });

  const tempProfileData = [
    { time: "00:00", inlet: 42, outlet: 29, ambient: 22 },
    { time: "04:00", inlet: 40, outlet: 28, ambient: 20 },
    { time: "08:00", inlet: 43, outlet: 30, ambient: 24 },
    { time: "12:00", inlet: 46, outlet: 32, ambient: 29 },
    { time: "16:00", inlet: 48, outlet: 34, ambient: 31 },
    { time: "20:00", inlet: 44, outlet: 31, ambient: 26 },
    { time: "24:00", inlet: 42, outlet: 29, ambient: 22 },
  ];

  const calculateCoolingEff = (tower: CoolingTowerData) => {
    const tempApproach = tower.outletTemp - tower.ambientTemp;
    const tempRange = tower.inletTemp - tower.outletTemp;
    const effectiveness = (tempRange / (tower.inletTemp - tower.ambientTemp)) * 100;
    return { approach: tempApproach, range: tempRange, effectiveness };
  };

  const getTreatmentStatus = (tower: CoolingTowerData) => {
    let status = "EXCELLENT";
    let issues: string[] = [];

    if (tower.tds > 1500) {
      status = "FAIR";
      issues.push("TDS high - consider blowdown increase");
    }
    if (tower.ph < 7 || tower.ph > 8.5) {
      status = "WARNING";
      issues.push("pH out of range - adjust treatment");
    }
    if (tower.conductivity > 2500) {
      status = "FAIR";
      issues.push("High conductivity - water quality degradation");
    }
    if (tower.cyclesOfConcentration < 2.5) {
      status = "WARNING";
      issues.push("Low CoC - reduce makeup water or increase blowdown");
    }

    return { status, issues };
  };

  const getTowerEfficiency = (tower: CoolingTowerData) => {
    const eff = calculateCoolingEff(tower);
    const utilization = (tower.capacity / 1000) * 100;
    const tempEfficiency = (eff.effectiveness / 100) * utilization;
    return tempEfficiency;
  };

  const addTower = () => {
    if (newTower.name && newTower.capacity) {
      const tower: CoolingTowerData = {
        id: Math.max(...towers.map((t) => t.id), 0) + 1,
        name: newTower.name,
        capacity: newTower.capacity || 500,
        inletTemp: newTower.inletTemp || 40,
        outletTemp: newTower.outletTemp || 30,
        ambientTemp: newTower.ambientTemp || 25,
        cyclesOfConcentration: newTower.cyclesOfConcentration || 3.5,
        blowdownRate: newTower.blowdownRate || 8,
        makeupWater: newTower.makeupWater || 40,
        waterLoss: newTower.waterLoss || 15,
        tds: newTower.tds || 1000,
        ph: newTower.ph || 7.5,
        conductivity: newTower.conductivity || 2000,
        status: "normal",
      };
      setTowers([...towers, tower]);
      setSelectedTower(tower.id);
      setNewTower({
        name: "",
        capacity: 500,
        inletTemp: 40,
        outletTemp: 30,
        ambientTemp: 25,
        cyclesOfConcentration: 3.5,
        blowdownRate: 8,
        makeupWater: 40,
        waterLoss: 15,
        tds: 1000,
        ph: 7.5,
        conductivity: 2000,
      });
    }
  };

  const updateTower = (id: number, field: keyof CoolingTowerData, value: any) => {
    setTowers(towers.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const removeTower = (id: number) => {
    setTowers(towers.filter((t) => t.id !== id));
    if (selectedTower === id) {
      setSelectedTower(towers[0]?.id || null);
    }
  };

  const currentTower = towers.find((t) => t.id === selectedTower);
  const coolingEff = currentTower ? calculateCoolingEff(currentTower) : { approach: 0, range: 0, effectiveness: 0 };
  const treatmentStatus = currentTower ? getTreatmentStatus(currentTower) : { status: "N/A", issues: [] };
  const towerEff = currentTower ? getTowerEfficiency(currentTower) : 0;

  const totalMakeupWater = towers.reduce((sum, t) => sum + t.makeupWater, 0);
  const totalEvaporation = towers.reduce((sum, t) => sum + t.waterLoss, 0);
  const totalBlowdown = towers.reduce((sum, t) => sum + (t.capacity * t.blowdownRate) / 100, 0);
  const cyclesOfConc = towers.length > 0 ? (towers.reduce((sum, t) => sum + t.cyclesOfConcentration, 0) / towers.length).toFixed(1) : 0;

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "36px", fontWeight: "800", margin: "0 0 10px 0" }}>
          🏭 Cooling Tower Water Management System
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 40px 0" }}>
          Real-time monitoring, treatment, and efficiency optimization for industrial cooling towers
        </p>

        {/* System Overview Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #0284c7" }}>
            <p style={{ color: "#0c2340", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>MAKEUP WATER</p>
            <p style={{ color: "#0284c7", fontSize: "32px", fontWeight: "800", margin: "0" }}>{totalMakeupWater.toFixed(0)}</p>
            <p style={{ color: "#0c2340", fontSize: "12px", margin: "5px 0 0 0" }}>GPM (total)</p>
          </div>

          <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #10b981" }}>
            <p style={{ color: "#065f46", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>EVAPORATION LOSS</p>
            <p style={{ color: "#10b981", fontSize: "32px", fontWeight: "800", margin: "0" }}>{totalEvaporation.toFixed(0)}</p>
            <p style={{ color: "#065f46", fontSize: "12px", margin: "5px 0 0 0" }}>GPM (natural)</p>
          </div>

          <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #ca8a04" }}>
            <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>BLOWDOWN</p>
            <p style={{ color: "#ca8a04", fontSize: "32px", fontWeight: "800", margin: "0" }}>{totalBlowdown.toFixed(0)}</p>
            <p style={{ color: "#854d0e", fontSize: "12px", margin: "5px 0 0 0" }}>GPM (treatment)</p>
          </div>

          <div style={{ background: "linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #8b5cf6" }}>
            <p style={{ color: "#6d28d9", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>AVG CYCLES OF CONC</p>
            <p style={{ color: "#8b5cf6", fontSize: "32px", fontWeight: "800", margin: "0" }}>{cyclesOfConc}</p>
            <p style={{ color: "#6d28d9", fontSize: "12px", margin: "5px 0 0 0" }}>x (target: 3-5)</p>
          </div>
        </div>

        {/* Tower Selection & Add New */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>Manage Cooling Towers</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "15px", marginBottom: "20px" }}>
            {towers.map((tower) => (
              <div
                key={tower.id}
                onClick={() => setSelectedTower(tower.id)}
                style={{
                  cursor: "pointer",
                  padding: "15px",
                  borderRadius: "10px",
                  border: selectedTower === tower.id ? "3px solid #0284c7" : "1px solid #e5e7eb",
                  background: selectedTower === tower.id ? "#f0f9ff" : "white",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <p style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 8px 0" }}>{tower.name}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#666", fontSize: "12px" }}>{tower.capacity} GPM</span>
                  <span
                    style={{
                      background: tower.status === "normal" ? "#dcfce7" : tower.status === "warning" ? "#fef3c7" : "#fee2e2",
                      color: tower.status === "normal" ? "#065f46" : tower.status === "warning" ? "#854d0e" : "#7f1d1d",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    {tower.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: "20px" }}>
            <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 15px 0" }}>Add New Cooling Tower</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "15px" }}>
              <input
                type="text"
                placeholder="Tower name"
                value={newTower.name || ""}
                onChange={(e) => setNewTower({ ...newTower, name: e.target.value })}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "12px" }}
              />
              <input
                type="number"
                placeholder="Capacity (GPM)"
                value={newTower.capacity || ""}
                onChange={(e) => setNewTower({ ...newTower, capacity: Number(e.target.value) })}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "12px" }}
              />
              <input
                type="number"
                placeholder="Inlet Temp (°C)"
                value={newTower.inletTemp || ""}
                onChange={(e) => setNewTower({ ...newTower, inletTemp: Number(e.target.value) })}
                step="0.1"
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "12px" }}
              />
              <input
                type="number"
                placeholder="Outlet Temp (°C)"
                value={newTower.outletTemp || ""}
                onChange={(e) => setNewTower({ ...newTower, outletTemp: Number(e.target.value) })}
                step="0.1"
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "12px" }}
              />
              <input
                type="number"
                placeholder="Ambient Temp (°C)"
                value={newTower.ambientTemp || ""}
                onChange={(e) => setNewTower({ ...newTower, ambientTemp: Number(e.target.value) })}
                step="0.1"
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "12px" }}
              />
              <input
                type="number"
                placeholder="CoC (Cycles)"
                value={newTower.cyclesOfConcentration || ""}
                onChange={(e) => setNewTower({ ...newTower, cyclesOfConcentration: Number(e.target.value) })}
                step="0.1"
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "12px" }}
              />
            </div>
            <button
              onClick={addTower}
              style={{
                width: "100%",
                padding: "10px",
                background: "#0284c7",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#0369a1"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#0284c7"}
            >
              + Add Tower
            </button>
          </div>
        </div>

        {/* Current Tower Details */}
        {currentTower && (
          <>
            {/* Temperature Profile */}
            <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
              <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>📈 {currentTower.name} - Temperature Profile</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={tempProfileData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis label={{ value: "Temperature (°C)", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="inlet" stroke="#dc2626" strokeWidth={2} name="Inlet" />
                  <Line type="monotone" dataKey="outlet" stroke="#0284c7" strokeWidth={2} name="Outlet" />
                  <Line type="monotone" dataKey="ambient" stroke="#10b981" strokeWidth={2} name="Ambient" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Cooling Efficiency */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>
              <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #0284c7" }}>
                <p style={{ color: "#0c2340", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0" }}>APPROACH TEMPERATURE</p>
                <p style={{ color: "#0284c7", fontSize: "36px", fontWeight: "800", margin: "0" }}>{coolingEff.approach.toFixed(1)}°C</p>
                <p style={{ color: "#0c2340", fontSize: "12px", margin: "8px 0 0 0" }}>Ideal: 2-5°C (target: 3°C)</p>
              </div>

              <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #10b981" }}>
                <p style={{ color: "#065f46", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0" }}>TEMPERATURE RANGE</p>
                <p style={{ color: "#10b981", fontSize: "36px", fontWeight: "800", margin: "0" }}>{coolingEff.range.toFixed(1)}°C</p>
                <p style={{ color: "#065f46", fontSize: "12px", margin: "8px 0 0 0" }}>Inlet - Outlet (target: 8-12°C)</p>
              </div>

              <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #ca8a04" }}>
                <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0" }}>COOLING EFFECTIVENESS</p>
                <p style={{ color: "#ca8a04", fontSize: "36px", fontWeight: "800", margin: "0" }}>{coolingEff.effectiveness.toFixed(1)}%</p>
                <p style={{ color: "#854d0e", fontSize: "12px", margin: "8px 0 0 0" }}>Efficiency rating</p>
              </div>

              <div style={{ background: "linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #8b5cf6" }}>
                <p style={{ color: "#6d28d9", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0" }}>TOWER EFFICIENCY</p>
                <p style={{ color: "#8b5cf6", fontSize: "36px", fontWeight: "800", margin: "0" }}>{towerEff.toFixed(1)}%</p>
                <p style={{ color: "#6d28d9", fontSize: "12px", margin: "8px 0 0 0" }}>Operational efficiency</p>
              </div>
            </div>

            {/* Water Treatment Quality */}
            <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
              <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🧪 Water Treatment Quality</h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                <div style={{ background: "#f0f9ff", padding: "15px", borderRadius: "10px", borderLeft: "4px solid #0284c7" }}>
                  <p style={{ color: "#0c4a6e", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>pH Level</p>
                  <p style={{ color: "#0284c7", fontSize: "24px", fontWeight: "800", margin: "0" }}>{currentTower.ph.toFixed(1)}</p>
                  <input
                    type="number"
                    value={currentTower.ph}
                    onChange={(e) => updateTower(currentTower.id, "ph", Number(e.target.value))}
                    step="0.1"
                    style={{ width: "100%", marginTop: "8px", padding: "6px", borderRadius: "4px", border: "1px solid #ddd" }}
                  />
                  <p style={{ color: "#666", fontSize: "11px", margin: "5px 0 0 0" }}>Target: 7.0-8.5</p>
                </div>

                <div style={{ background: "#f0fdf4", padding: "15px", borderRadius: "10px", borderLeft: "4px solid #10b981" }}>
                  <p style={{ color: "#065f46", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>TDS (mg/L)</p>
                  <p style={{ color: "#10b981", fontSize: "24px", fontWeight: "800", margin: "0" }}>{currentTower.tds.toFixed(0)}</p>
                  <input
                    type="number"
                    value={currentTower.tds}
                    onChange={(e) => updateTower(currentTower.id, "tds", Number(e.target.value))}
                    step="10"
                    style={{ width: "100%", marginTop: "8px", padding: "6px", borderRadius: "4px", border: "1px solid #ddd" }}
                  />
                  <p style={{ color: "#666", fontSize: "11px", margin: "5px 0 0 0" }}>Target: &lt;1500 mg/L</p>
                </div>

                <div style={{ background: "#fef3c7", padding: "15px", borderRadius: "10px", borderLeft: "4px solid #ca8a04" }}>
                  <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>Conductivity (µS/cm)</p>
                  <p style={{ color: "#ca8a04", fontSize: "24px", fontWeight: "800", margin: "0" }}>{currentTower.conductivity.toFixed(0)}</p>
                  <input
                    type="number"
                    value={currentTower.conductivity}
                    onChange={(e) => updateTower(currentTower.id, "conductivity", Number(e.target.value))}
                    step="50"
                    style={{ width: "100%", marginTop: "8px", padding: "6px", borderRadius: "4px", border: "1px solid #ddd" }}
                  />
                  <p style={{ color: "#666", fontSize: "11px", margin: "5px 0 0 0" }}>Target: &lt;2500 µS/cm</p>
                </div>

                <div style={{ background: "#f3e8ff", padding: "15px", borderRadius: "10px", borderLeft: "4px solid #8b5cf6" }}>
                  <p style={{ color: "#6d28d9", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>Cycles of Concentration</p>
                  <p style={{ color: "#8b5cf6", fontSize: "24px", fontWeight: "800", margin: "0" }}>{currentTower.cyclesOfConcentration.toFixed(1)}x</p>
                  <input
                    type="number"
                    value={currentTower.cyclesOfConcentration}
                    onChange={(e) => updateTower(currentTower.id, "cyclesOfConcentration", Number(e.target.value))}
                    step="0.1"
                    style={{ width: "100%", marginTop: "8px", padding: "6px", borderRadius: "4px", border: "1px solid #ddd" }}
                  />
                  <p style={{ color: "#666", fontSize: "11px", margin: "5px 0 0 0" }}>Target: 3-5x</p>
                </div>
              </div>

              <div
                style={{
                  background:
                    treatmentStatus.status === "EXCELLENT"
                      ? "#dcfce7"
                      : treatmentStatus.status === "FAIR"
                        ? "#fef3c7"
                        : "#fee2e2",
                  padding: "15px",
                  borderRadius: "8px",
                  border:
                    treatmentStatus.status === "EXCELLENT"
                      ? "2px solid #10b981"
                      : treatmentStatus.status === "FAIR"
                        ? "2px solid #ca8a04"
                        : "2px solid #dc2626",
                }}
              >
                <p
                  style={{
                    color:
                      treatmentStatus.status === "EXCELLENT"
                        ? "#065f46"
                        : treatmentStatus.status === "FAIR"
                          ? "#854d0e"
                          : "#7f1d1d",
                    fontSize: "13px",
                    fontWeight: "700",
                    margin: "0 0 8px 0",
                  }}
                >
                  Treatment Status: {treatmentStatus.status}
                </p>
                {treatmentStatus.issues.length > 0 && (
                  <ul style={{ margin: "0", paddingLeft: "20px" }}>
                    {treatmentStatus.issues.map((issue, idx) => (
                      <li
                        key={idx}
                        style={{
                          color:
                            treatmentStatus.status === "EXCELLENT"
                              ? "#065f46"
                              : treatmentStatus.status === "FAIR"
                                ? "#854d0e"
                                : "#7f1d1d",
                          fontSize: "12px",
                        }}
                      >
                        {issue}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Water Balance */}
            <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
              <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>💧 Water Balance & Blowdown</h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "20px" }}>
                <div style={{ background: "#f0f9ff", padding: "15px", borderRadius: "10px" }}>
                  <p style={{ color: "#0c4a6e", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>Makeup Water</p>
                  <p style={{ color: "#0284c7", fontSize: "24px", fontWeight: "800", margin: "0" }}>{currentTower.makeupWater.toFixed(1)}</p>
                  <p style={{ color: "#666", fontSize: "11px", margin: "5px 0 0 0" }}>GPM (input)</p>
                </div>

                <div style={{ background: "#f0fdf4", padding: "15px", borderRadius: "10px" }}>
                  <p style={{ color: "#065f46", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>Evaporation</p>
                  <p style={{ color: "#10b981", fontSize: "24px", fontWeight: "800", margin: "0" }}>{currentTower.waterLoss.toFixed(1)}</p>
                  <p style={{ color: "#666", fontSize: "11px", margin: "5px 0 0 0" }}>GPM (natural loss)</p>
                </div>

                <div style={{ background: "#fef3c7", padding: "15px", borderRadius: "10px" }}>
                  <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>Blowdown Rate</p>
                  <p style={{ color: "#ca8a04", fontSize: "24px", fontWeight: "800", margin: "0" }}>{currentTower.blowdownRate.toFixed(1)}%</p>
                  <input
                    type="number"
                    value={currentTower.blowdownRate}
                    onChange={(e) => updateTower(currentTower.id, "blowdownRate", Number(e.target.value))}
                    step="0.1"
                    style={{ width: "100%", marginTop: "8px", padding: "6px", borderRadius: "4px", border: "1px solid #ddd" }}
                  />
                </div>

                <div style={{ background: "#f3e8ff", padding: "15px", borderRadius: "10px" }}>
                  <p style={{ color: "#6d28d9", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>Actual Blowdown</p>
                  <p style={{ color: "#8b5cf6", fontSize: "24px", fontWeight: "800", margin: "0" }}>
                    {((currentTower.capacity * currentTower.blowdownRate) / 100).toFixed(1)}
                  </p>
                  <p style={{ color: "#666", fontSize: "11px", margin: "5px 0 0 0" }}>GPM (calculated)</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[currentTower].map((t) => ({
                  name: "Tower",
                  "Makeup": t.makeupWater,
                  "Evaporation": t.waterLoss,
                  "Blowdown": (t.capacity * t.blowdownRate) / 100,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "GPM", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Bar dataKey="Makeup" fill="#0284c7" />
                  <Bar dataKey="Evaporation" fill="#10b981" />
                  <Bar dataKey="Blowdown" fill="#ca8a04" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: "#fee2e2", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
              <button
                onClick={() => removeTower(currentTower.id)}
                style={{
                  padding: "10px 20px",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Remove Tower
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
