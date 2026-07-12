export interface WaterBalanceInput {
  freshwater: number;
  recycledWater: number;
  rainwater: number;
  production: number;
  evaporationLoss: number;
  blowdownLoss: number;
  processLoss: number;
  domesticUse: number;
  discharge: number;
}

export interface WaterBalanceResult {
  totalInput: number;
  totalOutput: number;
  waterLoss: number;
  balanceError: number;
  reusePercentage: number;
  waterIntensity: number;
  balanceStatus: string;
}

export function calculateWaterBalance(
  input: WaterBalanceInput
): WaterBalanceResult {

  const totalInput =
    input.freshwater +
    input.recycledWater +
    input.rainwater;

  const totalOutput =
    input.evaporationLoss +
    input.blowdownLoss +
    input.processLoss +
    input.domesticUse +
    input.discharge;

  const waterLoss = totalInput - totalOutput;

  const balanceError = Math.abs(waterLoss);

  const reusePercentage =
    totalInput === 0
      ? 0
      : (input.recycledWater / totalInput) * 100;

  const waterIntensity =
    input.production === 0
      ? 0
      : totalInput / input.production;

  let balanceStatus = "Balanced";

  if (balanceError > totalInput * 0.05) {
    balanceStatus = "Unbalanced";
  }

  return {
    totalInput,
    totalOutput,
    waterLoss,
    balanceError,
    reusePercentage,
    waterIntensity,
    balanceStatus
  };
}