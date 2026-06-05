export type ClimateAlertSeverity = "critical" | "warning" | "watch" | "info";
export type ClimateAlertType = "flood" | "heat" | "humidity" | "rainfall" | "stable";

export interface ClimateAlert {
  id: string;
  district: string;
  type: ClimateAlertType;
  severity: ClimateAlertSeverity;
  title: string;
  detail: string;
  metric: string;
  value: number | null;
  threshold: number | null;
  updatedAt: string;
}

export function generateAlerts(data: {
  district: string;
  rainfall: number;
  probability: number;
  temperature: number | null;
  humidity: number | null;
  updatedAt?: string;
}) {
  const alerts: ClimateAlert[] = [];
  const updatedAt = data.updatedAt ?? new Date().toISOString();

  if (data.probability >= 80) {
    alerts.push({
      id: `${data.district}-flood-${updatedAt}`,
      district: data.district,
      type: "flood",
      severity: data.probability >= 90 ? "critical" : "warning",
      title: "Flood risk rising",
      detail: "Precipitation probability is above the district risk threshold.",
      metric: "Rain probability",
      value: data.probability,
      threshold: 80,
      updatedAt,
    });
  }

  if (data.temperature !== null && data.temperature >= 38) {
    alerts.push({
      id: `${data.district}-heat-${updatedAt}`,
      district: data.district,
      type: "heat",
      severity: data.temperature >= 42 ? "critical" : "warning",
      title: "Heat stress warning",
      detail: "Current temperature is above the heat stress threshold.",
      metric: "Temperature",
      value: data.temperature,
      threshold: 38,
      updatedAt,
    });
  }

  if (data.humidity !== null && data.humidity >= 90) {
    alerts.push({
      id: `${data.district}-humidity-${updatedAt}`,
      district: data.district,
      type: "humidity",
      severity: data.humidity >= 95 ? "critical" : "watch",
      title: "Extreme humidity detected",
      detail: "Humidity is high enough to affect comfort and crop disease risk.",
      metric: "Humidity",
      value: data.humidity,
      threshold: 90,
      updatedAt,
    });
  }

  if (data.rainfall >= 100) {
    alerts.push({
      id: `${data.district}-rainfall-${updatedAt}`,
      district: data.district,
      type: "rainfall",
      severity: data.rainfall >= 200 ? "critical" : "watch",
      title: "Heavy rainfall accumulation",
      detail: "Daily rainfall accumulation is elevated for this district.",
      metric: "Today rainfall",
      value: data.rainfall,
      threshold: 100,
      updatedAt,
    });
  }

  return alerts;
}
