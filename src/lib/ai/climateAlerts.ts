interface ClimateAlertInput {
  temperature: number;
  rainfall: number;
  humidity: number;
}

export function generateClimateAlerts({
  temperature,
  rainfall,
  humidity,
}: ClimateAlertInput) {

  const alerts: string[] = [];

  if (temperature > 35) {
    alerts.push(
      "⚠️ Heatwave conditions expected"
    );
  }

  if (rainfall > 2500) {
    alerts.push(
      "🌧️ Heavy rainfall / flood risk"
    );
  }

  if (humidity > 80) {
    alerts.push(
      "💧 High humidity may affect crops"
    );
  }

  if (alerts.length === 0) {
    alerts.push(
      "✅ Climate conditions stable"
    );
  }

  return alerts;
}