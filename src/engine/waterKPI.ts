export interface WaterInput {
  freshwater: number;
  recycled: number;
  rainwater: number;
  production: number;
  discharge: number;
}

export function calculateWaterKPI(data: WaterInput) {

  const totalInput =
    data.freshwater +
    data.recycled +
    data.rainwater;

  const reuse =
    totalInput === 0
      ? 0
      : (data.recycled / totalInput) * 100;

  const waterIntensity =
    data.production === 0
      ? 0
      : totalInput / data.production;

  const recovery =
    totalInput === 0
      ? 0
      : ((totalInput - data.discharge) / totalInput) * 100;

  return {
    totalInput,
    reuse,
    waterIntensity,
    recovery
  };
}