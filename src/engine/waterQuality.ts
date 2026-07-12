export interface WaterQualityInput {
  pH: number;
  conductivity: number;
  tds: number;
  hardness: number;
  alkalinity: number;
  silica: number;
  chloride: number;
  iron: number;
}

export interface WaterQualityResult {
  status: string;
  warnings: string[];
  score: number;
}

export function evaluateWaterQuality(
  input: WaterQualityInput
): WaterQualityResult {

  const warnings: string[] = [];
  let score = 100;

  if (input.pH < 6.5 || input.pH > 8.5) {
    warnings.push("pH outside recommended range");
    score -= 10;
  }

  if (input.conductivity > 3000) {
    warnings.push("High conductivity");
    score -= 10;
  }

  if (input.tds > 2000) {
    warnings.push("High TDS");
    score -= 10;
  }

  if (input.hardness > 500) {
    warnings.push("High hardness");
    score -= 10;
  }

  if (input.silica > 150) {
    warnings.push("High silica scaling risk");
    score -= 20;
  }

  if (input.chloride > 500) {
    warnings.push("High chloride corrosion risk");
    score -= 20;
  }

  if (input.iron > 1) {
    warnings.push("High iron concentration");
    score -= 10;
  }

  return {
    status: score >= 80 ? "Good" : score >= 60 ? "Warning" : "Critical",
    warnings,
    score
  };
}