import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const buttons = [
    { label: "🔗 Integrated Management", path: "/integrated" },
    { label: "🌏 India Climate Scenario", path: "/india-climate" },
    { label: "💧 Aquifer Mapping", path: "/aquifer-mapping" },
    { label: "🌊 SWAT Tool Integration", path: "/swat-tool" },
    { label: "🗻 Watershed Delineation", path: "/watershed-delineation" },
    { label: "🌐 RCP Database v2.0.5", path: "/rcp-database" },
    { label: "🏥 Health Barometer", path: "/health-barometer" },
    { label: "💧 Water", path: "/water" },
    { label: "🧪 Water Quality", path: "/quality" },
    { label: "🏭 Cooling Tower Mgmt", path: "/cooling-tower" },
    { label: "🌱 Neutrality", path: "/neutrality" },
    { label: "📈 KPI Card", path: "/kpi" },
    { label: "🤖 AI Advisor", path: "/ai" },
    { label: "📊 Water Footprint", path: "/footprint" },
    { label: "🌍 Carbon Footprint", path: "/carbon" },
    { label: "💧 Drinking Water", path: "/drinking-water" },
    { label: "📄 Reports", path: "/reports" },
    { label: "⚙ Settings", path: "/settings" },
  ];

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
        overflowY: "auto",
      }}
    >
      <h2 
        onClick={() => navigate("/")}
        style={{ 
          marginBottom: "40px", 
          color: "#38bdf8",
          cursor: "pointer",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#7dd3fc";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#38bdf8";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        AQUANTIS GLOBAL
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={() => navigate(btn.path)}
            style={{
              background: "transparent",
              color: "white",
              border: "1px solid #38bdf8",
              padding: "12px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.3s",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#38bdf8";
              e.currentTarget.style.color = "#0f172a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "white";
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
