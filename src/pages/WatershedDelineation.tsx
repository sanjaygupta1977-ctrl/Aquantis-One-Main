import Layout from "../components/Layout";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DEMDataset {
  name: string;
  resolution: string;
  coverage: string;
  accuracy: string;
  url: string;
  source: string;
}

interface WatershedResult {
  name: string;
  area: number;
  perimeter: number;
  mainStreamLength: number;
  elevation_min: number;
  elevation_max: number;
  slope: number;
  subbasins: number;
}

export default function WatershedDelineation() {
  const [selectedResolution, setSelectedResolution] = useState("30m");
  const [selectedBasin, setSelectedBasin] = useState("ganges");
  const [showResults, setShowResults] = useState(false);

  // High-resolution DEM datasets
  const demDatasets: DEMDataset[] = [
    {
      name: "SRTM 1 Arc-Second (30m)",
      resolution: "30m",
      coverage: "Global (-56° to 60°N)",
      accuracy: "±16m vertical RMSE",
      url: "https://earthexplorer.usgs.gov/",
      source: "USGS/NASA",
    },
    {
      name: "SRTM 3 Arc-Second (90m)",
      resolution: "90m",
      coverage: "Global (-56° to 60°N)",
      accuracy: "±20m vertical RMSE",
      url: "https://earthexplorer.usgs.gov/",
      source: "USGS/NASA",
    },
    {
      name: "ASTER GDEM v3 (30m)",
      resolution: "30m",
      coverage: "Global (-83° to 83°)",
      accuracy: "±17m vertical RMSE",
      url: "https://lpdaac.usgs.gov/products/astgtmv003/",
      source: "USGS/METI/NASA",
    },
    {
      name: "ALOS World 3D - 30m (AW3D30)",
      resolution: "30m",
      coverage: "Global",
      accuracy: "±5m vertical RMSE",
      url: "https://www.eorc.jaxa.jp/ALOS/en/aw3d30/",
      source: "JAXA",
    },
    {
      name: "NASADEM (30m)",
      resolution: "30m",
      coverage: "Global (-56° to 60°N)",
      accuracy: "±7m vertical RMSE",
      url: "https://lpdaac.usgs.gov/products/nasadem_hgtv001/",
      source: "NASA/METI/JSTB",
    },
    {
      name: "Copernicus DEM (30m/90m)",
      resolution: "30m / 90m",
      coverage: "Global",
      accuracy: "±3m vertical RMSE (30m)",
      url: "https://www.copernicus.eu/en/access-data/copernicus-data-packages",
      source: "EU/ESA",
    },
    {
      name: "India-specific: Cartosat-1",
      resolution: "2.5m",
      coverage: "India (±38° latitude)",
      accuracy: "±3m vertical RMSE",
      url: "https://bhuvan.nrsc.gov.in/",
      source: "ISRO",
    },
    {
      name: "India-specific: RISAT-1",
      resolution: "5m",
      coverage: "India",
      accuracy: "±4m vertical RMSE",
      url: "https://bhuvan.nrsc.gov.in/",
      source: "ISRO",
    },
  ];

  // Watershed delineation algorithms
  const algorithms = [
    {
      name: "D8 (Deterministic 8-neighbor)",
      description: "Flow routing to 8 neighbors, fastest, deterministic",
      pros: ["Fast computation", "Widely used", "No diagonal issues"],
      cons: "Less accurate flow convergence",
      best_for: "Quick assessments, large areas",
      tool: "TauDEM, Whitebox, GRASS",
    },
    {
      name: "D-Infinity (DINF)",
      description: "Continuous flow direction allowing infinite slopes",
      pros: ["Better accuracy", "Handles plateaus", "Better flow distribution"],
      cons: "Computationally intensive",
      best_for: "Detailed analysis, nutrient transport",
      tool: "TauDEM, Whitebox",
    },
    {
      name: "MFD (Multiple Flow Direction)",
      description: "Flow distributed to multiple downslope neighbors",
      pros: ["Most realistic", "Better convergence zones", "Complex topography"],
      cons: "Slower, more parameters",
      best_for: "Wetlands, floodplains, hillslopes",
      tool: "SAGA GIS, PCRaster",
    },
    {
      name: "Threshold-based Delineation",
      description: "Uses minimum drainage area threshold for streams",
      pros: ["Simple parameter", "Fast", "Customizable"],
      cons: "Depends heavily on threshold choice",
      best_for: "Stream network definition, sub-basin creation",
      tool: "All hydrological software",
    },
  ];

  // Indian watersheds with high-resolution DEM requirements
  const indianWatersheds = [
    {
      name: "Ganges Basin",
      basin_id: "ganges",
      area: 890000,
      subbasins: 18,
      priority: "CRITICAL",
      dem_need: "SRTM 30m + Cartosat 2.5m (Himalayan sections)",
      stream_density: 0.45,
      avg_slope: 8.2,
      elevation_range: "70m - 8848m",
      delineation_points: 12,
    },
    {
      name: "Brahmaputra Basin",
      basin_id: "brahmaputra",
      area: 580000,
      subbasins: 15,
      priority: "HIGH",
      dem_need: "NASADEM 30m for monsoon areas, Cartosat for mountains",
      stream_density: 0.52,
      avg_slope: 12.5,
      elevation_range: "0m - 7816m",
      delineation_points: 10,
    },
    {
      name: "Krishna Basin",
      basin_id: "krishna",
      area: 260000,
      subbasins: 8,
      priority: "HIGH",
      dem_need: "Copernicus 30m, validate with field survey",
      stream_density: 0.38,
      avg_slope: 6.8,
      elevation_range: "15m - 1680m",
      delineation_points: 8,
    },
    {
      name: "Godavari Basin",
      basin_id: "godavari",
      area: 312000,
      subbasins: 9,
      priority: "MEDIUM",
      dem_need: "SRTM 30m, AW3D30 validation",
      stream_density: 0.41,
      avg_slope: 7.2,
      elevation_range: "20m - 1680m",
      delineation_points: 9,
    },
    {
      name: "Sutlej Basin",
      basin_id: "sutlej",
      area: 50000,
      subbasins: 6,
      priority: "MEDIUM",
      dem_need: "Cartosat 2.5m essential for Himalayan terrain",
      stream_density: 0.68,
      avg_slope: 18.5,
      elevation_range: "400m - 6721m",
      delineation_points: 6,
    },
  ];

  // Delineation processing steps
  const processingSteps = [
    { step: 1, name: "DEM Download & Preprocessing", time: "2-4 hours", action: "Reproject, mosaic, fill sinks" },
    { step: 2, name: "Hydrological Conditioning", time: "1-2 hours", action: "Burn vector streams, fill depressions" },
    { step: 3, name: "Flow Direction Calculation", time: "30-45 min", action: "D8 or D-Infinity routing" },
    { step: 4, name: "Flow Accumulation", time: "1-2 hours", action: "Cumulative flow computation" },
    { step: 5, name: "Stream Network Definition", time: "30 min", action: "Apply threshold (e.g., 5000 cells)" },
    { step: 6, name: "Watershed Delineation", time: "2-3 hours", action: "Auto-delineate pour points" },
    { step: 7, name: "Sub-basin Generation", time: "1-2 hours", action: "HRU creation and parameterization" },
    { step: 8, name: "Quality Check & Export", time: "1 hour", action: "Validation, shapefile export" },
  ];

  // Delineation software comparison
  const softwareTools = [
    {
      name: "TauDEM (Terrain Analysis)",
      cost: "Free & Open Source",
      features: ["D8 & D-Infinity", "Gully detection", "Channel mapping", "Stream power"],
      best_for: "Research, advanced hydrology",
      url: "http://hydrology.unsw.edu.au/taudem/",
    },
    {
      name: "Whitebox GAT",
      cost: "Free & Open Source",
      features: ["All flow algorithms", "Automated delineation", "Visualization", "Fast processing"],
      best_for: "Users, educational",
      url: "https://www.whiteboxgeo.com/",
    },
    {
      name: "QGIS + SAGA/GRASS",
      cost: "Free & Open Source",
      features: ["Complete GIS toolkit", "Multiple algorithms", "Scripting support"],
      best_for: "General GIS work, local analysis",
      url: "https://qgis.org/",
    },
    {
      name: "ArcGIS Hydrology Extension",
      cost: "Commercial ($$$)",
      features: ["Professional tools", "Support", "Integrated workflow", "ArcSWAT"],
      best_for: "Enterprise projects, consulting",
      url: "https://www.esri.com/",
    },
    {
      name: "HEC-HMS",
      cost: "Free (USACE)",
      features: ["Hydrologic modeling", "Flow routing", "Watershed parameters"],
      best_for: "Flood modeling, routing",
      url: "https://www.hec.usace.army.mil/",
    },
  ];

  // Delineation quality metrics
  const qualityMetrics = [
    { metric: "Vertical Accuracy", target: "±3-7m RMSE", importance: "Critical", validation: "Field GPS check" },
    { metric: "Stream Network Match", target: ">85% overlap with maps", importance: "High", validation: "Compare with 1:50k maps" },
    { metric: "Watershed Boundary", target: "<2% area variance", importance: "High", validation: "Cross-check with geology" },
    { metric: "Sub-basin Count", target: "Within 10% of target", importance: "Medium", validation: "Visual inspection" },
    { metric: "Slope Accuracy", target: "±5% of field samples", importance: "Medium", validation: "Field slope survey" },
  ];

  // Results for selected basin
  const basinResults: Record<string, WatershedResult> = {
    ganges: {
      name: "Ganges Basin Delineation",
      area: 890000,
      perimeter: 3850,
      mainStreamLength: 2525,
      elevation_min: 70,
      elevation_max: 8848,
      slope: 8.2,
      subbasins: 18,
    },
    brahmaputra: {
      name: "Brahmaputra Basin Delineation",
      area: 580000,
      perimeter: 2950,
      mainStreamLength: 2900,
      elevation_min: 0,
      elevation_max: 7816,
      slope: 12.5,
      subbasins: 15,
    },
    krishna: {
      name: "Krishna Basin Delineation",
      area: 260000,
      perimeter: 1840,
      mainStreamLength: 1400,
      elevation_min: 15,
      elevation_max: 1680,
      slope: 6.8,
      subbasins: 8,
    },
  };

  const currentResult = basinResults[selectedBasin as keyof typeof basinResults];
  const processingTimeData = processingSteps.map((step) => ({
    step: `Step ${step.step}`,
    hours: Math.random() * 4 + 0.5,
  }));

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "36px", fontWeight: "800", margin: "0 0 10px 0" }}>
          🗻 Watershed Delineation - High Resolution DEM Analysis
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 40px 0" }}>
          Advanced hydrological watershed delineation using high-resolution DEMs (2.5m-30m) for Indian river basins
        </p>

        {/* DEM Resolution Selector */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>📊 High-Resolution DEM Datasets Available</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "15px", marginBottom: "20px" }}>
            {demDatasets.map((dem, idx) => (
              <a
                key={idx}
                href={dem.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#f9fafb",
                  padding: "15px",
                  borderRadius: "10px",
                  border: selectedResolution === dem.resolution ? "3px solid #0284c7" : "1px solid #e5e7eb",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#0284c7";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(2,132,199,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = selectedResolution === dem.resolution ? "#0284c7" : "#e5e7eb";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => setSelectedResolution(dem.resolution)}
              >
                <h3 style={{ color: "#0284c7", fontSize: "13px", fontWeight: "700", margin: "0 0 8px 0" }}>{dem.name}</h3>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  <p style={{ margin: "3px 0" }}>📍 Coverage: {dem.coverage}</p>
                  <p style={{ margin: "3px 0" }}>✓ Accuracy: {dem.accuracy}</p>
                  <p style={{ margin: "3px 0" }}>📦 Source: {dem.source}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Delineation Algorithms */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>⚙️ Watershed Delineation Algorithms</h2>
          <div style={{ display: "grid", gap: "15px" }}>
            {algorithms.map((algo, idx) => (
              <div key={idx} style={{ background: "#f9fafb", padding: "15px", borderRadius: "10px", borderLeft: "4px solid #0284c7" }}>
                <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0 0 8px 0" }}>{algo.name}</h3>
                <p style={{ color: "#666", fontSize: "12px", margin: "0 0 10px 0" }}>{algo.description}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", fontSize: "11px" }}>
                  <div>
                    <p style={{ color: "#0f172a", fontWeight: "700", margin: "0 0 3px 0" }}>✓ Pros:</p>
                    {algo.pros.map((pro, pidx) => (
                      <p key={pidx} style={{ color: "#10b981", margin: "2px 0" }}>• {pro}</p>
                    ))}
                  </div>
                  <div>
                    <p style={{ color: "#0f172a", fontWeight: "700", margin: "0 0 3px 0" }}>✗ Cons:</p>
                    <p style={{ color: "#dc2626", margin: "2px 0" }}>• {algo.cons}</p>
                  </div>
                  <div>
                    <p style={{ color: "#0f172a", fontWeight: "700", margin: "0 0 3px 0" }}>Best For:</p>
                    <p style={{ color: "#ca8a04", margin: "2px 0", fontWeight: "600" }}>• {algo.best_for}</p>
                    <p style={{ color: "#666", margin: "5px 0 0 0" }}>Tools: {algo.tool}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indian Watersheds Selection */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🗺️ Indian Watershed Basins - DEM Requirements</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "15px" }}>
            {indianWatersheds.map((ws, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedBasin(ws.basin_id);
                  setShowResults(true);
                }}
                style={{
                  background: selectedBasin === ws.basin_id ? "#f0f9ff" : "#f9fafb",
                  padding: "15px",
                  borderRadius: "10px",
                  border: selectedBasin === ws.basin_id ? "3px solid #0284c7" : "1px solid #e5e7eb",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(2,132,199,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                  <h3 style={{ color: "#0284c7", fontSize: "14px", fontWeight: "700", margin: "0" }}>{ws.name}</h3>
                  <span
                    style={{
                      background: ws.priority === "CRITICAL" ? "#fee2e2" : "#fef3c7",
                      color: ws.priority === "CRITICAL" ? "#dc2626" : "#854d0e",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: "700",
                    }}
                  >
                    {ws.priority}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#666", display: "grid", gap: "3px" }}>
                  <p style={{ margin: "0" }}>📍 Area: {(ws.area / 1000).toFixed(0)}k km²</p>
                  <p style={{ margin: "0" }}>💧 Sub-basins: {ws.subbasins}</p>
                  <p style={{ margin: "0" }}>📡 DEM: {ws.dem_need}</p>
                  <p style={{ margin: "0" }}>📊 Slope: {ws.avg_slope}°</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Workflow */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🔄 Delineation Processing Workflow</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processingTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step" />
              <YAxis label={{ value: "Processing Time (hours)", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Bar dataKey="hours" fill="#0284c7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: "20px" }}>
            {processingSteps.map((ps, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 3fr", gap: "15px", padding: "10px 0", borderBottom: idx < processingSteps.length - 1 ? "1px solid #e5e7eb" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ background: "#0284c7", color: "white", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px" }}>
                    {ps.step}
                  </div>
                  <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "600", margin: "0" }}>{ps.name}</p>
                </div>
                <p style={{ color: "#ca8a04", fontSize: "12px", fontWeight: "700", margin: "0" }}>⏱️ {ps.time}</p>
                <p style={{ color: "#666", fontSize: "12px", margin: "0" }}>{ps.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Software Tools Comparison */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🛠️ Watershed Delineation Software Comparison</h2>
          <div style={{ display: "grid", gap: "15px" }}>
            {softwareTools.map((tool, idx) => (
              <a
                key={idx}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#f9fafb",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  textDecoration: "none",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  display: "block",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#0284c7";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(2,132,199,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr", gap: "15px" }}>
                  <div>
                    <h3 style={{ color: "#0284c7", fontSize: "14px", fontWeight: "700", margin: "0 0 5px 0" }}>{tool.name}</h3>
                    <p style={{ color: "#666", fontSize: "12px", margin: "0 0 8px 0" }}>
                      {tool.features.map((f, fidx) => (
                        <span key={fidx}>
                          {fidx > 0 ? " • " : ""}
                          {f}
                        </span>
                      ))}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "#ca8a04", fontSize: "12px", fontWeight: "700", margin: "0" }}>{tool.cost}</p>
                  </div>
                  <div>
                    <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "600", margin: "0" }}>{tool.best_for}</p>
                    <p style={{ color: "#0284c7", fontSize: "12px", fontWeight: "700", margin: "5px 0 0 0" }}>Visit Website ↗</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Delineation Results */}
        {showResults && currentResult && (
          <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #0284c7", marginBottom: "40px" }}>
            <h2 style={{ color: "#0c4a6e", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>📊 {currentResult.name} - Delineation Results</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
              <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0", textTransform: "uppercase" }}>Total Area</p>
                <p style={{ color: "#0284c7", fontSize: "24px", fontWeight: "800", margin: "0" }}>{(currentResult.area / 1000).toFixed(0)}k</p>
                <p style={{ color: "#0c4a6e", fontSize: "11px", margin: "3px 0 0 0" }}>km²</p>
              </div>
              <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0", textTransform: "uppercase" }}>Perimeter</p>
                <p style={{ color: "#0284c7", fontSize: "24px", fontWeight: "800", margin: "0" }}>{currentResult.perimeter}</p>
                <p style={{ color: "#0c4a6e", fontSize: "11px", margin: "3px 0 0 0" }}>km</p>
              </div>
              <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0", textTransform: "uppercase" }}>Main Stream</p>
                <p style={{ color: "#0284c7", fontSize: "24px", fontWeight: "800", margin: "0" }}>{currentResult.mainStreamLength}</p>
                <p style={{ color: "#0c4a6e", fontSize: "11px", margin: "3px 0 0 0" }}>km</p>
              </div>
              <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0", textTransform: "uppercase" }}>Avg Slope</p>
                <p style={{ color: "#0284c7", fontSize: "24px", fontWeight: "800", margin: "0" }}>{currentResult.slope}°</p>
                <p style={{ color: "#0c4a6e", fontSize: "11px", margin: "3px 0 0 0" }}>Degrees</p>
              </div>
              <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0", textTransform: "uppercase" }}>Elevation</p>
                <p style={{ color: "#0284c7", fontSize: "18px", fontWeight: "800", margin: "0" }}>{currentResult.elevation_min}m - {currentResult.elevation_max}m</p>
              </div>
              <div style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
                <p style={{ color: "#0c4a6e", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0", textTransform: "uppercase" }}>Sub-basins</p>
                <p style={{ color: "#0284c7", fontSize: "24px", fontWeight: "800", margin: "0" }}>{currentResult.subbasins}</p>
                <p style={{ color: "#0c4a6e", fontSize: "11px", margin: "3px 0 0 0" }}>Delineated</p>
              </div>
            </div>
          </div>
        )}

        {/* Quality Metrics */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>✓ Delineation Quality Assurance Metrics</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f0f9ff", borderBottom: "2px solid #0284c7" }}>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>QA Metric</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Target</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>Importance</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "700", color: "#0f172a" }}>Validation Method</th>
                </tr>
              </thead>
              <tbody>
                {qualityMetrics.map((qm, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "12px", color: "#0f172a", fontWeight: "600" }}>{qm.metric}</td>
                    <td style={{ padding: "12px", textAlign: "center", color: "#0284c7", fontWeight: "600" }}>{qm.target}</td>
                    <td style={{ padding: "12px", textAlign: "center", color: "#ca8a04", fontWeight: "600" }}>{qm.importance}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{qm.validation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Resources */}
        <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #10b981" }}>
          <h2 style={{ color: "#065f46", fontSize: "18px", fontWeight: "700", margin: "0 0 20px 0" }}>🚀 Getting Started with Watershed Delineation</h2>
          <ol style={{ color: "#047857", fontSize: "13px", lineHeight: "2", margin: "0" }}>
            <li>
              <strong>Download High-Resolution DEM:</strong> Use links above (Cartosat 2.5m for Indian basins, NASADEM/Copernicus for validation)
            </li>
            <li>
              <strong>Choose Software:</strong> TauDEM or Whitebox recommended for beginners, ArcGIS for professional work
            </li>
            <li>
              <strong>Preprocess DEM:</strong> Reproject to UTM, fill sinks, burn streams (if available)
            </li>
            <li>
              <strong>Set Flow Accumulation Threshold:</strong> Typically 5000-10000 cells for regional analyses
            </li>
            <li>
              <strong>Delineate Watershed:</strong> Auto-delineate or manually define pour points
            </li>
            <li>
              <strong>Quality Check:</strong> Validate against 1:50k maps and field surveys
            </li>
            <li>
              <strong>Export & Use:</strong> Generate shapefiles for SWAT, HEC-HMS, or QSWAT input
            </li>
          </ol>
        </div>
      </div>
    </Layout>
  );
}
