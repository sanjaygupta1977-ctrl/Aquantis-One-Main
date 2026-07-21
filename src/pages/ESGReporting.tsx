import Layout from "../components/Layout";
import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ESGScore {
  category: string;
  score: number;
  weight: number;
  trend: string;
  color: string;
}

interface GRIIndicator {
  code: string;
  title: string;
  value: string;
  unit: string;
  status: "disclosed" | "partial" | "omitted";
  trend: "up" | "down" | "stable";
  target: string;
}

interface BRSRIndicator {
  principle: string;
  question: string;
  response: string;
  compliance: "yes" | "partial" | "no";
}

interface CDPMetric {
  category: string;
  metric: string;
  value: number;
  unit: string;
  score: string;
  year: number;
}

interface TCFDPillar {
  pillar: string;
  element: string;
  description: string;
  status: "implemented" | "partial" | "planned";
  riskLevel: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ESGReporting() {
  const [activeFramework, setActiveFramework] = useState("overview");
  const [activeYear, setActiveYear] = useState("2024");

  // ── Overall ESG Scores ──────────────────────────────────────────────────────
  const esgScores: ESGScore[] = [
    { category: "Environmental", score: 74, weight: 40, trend: "↑ +6 YoY", color: "#10b981" },
    { category: "Social",        score: 68, weight: 35, trend: "↑ +4 YoY", color: "#0284c7" },
    { category: "Governance",    score: 82, weight: 25, trend: "↑ +2 YoY", color: "#8b5cf6" },
  ];

  const compositeScore = Math.round(
    esgScores.reduce((acc, s) => acc + s.score * (s.weight / 100), 0)
  );

  // ── Trend Data ──────────────────────────────────────────────────────────────
  const esgTrend = [
    { year: "2020", environmental: 55, social: 52, governance: 68, composite: 57 },
    { year: "2021", environmental: 60, social: 56, governance: 72, composite: 62 },
    { year: "2022", environmental: 65, social: 61, governance: 76, composite: 66 },
    { year: "2023", environmental: 68, social: 64, governance: 80, composite: 71 },
    { year: "2024", environmental: 74, social: 68, governance: 82, composite: 74 },
  ];

  // ── Radar data ──────────────────────────────────────────────────────────────
  const radarData = [
    { subject: "GHG Emissions",     A: 72 },
    { subject: "Water Mgmt",        A: 80 },
    { subject: "Waste & Circular",  A: 65 },
    { subject: "Biodiversity",      A: 58 },
    { subject: "Energy",            A: 78 },
    { subject: "Supply Chain",      A: 70 },
    { subject: "Labour Rights",     A: 74 },
    { subject: "Community",         A: 66 },
    { subject: "Board Diversity",   A: 82 },
    { subject: "Transparency",      A: 88 },
  ];

  // ── GRI Standards ───────────────────────────────────────────────────────────
  const griIndicators: GRIIndicator[] = [
    // GRI 300 Environmental
    { code: "GRI 302-1", title: "Energy consumption within organisation",  value: "142,500",  unit: "GJ",         status: "disclosed", trend: "down", target: "<130,000 GJ" },
    { code: "GRI 302-3", title: "Energy intensity",                        value: "4.28",     unit: "GJ/tonne",   status: "disclosed", trend: "down", target: "<4.0 GJ/t" },
    { code: "GRI 303-3", title: "Water withdrawal",                        value: "2,840,000",unit: "m³",         status: "disclosed", trend: "down", target: "<2,500,000 m³" },
    { code: "GRI 303-4", title: "Water discharge",                         value: "1,920,000",unit: "m³",         status: "disclosed", trend: "down", target: "<1,700,000 m³" },
    { code: "GRI 305-1", title: "Direct (Scope 1) GHG emissions",          value: "18,450",   unit: "tCO₂e",      status: "disclosed", trend: "down", target: "<15,000 tCO₂e" },
    { code: "GRI 305-2", title: "Indirect (Scope 2) GHG emissions",        value: "9,820",    unit: "tCO₂e",      status: "disclosed", trend: "down", target: "<8,000 tCO₂e" },
    { code: "GRI 305-3", title: "Scope 3 GHG emissions",                   value: "42,100",   unit: "tCO₂e",      status: "partial",   trend: "stable", target: "<38,000 tCO₂e" },
    { code: "GRI 306-3", title: "Waste generated",                         value: "3,250",    unit: "tonnes",     status: "disclosed", trend: "down", target: "<3,000 t" },
    // GRI 400 Social
    { code: "GRI 401-1", title: "New employee hires & turnover",            value: "14.2",     unit: "% turnover", status: "disclosed", trend: "stable", target: "<12%" },
    { code: "GRI 403-9", title: "Work-related injuries",                   value: "0.82",     unit: "TRIR",       status: "disclosed", trend: "down", target: "<0.6 TRIR" },
    { code: "GRI 404-1", title: "Average training hours per employee",     value: "28",       unit: "hours/yr",   status: "disclosed", trend: "up",   target: ">32 hrs" },
    { code: "GRI 405-1", title: "Diversity of governance bodies",          value: "34",       unit: "% women",    status: "disclosed", trend: "up",   target: ">40%" },
    { code: "GRI 413-1", title: "Community engagement programmes",         value: "12",       unit: "programmes", status: "disclosed", trend: "up",   target: ">15" },
    // GRI 200 Economic
    { code: "GRI 201-1", title: "Direct economic value generated",         value: "₹ 4,820M", unit: "",           status: "disclosed", trend: "up",   target: ">₹ 5,500M" },
    { code: "GRI 205-2", title: "Anti-corruption training",                value: "96",       unit: "% employees",status: "disclosed", trend: "up",   target: "100%" },
  ];

  // ── BRSR (India) ─────────────────────────────────────────────────────────────
  const brsrIndicators: BRSRIndicator[] = [
    { principle: "P1 – Ethics & Transparency",        question: "Code of conduct policy in place?",                  response: "Yes – board-approved CoC, 100% employees trained", compliance: "yes" },
    { principle: "P1 – Ethics & Transparency",        question: "Whistle-blower / vigil mechanism?",                 response: "Active ombudsman portal with anonymous reporting",  compliance: "yes" },
    { principle: "P2 – Product Lifecycle",            question: "Life-cycle assessment performed?",                  response: "Partial – 3 product categories covered of 8",      compliance: "partial" },
    { principle: "P2 – Product Lifecycle",            question: "Extended Producer Responsibility (EPR) compliant?", response: "Yes – EPR plan filed, target 30% recycled content", compliance: "yes" },
    { principle: "P3 – Employee Wellbeing",           question: "Health & safety management system certified?",      response: "ISO 45001:2018 certified across all plants",        compliance: "yes" },
    { principle: "P3 – Employee Wellbeing",           question: "Maternity / paternity leave policy?",               response: "26 weeks maternity; 5 days paternity",              compliance: "yes" },
    { principle: "P4 – Stakeholder Engagement",       question: "Stakeholder mapping completed?",                    response: "Yes – 6 stakeholder groups mapped, bi-annual review",compliance: "yes" },
    { principle: "P5 – Human Rights",                 question: "Human rights due diligence conducted?",             response: "Partial – tier-1 suppliers covered, tier-2 planned", compliance: "partial" },
    { principle: "P6 – Environment",                  question: "Net-zero / carbon neutrality target set?",          response: "Net-zero by 2040 committed; SBTi alignment pending", compliance: "partial" },
    { principle: "P6 – Environment",                  question: "Water positivity commitment?",                      response: "Water neutral by 2030, CGWB baseline submitted",   compliance: "yes" },
    { principle: "P7 – Policy Advocacy",              question: "Industry association memberships disclosed?",       response: "Yes – CII, FICCI, ASSOCHAM listed in Annual Report",compliance: "yes" },
    { principle: "P8 – Inclusive Growth",             question: "CSR spend ≥ 2% net profit?",                       response: "2.3% – ₹ 62M on water, education, livelihood",     compliance: "yes" },
    { principle: "P9 – Customer Value",               question: "Consumer complaint redressal mechanism?",           response: "ISO 10002 certified; <48 h resolution SLA",         compliance: "yes" },
  ];

  // ── CDP Climate Metrics ─────────────────────────────────────────────────────
  const cdpMetrics: CDPMetric[] = [
    { category: "Governance",   metric: "Board oversight of climate",          value: 100, unit: "%",       score: "A",  year: 2024 },
    { category: "Risk",         metric: "Climate risk assessment conducted",   value: 100, unit: "%",       score: "A",  year: 2024 },
    { category: "Targets",      metric: "Scope 1 reduction target",            value: 30,  unit: "% by 2030",score: "B", year: 2024 },
    { category: "Targets",      metric: "Scope 2 reduction target",            value: 50,  unit: "% by 2030",score: "A-",year: 2024 },
    { category: "Emissions",    metric: "Scope 1 GHG (tCO₂e)",                value: 18450,unit: "tCO₂e",  score: "B",  year: 2024 },
    { category: "Emissions",    metric: "Scope 2 GHG (market-based, tCO₂e)", value: 9820, unit: "tCO₂e",  score: "B",  year: 2024 },
    { category: "Energy",       metric: "Renewable energy share",              value: 22,  unit: "%",       score: "B",  year: 2024 },
    { category: "Water",        metric: "CDP Water Security – overall score",  value: 72,  unit: "/100",    score: "B",  year: 2024 },
  ];

  // ── TCFD ────────────────────────────────────────────────────────────────────
  const tcfdPillars: TCFDPillar[] = [
    { pillar: "Governance", element: "Board oversight",        description: "Board ESG Committee meets quarterly; climate risk on agenda since 2022",      status: "implemented", riskLevel: "Low" },
    { pillar: "Governance", element: "Management role",        description: "Chief Sustainability Officer reports directly to MD; cross-functional ESG task force", status: "implemented", riskLevel: "Low" },
    { pillar: "Strategy",   element: "Risks & opportunities",  description: "Physical & transition risks identified across RCP 2.6, 4.5, 8.5 scenarios",  status: "implemented", riskLevel: "Medium" },
    { pillar: "Strategy",   element: "Scenario analysis",      description: "1.5°C, 2°C, 3°C scenarios modelled; 2030 & 2050 horizons covered",          status: "partial",     riskLevel: "Medium" },
    { pillar: "Strategy",   element: "Business impact",        description: "Revenue at risk: ₹ 840M under 3°C scenario by 2040",                         status: "implemented", riskLevel: "High" },
    { pillar: "Risk Mgmt",  element: "Risk identification",    description: "Integrated climate risk register; updated annually",                          status: "implemented", riskLevel: "Medium" },
    { pillar: "Risk Mgmt",  element: "Risk management",        description: "Climate risk embedded in enterprise risk management (ERM) framework",        status: "partial",     riskLevel: "Medium" },
    { pillar: "Metrics",    element: "Scope 1, 2, 3 GHG",     description: "GHG verified by third party; Scope 3 (15 categories) reporting in progress", status: "partial",     riskLevel: "Low" },
    { pillar: "Metrics",    element: "Climate-linked incentives","description":"20% of executive variable pay linked to climate KPIs from FY2024",        status: "implemented", riskLevel: "Low" },
    { pillar: "Targets",    element: "GHG reduction targets",  description: "SBTi submission filed; net-zero by 2040 committed",                          status: "partial",     riskLevel: "Medium" },
  ];

  // ── Emissions breakdown ──────────────────────────────────────────────────────
  const emissionsBreakdown = [
    { name: "Scope 1 – Direct",       value: 18450, color: "#dc2626" },
    { name: "Scope 2 – Electricity",  value: 9820,  color: "#f97316" },
    { name: "Scope 3 – Value chain",  value: 42100, color: "#ca8a04" },
  ];

  // ── SDG Alignment ────────────────────────────────────────────────────────────
  const sdgAlignment = [
    { sdg: "SDG 6",  title: "Clean Water",        alignment: 92, color: "#0284c7" },
    { sdg: "SDG 7",  title: "Clean Energy",       alignment: 68, color: "#ca8a04" },
    { sdg: "SDG 8",  title: "Decent Work",        alignment: 74, color: "#10b981" },
    { sdg: "SDG 12", title: "Responsible Consume",alignment: 71, color: "#8b5cf6" },
    { sdg: "SDG 13", title: "Climate Action",     alignment: 78, color: "#f97316" },
    { sdg: "SDG 15", title: "Life on Land",       alignment: 58, color: "#065f46" },
  ];

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const statusBadge = (s: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      disclosed:    { bg: "#dcfce7", color: "#065f46", label: "✓ Disclosed" },
      partial:      { bg: "#fef3c7", color: "#854d0e", label: "⚠ Partial" },
      omitted:      { bg: "#fee2e2", color: "#7f1d1d", label: "✗ Omitted" },
      yes:          { bg: "#dcfce7", color: "#065f46", label: "✓ Compliant" },
      no:           { bg: "#fee2e2", color: "#7f1d1d", label: "✗ Non-compliant" },
      implemented:  { bg: "#dcfce7", color: "#065f46", label: "✓ Implemented" },
      planned:      { bg: "#e0e7ff", color: "#3730a3", label: "📅 Planned" },
    };
    const d = map[s] || map["partial"];
    return (
      <span style={{ background: d.bg, color: d.color, padding: "3px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700" }}>
        {d.label}
      </span>
    );
  };

