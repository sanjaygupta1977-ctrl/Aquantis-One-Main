import Layout from "../components/Layout";
import { useState } from "react";

export default function SWATToolIntegration() {
  const [selectedModel, setSelectedModel] = useState("overview");

  // SWAT official resources
  const swatResources = [
    {
      name: "SWAT Official Website",
      url: "https://swat.tamu.edu/",
      description: "Main SWAT model portal - downloads, documentation, tutorials",
      category: "Official",
      icon: "🌐",
    },
    {
      name: "SWAT+ (Latest Version)",
      url: "https://swatplus.gitbook.io/docs/",
      description: "SWAT+ documentation - enhanced version with improved features",
      category: "Official",
      icon: "📚",
    },
    {
      name: "GitHub Repository",
      url: "https://github.com/swat-model/swat",
      description: "Source code, issues, contributions, latest updates",
      category: "Development",
      icon: "💻",
    },
    {
      name: "SWAT Community",
      url: "https://swat.tamu.edu/community/",
      description: "User forum, case studies, publications, datasets",
      category: "Community",
      icon: "👥",
    },
    {
      name: "ArcSWAT Interface",
      url: "https://swat.tamu.edu/software/arcswat/",
      description: "ArcGIS interface for SWAT model setup and visualization",
      category: "Tools",
      icon: "🗺️",
    },
    {
      name: "QGIS-SWAT",
      url: "https://swat.tamu.edu/software/qswat/",
      description: "Open-source QGIS interface for SWAT preprocessing",
      category: "Tools",
      icon: "🔧",
    },
  ];

  // Indian SWAT applications
  const indianApplications = [
    {
      basin: "Ganges River Basin",
      area: 890000,
      states: ["UP", "Bihar", "West Bengal"],
      studies: 8,
      focus: "Water balance, sediment yield, nutrient cycling",
      link: "https://swat.tamu.edu/community/",
    },
    {
      basin: "Krishna River Basin",
      area: 260000,
      states: ["Maharashtra", "Karnataka", "Telangana"],
      studies: 5,
      focus: "Irrigation impact, groundwater recharge",
      link: "https://swat.tamu.edu/community/",
    },
    {
      basin: "Godavari River Basin",
      area: 312000,
      states: ["Maharashtra", "Telangana", "Andhra Pradesh"],
      studies: 6,
      focus: "Monsoon variability, water scarcity",
      link: "https://swat.tamu.edu/community/",
    },
    {
      basin: "Brahmaputra River Basin",
      area: 580000,
      states: ["Assam", "Meghalaya"],
      studies: 4,
      focus: "Flood modeling, erosion assessment",
      link: "https://swat.tamu.edu/community/",
    },
    {
      basin: "Sutlej River Basin",
      area: 50000,
      states: ["Punjab", "Himachal Pradesh"],
      studies: 3,
      focus: "Hydropower potential, water allocation",
      link: "https://swat.tamu.edu/community/",
    },
  ];

  // SWAT model components
  const swatComponents = [
    {
      name: "Hydrological Cycle",
      description: "Models water movement through precipitation, infiltration, surface runoff, groundwater flow, and evapotranspiration",
      inputs: ["Climate data", "Soil properties", "Land use/cover"],
      outputs: ["Water yield", "Groundwater recharge", "Surface runoff"],
      icon: "💧",
    },
    {
      name: "Sediment Transport",
      description: "Simulates soil erosion, sediment transport, and deposition in streams and reservoirs",
      inputs: ["Topography", "Soil erodibility", "Cover factor"],
      outputs: ["Sediment yield", "Erosion maps", "Reservoir sedimentation"],
      icon: "🏔️",
    },
    {
      name: "Nutrient Cycling",
      description: "Tracks nitrogen and phosphorus movement through soil, plants, and water bodies",
      inputs: ["Fertilizer data", "Manure applications", "Crop residue"],
      outputs: ["N & P loads", "Eutrophication risk", "Water quality"],
      icon: "🌱",
    },
    {
      name: "Pesticide Transport",
      description: "Models pesticide fate and transport in soil and water systems",
      inputs: ["Pesticide properties", "Application rates", "Soil degradation"],
      outputs: ["Pesticide concentration", "Contamination maps", "Health risks"],
      icon: "⚠️",
    },
    {
      name: "Land Use Change",
      description: "Evaluates impacts of deforestation, urbanization, and agricultural changes on water resources",
      inputs: ["LULC maps", "Transition rates", "Management practices"],
      outputs: ["Water yield changes", "Runoff variations", "Ecosystem impacts"],
      icon: "🌍",
    },
    {
      name: "Climate Change",
      description: "Assesses future water availability under different climate scenarios (RCP 2.6, 4.5, 8.5)",
      inputs: ["GCM projections", "Historical climate", "Downscaled data"],
      outputs: ["Future streamflow", "Water stress", "Drought risk"],
      icon: "🌡️",
    },
  ];

  // SWAT for India use cases
  const useCases = [
    {
      title: "Watershed Management Planning",
      description: "Optimize water resource allocation across irrigation, hydropower, and domestic sectors",
      basin: "Ganges",
      methodology: "SWAT calibration + sensitivity analysis",
      results: "20% water savings through improved allocation",
      reference: "SWAT Community Case Studies",
    },
    {
      title: "Water Scarcity Assessment",
      description: "Quantify seasonal water deficits and identify critical months for water stress",
      basin: "Krishna",
      methodology: "Flow duration analysis + water demand modeling",
      results: "Identified 4-month critical deficit period",
      reference: "Indian Journal of Water Resources",
    },
    {
      title: "Pollution Load Mapping",
      description: "Map agricultural runoff contamination across watersheds",
      basin: "Godavari",
      methodology: "N & P load simulation + hotspot identification",
      results: "60% of pollution from 20% of area",
      reference: "Nutrient Cycling in Agroecosystems",
    },
    {
      title: "Flood Risk Modeling",
      description: "Predict extreme flood events under climate change scenarios",
      basin: "Brahmaputra",
      methodology: "Extreme rainfall analysis + runoff routing",
      results: "30% increase in 100-year flood magnitude",
      reference: "Water Resources Management",
    },
    {
      title: "Hydropower Optimization",
      description: "Design optimal reservoir operation for maximum power generation",
      basin: "Sutlej",
      methodology: "Streamflow forecasting + reservoir routing",
      results: "15% increase in annual power generation",
      reference: "Journal of Hydrology",
    },
  ];

  // SWAT India data sources
  const dataSources = [
    { source: "SRTM DEM", resolution: "30m", url: "https://earthexplorer.usgs.gov/", coverage: "All India" },
    { source: "Sentinel-2 LULC", resolution: "10m", url: "https://scihub.copernicus.eu/", coverage: "All India" },
    { source: "CGWB Data", resolution: "District", url: "https://cgwb.gov.in/", coverage: "Groundwater tables" },
    { source: "IMD Climate", resolution: "0.25°", url: "https://mausam.imd.gov.in/", coverage: "Daily rainfall, temperature" },
    { source: "SOIL Map India", resolution: "1:250k", url: "http://www.nbsslup.gov.in/", coverage: "Soil properties" },
    { source: "Landsat Archive", resolution: "30m", url: "https://earthexplorer.usgs.gov/", coverage: "Historical LULC" },
  ];

  // Integration with AQUANTIS
  const integrationPoints = [
    {
      module: "Water Footprint",
      connection: "SWAT water yield output → Virtual water calculation",
      benefit: "Precise regional water availability for footprint assessment",
    },
    {
      module: "Carbon Footprint",
      connection: "SWAT land use → Emission factors",
      benefit: "Account for land use change emissions in carbon balance",
    },
    {
      module: "Climate Scenarios",
      connection: "RCP projections → SWAT climate inputs",
      benefit: "Model future water availability under climate change",
    },
    {
      module: "Aquifer Mapping",
      connection: "SWAT groundwater recharge → Aquifer recharge rates",
      benefit: "Validate and improve groundwater depletion models",
    },
    {
      module: "Cooling Tower Management",
      connection: "SWAT streamflow → Water availability assessment",
      benefit: "Ensure cooling system sustainability in water-stressed areas",
    },
    {
      module: "Drinking Water Quality",
      connection: "SWAT pollutant loads → Water quality projections",
      benefit: "Predict contamination impacts on drinking water sources",
    },
  ];

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "36px", fontWeight: "800", margin: "0 0 10px 0" }}>
          🌊 SWAT Tool Integration & India Water Basin Modeling
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 40px 0" }}>
          Soil and Water Assessment Tool (SWAT) - Download links, Indian applications, and AQUANTIS integration
        </p>

        {/* View Selector */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
          {["overview", "resources", "applications", "usecases", "integration"].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedModel(view)}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "2px solid #0284c7",
                background: selectedModel === view ? "#0284c7" : "white",
                color: selectedModel === view ? "white" : "#0284c7",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s",
                textTransform: "capitalize",
              }}
            >
              {view === "overview" ? "📋 Overview" : view === "resources" ? "🔗 Resources" : view === "applications" ? "🗺️ India Apps" : view === "usecases" ? "💡 Use Cases" : "🔀 Integration"}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {selectedModel === "overview" && (
          <>
            {/* SWAT Overview */}
            <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #0284c7", marginBottom: "40px" }}>
              <h2 style={{ color: "#0c4a6e", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>What is SWAT?</h2>
              <p style={{ color: "#0369a1", fontSize: "14px", lineHeight: "1.8", margin: "0" }}>
                SWAT (Soil and Water Assessment Tool) is a public-domain, continuous time, semi-distributed, process-based watershed model developed by the USDA Agricultural Research Service. It simulates water quality, water quantity, and agricultural production in watersheds and larger river basins. SWAT is extensively used for hydrological modeling, water resource management, and climate change impact assessment in India and worldwide.
              </p>
            </div>

            {/* SWAT Components */}
            <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
              <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 25px 0" }}>🔬 SWAT Model Components</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                {swatComponents.map((comp, idx) => (
                  <div key={idx} style={{ background: "#f9fafb", padding: "20px", borderRadius: "12px", borderLeft: "4px solid #0284c7" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <span style={{ fontSize: "28px" }}>{comp.icon}</span>
                      <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0" }}>{comp.name}</h3>
                    </div>
                    <p style={{ color: "#666", fontSize: "12px", margin: "0 0 10px 0", lineHeight: "1.6" }}>{comp.description}</p>
                    <div style={{ fontSize: "11px", color: "#999" }}>
                      <p style={{ margin: "5px 0" }}>📥 <strong>Inputs:</strong> {comp.inputs.join(", ")}</p>
                      <p style={{ margin: "5px 0" }}>📤 <strong>Outputs:</strong> {comp.outputs.join(", ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Sources for India */}
            <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
              <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>📊 SWAT Data Sources for India</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#f0f9ff", borderBottom: "2px solid #0284c7" }}>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>Data Source</th>
                      <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Resolution</th>
                      <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Coverage</th>
                      <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataSources.map((ds, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "12px", color: "#0f172a", fontWeight: "600" }}>{ds.source}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#666" }}>{ds.resolution}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#666" }}>{ds.coverage}</td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <a href={ds.url} target="_blank" rel="noopener noreferrer" style={{ color: "#0284c7", fontWeight: "700", textDecoration: "none" }}>
                            Download ↗
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* RESOURCES */}
        {selectedModel === "resources" && (
          <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 25px 0" }}>🔗 SWAT Official Resources & Downloads</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              {swatResources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#f9fafb",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "2px solid #e5e7eb",
                    textDecoration: "none",
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#0284c7";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(2,132,199,0.15)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "24px" }}>{resource.icon}</span>
                    <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>
                      {resource.category}
                    </span>
                  </div>
                  <h3 style={{ color: "#0284c7", fontSize: "15px", fontWeight: "700", margin: "0 0 8px 0" }}>{resource.name}</h3>
                  <p style={{ color: "#666", fontSize: "13px", margin: "0 0 12px 0", lineHeight: "1.6" }}>{resource.description}</p>
                  <p style={{ color: "#0284c7", fontSize: "12px", fontWeight: "700", margin: "0" }}>Visit Website →</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* APPLICATIONS */}
        {selectedModel === "applications" && (
          <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 25px 0" }}>🗺️ SWAT Applications in India - Major River Basins</h2>
            <div style={{ display: "grid", gap: "15px" }}>
              {indianApplications.map((app, idx) => (
                <a
                  key={idx}
                  href={app.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#f9fafb",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    textDecoration: "none",
                    transition: "all 0.3s",
                    cursor: "pointer",
                    display: "block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#0284c7";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(2,132,199,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                    <div>
                      <h3 style={{ color: "#0284c7", fontSize: "16px", fontWeight: "700", margin: "0 0 8px 0" }}>{app.basin} Basin</h3>
                      <p style={{ color: "#666", fontSize: "13px", margin: "0 0 8px 0" }}>
                        <strong>States:</strong> {app.states.join(", ")} | <strong>Studies:</strong> {app.studies} peer-reviewed papers
                      </p>
                      <p style={{ color: "#666", fontSize: "13px", margin: "0" }}>
                        <strong>Focus:</strong> {app.focus}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", borderLeft: "2px solid #e5e7eb", paddingLeft: "20px" }}>
                      <p style={{ color: "#0284c7", fontSize: "28px", fontWeight: "800", margin: "0" }}>
                        {(app.area / 1000).toFixed(0)}k
                      </p>
                      <p style={{ color: "#666", fontSize: "12px", margin: "5px 0 0 0" }}>km² Basin Area</p>
                      <p style={{ color: "#0284c7", fontSize: "12px", fontWeight: "700", margin: "10px 0 0 0" }}>View Studies ↗</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* USE CASES */}
        {selectedModel === "usecases" && (
          <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 25px 0" }}>💡 SWAT Use Cases for India Water Management</h2>
            <div style={{ display: "grid", gap: "20px" }}>
              {useCases.map((usecase, idx) => (
                <div key={idx} style={{ background: "#f9fafb", padding: "20px", borderRadius: "12px", borderLeft: "4px solid #0284c7" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "15px" }}>
                    <div>
                      <h3 style={{ color: "#0f172a", fontSize: "15px", fontWeight: "700", margin: "0 0 8px 0" }}>{usecase.title}</h3>
                      <p style={{ color: "#666", fontSize: "13px", margin: "0" }}>{usecase.description}</p>
                    </div>
                    <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", padding: "15px", borderRadius: "8px" }}>
                      <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0", textTransform: "uppercase" }}>Basin</p>
                      <p style={{ color: "#0284c7", fontSize: "16px", fontWeight: "800", margin: "0" }}>{usecase.basin}</p>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", fontSize: "12px" }}>
                    <div>
                      <p style={{ color: "#999", margin: "0 0 3px 0", textTransform: "uppercase", fontWeight: "700" }}>Methodology</p>
                      <p style={{ color: "#0f172a", margin: "0" }}>{usecase.methodology}</p>
                    </div>
                    <div>
                      <p style={{ color: "#999", margin: "0 0 3px 0", textTransform: "uppercase", fontWeight: "700" }}>Key Results</p>
                      <p style={{ color: "#10b981", fontWeight: "700", margin: "0" }}>{usecase.results}</p>
                    </div>
                    <div>
                      <p style={{ color: "#999", margin: "0 0 3px 0", textTransform: "uppercase", fontWeight: "700" }}>Reference</p>
                      <p style={{ color: "#0284c7", margin: "0" }}>{usecase.reference}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INTEGRATION */}
        {selectedModel === "integration" && (
          <>
            <div style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #0284c7", marginBottom: "40px" }}>
              <h2 style={{ color: "#0c4a6e", fontSize: "18px", fontWeight: "700", margin: "0 0 15px 0" }}>🔀 SWAT Integration with AQUANTIS Modules</h2>
              <p style={{ color: "#0369a1", fontSize: "13px", lineHeight: "1.8", margin: "0" }}>
                SWAT modeling outputs seamlessly integrate with AQUANTIS water management modules, providing detailed hydrological simulations that feed into water footprint calculations, climate impact assessments, and groundwater sustainability models.
              </p>
            </div>

            <div style={{ display: "grid", gap: "15px" }}>
              {integrationPoints.map((point, idx) => (
                <div key={idx} style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 2fr", gap: "20px" }}>
                    <div style={{ background: "#f0f9ff", padding: "15px", borderRadius: "8px" }}>
                      <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0", textTransform: "uppercase" }}>Module</p>
                      <p style={{ color: "#0284c7", fontSize: "14px", fontWeight: "700", margin: "0" }}>{point.module}</p>
                    </div>
                    <div>
                      <p style={{ color: "#666", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0", textTransform: "uppercase" }}>Data Connection</p>
                      <p style={{ color: "#0f172a", fontSize: "13px", margin: "0" }}>{point.connection}</p>
                    </div>
                    <div>
                      <p style={{ color: "#666", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0", textTransform: "uppercase" }}>Benefit</p>
                      <p style={{ color: "#10b981", fontSize: "13px", margin: "0" }}>✓ {point.benefit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #10b981", marginTop: "40px" }}>
              <h2 style={{ color: "#065f46", fontSize: "18px", fontWeight: "700", margin: "0 0 15px 0" }}>🚀 How to Start with SWAT</h2>
              <ol style={{ color: "#047857", fontSize: "13px", lineHeight: "2", margin: "0" }}>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Download SWAT:</strong> Visit{" "}
                  <a href="https://swat.tamu.edu/" target="_blank" rel="noopener noreferrer" style={{ color: "#0369a1", textDecoration: "underline" }}>
                    swat.tamu.edu
                  </a>{" "}
                  to download SWAT2012, SWAT2014, or latest SWAT+
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Install Interface:</strong> Set up ArcSWAT (for ArcGIS) or QSWAT (for QGIS) based on your preference
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Gather Data:</strong> Collect DEM, LULC, soil, and climate data for your basin using sources listed above
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Delineate Watershed:</strong> Use the preprocessing tools to create sub-basins and HRUs (Hydrologic Response Units)
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Calibrate Model:</strong> Use observed streamflow data to calibrate model parameters for your region
                </li>
                <li>
                  <strong>Run Scenarios:</strong> Model baseline conditions, climate change, land use changes, and management practices
                </li>
              </ol>
            </div>
          </>
        )}

        {/* Quick Links */}
        <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #ca8a04", marginTop: "40px" }}>
          <h2 style={{ color: "#854d0e", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>📚 Quick Reference Links</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            <a href="https://swat.tamu.edu/" target="_blank" rel="noopener noreferrer" style={{ background: "white", padding: "15px", borderRadius: "8px", textDecoration: "none", border: "1px solid #ca8a04" }}>
              <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 5px 0" }}>Official Portal</p>
              <p style={{ color: "#ca8a04", fontSize: "13px", fontWeight: "700", margin: "0" }}>swat.tamu.edu ↗</p>
            </a>
            <a href="https://github.com/swat-model/swat" target="_blank" rel="noopener noreferrer" style={{ background: "white", padding: "15px", borderRadius: "8px", textDecoration: "none", border: "1px solid #ca8a04" }}>
              <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 5px 0" }}>Source Code</p>
              <p style={{ color: "#ca8a04", fontSize: "13px", fontWeight: "700", margin: "0" }}>GitHub Repository ↗</p>
            </a>
            <a href="https://swat.tamu.edu/community/" target="_blank" rel="noopener noreferrer" style={{ background: "white", padding: "15px", borderRadius: "8px", textDecoration: "none", border: "1px solid #ca8a04" }}>
              <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 5px 0" }}>Case Studies</p>
              <p style={{ color: "#ca8a04", fontSize: "13px", fontWeight: "700", margin: "0" }}>Community Portal ↗</p>
            </a>
            <a href="https://swatplus.gitbook.io/docs/" target="_blank" rel="noopener noreferrer" style={{ background: "white", padding: "15px", borderRadius: "8px", textDecoration: "none", border: "1px solid #ca8a04" }}>
              <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 5px 0" }}>Documentation</p>
              <p style={{ color: "#ca8a04", fontSize: "13px", fontWeight: "700", margin: "0" }}>SWAT+ Docs ↗</p>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
