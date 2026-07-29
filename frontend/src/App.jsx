import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from 'axios'
import './App.css'

export default function App() {
  const [resources, setResources] = useState([])
  const [selected, setSelected] = useState(null)
  const [timeseries, setTimeseries] = useState([])
  const [anomalies, setAnomalies] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const res = await axios.get('/api/v1/resources')
      setResources(res.data)
      if (res.data.length > 0) {
        fetchTimeseries(res.data[0].source_id)
      }
    } catch (err) {
      console.error('Error fetching resources:', err)
    }
  }

  const fetchTimeseries = async (sourceId) => {
    setLoading(true)
    try {
      const [ts, anom] = await Promise.all([
        axios.get(`/api/v1/resources/${sourceId}/timeseries?days=30`),
        axios.get(`/api/v1/resources/${sourceId}/anomalies?days=30`),
      ])
      setTimeseries(ts.data.reverse())
      setAnomalies(anom.data)
      setSelected(sourceId)
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Resource Intelligence Dashboard</h1>
        <p>Water & Energy Monitoring Platform</p>
      </header>

      <div className="container">
        <aside className="sidebar">
          <h3>Resources</h3>
          <ul>
            {resources.map((r) => (
              <li key={r.source_id} className={selected === r.source_id ? 'active' : ''}>
                <button onClick={() => fetchTimeseries(r.source_id)}>
                  <strong>{r.source_id}</strong>
                  <span>{r.resource_type}</span>
                  <small>{r.latest_value.toFixed(2)} ({r.count} records)</small>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="main">
          {loading && <p className="loading">Loading...</p>}
          {!loading && timeseries.length > 0 && (
            <>
              <section className="chart-section">
                <h2>Time Series: {selected}</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={timeseries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ts" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </section>

              {anomalies.length > 0 && (
                <section className="anomalies-section">
                  <h2>Detected Anomalies ({anomalies.length})</h2>
                  <table className="anomaly-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Value</th>
                        <th>Expected</th>
                        <th>Deviation</th>
                        <th>Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anomalies.slice(0, 10).map((a, i) => (
                        <tr key={i} className={`severity-${a.severity}`}>
                          <td>{new Date(a.ts).toLocaleString()}</td>
                          <td>{a.value.toFixed(2)}</td>
                          <td>{a.expected.toFixed(2)}</td>
                          <td>{a.deviation}σ</td>
                          <td>{a.severity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
