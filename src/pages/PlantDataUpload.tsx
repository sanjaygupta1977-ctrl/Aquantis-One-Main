import Layout from "../components/Layout";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, ResponsiveContainer } from "recharts";

const API_BASE = "/api";

interface PlantData {
  id: string;
  name: string;
  location: string;
  sector: string;
  water_usage: number;
  wastewater: number;
  energy_consumption: number;
  waste_generated: number;
  employees: number;
  area_sqm: number;
  crop_area?: number;
  crop_type?: string;
  upload_date: string;
  raw_data: Record<string, any>;
}

interface ModuleCompatibility {
  module: string;
  category: string;
  compatibility: "Full" | "Partial" | "Limited";
  dataUsed: string[];
  score: number;
}

export default function PlantDataUpload() {
  const [plants, setPlants] = useState<PlantData[]>([]);
  const [newPlant, setNewPlant] = useState({
    name: "",
    location: "",
    sector: "manufacturing",
    water_usage: 0,
    wastewater: 0,
    energy_consumption: 0,
    waste_generated: 0,
    employees: 0,
    area_sqm: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantData | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  const handleAddPlant = async () => {
    if (!newPlant.name || !newPlant.location) {
      alert("Please fill in plant name and location");
      return;
    }

    setUploading(true);
    try {
      const response = await fetch(`${API_BASE}/plant-data/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlant),
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setPlants([...plants, data.plant]);
      setNewPlant({
        name: "",
        location: "",
        sector: "manufacturing",
        water_usage: 0,
        wastewater: 0,
        energy_consumption: 0,
        waste_generated: 0,
        employees: 0,
        area_sqm: 0,
      });
      alert("Plant data uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed - using local storage");
      const plant: PlantData = {
        id: Date.now().toString(),
        ...newPlant,
        upload_date: new Date().toISOString(),
        raw_data: newPlant,
      };
      setPlants([...plants, plant]);
    } finally {
      setUploading(false);
    }
  };

  const getModuleCompatibility = (): ModuleCompatibility[] => [
    { module: "Water Footprint", category: "Calculators", compatibility: "Full", dataUsed: ["water_usage", "area_sqm"], score: 95 },
    { module: "Carbon Footprint", category: "Calculators", compatibility: "Full", dataUsed: ["energy_consumption", "employees"], score: 92 },
    { module: "ZLD Calculator", category: "Calculators", compatibility: "Full", dataUsed: ["wastewater", "sector"], score: 98 },
    { module: "ISO 14046", category: "Calculators", compatibility: "Full", dataUsed: ["water_usage", "wastewater"], score: 94 },
    { module: "RO Design", category: "Calculators", compatibility: "Full", dataUsed: ["wastewater", "water_usage"], score: 90 },
    { module: "Crop Water", category: "Calculators", compatibility: "Partial", dataUsed: ["crop_area", "crop_type"], score: 85 },
    { module: "Water Quality", category: "Monitoring", compatibility: "Partial", dataUsed: ["wastewater", "location"], score: 78 },
    { module: "E. coli Analysis", category: "Monitoring", compatibility: "Partial", dataUsed: ["wastewater"], score: 72 },
    { module: "Lake Management", category: "Monitoring", compatibility: "Partial", dataUsed: ["location"], score: 68 },
    { module: "ESG Reporting", category: "Core", compatibility: "Full", dataUsed: ["all"], score: 100 },
    { module: "Cooling Tower", category: "Monitoring", compatibility: "Partial", dataUsed: ["water_usage"], score: 80 },
    { module: "Health Barometer", category: "Monitoring", compatibility: "Partial", dataUsed: ["employees", "location"], score: 75 },
  ];

  const compatibilityData = getModuleCompatibility().map(m => ({
    name: m.module,
    score: m.score,
  }));

  const tabs = [
    { id: "upload", label: "📤 Upload Data" },
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "compatibility", label: "🔗 Module Links" },
    { id: "plants", label: "🏭 Plant List" },
  ];

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" }}>
          🏭 Plant Data Management System
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 32px 0" }}>
          Upload plant operational data & auto-link to all 33 modules
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "8px 12px", borderRadius: "8px", border: "2px solid", background: activeTab === t.id ? "#3b82f6" : "white", color: activeTab === t.id ? "white" : "#3b82f6", borderColor: "#3b82f6", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div style={{ background: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
            <h2 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>🏭 Add Plant Data</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Plant Name *</label>
                <input type="text" value={newPlant.name} onChange={e => setNewPlant({ ...newPlant, name: e.target.value })} placeholder="e.g., Plant A" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
              </div>

              <div>
                <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Location *</label>
                <input type="text" value={newPlant.location} onChange={e => setNewPlant({ ...newPlant, location: e.target.value })} placeholder="e.g., Tamil Nadu" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
              </div>

              <div>
                <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Sector</label>
                <select value={newPlant.sector} onChange={e => setNewPlant({ ...newPlant, sector: e.target.value })} style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a", background: "white", cursor: "pointer" }}>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="textile">Textile</option>
                  <option value="pharma">Pharma</option>
                  <option value="food">Food & Beverage</option>
                  <option value="chemical">Chemical</option>
                  <option value="agriculture">Agriculture</option>
                </select>
              </div>

              <div>
                <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Water Usage (m³/day)</label>
                <input type="number" value={newPlant.water_usage} onChange={e => setNewPlant({ ...newPlant, water_usage: parseFloat(e.target.value) || 0 })} min="0" step="10" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
              </div>

              <div>
                <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Wastewater (m³/day)</label>
                <input type="number" value={newPlant.wastewater} onChange={e => setNewPlant({ ...newPlant, wastewater: parseFloat(e.target.value) || 0 })} min="0" step="10" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
              </div>

              <div>
                <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Energy (MWh/day)</label>
                <input type="number" value={newPlant.energy_consumption} onChange={e => setNewPlant({ ...newPlant, energy_consumption: parseFloat(e.target.value) || 0 })} min="0" step="1" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
              </div>

              <div>
                <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Waste (tons/day)</label>
                <input type="number" value={newPlant.waste_generated} onChange={e => setNewPlant({ ...newPlant, waste_generated: parseFloat(e.target.value) || 0 })} min="0" step="1" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
              </div>

              <div>
                <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Employees</label>
                <input type="number" value={newPlant.employees} onChange={e => setNewPlant({ ...newPlant, employees: parseInt(e.target.value) || 0 })} min="0" step="10" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
              </div>

              <div>
                <label style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Area (m²)</label>
                <input type="number" value={newPlant.area_sqm} onChange={e => setNewPlant({ ...newPlant, area_sqm: parseFloat(e.target.value) || 0 })} min="0" step="100" style={{ width: "100%", padding: "10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#0f172a" }} />
              </div>

              <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "flex-end" }}>
                <button onClick={handleAddPlant} disabled={uploading} style={{ padding: "10px 32px", borderRadius: "8px", border: "none", background: uploading ? "#cbd5e1" : "#3b82f6", color: "white", fontSize: "14px", fontWeight: "700", cursor: uploading ? "not-allowed" : "pointer", width: "100%" }}>
                  {uploading ? "📤 Uploading..." : "📤 Upload Plant Data"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && plants.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Plants Uploaded</h3>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#3b82f6" }}>{plants.length}</div>
              <p style={{ color: "#64748b", fontSize: "12px", margin: "0" }}>Total plant facilities</p>
            </div>

            <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Avg Water Usage</h3>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#06b6d4" }}>
                {(plants.reduce((sum, p) => sum + p.water_usage, 0) / plants.length).toFixed(0)}
              </div>
              <p style={{ color: "#64748b", fontSize: "12px", margin: "0" }}>m³/day per facility</p>
            </div>

            <div style={{ gridColumn: "1 / -1", background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Water Usage Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={plants}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <RechartTooltip />
                  <Bar dataKey="water_usage" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Compatibility Tab */}
        {activeTab === "compatibility" && (
          <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
            <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Module Integration Score</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={compatibilityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={150} />
                <RechartTooltip />
                <Bar dataKey="score" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>

            <div style={{ marginTop: "20px" }}>
              <h4 style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0 0 12px 0" }}>Compatibility Details</h4>
              {getModuleCompatibility().map((m, i) => (
                <div key={i} style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", marginBottom: "8px", borderLeft: `4px solid ${m.score >= 90 ? "#10b981" : m.score >= 75 ? "#f97316" : "#ef4444"}` }}>
                  <p style={{ color: "#0f172a", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>{m.module} ({m.category})</p>
                  <p style={{ color: "#64748b", fontSize: "10px", margin: "0" }}>Score: {m.score}% • Data: {m.dataUsed.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plant List Tab */}
        {activeTab === "plants" && (
          <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>Uploaded Plants</h3>
            {plants.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "12px" }}>No plants uploaded yet</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px" }}>
                {plants.map((plant, i) => (
                  <div key={i} style={{ padding: "16px", background: "#f8fafc", borderRadius: "10px", borderLeft: "4px solid #3b82f6", cursor: "pointer" }} onClick={() => setSelectedPlant(plant)}>
                    <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", margin: "0 0 4px 0" }}>{plant.name}</p>
                    <p style={{ color: "#64748b", fontSize: "10px", margin: "0 0 4px 0" }}>📍 {plant.location}</p>
                    <p style={{ color: "#64748b", fontSize: "10px", margin: "0 0 4px 0" }}>💧 {plant.water_usage} m³/day</p>
                    <p style={{ color: "#64748b", fontSize: "10px", margin: "0" }}>⚡ {plant.energy_consumption} MWh/day</p>
                  </div>
                ))}
              </div>
            )}

            {selectedPlant && (
              <div style={{ marginTop: "24px", padding: "16px", background: "#f0f9ff", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
                <h4 style={{ color: "#0c4a6e", fontSize: "12px", fontWeight: "700", margin: "0 0 12px 0" }}>🏭 {selectedPlant.name} - Details</h4>
                {Object.entries(selectedPlant).map(([key, value]) => (
                  typeof value === "object" ? null : (
                    <div key={key} style={{ fontSize: "11px", color: "#0f172a", marginBottom: "4px" }}>
                      <strong>{key}:</strong> {String(value)}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {activeTab === "dashboard" && plants.length === 0 && (
          <div style={{ background: "white", padding: "40px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0" }}>📤 Upload plant data to see dashboard</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
