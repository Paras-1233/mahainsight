export type MapRiskLevel = "Low Risk" | "Moderate Risk" | "High Risk";

export interface LiveMapDistrict {
  district: string;
  latitude: number;
  longitude: number;
  todayRainfall: number;
  currentRainfall: number;
  probability: number;
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  weatherCode: number | null;
  riskScore: number;
  riskLevel: MapRiskLevel;
  riskColor: string;
  timestamp: string;
}

export interface LiveMapSummary {
  districtCount: number;
  activeRainDistricts: number;
  highRiskDistricts: number;
  averageTemperature: number | null;
  averageHumidity: number | null;
}

export interface LiveMapResponse {
  districts: LiveMapDistrict[];
  summary: LiveMapSummary;
  timestamp: string;
  source: "Open-Meteo";
}
