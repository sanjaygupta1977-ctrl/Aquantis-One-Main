function Dashboard() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          background: "#0f172a",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>AQUANTIS</h2>

        <hr />

        <p>🏠 Dashboard</p>
        <p>💧 Water</p>
        <p>⚡ Energy</p>
        <p>🌍 Carbon</p>
        <p>📊 Reports</p>
        <p>🤖 AI Copilot</p>
        <p>⚙ Settings</p>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "30px",
          background: "#f5f7fb",
        }}
      >
        <h1>Welcome to Aquantis Global</h1>

        <h3>Plant Health Score : 92%</h3>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div style={{ background: "white", padding: "20px", width: "220px" }}>
            💧 Water
            <h2>1250 m³/day</h2>
          </div>

          <div style={{ background: "white", padding: "20px", width: "220px" }}>
            ⚡ Energy
            <h2>18.2 MW</h2>
          </div>

          <div style={{ background: "white", padding: "20px", width: "220px" }}>
            🌍 Carbon
            <h2>624 tCO₂</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;