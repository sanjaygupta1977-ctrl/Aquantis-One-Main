import Layout from "../components/Layout";
import { useState } from "react";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [language, setLanguage] = useState("en");

  return (
    <Layout>
      <div style={{ padding: "40px", maxWidth: "800px" }}>
        <h1>⚙ Settings</h1>
        <p style={{ color: "#666", marginTop: "10px" }}>Configure system preferences and options</p>

        <div style={{ marginTop: "40px", display: "grid", gap: "25px" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "20px", alignItems: "center" }}>
              <div>
                <h4 style={{ margin: "0 0 5px 0" }}>Notifications</h4>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Receive alerts for system anomalies</p>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />
            </div>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "20px", alignItems: "center" }}>
              <div>
                <h4 style={{ margin: "0 0 5px 0" }}>Dark Mode</h4>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Use dark theme for the interface</p>
              </div>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />
            </div>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "20px", alignItems: "center" }}>
              <div>
                <h4 style={{ margin: "0 0 5px 0" }}>Auto Update</h4>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Automatically update to latest version</p>
              </div>
              <input
                type="checkbox"
                checked={autoUpdate}
                onChange={(e) => setAutoUpdate(e.target.checked)}
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />
            </div>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <label style={{ display: "block", marginBottom: "10px" }}>
              <h4 style={{ margin: "0 0 8px 0" }}>Language</h4>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
              </select>
            </label>
          </div>
        </div>

        <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "#eff6ff", padding: "20px", borderRadius: "8px" }}>
            <h4>System Information</h4>
            <ul style={{ margin: "15px 0", padding: "0 20px", lineHeight: "1.8", fontSize: "14px" }}>
              <li>Version: 1.0.0</li>
              <li>Build: 2024.01.15</li>
              <li>Status: Running</li>
              <li>Uptime: 42 days</li>
            </ul>
          </div>

          <div style={{ background: "#f0fdf4", padding: "20px", borderRadius: "8px" }}>
            <h4>Quick Actions</h4>
            <div style={{ marginTop: "15px", display: "grid", gap: "10px" }}>
              <button
                style={{
                  padding: "10px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => alert("System cleared")}
              >
                Clear Cache
              </button>
              <button
                style={{
                  padding: "10px",
                  background: "#0369a1",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => alert("Help documentation opened")}
              >
                Help & Support
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "40px", display: "grid", gap: "10px" }}>
          <button
            style={{
              padding: "12px 20px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
            onClick={() => alert("Settings saved!")}
          >
            Save Settings
          </button>
          <button
            style={{
              padding: "12px 20px",
              background: "#e5e7eb",
              color: "#111",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
            onClick={() => alert("Settings reset to default")}
          >
            Reset to Default
          </button>
        </div>
      </div>
    </Layout>
  );
}
