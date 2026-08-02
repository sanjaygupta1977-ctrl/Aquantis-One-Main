import { useState } from 'react';
import axios from "axios";

const CBAMCalculator = () => {
  const [projectName, setProjectName] = useState('10 MLD MBR STP - Bangalore');
  const [capacityMld, setCapacityMld] = useState(10);
  
  // Civil Data
  const [rccVolume, setRccVolume] = useState(2750);
  const [steelMass, setSteelMass] = useState(250000);
  const [waterproofingArea, setWaterproofingArea] = useState(5000);
  const [epoxyArea, setEpoxyArea] = useState(3000);
  
  // Mechanical Data
  const [inletPumpKw, setInletPumpKw] = useState(30);
  const [rasPumpKw, setRasPumpKw] = useState(15);
  const [effluentPumpKw, setEffluentPumpKw] = useState(24);
  const [blowerKw, setBlowerKw] = useState(60);
  const [membraneArea, setMembraneArea] = useState(500);
  const [pipingLength, setPipingLength] = useState(2000);
  
  // Electrical Data
  const [transformerKva, setTransformerKva] = useState(100);
  const [cableLength, setCableLength] = useState(500);
  const [earthingRods, setEarthingRods] = useState(10);
  
  // Operational Data
  const [annualElectricityKwh, setAnnualElectricityKwh] = useState(1050000);
  const [gridIntensity, setGridIntensity] = useState(0.4);
  const [renewableFraction, setRenewableFraction] = useState(0);
  const [coagulantKgAnnual, setCoagulantKgAnnual] = useState(150000);
  const [disinfectantKgAnnual, setDisinfectantKgAnnual] = useState(90000);
  const [limeKgAnnual, setLimeKgAnnual] = useState(150000);
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/cbam/calculate', {
        project_name: projectName,
        capacity_mld: capacityMld,
        civil_data: {
          rcc_volume: rccVolume,
          steel_mass: steelMass,
          waterproofing_area: waterproofingArea,
          epoxy_area: epoxyArea,
        },
        mechanical_data: {
          inlet_pump_kw: inletPumpKw,
          ras_pump_kw: rasPumpKw,
          effluent_pump_kw: effluentPumpKw,
          blower_kw: blowerKw,
          membrane_area: membraneArea,
          piping_length: pipingLength,
        },
        electrical_data: {
          transformer_kva: transformerKva,
          cable_length: cableLength,
          earthing_rods: earthingRods,
        },
        operational_data: {
          annual_electricity_kwh: annualElectricityKwh,
          grid_intensity: gridIntensity,
          renewable_fraction: renewableFraction,
          coagulant_kg_annual: coagulantKgAnnual,
          disinfectant_kg_annual: disinfectantKgAnnual,
          lime_kg_annual: limeKgAnnual,
        },
      });
      setResult(response.data);
    } catch (err) {
      setError(err.message);
      console.error('CBAM calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">CBAM Calculator</h1>
          <p className="text-gray-300">EU Carbon Border Adjustment Mechanism Tax Analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
              {/* Project Info */}
              <div className="space-y-4 mb-6">
                <h2 className="text-xl font-semibold text-white">Project Information</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Capacity (MLD)</label>
                  <input
                    type="number"
                    value={capacityMld}
                    onChange={(e) => setCapacityMld(parseFloat(e.target.value))}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Civil Works */}
              <div className="space-y-3 mb-6 pb-6 border-b border-slate-700">
                <h3 className="font-semibold text-white">Civil Works</h3>
                <div>
                  <label className="text-sm text-gray-300">RCC Volume (m³)</label>
                  <input
                    type="number"
                    value={rccVolume}
                    onChange={(e) => setRccVolume(parseFloat(e.target.value))}
                    className="w-full bg-slate-700 text-white px-3 py-1 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Steel Mass (kg)</label>
                  <input
                    type="number"
                    value={steelMass}
                    onChange={(e) => setSteelMass(parseFloat(e.target.value))}
                    className="w-full bg-slate-700 text-white px-3 py-1 rounded text-sm"
                  />
                </div>
              </div>

              {/* Electrical */}
              <div className="space-y-3 mb-6 pb-6 border-b border-slate-700">
                <h3 className="font-semibold text-white">Electrical</h3>
                <div>
                  <label className="text-sm text-gray-300">Transformer (kVA)</label>
                  <input
                    type="number"
                    value={transformerKva}
                    onChange={(e) => setTransformerKva(parseFloat(e.target.value))}
                    className="w-full bg-slate-700 text-white px-3 py-1 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Cable Length (m)</label>
                  <input
                    type="number"
                    value={cableLength}
                    onChange={(e) => setCableLength(parseFloat(e.target.value))}
                    className="w-full bg-slate-700 text-white px-3 py-1 rounded text-sm"
                  />
                </div>
              </div>

              {/* Operational */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-white">Operations</h3>
                <div>
                  <label className="text-sm text-gray-300">Annual Electricity (kWh)</label>
                  <input
                    type="number"
                    value={annualElectricityKwh}
                    onChange={(e) => setAnnualElectricityKwh(parseFloat(e.target.value))}
                    className="w-full bg-slate-700 text-white px-3 py-1 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Grid CO2 Intensity (kg/kWh)</label>
                  <input
                    type="number"
                    value={gridIntensity}
                    onChange={(e) => setGridIntensity(parseFloat(e.target.value))}
                    step="0.01"
                    className="w-full bg-slate-700 text-white px-3 py-1 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Renewable Energy %</label>
                  <input
                    type="number"
                    value={renewableFraction * 100}
                    onChange={(e) => setRenewableFraction(parseFloat(e.target.value) / 100)}
                    min="0"
                    max="100"
                    className="w-full bg-slate-700 text-white px-3 py-1 rounded text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleCalculate}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-semibold py-3 rounded transition duration-200"
              >
                {loading ? 'Calculating...' : 'Calculate CBAM'}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6">
                Error: {error}
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
                  <h2 className="text-2xl font-bold text-white mb-4">CBAM Analysis Summary</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-700 p-4 rounded">
                      <p className="text-gray-400 text-sm">Total Embodied Carbon</p>
                      <p className="text-2xl font-bold text-green-400">
                        {result.summary.total_embodied_carbon_tons.toFixed(0)} tons
                      </p>
                    </div>
                    <div className="bg-slate-700 p-4 rounded">
                      <p className="text-gray-400 text-sm">Annual Operational Carbon</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {result.summary.annual_operational_carbon_tons.toFixed(0)} tons
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-900 to-orange-900 p-4 rounded mb-6">
                    <p className="text-gray-300 text-sm mb-2">CBAM Tax (10-year projection)</p>
                    <p className="text-3xl font-bold text-white">
                      €{(result.summary.total_10year_tax_eur / 1000).toFixed(1)}k
                    </p>
                    <p className="text-sm text-gray-300 mt-2">
                      Current Phase: {result.cbam_analysis.current_phase}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-700 p-3 rounded text-center">
                      <p className="text-gray-400 text-xs">Embodied Tax</p>
                      <p className="text-lg font-bold text-blue-300">
                        €{(result.summary.total_embodied_tax_eur / 1000).toFixed(0)}k
                      </p>
                    </div>
                    <div className="bg-slate-700 p-3 rounded text-center">
                      <p className="text-gray-400 text-xs">Annual Tax</p>
                      <p className="text-lg font-bold text-purple-300">
                        €{(result.summary.annual_operational_tax_eur / 1000).toFixed(0)}k/yr
                      </p>
                    </div>
                    <div className="bg-slate-700 p-3 rounded text-center">
                      <p className="text-gray-400 text-xs">Tax Rate</p>
                      <p className="text-lg font-bold text-indigo-300">
                        €95/ton
                      </p>
                    </div>
                  </div>
                </div>

                {/* Offset Options */}
                {result.offset_options && (
                  <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-4">Carbon Offset Options</h3>
                    <div className="space-y-3">
                      {result.offset_options.options.map((option, idx) => (
                        <div key={idx} className="bg-slate-700 p-4 rounded">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-white">{option.name}</h4>
                            <span className="text-green-400 font-bold">
                              {option.reduction_percent}% reduction
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{option.description}</p>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">
                              Reduced CO2: {option.reduced_carbon.toFixed(0)} tons
                            </span>
                            <span className="text-green-400 font-semibold">
                              €{(option.total_cost_eur / 1000).toFixed(0)}k
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Breakdown by Category */}
                <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-white mb-4">Emissions Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                      <span className="text-gray-300">Civil Works</span>
                      <span className="text-lg font-bold text-blue-400">
                        {result.emissions.civil.total_civil_tons.toFixed(0)} tons CO2e
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                      <span className="text-gray-300">Mechanical Equipment</span>
                      <span className="text-lg font-bold text-green-400">
                        {result.emissions.mechanical.total_mechanical_tons.toFixed(0)} tons CO2e
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                      <span className="text-gray-300">Electrical Systems</span>
                      <span className="text-lg font-bold text-yellow-400">
                        {result.emissions.electrical.total_electrical_tons.toFixed(0)} tons CO2e
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                      <span className="text-gray-300">Annual Operations</span>
                      <span className="text-lg font-bold text-orange-400">
                        {result.emissions.operational.total_annual_operational.toFixed(0)} tons CO2e
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!result && !loading && !error && (
              <div className="bg-slate-800 rounded-lg p-12 text-center">
                <p className="text-gray-400 text-lg">Enter project details and click "Calculate CBAM" to see analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CBAMCalculator;
