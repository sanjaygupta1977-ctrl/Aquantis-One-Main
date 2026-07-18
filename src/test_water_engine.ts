import { runWaterAudit } from "./engine/water_engine";


const result = runWaterAudit({

  plantName: "Paper Mill A",

  waterConsumption: 5000,

  production: 1000,

  recycledWater: 3500

});


console.log(result);