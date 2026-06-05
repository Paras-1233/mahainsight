export interface LiveDemographicRecord {
  district: string;
  region: string;
  population: number;
  literacyRate: number;
  workforce: string;
  urbanizationRate: number;
  populationDensity: number;
  currentRainfall: number;
  todayRainfall: number;
  rainProbability: number;
  temperature: number | null;
  humidity: number | null;
  exposureScore: number;
  exposureLabel: "Low" | "Moderate" | "High";
  timestamp: string | null;
}

export interface DemographicSummary {
  districtCount: number;
  totalPopulation: number;
  averageLiteracy: number;
  urbanPopulationShare: number;
  highExposureDistricts: number;
}

export interface LiveDemographicResponse {
  records: LiveDemographicRecord[];
  summary: DemographicSummary;
  timestamp: string;
  source: "Open-Meteo" | "Static Baseline";
}
