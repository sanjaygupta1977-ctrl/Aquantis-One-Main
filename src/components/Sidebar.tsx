export default function Sidebar() {
  return (
    <div
      style={{
        width: "240px",
        background: "#0f172a",
        color: "white",
        height: "100vh",
        padding: "20px",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <h2 style={{ marginBottom: "40px", color: "#38bdf8" }}>
        AQUANTIS GLOBAL
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <button>🏠 Dashboard</button>
        <button>💧 Water</button>
        <button>🧪 Water Quality</button>
        <button>🏭 Cooling Tower</button>
        <button>🌱 Neutrality</button>
        <button> 📈KPI Card</button>
        <button>🤖 AI Advisor</button>
        <button>📄 Reports</button>
        <button>⚙ Settings</button>
      </div>
    </div>
  );
}