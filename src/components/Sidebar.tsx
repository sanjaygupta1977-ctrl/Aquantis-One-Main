import { useNavigate, useLocation } from "react-router-dom";

const navGroups = [
  {
    group: "CORE",
    items: [
      { label: "🏠 Dashboard",            path: "/" },
      { label: "🏭 Plant Data Manager",    path: "/plant-data" },
      { label: "📂 File Upload Manager",    path: "/file-upload" },
      { label: "📑 ESG Reporting",         path: "/esg-reporting" },
      { label: "🔗 Integrated Management", path: "/integrated" },
    ],
  },
  {
    group: "CLIMATE & WATER",
    items: [
      { label: "🌏 India Climate Scenario", path: "/india-climate" },
      { label: "🌐 RCP Database v2.0.5",    path: "/rcp-database" },
      { label: "💧 Aquifer Mapping",         path: "/aquifer-mapping" },
      { label: "💧 GEC 2015 Groundwater",   path: "/gec-2015-groundwater" },
      { label: "💧 GEC 2015 Lake Recharge",  path: "/gec-2015-lake-recharge" },
      { label: "🌍 GEC Interventions",      path: "/gec-interventions" },
      { label: "🗻 Watershed Delineation",  path: "/watershed-delineation" },
      { label: "🌊 SWAT Tool Integration",  path: "/swat-tool" },
    ],
  },
  {
    group: "MONITORING",
    items: [
      { label: "🏥 Health Barometer",     path: "/health-barometer" },
      { label: "💧 Water Intelligence",   path: "/water" },
      { label: "🧪 Water Quality",        path: "/quality" },
      { label: "🧬 E. coli Analysis",      path: "/ecoli" },
      { label: "🏞️ Lake Management",       path: "/lake-management" },
      { label: "🏭 Cooling Tower Mgmt",   path: "/cooling-tower" },
      { label: "🌱 Neutrality",           path: "/neutrality" },
      { label: "💧 Water Neutrality (NITI)", path: "/water-neutrality" },
      { label: "📈 KPI Card",             path: "/kpi" },
      { label: "🤖 AI Advisor",           path: "/ai" },
    ],
  },
  {
    group: "CALCULATORS",
    items: [
      { label: "📊 Water Footprint",   path: "/footprint" },
      { label: "🌍 Carbon Footprint",  path: "/carbon" },
      { label: "🌍 Carbon Methodologies", path: "/carbon-methodologies" },
      { label: "💧 Drinking Water",    path: "/drinking-water" },
      { label: "♻️ ZLD Calculator",     path: "/zld-calculator" },
      { label: "🌾 Crop Water",        path: "/crop-water-requirement" },
      { label: "🗺️ LULC Analysis",      path: "/lulc-analysis" },
      { label: "💧 ISO 14046 Water Footprint", path: "/iso14046" },
      { label: "🔬 RO Design Calculator", path: "/ro-design" },
    ],
  },
  {
    group: "ADMIN",
    items: [
      { label: "📄 Reports",   path: "/reports" },
      { label: "⚙️ Settings", path: "/settings" },
    ],
  },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const activePath = location.pathname;

  return (
    <div style={{
      width: "240px",
      background: "#0f172a",
      color: "white",
      height: "100vh",
      padding: "0",
      position: "fixed",
      left: 0,
      top: 0,
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Brand */}
      <div
        onClick={() => navigate("/")}
        style={{ padding: "20px 20px 16px", cursor: "pointer", borderBottom: "1px solid #1e293b" }}
      >
        <p style={{ color: "#38bdf8", fontSize: "16px", fontWeight: "800", margin: "0 0 2px 0", letterSpacing: "0.5px" }}>
          AQUANTIS GLOBAL
        </p>
        <p style={{ color: "#475569", fontSize: "10px", margin: "0" }}>Environmental Intelligence Platform</p>
      </div>

      {/* Nav groups */}
      <div style={{ flex: 1, padding: "12px 12px 20px", display: "flex", flexDirection: "column", gap: "18px" }}>
        {navGroups.map((grp, gi) => (
          <div key={gi}>
            <p style={{ color: "#334155", fontSize: "9px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px 8px" }}>
              {grp.group}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {grp.items.map((btn, bi) => {
                const active = activePath === btn.path;
                return (
                  <button
                    key={bi}
                    onClick={() => navigate(btn.path)}
                    style={{
                      background: active ? "#0284c7" : "transparent",
                      color: active ? "white" : "#94a3b8",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: active ? "700" : "400",
                      transition: "all 0.15s",
                      textAlign: "left",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "#1e293b";
                        e.currentTarget.style.color = "white";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#94a3b8";
                      }
                    }}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid #1e293b" }}>
        <p style={{ color: "#38bdf8", fontSize: "11px", fontWeight: "700", margin: "0 0 2px 0" }}>AQUANTIS v1.4.0</p>
        <p style={{ color: "#334155", fontSize: "10px", margin: "0" }}>35 Modules · Files Upload · ESG Ready</p>
      </div>
    </div>
  );
}
