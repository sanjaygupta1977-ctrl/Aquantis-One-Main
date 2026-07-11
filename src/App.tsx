export default function App() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navigation */}
      <nav className="flex justify-between items-center px-10 py-5 shadow-md">
        <h1 className="text-3xl font-bold text-blue-700">
          Aquantis Global
        </h1>

        <div className="space-x-8">
          <a href="#">Home</a>
          <a href="#">Solutions</a>
          <a href="#">Industries</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-24 bg-gradient-to-r from-blue-800 to-cyan-600 text-white">
        <h1 className="text-6xl font-bold mb-6">
          Industrial Intelligence Platform
        </h1>

        <p className="text-xl max-w-3xl mx-auto">
          AI-powered Water, Energy, Carbon, ESG and Sustainability Management
          Platform for Industries.
        </p>

        <button className="mt-10 bg-white text-blue-700 px-8 py-3 rounded-xl font-bold">
          Request Demo
        </button>
      </section>

      {/* Modules */}

      <section className="py-20 px-10">

        <h2 className="text-4xl font-bold text-center mb-12">
          Platform Modules
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="shadow-xl rounded-2xl p-8">
            <h3 className="text-2xl font-bold">💧 Water Intelligence</h3>
            <p>Water Audit • Water Balance • Water Footprint • Water Neutrality</p>
          </div>

          <div className="shadow-xl rounded-2xl p-8">
            <h3 className="text-2xl font-bold">⚡ Energy Intelligence</h3>
            <p>Energy Monitoring • Benchmarking • Optimization</p>
          </div>

          <div className="shadow-xl rounded-2xl p-8">
            <h3 className="text-2xl font-bold">🌍 Carbon & ESG</h3>
            <p>Carbon Accounting • BRSR • CDP • GRI</p>
          </div>

          <div className="shadow-xl rounded-2xl p-8">
            <h3 className="text-2xl font-bold">🏭 Industrial Intelligence</h3>
            <p>Digital Twin • KPI Dashboard • AI Analytics</p>
          </div>

          <div className="shadow-xl rounded-2xl p-8">
            <h3 className="text-2xl font-bold">📊 Analytics</h3>
            <p>Reports • Trends • Forecasts • Dashboards</p>
          </div>

          <div className="shadow-xl rounded-2xl p-8">
            <h3 className="text-2xl font-bold">🤖 AI Copilot</h3>
            <p>Recommendations • Compliance • Report Generator</p>
          </div>

        </div>

      </section>

      {/* Footer */}

      <footer className="bg-slate-900 text-white text-center py-8">
        © 2026 Aquantis Global | Industrial Intelligence Platform
      </footer>

    </div>
  );
}