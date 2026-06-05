interface DashboardInsightInput {
  rainfall: number;
  temperature: number;
}

export function generateDashboardInsights({
  rainfall,
  temperature,
}: DashboardInsightInput) {

  return {
    floodRisk:
      rainfall > 2500
        ? "High"
        : "Low",

    heatwaveRisk:
      temperature > 35
        ? "High"
        : "Moderate",

    rainfallTrend:
      rainfall > 1500
        ? "Increasing"
        : "Stable",

    recommendedCrop:
      rainfall > 2000
        ? "Rice"
        : "Jowar",
  };
}