  const cdpGrade = (s: string) => {
    const map: Record<string, string> = { "A": "#10b981", "A-": "#34d399", "B": "#0284c7", "B-": "#38bdf8", "C": "#ca8a04", "D": "#dc2626" };
    return (
      <span style={{ background: map[s] || "#e5e7eb", color: "white", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "800" }}>
        {s}
      </span>
    );
  };

  const frameworks = [
    { id: "overview",  label: "📊 Overview",       desc: "ESG Score" },
    { id: "gri",       label: "📋 GRI Standards",   desc: "GRI 2021" },
    { id: "brsr",      label: "🇮🇳 BRSR",            desc: "SEBI India" },
    { id: "cdp",       label: "🌡️ CDP Climate",     desc: "CDP 2024" },
    { id: "tcfd",      label: "🏦 TCFD",             desc: "Disclosures" },
    { id: "sdg",       label: "🌍 SDG Alignment",   desc: "UN Goals" },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>

        {/* Header */}
        <h1 style={{ color: "#0f172a", fontSize: "34px", fontWeight: "800", margin: "0 0 8px 0" }}>
          📑 ESG Reporting & Disclosure
        </h1>
        <p style={{ color: "#64748b", fontSize: "15px", margin: "0 0 36px 0" }}>
          Integrated reporting across GRI, BRSR (SEBI), CDP, TCFD &amp; UN SDG frameworks — FY {activeYear}
        </p>

        {/* Year Selector */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "32px", flexWrap: "wrap" }}>
          {["2022", "2023", "2024"].map(y => (
            <button key={y} onClick={() => setActiveYear(y)} style={{
              padding: "8px 20px", borderRadius: "6px", border: "2px solid",
              background: activeYear === y ? "#0f172a" : "white",
              color: activeYear === y ? "white" : "#0f172a",
              borderColor: "#0f172a", fontSize: "13px", fontWeight: "700", cursor: "pointer",
            }}>{y}</button>
          ))}
        </div>

