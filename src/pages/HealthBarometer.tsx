import Layout from "../components/Layout";
import { useState, useEffect } from "react";

export default function HealthBarometer() {
  const [healthMetrics, setHealthMetrics] = useState({
    waterQuality: 87,
    carbonFootprint: 62,
    waterFootprint: 75,
    airQuality: 68,
    soilHealth: 71,
    biodiversity: 58,
    energyEfficiency: 79,
    wasteManagement: 64,
  });

  const [timerange, setTimerange] = useState("monthly"); // daily, weekly, monthly, yearly
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Health metric details
  const metricDetails: Record<
    string,
    {
      icon: string;
      fullName: string;
      description: string;
      unit: string;
      safe: number;
      warning: number;
      critical: number;
      recommendations: string[];
      trend: number;
    }
  > = {
    waterQuality: {
      icon: "💧",
      fullName: "Water Quality Index",
      description: "Overall potability and safety of water sources",
      unit: "%",
      safe: 80,
      warning: 60,
      critical: 40,
      recommendations: [
        "Regular water testing (monthly)",
        "Install filtration systems",
        "Monitor contaminant levels",
        "Upgrade treatment plants",
      ],
      trend: 2.3,
    },
    carbonFootprint: {
      icon: "🌍",
      fullName: "Carbon Footprint Index",
      description: "GHG emissions intensity per unit of production",
      unit: "tons CO2e",
      safe: 80,
      warning: 60,
      critical: 40,
      recommendations: [
        "Switch to renewable energy (50% target)",
        "Implement energy efficiency programs",
        "Offset carbon through forestry projects",
        "Audit supply chain emissions",
      ],
      trend: -1.5,
    },
    waterFootprint: {
      icon: "🌊",
      fullName: "Virtual Water Footprint",
      description: "Total water used in production and supply chain",
      unit: "ML/year",
      safe: 85,
      warning: 65,
      critical: 45,
      recommendations: [
        "Implement water recycling systems",
        "Reduce indirect water usage",
        "Upgrade to water-efficient processes",
        "Monitor supply chain water use",
      ],
      trend: -0.8,
    },
    airQuality: {
      icon: "🌬️",
      fullName: "Air Quality Index",
      description: "Concentration of particulates and pollutants",
      unit: "AQI",
      safe: 85,
      warning: 65,
      critical: 45,
      recommendations: [
        "Install emission control systems",
        "Transition to clean energy sources",
        "Reduce transportation emissions",
        "Monitor air quality regularly",
      ],
      trend: 1.2,
    },
    soilHealth: {
      icon: "🌱",
      fullName: "Soil Health Index",
      description: "Nutrient content, organic matter, and microbial life",
      unit: "%",
      safe: 80,
      warning: 60,
      critical: 40,
      recommendations: [
        "Implement crop rotation",
        "Reduce chemical fertilizers",
        "Increase organic matter content",
        "Monitor soil degradation",
      ],
      trend: 1.8,
    },
    biodiversity: {
      icon: "🦋",
      fullName: "Biodiversity Index",
      description: "Species diversity and ecosystem health",
      unit: "Index",
      safe: 80,
      warning: 60,
      critical: 40,
      recommendations: [
        "Protect natural habitats",
        "Restore wetlands and forests",
        "Reduce pesticide use",
        "Create wildlife corridors",
      ],
      trend: -2.1,
    },
    energyEfficiency: {
      icon: "⚡",
      fullName: "Energy Efficiency Ratio",
      description: "Energy output per unit of input resource",
      unit: "%",
      safe: 85,
      warning: 65,
      critical: 45,
      recommendations: [
        "Upgrade to LED lighting",
        "Optimize HVAC systems",
        "Implement smart building controls",
        "Regular equipment maintenance",
      ],
      trend: 3.1,
    },
    wasteManagement: {
      icon: "♻️",
      fullName: "Waste Management Score",
      description: "Percentage of waste diverted from landfills",
      unit: "%",
      safe: 85,
      warning: 65,
      critical: 45,
      recommendations: [
        "Increase recycling programs (target: 85%)",
        "Implement waste segregation",
        "Partner with waste processors",
        "Reduce single-use materials",
      ],
      trend: 2.4,
    },
  };

  // Calculate overall health score
  const overallHealth = Math.round(
    Object.values(healthMetrics).reduce((a, b) => a + b) / Object.values(healthMetrics).length
  );

  // Get health status color
  const getHealthColor = (score: number): string => {
    if (score >= 80) return "#10b981"; // Green
    if (score >= 60) return "#ca8a04"; // Amber
    if (score >= 40) return "#f97316"; // Orange
    return "#dc2626"; // Red
  };

  // Get health status text
  const getHealthStatus = (score: number): string => {
    if (score >= 80) return "EXCELLENT";
    if (score >= 60) return "GOOD";
    if (score >= 40) return "FAIR";
    return "POOR";
  };

  // Simulate data update based on timerange
  useEffect(() => {
    // In production, this would fetch from an API
    const variation = timerange === "daily" ? 2 : timerange === "weekly" ? 5 : timerange === "monthly" ? 8 : 15;
    setHealthMetrics((prev) => ({
      waterQuality: Math.max(30, Math.min(100, prev.waterQuality + (Math.random() - 0.5) * variation)),
      carbonFootprint: Math.max(30, Math.min(100, prev.carbonFootprint + (Math.random() - 0.5) * variation)),
      waterFootprint: Math.max(30, Math.min(100, prev.waterFootprint + (Math.random() - 0.5) * variation)),
      airQuality: Math.max(30, Math.min(100, prev.airQuality + (Math.random() - 0.5) * variation)),
      soilHealth: Math.max(30, Math.min(100, prev.soilHealth + (Math.random() - 0.5) * variation)),
      biodiversity: Math.max(30, Math.min(100, prev.biodiversity + (Math.random() - 0.5) * variation)),
      energyEfficiency: Math.max(30, Math.min(100, prev.energyEfficiency + (Math.random() - 0.5) * variation)),
      wasteManagement: Math.max(30, Math.min(100, prev.wasteManagement + (Math.random() - 0.5) * variation)),
    }));
  }, [timerange]);

  const MetricCard = ({
    key,
    metric,
    score,
  }: {
    key: string;
    metric: string;
    score: number;
  }) => {
    const details = metricDetails[metric];
    const isSelected = selectedMetric === metric;
    const color = getHealthColor(score);
    const status = getHealthStatus(score);

    return (
      <div
        key={key}
        onClick={() => setSelectedMetric(isSelected ? null : metric)}
        style={{
          cursor: "pointer",
          background: isSelected ? "#f0f9ff" : "white",
          padding: "20px",
          borderRadius: "12px",
          border: isSelected ? `3px solid ${color}` : "1px solid #e5e7eb",
          boxShadow: isSelected ? `0 0 20px ${color}40` : "0 1px 3px rgba(0,0,0,0.08)",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = `0 8px 12px ${color}20`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = isSelected ? `0 0 20px ${color}40` : "0 1px 3px rgba(0,0,0,0.08)";
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <span style={{ fontSize: "32px" }}>{details.icon}</span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              padding: "4px 8px",
              borderRadius: "4px",
              background: `${color}20`,
              color: color,
              textTransform: "uppercase",
            }}
          >
            {status}
          </span>
        </div>

        <p style={{ color: "#666", fontSize: "12px", margin: "0 0 8px 0", fontWeight: "600" }}>{details.fullName}</p>

        {/* Progress Bar */}
        <div style={{ height: "8px", background: "#e5e7eb", borderRadius: "4px", overflow: "hidden", marginBottom: "12px" }}>
          <div
            style={{
              height: "100%",
              background: color,
              width: `${score}%`,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "#0f172a", fontSize: "24px", fontWeight: "800", margin: "0" }}>{score.toFixed(0)}</p>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: metricDetails[metric].trend > 0 ? "#10b981" : "#dc2626",
            }}
          >
            {metricDetails[metric].trend > 0 ? "↑" : "↓"} {Math.abs(metricDetails[metric].trend)}%
          </span>
        </div>

        {isSelected && (
          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e5e7eb" }}>
            <p style={{ color: "#666", fontSize: "12px", margin: "0 0 10px 0" }}>{details.description}</p>
            <div style={{ background: "#f0fdf4", padding: "10px", borderRadius: "6px", marginBottom: "10px" }}>
              <p style={{ color: "#065f46", fontSize: "11px", fontWeight: "700", margin: "0 0 5px 0" }}>💡 Actions to Take:</p>
              {details.recommendations.slice(0, 2).map((rec, idx) => (
                <p key={idx} style={{ color: "#047857", fontSize: "11px", margin: "3px 0" }}>
                  • {rec}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#0f172a", fontSize: "36px", fontWeight: "800", margin: "0 0 10px 0" }}>
          🏥 Environmental Health Barometer
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 40px 0" }}>
          Real-time monitoring of water, carbon, energy, and ecosystem health metrics
        </p>

        {/* Time Range Selector */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          {["daily", "weekly", "monthly", "yearly"].map((range) => (
            <button
              key={range}
              onClick={() => setTimerange(range)}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "2px solid",
                background: timerange === range ? "#0284c7" : "white",
                color: timerange === range ? "white" : "#0284c7",
                borderColor: "#0284c7",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s",
                textTransform: "capitalize",
              }}
              onMouseEnter={(e) => {
                if (timerange !== range) {
                  e.currentTarget.style.background = "#e0f2fe";
                }
              }}
              onMouseLeave={(e) => {
                if (timerange !== range) {
                  e.currentTarget.style.background = "white";
                }
              }}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* Overall Health Score */}
        <div
          style={{
            background: `linear-gradient(135deg, ${getHealthColor(overallHealth)}20 0%, ${getHealthColor(overallHealth)}10 100%)`,
            border: `3px solid ${getHealthColor(overallHealth)}`,
            padding: "40px",
            borderRadius: "16px",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          <p style={{ color: getHealthColor(overallHealth), fontSize: "14px", fontWeight: "700", margin: "0 0 10px 0", textTransform: "uppercase" }}>
            Overall Environmental Health Score
          </p>
          <p style={{ color: getHealthColor(overallHealth), fontSize: "72px", fontWeight: "800", margin: "0 0 10px 0" }}>
            {overallHealth}
          </p>
          <p
            style={{
              color: getHealthColor(overallHealth),
              fontSize: "18px",
              fontWeight: "700",
              margin: "0 0 20px 0",
              textTransform: "uppercase",
            }}
          >
            {getHealthStatus(overallHealth)}
          </p>
          <p style={{ color: "#475569", fontSize: "14px", margin: "0" }}>
            Your facility's combined environmental health across 8 key metrics. Data refreshed {timerange}ly.
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {Object.entries(healthMetrics).map(([metric, score]) => (
            <MetricCard key={metric} metric={metric} score={score} />
          ))}
        </div>

        {/* Health Status Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #10b981" }}>
            <p style={{ color: "#065f46", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>✓ EXCELLENT (80-100)</p>
            <p style={{ color: "#10b981", fontSize: "24px", fontWeight: "800", margin: "0" }}>
              {Object.values(healthMetrics).filter((s) => s >= 80).length}
            </p>
            <p style={{ color: "#047857", fontSize: "12px", margin: "5px 0 0 0" }}>metrics in excellent range</p>
          </div>

          <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #ca8a04" }}>
            <p style={{ color: "#854d0e", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>⚠ GOOD (60-79)</p>
            <p style={{ color: "#ca8a04", fontSize: "24px", fontWeight: "800", margin: "0" }}>
              {Object.values(healthMetrics).filter((s) => s >= 60 && s < 80).length}
            </p>
            <p style={{ color: "#92400e", fontSize: "12px", margin: "5px 0 0 0" }}>metrics need attention</p>
          </div>

          <div style={{ background: "linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #f97316" }}>
            <p style={{ color: "#92400e", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>🔴 FAIR (40-59)</p>
            <p style={{ color: "#f97316", fontSize: "24px", fontWeight: "800", margin: "0" }}>
              {Object.values(healthMetrics).filter((s) => s >= 40 && s < 60).length}
            </p>
            <p style={{ color: "#92400e", fontSize: "12px", margin: "5px 0 0 0" }}>metrics require action</p>
          </div>

          <div style={{ background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #dc2626" }}>
            <p style={{ color: "#7f1d1d", fontSize: "12px", fontWeight: "700", margin: "0 0 8px 0" }}>🚨 POOR (&lt;40)</p>
            <p style={{ color: "#dc2626", fontSize: "24px", fontWeight: "800", margin: "0" }}>
              {Object.values(healthMetrics).filter((s) => s < 40).length}
            </p>
            <p style={{ color: "#991b1b", fontSize: "12px", margin: "5px 0 0 0" }}>critical interventions</p>
          </div>
        </div>

        {/* Priority Actions */}
        <div style={{ background: "linear-gradient(135deg, #fef5f1 0%, #fef3f0 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #ea580c", marginBottom: "40px" }}>
          <h2 style={{ color: "#7c2d12", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>🎯 Priority Action Items</h2>

          <div style={{ display: "grid", gap: "15px" }}>
            {Object.entries(healthMetrics)
              .sort((a, b) => a[1] - b[1])
              .slice(0, 3)
              .map(([metric, score]) => {
                const details = metricDetails[metric];
                return (
                  <div key={metric} style={{ background: "white", padding: "15px", borderRadius: "10px", borderLeft: `4px solid ${getHealthColor(score)}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <p style={{ color: "#0f172a", fontSize: "14px", fontWeight: "700", margin: "0" }}>
                        {details.icon} {details.fullName}
                      </p>
                      <span style={{ color: getHealthColor(score), fontSize: "16px", fontWeight: "800" }}>{score.toFixed(0)}%</span>
                    </div>
                    <p style={{ color: "#666", fontSize: "12px", margin: "0 0 8px 0" }}>{details.description}</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {details.recommendations.slice(0, 2).map((rec, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: `${getHealthColor(score)}20`,
                            color: getHealthColor(score),
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "600",
                          }}
                        >
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Key Metrics Reference */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>📚 Understanding the Barometer</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
            <div style={{ padding: "15px", background: "#f0fdf4", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
              <p style={{ color: "#065f46", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>💧 Water Quality Index (WQI)</p>
              <p style={{ color: "#047857", fontSize: "12px", margin: "0" }}>
                Measures pH, turbidity, TDS, and contamination levels. Higher is better. Target: &gt;85%
              </p>
            </div>
            <div style={{ padding: "15px", background: "#f0f9ff", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
              <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>🌍 Carbon Footprint Index</p>
              <p style={{ color: "#0369a1", fontSize: "12px", margin: "0" }}>
                GHG emissions per unit production. Lower is better. Target: &lt;50 tons CO2e
              </p>
            </div>
            <div style={{ padding: "15px", background: "#f0fdf4", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
              <p style={{ color: "#065f46", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>🌊 Virtual Water Footprint</p>
              <p style={{ color: "#047857", fontSize: "12px", margin: "0" }}>
                Total water embedded in products & processes. Lower is better. Target: &lt;2M liters/year
              </p>
            </div>
            <div style={{ padding: "15px", background: "#f0f9ff", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
              <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>🌬️ Air Quality Index (AQI)</p>
              <p style={{ color: "#0369a1", fontSize: "12px", margin: "0" }}>
                Particulate matter &amp; pollutant concentration. Higher is better. Target: &gt;85%
              </p>
            </div>
            <div style={{ padding: "15px", background: "#f0fdf4", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
              <p style={{ color: "#065f46", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>🌱 Soil Health Index</p>
              <p style={{ color: "#047857", fontSize: "12px", margin: "0" }}>
                Nutrient content &amp; organic matter. Higher is better. Target: &gt;80%
              </p>
            </div>
            <div style={{ padding: "15px", background: "#f0f9ff", borderRadius: "8px", borderLeft: "4px solid #0284c7" }}>
              <p style={{ color: "#0c4a6e", fontSize: "13px", fontWeight: "700", margin: "0 0 5px 0" }}>🦋 Biodiversity Index</p>
              <p style={{ color: "#0369a1", fontSize: "12px", margin: "0" }}>
                Species diversity &amp; ecosystem health. Higher is better. Target: &gt;80%
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
