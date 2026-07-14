import Layout from "../components/Layout";
import { useState } from "react";

interface CarbonItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  carbonPerUnit: number;
  source: string;
  category: string;
}

export default function CarbonFootprintCalculator() {
  const [items, setItems] = useState<CarbonItem[]>([
    { id: 1, name: "Cotton Shirts Production", quantity: 1000, unit: "pieces", carbonPerUnit: 5.5, source: "GHG Protocol", category: "textiles" },
    { id: 2, name: "Beef Production", quantity: 500, unit: "kg", carbonPerUnit: 27, source: "IPCC AR5", category: "food" },
  ]);
  const [newItem, setNewItem] = useState<CarbonItem>({ id: 0, name: "", quantity: 0, unit: "kg", carbonPerUnit: 0, source: "", category: "textiles" });
  const [nextId, setNextId] = useState(3);

  // Carbon registry reference data (kg CO2e per unit)
  const carbonRegistry: Record<string, Record<string, { emission: number; source: string; unit: string }>> = {
    textiles: {
      "Cotton Shirts": { emission: 5.5, source: "GHG Protocol - Textiles Guidance", unit: "per piece" },
      "Denim Jeans": { emission: 7.2, source: "Higg FSLCI Index", unit: "per piece" },
      "Polyester T-Shirt": { emission: 3.8, source: "EPA - Apparel & Footwear", unit: "per piece" },
      "Wool Sweater": { emission: 8.1, source: "Environmental Product Declaration", unit: "per piece" },
      "Leather Shoes": { emission: 12.4, source: "ISO 14040/44 LCA Study", unit: "per pair" },
    },
    food: {
      "Beef": { emission: 27, source: "IPCC AR5 - Agriculture", unit: "per kg" },
      "Lamb": { emission: 24, source: "IPCC AR5 - Agriculture", unit: "per kg" },
      "Pork": { emission: 12, source: "IPCC AR5 - Agriculture", unit: "per kg" },
      "Chicken": { emission: 6.9, source: "IPCC AR5 - Agriculture", unit: "per kg" },
      "Rice": { emission: 4, source: "IPCC AR5 - Agriculture", unit: "per kg" },
      "Wheat": { emission: 1.5, source: "IPCC AR5 - Agriculture", unit: "per kg" },
      "Coffee": { emission: 0.46, source: "PAS 2050 - Coffee", unit: "per 100g" },
      "Milk": { emission: 1.9, source: "IPCC AR5 - Dairy", unit: "per liter" },
    },
    electronics: {
      "Smartphone": { emission: 70, source: "GHG Protocol - Electronics", unit: "per device" },
      "Laptop": { emission: 300, source: "GHG Protocol - Electronics", unit: "per device" },
      "Tablet": { emission: 150, source: "GHG Protocol - Electronics", unit: "per device" },
      "Server": { emission: 2500, source: "GHG Protocol - Data Centers", unit: "per device" },
      "LED Bulb": { emission: 0.1, source: "PAS 2050", unit: "per bulb" },
    },
    energy: {
      "Natural Gas": { emission: 2.04, source: "EPA eGRID", unit: "per cubic meter" },
      "Coal": { emission: 8.76, source: "IPCC GWP 100", unit: "per kg" },
      "Crude Oil": { emission: 3.15, source: "EPA eGRID", unit: "per liter" },
      "Electricity (Grid Mix)": { emission: 0.42, source: "EPA eGRID", unit: "per kWh" },
      "Solar Electricity": { emission: 0.05, source: "NREL LCA", unit: "per kWh" },
      "Wind Electricity": { emission: 0.01, source: "NREL LCA", unit: "per kWh" },
    },
    transportation: {
      "Car (Petrol)": { emission: 0.192, source: "EPA - Transportation", unit: "per km" },
      "Car (Electric)": { emission: 0.05, source: "EPA - Transportation", unit: "per km" },
      "Bus": { emission: 0.089, source: "EPA - Public Transport", unit: "per km per passenger" },
      "Train": { emission: 0.041, source: "EPA - Public Transport", unit: "per km per passenger" },
      "Aircraft": { emission: 0.255, source: "ICAO Carbon Calculator", unit: "per km per passenger" },
      "Ship": { emission: 0.012, source: "IMO - Marine", unit: "per km per ton" },
    },
    chemicals: {
      "Cement": { emission: 0.91, source: "WBCSD CSI", unit: "per kg" },
      "Steel": { emission: 2.13, source: "World Steel Association", unit: "per kg" },
      "Aluminum": { emission: 12.5, source: "International Aluminum Institute", unit: "per kg" },
      "Plastic (PET)": { emission: 3.5, source: "GHG Protocol", unit: "per kg" },
      "Paper": { emission: 1.4, source: "EPA - Paper & Pulp", unit: "per kg" },
    },
  };

  const presets: Record<string, string[]> = {
    textiles: ["Cotton Shirts", "Denim Jeans", "Polyester T-Shirt", "Wool Sweater", "Leather Shoes"],
    food: ["Beef", "Lamb", "Pork", "Chicken", "Rice", "Wheat", "Coffee", "Milk"],
    electronics: ["Smartphone", "Laptop", "Tablet", "Server", "LED Bulb"],
    energy: ["Natural Gas", "Coal", "Crude Oil", "Electricity (Grid Mix)", "Solar Electricity", "Wind Electricity"],
    transportation: ["Car (Petrol)", "Car (Electric)", "Bus", "Train", "Aircraft", "Ship"],
    chemicals: ["Cement", "Steel", "Aluminum", "Plastic (PET)", "Paper"],
  };

  const addItem = () => {
    if (newItem.name && newItem.quantity > 0 && newItem.carbonPerUnit > 0) {
      setItems([...items, { ...newItem, id: nextId }]);
      setNextId(nextId + 1);
      setNewItem({ id: 0, name: "", quantity: 0, unit: "kg", carbonPerUnit: 0, source: "", category: "textiles" });
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: keyof CarbonItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const totalCarbon = items.reduce((sum, item) => sum + item.quantity * item.carbonPerUnit, 0);
  const averageCarbonPerItem = items.length > 0 ? totalCarbon / items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const carbonReductionTarget = totalCarbon * 0.3; // 30% reduction target (common ESG goal)

  // Carbon offset references
  const offsets = [
    { activity: "Tree Planting", offset: 20, unit: "kg CO2e per tree/year" },
    { activity: "Solar Rooftop", offset: 4000, unit: "kg CO2e per kW/year" },
    { activity: "Renewable Energy", offset: 0.5, unit: "kg CO2e avoided per kWh" },
    { activity: "Reforestation", offset: 25, unit: "kg CO2e per hectare/year" },
  ];

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "36px", fontWeight: "800", margin: "0 0 10px 0" }}>
          🌍 Carbon Footprint Calculator
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 40px 0" }}>
          Track emissions across your supply chain with reference data from global carbon registries
        </p>

        {/* Registry Info Banner */}
        <div style={{ background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #10b981", marginBottom: "30px" }}>
          <p style={{ color: "#065f46", fontSize: "13px", fontWeight: "700", margin: "0 0 8px 0" }}>📚 Data Sources:</p>
          <p style={{ color: "#047857", fontSize: "13px", margin: "0" }}>
            GHG Protocol • IPCC AR5 • EPA eGRID • ISO 14040/44 LCA • Higg FSLCI • PAS 2050 • NREL • ICAO • IMO
          </p>
        </div>

        {/* Add New Item Form */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>Add Emission Source</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", color: "#0f172a", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value, name: "" })}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px" }}
              >
                <option value="textiles">Textiles</option>
                <option value="food">Food</option>
                <option value="electronics">Electronics</option>
                <option value="energy">Energy</option>
                <option value="transportation">Transportation</option>
                <option value="chemicals">Chemicals & Materials</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", color: "#0f172a", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>Product / Source</label>
              <select
                value={newItem.name}
                onChange={(e) => {
                  const selected = e.target.value;
                  const categoryData = carbonRegistry[newItem.category];
                  if (categoryData && categoryData[selected]) {
                    setNewItem({
                      ...newItem,
                      name: selected,
                      carbonPerUnit: categoryData[selected].emission,
                      unit: categoryData[selected].unit,
                      source: categoryData[selected].source,
                    });
                  }
                }}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px" }}
              >
                <option value="">Select an item...</option>
                {presets[newItem.category]?.map((prod: string) => (
                  <option key={prod} value={prod}>
                    {prod}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", color: "#0f172a", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>Quantity</label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                placeholder="e.g., 1000"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "#0f172a", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>Unit</label>
              <input
                type="text"
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                placeholder="e.g., kg, pieces"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "#0f172a", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>Carbon (kg CO2e per unit)</label>
              <input
                type="number"
                value={newItem.carbonPerUnit}
                onChange={(e) => setNewItem({ ...newItem, carbonPerUnit: Number(e.target.value) })}
                placeholder="e.g., 27"
                step="0.01"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "#0f172a", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>Source</label>
              <input
                type="text"
                value={newItem.source}
                placeholder="e.g., IPCC AR5"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px", boxSizing: "border-box" }}
                readOnly
              />
            </div>
          </div>

          <button
            onClick={addItem}
            style={{
              width: "100%",
              padding: "12px",
              background: "#059669",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#047857"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#059669"}
          >
            + Add Emission Source
          </button>
        </div>

        {/* Items Table */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>Emission Inventory</h2>

          {items.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center", padding: "40px" }}>No emission sources added yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f0fdf4", borderBottom: "2px solid #10b981" }}>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>Source</th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>Category</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Qty</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Unit</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Emission/Unit</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Total (kg CO2e)</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Registry</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "12px", color: "#0f172a", fontWeight: "600" }}>{item.name}</td>
                      <td style={{ padding: "12px", color: "#0f172a" }}>
                        <span style={{ background: "#e0f2fe", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", color: "#0369a1", fontWeight: "600" }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center", color: "#0f172a" }}>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                          style={{ width: "70px", padding: "6px", borderRadius: "4px", border: "1px solid #ddd", textAlign: "center" }}
                        />
                      </td>
                      <td style={{ padding: "12px", textAlign: "center", color: "#666", fontSize: "12px" }}>{item.unit}</td>
                      <td style={{ padding: "12px", textAlign: "center", color: "#0f172a", fontWeight: "600" }}>
                        <input
                          type="number"
                          value={item.carbonPerUnit}
                          onChange={(e) => updateItem(item.id, "carbonPerUnit", Number(e.target.value))}
                          step="0.01"
                          style={{ width: "80px", padding: "6px", borderRadius: "4px", border: "1px solid #ddd", textAlign: "center" }}
                        />
                      </td>
                      <td style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#dc2626" }}>
                        {(item.quantity * item.carbonPerUnit).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center", fontSize: "11px", color: "#666" }}>
                        {item.source.split(" - ")[0]}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{
                            padding: "6px 12px",
                            background: "#fee2e2",
                            color: "#dc2626",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        {items.length > 0 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>
              <div style={{ background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #dc2626" }}>
                <p style={{ color: "#7f1d1d", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>Total Carbon Footprint</p>
                <p style={{ color: "#dc2626", fontSize: "36px", fontWeight: "800", margin: "0" }}>
                  {(totalCarbon / 1000).toFixed(1)}
                </p>
                <p style={{ color: "#7f1d1d", fontSize: "12px", margin: "8px 0 0 0" }}>Metric Tons CO2e</p>
              </div>

              <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #0284c7" }}>
                <p style={{ color: "#0c2340", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>Avg per Unit</p>
                <p style={{ color: "#0284c7", fontSize: "36px", fontWeight: "800", margin: "0" }}>
                  {averageCarbonPerItem.toLocaleString("en-US", { maximumFractionDigits: 1 })}
                </p>
                <p style={{ color: "#0c2340", fontSize: "12px", margin: "8px 0 0 0" }}>kg CO2e/unit</p>
              </div>

              <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #ca8a04" }}>
                <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>30% Reduction Target</p>
                <p style={{ color: "#ca8a04", fontSize: "36px", fontWeight: "800", margin: "0" }}>
                  {(carbonReductionTarget / 1000).toFixed(1)}
                </p>
                <p style={{ color: "#854d0e", fontSize: "12px", margin: "8px 0 0 0" }}>Metric Tons CO2e to save</p>
              </div>

              <div style={{ background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #10b981" }}>
                <p style={{ color: "#065f46", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>Total Units</p>
                <p style={{ color: "#10b981", fontSize: "36px", fontWeight: "800", margin: "0" }}>
                  {items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}
                </p>
                <p style={{ color: "#065f46", fontSize: "12px", margin: "8px 0 0 0" }}>Emission sources</p>
              </div>
            </div>

            {/* Carbon Offset Calculator */}
            <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f3faf7 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #10b981", marginBottom: "40px" }}>
              <h2 style={{ color: "#065f46", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>♻️ Carbon Offset Solutions</h2>
              <p style={{ color: "#047857", fontSize: "13px", margin: "0 0 20px 0" }}>How to offset {(totalCarbon / 1000).toFixed(1)} metric tons of CO2e:</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "15px" }}>
                {offsets.map((offset, idx) => {
                  const unitsNeeded = Math.ceil(totalCarbon / offset.offset);
                  return (
                    <div key={idx} style={{ background: "white", padding: "18px", borderRadius: "10px", border: "1px solid #d1fae5" }}>
                      <h3 style={{ color: "#059669", fontSize: "14px", fontWeight: "700", margin: "0 0 10px 0" }}>{offset.activity}</h3>
                      <p style={{ color: "#666", fontSize: "12px", margin: "0 0 8px 0" }}>Offset per unit: {offset.offset} {offset.unit}</p>
                      <p style={{ color: "#10b981", fontSize: "16px", fontWeight: "800", margin: "0 0 8px 0" }}>
                        {unitsNeeded.toLocaleString()} units needed
                      </p>
                      <p style={{ color: "#666", fontSize: "11px", margin: "0" }}>to neutralize your emissions</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Registry References */}
            <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>📚 Registry References Used</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                <div style={{ padding: "15px", background: "#f0f9ff", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
                  <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>GHG Protocol</p>
                  <p style={{ color: "#475569", fontSize: "12px", margin: "0" }}>Global standard for greenhouse gas emissions accounting and reporting</p>
                </div>
                <div style={{ padding: "15px", background: "#f0fdf4", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
                  <p style={{ color: "#065f46", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>IPCC AR5</p>
                  <p style={{ color: "#475569", fontSize: "12px", margin: "0" }}>Intergovernmental Panel on Climate Change Assessment Report 5 - Agriculture & Energy</p>
                </div>
                <div style={{ padding: "15px", background: "#fef3c7", borderRadius: "8px", borderLeft: "4px solid #ca8a04" }}>
                  <p style={{ color: "#854d0e", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>EPA eGRID</p>
                  <p style={{ color: "#475569", fontSize: "12px", margin: "0" }}>US Environmental Protection Agency emission factors for electricity and transportation</p>
                </div>
                <div style={{ padding: "15px", background: "#f3e8ff", borderRadius: "8px", borderLeft: "4px solid #8b5cf6" }}>
                  <p style={{ color: "#6d28d9", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>ISO 14040/44</p>
                  <p style={{ color: "#475569", fontSize: "12px", margin: "0" }}>International standard for Life Cycle Assessment methodology</p>
                </div>
                <div style={{ padding: "15px", background: "#e0f2fe", borderRadius: "8px", borderLeft: "4px solid #0369a1" }}>
                  <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>Higg FSLCI</p>
                  <p style={{ color: "#475569", fontSize: "12px", margin: "0" }}>Higg Facilities & Supply Chain Index for apparel & textiles</p>
                </div>
                <div style={{ padding: "15px", background: "#fef5f1", borderRadius: "8px", borderLeft: "4px solid #ea580c" }}>
                  <p style={{ color: "#7c2d12", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>NREL LCA</p>
                  <p style={{ color: "#475569", fontSize: "12px", margin: "0" }}>National Renewable Energy Laboratory lifecycle assessment database</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