        {/* Framework tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
          {frameworks.map(f => (
            <button key={f.id} onClick={() => setActiveFramework(f.id)} style={{
              padding: "10px 16px", borderRadius: "8px", border: "2px solid",
              background: activeFramework === f.id ? "#0284c7" : "white",
              color: activeFramework === f.id ? "white" : "#0284c7",
              borderColor: "#0284c7", fontSize: "12px", fontWeight: "700", cursor: "pointer",
              transition: "all 0.2s",
            }}>
              {f.label}<br />
              <span style={{ fontSize: "10px", opacity: 0.85 }}>{f.desc}</span>
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
        {activeFramework === "overview" && (
          <>
            {/* Score Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
              {esgScores.map((s, i) => (
                <div key={i} style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: `4px solid ${s.color}` }}>
                  <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 8px 0" }}>{s.category}</p>
                  <p style={{ color: s.color, fontSize: "44px", fontWeight: "800", margin: "0 0 4px 0", lineHeight: 1 }}>{s.score}</p>
                  <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 4px 0" }}>/100 &nbsp;·&nbsp; Weight: {s.weight}%</p>
                  <p style={{ color: s.color, fontSize: "12px", fontWeight: "700", margin: "0" }}>{s.trend}</p>
                </div>
              ))}
              <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
                <p style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 8px 0" }}>Composite ESG Score</p>
                <p style={{ color: "#38bdf8", fontSize: "44px", fontWeight: "800", margin: "0 0 4px 0", lineHeight: 1 }}>{compositeScore}</p>
                <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 6px 0" }}>/100 &nbsp;·&nbsp; MSCI rating: AA</p>
                <p style={{ color: "#4ade80", fontSize: "12px", fontWeight: "700", margin: "0" }}>↑ +3 pts vs FY2023</p>
              </div>
            </div>

            {/* Trend & Radar */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px", marginBottom: "32px" }}>
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>📈 5-Year ESG Trend</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={esgTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[40, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="environmental" stroke="#10b981" strokeWidth={2} name="Environmental" />
                    <Line type="monotone" dataKey="social"        stroke="#0284c7" strokeWidth={2} name="Social" />
                    <Line type="monotone" dataKey="governance"    stroke="#8b5cf6" strokeWidth={2} name="Governance" />
                    <Line type="monotone" dataKey="composite"     stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" name="Composite" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>🎯 Performance Radar</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                    <Radar name="Score" dataKey="A" stroke="#0284c7" fill="#0284c7" fillOpacity={0.25} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Emissions doughnut */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>💨 GHG Emissions by Scope (tCO₂e)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={emissionsBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}>
                      {emissionsBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `${Number(v).toLocaleString()} tCO₂e`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>💧 Key Environmental KPIs</h3>
                {[
                  { label: "Water Intensity", val: "85.2 m³/tonne", target: "< 75", trend: "↓", ok: false },
                  { label: "Energy Intensity", val: "4.28 GJ/tonne", target: "< 4.0", trend: "↓", ok: false },
                  { label: "Renewable Energy", val: "22%", target: "> 40%", trend: "↑", ok: false },
                  { label: "Waste to Landfill", val: "8%", target: "< 5%", trend: "↓", ok: false },
                  { label: "Carbon Intensity", val: "0.84 tCO₂e/t", target: "< 0.70", trend: "↓", ok: false },
                  { label: "GHG Reduction YoY", val: "7.4%", target: "> 8%", trend: "↑", ok: false },
                ].map((kpi, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "600", margin: "0" }}>{kpi.label}</p>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <p style={{ color: "#0284c7", fontSize: "12px", fontWeight: "700", margin: "0" }}>{kpi.val}</p>
                      <p style={{ color: "#94a3b8", fontSize: "10px", margin: "0" }}>Target: {kpi.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── GRI ────────────────────────────────────────────────────────────── */}
        {activeFramework === "gri" && (
          <div style={{ background: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0" }}>📋 GRI Universal & Topic-Specific Standards</h2>
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { label: `✓ Disclosed (${griIndicators.filter(g => g.status === "disclosed").length})`, color: "#dcfce7", tc: "#065f46" },
                  { label: `⚠ Partial (${griIndicators.filter(g => g.status === "partial").length})`,   color: "#fef3c7", tc: "#854d0e" },
                ].map((b, i) => (
                  <span key={i} style={{ background: b.color, color: b.tc, padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700" }}>{b.label}</span>
                ))}
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ background: "#f0f9ff", borderBottom: "2px solid #0284c7" }}>
                    {["GRI Code", "Disclosure Title", "Value", "Unit", "Target", "Trend", "Status"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: "700", color: "#0f172a", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {griIndicators.map((ind, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                      <td style={{ padding: "10px 12px", color: "#0284c7", fontWeight: "700", whiteSpace: "nowrap" }}>{ind.code}</td>
                      <td style={{ padding: "10px 12px", color: "#0f172a", maxWidth: "240px" }}>{ind.title}</td>
                      <td style={{ padding: "10px 12px", color: "#0f172a", fontWeight: "700", whiteSpace: "nowrap" }}>{ind.value}</td>
                      <td style={{ padding: "10px 12px", color: "#64748b" }}>{ind.unit}</td>
                      <td style={{ padding: "10px 12px", color: "#94a3b8", fontSize: "11px" }}>{ind.target}</td>
                      <td style={{ padding: "10px 12px", color: ind.trend === "up" ? "#10b981" : ind.trend === "down" ? "#dc2626" : "#ca8a04", fontWeight: "700" }}>
                        {ind.trend === "up" ? "↑ Improving" : ind.trend === "down" ? "↓ Declining" : "→ Stable"}
                      </td>
                      <td style={{ padding: "10px 12px" }}>{statusBadge(ind.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "11px", margin: "16px 0 0 0" }}>
              * Reported in accordance with GRI Standards 2021. Verified by a third-party assurance provider (limited assurance, ISAE 3000).
            </p>
          </div>
        )}

        {/* ── BRSR ────────────────────────────────────────────────────────────── */}
        {activeFramework === "brsr" && (
          <>
            <div style={{ background: "linear-gradient(135deg,#fff7ed,#fef3c7)", padding: "20px", borderRadius: "14px", border: "2px solid #ca8a04", marginBottom: "24px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div>
                <p style={{ color: "#854d0e", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 4px 0" }}>BRSR Framework</p>
                <p style={{ color: "#0f172a", fontSize: "13px", margin: "0" }}>Business Responsibility and Sustainability Reporting (SEBI Circular No. SEBI/HO/CFD/CMD-2/CIR/P/2021/562) — Mandatory for Top-1000 listed companies by market cap</p>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <span style={{ background: "#dcfce7", color: "#065f46", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700" }}>✓ Compliant: {brsrIndicators.filter(b => b.compliance === "yes").length}</span>
                <span style={{ background: "#fef3c7", color: "#854d0e", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700" }}>⚠ Partial: {brsrIndicators.filter(b => b.compliance === "partial").length}</span>
                <span style={{ background: "#fee2e2", color: "#7f1d1d", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700" }}>✗ Gap: {brsrIndicators.filter(b => b.compliance === "no").length}</span>
              </div>
            </div>

            <div style={{ display: "grid", gap: "12px", marginBottom: "32px" }}>
              {brsrIndicators.map((ind, i) => (
                <div key={i} style={{ background: "white", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${ind.compliance === "yes" ? "#10b981" : ind.compliance === "partial" ? "#ca8a04" : "#dc2626"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 4px 0" }}>{ind.principle}</p>
                      <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "700", margin: "0 0 6px 0" }}>{ind.question}</p>
                      <p style={{ color: "#475569", fontSize: "12px", margin: "0" }}>{ind.response}</p>
                    </div>
                    <div style={{ flexShrink: 0 }}>{statusBadge(ind.compliance)}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── CDP ────────────────────────────────────────────────────────────── */}
        {activeFramework === "cdp" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              {cdpMetrics.map((m, i) => (
                <div key={i} style={{ background: "white", padding: "18px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 6px 0" }}>{m.category}</p>
                  <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: "600", margin: "0 0 10px 0" }}>{m.metric}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ color: "#0284c7", fontSize: "16px", fontWeight: "800", margin: "0" }}>{m.value.toLocaleString()}<span style={{ fontSize: "11px", fontWeight: "400", color: "#94a3b8" }}> {m.unit}</span></p>
                    {cdpGrade(m.score)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
              <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>🎯 CDP Scores by Category</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={cdpMetrics.filter(m => m.value <= 100)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="metric" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0284c7" radius={[6, 6, 0, 0]} name="Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: "linear-gradient(135deg,#dbeafe,#bfdbfe)", padding: "20px", borderRadius: "14px", border: "2px solid #0284c7" }}>
              <h3 style={{ color: "#0c4a6e", fontSize: "14px", fontWeight: "700", margin: "0 0 10px 0" }}>ℹ️ CDP Climate Change — Overall Band: <strong>B</strong></h3>
              <p style={{ color: "#0c4a6e", fontSize: "12px", margin: "0" }}>
                The company has taken coordinated action on climate issues. Target: achieve <strong>A–</strong> by 2026 through SBTi alignment, Scope 3 completion, and RE100 commitment.
              </p>
            </div>
          </>
        )}

        {/* ── TCFD ────────────────────────────────────────────────────────────── */}
        {activeFramework === "tcfd" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px", marginBottom: "28px" }}>
              {["Governance", "Strategy", "Risk Mgmt", "Metrics", "Targets"].map(pillar => {
                const items = tcfdPillars.filter(t => t.pillar === pillar);
                const done  = items.filter(t => t.status === "implemented").length;
                const pct   = Math.round((done / items.length) * 100);
                const color = pct === 100 ? "#10b981" : pct >= 50 ? "#ca8a04" : "#dc2626";
                return (
                  <div key={pillar} style={{ background: "white", padding: "18px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderTop: `4px solid ${color}` }}>
                    <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 6px 0" }}>{pillar}</p>
                    <p style={{ color: color, fontSize: "30px", fontWeight: "800", margin: "0 0 4px 0" }}>{pct}%</p>
                    <p style={{ color: "#94a3b8", fontSize: "11px", margin: "0" }}>{done} of {items.length} elements implemented</p>
                    <div style={{ background: "#e5e7eb", borderRadius: "4px", height: "5px", marginTop: "10px", overflow: "hidden" }}>
                      <div style={{ background: color, height: "100%", width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "grid", gap: "12px", marginBottom: "28px" }}>
              {tcfdPillars.map((t, i) => (
                <div key={i} style={{ background: "white", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${t.status === "implemented" ? "#10b981" : t.status === "partial" ? "#ca8a04" : "#8b5cf6"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 2px 0" }}>{t.pillar} — {t.element}</p>
                      <p style={{ color: "#475569", fontSize: "12px", margin: "0" }}>{t.description}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0, alignItems: "center" }}>
                      <span style={{ background: t.riskLevel === "High" ? "#fee2e2" : t.riskLevel === "Medium" ? "#fef3c7" : "#dcfce7", color: t.riskLevel === "High" ? "#7f1d1d" : t.riskLevel === "Medium" ? "#854d0e" : "#065f46", padding: "3px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700" }}>
                        {t.riskLevel} Risk
                      </span>
                      {statusBadge(t.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── SDG ─────────────────────────────────────────────────────────────── */}
        {activeFramework === "sdg" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              {sdgAlignment.map((sdg, i) => (
                <div key={i} style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: `4px solid ${sdg.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ background: sdg.color, color: "white", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>{sdg.sdg}</span>
                    <p style={{ color: sdg.color, fontSize: "24px", fontWeight: "800", margin: "0" }}>{sdg.alignment}%</p>
                  </div>
                  <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "600", margin: "0 0 10px 0" }}>{sdg.title}</p>
                  <div style={{ background: "#e5e7eb", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                    <div style={{ background: sdg.color, height: "100%", width: `${sdg.alignment}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "white", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
              <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>📊 SDG Contribution Scores</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={sdgAlignment}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="sdg" />
                  <YAxis domain={[0, 100]} />
                <Tooltip formatter={(v) => `${Number(v)}% alignment`} />
                  {sdgAlignment.map(() => null)}
                  <Bar dataKey="alignment" radius={[6, 6, 0, 0]} name="Alignment %">
                    {sdgAlignment.map((_s, i) => <Cell key={i} fill={_s.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", padding: "24px", borderRadius: "14px", border: "2px solid #10b981" }}>
              <h3 style={{ color: "#065f46", fontSize: "15px", fontWeight: "700", margin: "0 0 12px 0" }}>🌍 SDG Integration Strategy</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                {[
                  { title: "SDG 6 — Water Focus", body: "Water neutral by 2030, GEC 2015-aligned groundwater assessment, rainwater harvesting" },
                  { title: "SDG 13 — Climate Action", body: "Net-zero by 2040, SBTi near-term targets, RCP scenario planning" },
                  { title: "SDG 8 — Decent Work", body: "TRIR < 0.6, living wage policy, 40% women in leadership" },
                  { title: "SDG 12 — Responsible Consumption", body: "EPR compliance, circular economy roadmap, zero waste to landfill by 2030" },
                ].map((card, i) => (
                  <div key={i} style={{ background: "white", padding: "14px", borderRadius: "8px" }}>
                    <p style={{ color: "#065f46", fontSize: "12px", fontWeight: "700", margin: "0 0 6px 0" }}>{card.title}</p>
                    <p style={{ color: "#475569", fontSize: "11px", margin: "0", lineHeight: "1.5" }}>{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </Layout>
  );
}
