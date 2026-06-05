interface PredictionInput {
  historicalRainfall: number[];
}

export function predictRainfall({
  historicalRainfall,
}: PredictionInput) {

  const total =
    historicalRainfall.reduce(
      (sum, value) => sum + value,
      0
    );

  const average =
    total / historicalRainfall.length;

  const predicted =
    Math.round(average * 1.05);

  return {
    predictedRainfall: predicted,

    insight:
      predicted > average
        ? "Expected rainfall increase"
        : "Stable rainfall expected",
  };
}