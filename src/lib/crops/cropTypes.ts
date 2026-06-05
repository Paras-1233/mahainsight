export interface CropDistrict {
  name: string;
}

export interface CropRecord {
  id: number;
  name: string;
  season: string;
  rainfallType: string;
  district: CropDistrict;
}

export interface LiveCropRecord extends CropRecord {
  currentRainfall: number;
  todayRainfall: number;
  probability: number;
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  suitabilityScore: number;
  suitabilityLabel: string;
  timestamp: string | null;
}

export interface LiveCropSummary {
  totalCrops: number;
  kharifCount: number;
  highRainfallCrops: number;
  activeRainDistricts: number;
  averageSuitability: number;
  recommendationCount: number;
}

export interface LiveCropResponse {
  crops: LiveCropRecord[];
  recommendations: string[];
  summary: LiveCropSummary;
  timestamp: string;
  source: "Open-Meteo" | "Database";
}
