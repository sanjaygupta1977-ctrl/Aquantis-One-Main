import { useState } from "react";
import { calculateWaterBalance } from "../engine/waterbalance";

export default function WaterIntelligence() {

  const [freshwater, setFreshwater] = useState(12000);
  const [recycled, setRecycled] = useState(4000);
  const [production, setProduction] = useState(2500);

  const result = calculateWaterBalance({
    freshwater,
    recycledWater: recycled,
    rainwater: 500,
    production,
    evaporationLoss: 5000,
    blowdownLoss: 1000,
    processLoss: 3000,
    domesticUse: 500,
    discharge: 7000
  });

  return (
    <div style={{padding:40}}>

      <h1>AQUANTIS WATER BALANCE</h1>

      <p>Fresh Water</p>
      <input
        type="number"
        value={freshwater}
        onChange={(e)=>setFreshwater(Number(e.target.value))}
      />

      <p>Recycled Water</p>
      <input
        type="number"
        value={recycled}
        onChange={(e)=>setRecycled(Number(e.target.value))}
      />

      <p>Production</p>
      <input
        type="number"
        value={production}
        onChange={(e)=>setProduction(Number(e.target.value))}
      />

      <hr/>

      <h2>Total Water Input : {result.totalInput}</h2>

      <h2>Reuse : {result.reusePercentage.toFixed(1)}%</h2>

      <h2>Water Intensity : {result.waterIntensity.toFixed(2)}</h2>

      <h2>Status : {result.balanceStatus}</h2>

    </div>
  );
}