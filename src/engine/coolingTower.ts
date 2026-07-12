export interface CoolingTowerInput {
  circulation: number;
  coc: number;
  targetCoc: number;
  evaporation: number;
  waterCost: number;
}

export interface CoolingTowerResult {
  currentMakeup: number;
 targetMakeup: number;
  annualWaterSaving: number;
  annualCostSaving: number;
}

export function calculateCoolingTower(
  input: CoolingTowerInput
): CoolingTowerResult {

  const currentBlowdown =
    input.evaporation / (input.coc - 1);

  const targetBlowdown =
    input.evaporation / (input.targetCoc - 1);

  const currentMakeup =
    input.evaporation + currentBlowdown;

  const targetMakeup =
    input.evaporation + targetBlowdown;

  const annualWaterSaving =
    (currentMakeup - targetMakeup) * 365;

  const annualCostSaving =
    annualWaterSaving * input.waterCost;

  return {
    currentMakeup,
    targetMakeup,
    annualWaterSaving,
    annualCostSaving
  };
}