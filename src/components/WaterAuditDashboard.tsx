import { useState } from "react";
import { runWaterAudit } from "../engine/water_engine";

function WaterAuditDashboard() {

  const [result, setResult] = useState<any>(null);

  const calculate = () => {

    const audit = runWaterAudit({

      plantName: "Paper Mill A",

      waterConsumption: 5000,

      production: 1000,

      recycledWater: 3500

    });

    setResult(audit);
  };


  return (

    <div>

      <h1>Aquantis Water Intelligence</h1>

      <button onClick={calculate}>
        Run Water Audit
      </button>


      {result && (

        <div>

          <h2>{result.plantName}</h2>

          <p>
            Water Intensity:
            {result.waterIntensity} m³/tonne
          </p>

          <p>
            Recycling:
            {result.recyclingPercentage} %
          </p>

          <p>
            Status:
            {result.waterStatus}
          </p>

        </div>

      )}

    </div>

  );
}

export default WaterAuditDashboard;