import Layout from "../components/Layout";
import { useState } from "react";

interface Item {
  id: number;
  name: string;
  quantity: number;
  waterPerUnit: number;
  category: string;
}

export default function WaterFootprintCalculator() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Cotton Shirts", quantity: 1000, waterPerUnit: 10000, category: "textiles" },
    { id: 2, name: "Beef Products", quantity: 500, waterPerUnit: 15415, category: "food" },
  ]);
  const [newItem, setNewItem] = useState<Item>({ id: 0, name: "", quantity: 0, waterPerUnit: 0, category: "textiles" });
  const [nextId, setNextId] = useState(3);

  const waterContent: Record<string, Record<string, number>> = {
    textiles: { "Cotton Shirts": 10000, "Denim Jeans": 11000, "T-Shirt": 2700, "Polyester": 3000 },
    food: { "Beef": 15415, "Chicken": 4325, "Rice (1kg)": 2500, "Coffee (1cup)": 140 },
    electronics: { "Smartphone": 240, "Laptop": 2100, "Tablet": 1200, "Microchip": 36 },
    beverages: { "Wine (1L)": 870, "Beer (1L)": 300, "Coffee (1cup)": 140, "Tea (1cup)": 27 },
  };

  const presets: Record<string, string[]> = {
    textiles: ["Cotton Shirts", "Denim Jeans", "T-Shirt", "Polyester"],
    food: ["Beef", "Chicken", "Rice (1kg)", "Coffee (1cup)"],
    electronics: ["Smartphone", "Laptop", "Tablet", "Microchip"],
    beverages: ["Wine (1L)", "Beer (1L)", "Coffee (1cup)", "Tea (1cup)"],
  };

  const addItem = () => {
    if (newItem.name && newItem.quantity > 0 && newItem.waterPerUnit > 0) {
      setItems([...items, { ...newItem, id: nextId }]);
      setNextId(nextId + 1);
      setNewItem({ id: 0, name: "", quantity: 0, waterPerUnit: 0, category: "textiles" });
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: keyof Item, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const totalWater = items.reduce((sum, item) => sum + item.quantity * item.waterPerUnit, 0);
  const averageWaterPerItem = items.length > 0 ? totalWater / items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "36px", fontWeight: "800", margin: "0 0 10px 0" }}>
          🌊 Itemwise Water Footprint Calculator
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 40px 0" }}>
          Calculate the virtual water footprint for each product in your supply chain
        </p>

        {/* Add New Item Form */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>Add Product to Inventory</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", color: "#0f172a", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px" }}
              >
                <option value="textiles">Textiles</option>
                <option value="food">Food</option>
                <option value="electronics">Electronics</option>
                <option value="beverages">Beverages</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", color: "#0f172a", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>Product Name</label>
              <select
                value={newItem.name}
                onChange={(e) => {
                  const selected = e.target.value;
                  const categoryProducts = waterContent[newItem.category];
                  const water = categoryProducts ? categoryProducts[selected] || 0 : 0;
                  setNewItem({
                    ...newItem,
                    name: selected,
                    waterPerUnit: water,
                  });
                }}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px" }}
              >
                <option value="">Select a product...</option>
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
              <label style={{ display: "block", color: "#0f172a", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>Water per Unit (L)</label>
              <input
                type="number"
                value={newItem.waterPerUnit}
                onChange={(e) => setNewItem({ ...newItem, waterPerUnit: Number(e.target.value) })}
                placeholder="e.g., 10000"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <button
            onClick={addItem}
            style={{
              width: "100%",
              padding: "12px",
              background: "#0284c7",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#0369a1"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#0284c7"}
          >
            + Add Product
          </button>
        </div>

        {/* Items Table */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>Product Inventory</h2>

          {items.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center", padding: "40px" }}>No products added yet. Add your first product above.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#f0f9ff", borderBottom: "2px solid #0284c7" }}>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>Product</th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>Category</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Quantity</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Water/Unit (L)</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Total Water (L)</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "12px", color: "#0f172a" }}>{item.name}</td>
                      <td style={{ padding: "12px", color: "#0f172a" }}>
                        <span style={{ background: "#e0f2fe", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", color: "#0369a1" }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center", color: "#0f172a" }}>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                          style={{ width: "80px", padding: "6px", borderRadius: "4px", border: "1px solid #ddd", textAlign: "center" }}
                        />
                      </td>
                      <td style={{ padding: "12px", textAlign: "center", color: "#0f172a" }}>
                        <input
                          type="number"
                          value={item.waterPerUnit}
                          onChange={(e) => updateItem(item.id, "waterPerUnit", Number(e.target.value))}
                          style={{ width: "100px", padding: "6px", borderRadius: "4px", border: "1px solid #ddd", textAlign: "center" }}
                        />
                      </td>
                      <td style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0284c7" }}>
                        {(item.quantity * item.waterPerUnit).toLocaleString()}
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #0284c7" }}>
              <p style={{ color: "#0c4a6e", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>Total Water Footprint</p>
              <p style={{ color: "#0284c7", fontSize: "32px", fontWeight: "800", margin: "0" }}>
                {(totalWater / 1000000).toFixed(2)}M
              </p>
              <p style={{ color: "#0c4a6e", fontSize: "12px", margin: "8px 0 0 0" }}>Liters</p>
            </div>

            <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #16a34a" }}>
              <p style={{ color: "#166534", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>Avg Water per Item</p>
              <p style={{ color: "#16a34a", fontSize: "32px", fontWeight: "800", margin: "0" }}>
                {averageWaterPerItem.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </p>
              <p style={{ color: "#166534", fontSize: "12px", margin: "8px 0 0 0" }}>Liters/unit</p>
            </div>

            <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #ca8a04" }}>
              <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>Total Units</p>
              <p style={{ color: "#ca8a04", fontSize: "32px", fontWeight: "800", margin: "0" }}>
                {items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}
              </p>
              <p style={{ color: "#854d0e", fontSize: "12px", margin: "8px 0 0 0" }}>Products</p>
            </div>

            <div style={{ background: "linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%)", padding: "25px", borderRadius: "12px", border: "2px solid #8b5cf6" }}>
              <p style={{ color: "#6d28d9", fontSize: "12px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>10% Reduction Saves</p>
              <p style={{ color: "#8b5cf6", fontSize: "32px", fontWeight: "800", margin: "0" }}>
                {(totalWater * 0.1 / 1000000).toFixed(2)}M
              </p>
              <p style={{ color: "#6d28d9", fontSize: "12px", margin: "8px 0 0 0" }}>Liters/year</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
