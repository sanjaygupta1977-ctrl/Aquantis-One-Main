import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { calculateWaterBalance } from "../engine/waterbalance";
import { api } from "../utils/api";

export default function WaterIntelligence() {
  const [freshwater, setFreshwater] = useState(12000);
  const [recycled, setRecycled] = useState(4000);
  const [production, setProduction] = useState(2500);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const result = calculateWaterBalance({
    freshwater,
    recycledWater: recycled,
    rainwater: 500,
    production,
    evaporationLoss: 5000,
    blowdownLoss: 1000,
    processLoss: 3000,
    domesticUse: 500,
    discharge: 7000
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getWaterBalance();
      if (data && data.freshwater) {
        setFreshwater(data.freshwater);
        setRecycled(data.recycled_water);
        setProduction(data.production);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.saveWaterBalance({
        freshwater,
        recycledWater: recycled,
        rainwater: 500,
        production,
        evaporationLoss: 5000,
        blowdownLoss: 1000,
        processLoss: 3000,
        domesticUse: 500,
        discharge: 7000
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{padding:40}}>
        <h1>💧 AQUANTIS WATER BALANCE</h1>

        {saved && (
          <div style={{ background: '#d1fae5', padding: '12px', borderRadius: '6px', marginBottom: '20px', color: '#065f46' }}>
            ✓ Data saved to database successfully
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px" }}>
          <div style={{ background: "#eff6ff", padding: "20px", borderRadius: "8px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Fresh Water (m³)</label>
            <input
              type="number"
              value={freshwater}
              onChange={(e)=>setFreshwater(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ background: "#f0fdf4", padding: "20px", borderRadius: "8px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Recycled Water (m³)</label>
            <input
              type="number"
              value={recycled}
              onChange={(e)=>setRecycled(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ background: "#fef3c7", padding: "20px", borderRadius: "8px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Production (m³)</label>
            <input
              type="number"
              value={production}
              onChange={(e)=>setProduction(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
                fontSize: "14px"
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          <div style={{ background: "#f9fafb", padding: "20px", borderRadius: "8px", border: "2px solid #38bdf8" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#0369a1" }}>Total Water Input</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#38bdf8", margin: "10px 0" }}>{result.totalInput} m³</p>
          </div>

          <div style={{ background: "#f9fafb", padding: "20px", borderRadius: "8px", border: "2px solid #16a34a" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#16a34a" }}>Reuse Rate</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#16a34a", margin: "10px 0" }}>{result.reusePercentage.toFixed(1)}%</p>
          </div>

          <div style={{ background: "#f9fafb", padding: "20px", borderRadius: "8px", border: "2px solid #b45309" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#b45309" }}>Water Intensity</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#b45309", margin: "10px 0" }}>{result.waterIntensity.toFixed(2)} m³/unit</p>
          </div>

          <div style={{ background: result.balanceStatus === "Balanced" ? "#f0fdf4" : "#fef2f2", padding: "20px", borderRadius: "8px", border: `2px solid ${result.balanceStatus === "Balanced" ? "#16a34a" : "#dc2626"}` }}>
            <h3 style={{ margin: "0 0 10px 0", color: result.balanceStatus === "Balanced" ? "#16a34a" : "#dc2626" }}>Status</h3>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: result.balanceStatus === "Balanced" ? "#16a34a" : "#dc2626", margin: "10px 0" }}>
              {result.balanceStatus === "Balanced" ? "✓" : "⚠"} {result.balanceStatus}
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            marginTop: '30px',
            padding: '12px 30px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            opacity: loading ? 0.7 : 1,
            transition: "all 0.3s"
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = "#1d4ed8";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.background = "#2563eb";
          }}
        >
          {loading ? 'Saving...' : '💾 Save to Database'}
        </button>
      </div>
    </Layout>
  );
}
