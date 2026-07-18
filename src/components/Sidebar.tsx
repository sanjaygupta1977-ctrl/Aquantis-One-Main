import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const buttons = [
    { label: "🏠 Dashboard", path: "/" },
  
    { label: "🔗 Integrated Management", path: "/integrated" },
    { label: "🌏 India Climate Scenario", path: "/india-climate" },
    { label: "💧 Aquifer Mapping", path: "/aquifer-mapping" },
    { label: "🌊 SWAT Tool Integration", path: "/swat-tool" },
    { label: "🗻 Watershed Delineation", path: "/watershed-delineation" },
    { label: "🌐 RCP Database v2.0.5", path: "/rcp-database" },
    { label: "🌍 GEC Interventions", path: "/gec-interventions" },
    { label: "💧 GEC 2015 Groundwater", path: "/gec-2015-groundwater" },
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
          fontSize: "18px",
          fontWeight: "800",
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

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={() => navigate(btn.path)}
            style={{
              background: "transparent",
              color: "white",
              border: "1px solid #38bdf8",
              padding: "10px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "500",
              transition: "all 0.3s",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#38bdf8";
              e.currentTarget.style.color = "#0f172a";
              e.currentTarget.style.fontWeight = "700";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.fontWeight = "500";
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #38bdf8" }}>
        <p style={{ fontSize: "10px", color: "#64748b", margin: "0 0 10px 0", fontWeight: "700", textTransform: "uppercase" }}>
          Version Info
        </p>
        <p style={{ fontSize: "11px", color: "#38bdf8", margin: "0 0 5px 0", fontWeight: "600" }}>
          AQUANTIS v1.1.0
        </p>
        <p style={{ fontSize: "10px", color: "#64748b", margin: "0" }}>
          23 Pages • 14-Month Roadmap
        </p>
      </div>
    </div>
  );
}
