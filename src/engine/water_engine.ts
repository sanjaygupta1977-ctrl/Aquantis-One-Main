// Aquantis Water Intelligence Engine
// Version 1.0

export interface WaterAuditInput {
  plantName: string;
  waterConsumption: number; // m3/day
  production: number;       // tonnes/day
  recycledWater: number;    // m3/day
}

export interface WaterAuditResult {
  plantName: string;
  waterIntensity: number;
  recyclingPercentage: number;
  waterStatus: string;
}


// Calculate water intensity
export function calculateWaterIntensity(
  waterConsumption: number,
  production: number
): number {

  if (production === 0) {
    return 0;
  }

  return Number(
    (waterConsumption / production).toFixed(2)
  );
}


// Calculate recycling percentage
export function calculateRecyclingPercentage(
  recycledWater: number,
  totalWater: number
): number {

  if (totalWater === 0) {
    return 0;
  }

  return Number(
    ((recycledWater / totalWater) * 100).toFixed(2)
  );
}


// Performance rating
export function waterPerformance(
  intensity: number
): string {

  if (intensity <= 3) {
    return "Excellent";
  }
  else if (intensity <= 5) {
    return "Good";
  }
  else if (intensity <= 8) {
    return "Needs Improvement";
  }
  else {
    return "Critical";
  }
}


// Main Aquantis audit function
export function runWaterAudit(
  input: WaterAuditInput
): WaterAuditResult {

  const intensity = calculateWaterIntensity(
    input.waterConsumption,
    input.production
  );

  const recycling = calculateRecyclingPercentage(
    input.recycledWater,
    input.waterConsumption
  );

  return {

    plantName: input.plantName,

    waterIntensity: intensity,

    recyclingPercentage: recycling,

    waterStatus: waterPerformance(intensity)

  };
}