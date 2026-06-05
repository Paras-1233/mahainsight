export interface RainfallChartPoint {
  month?: string;
  time?: string;
  year?: string;
  rainfall: number;
  probability?: number;
}

export interface DistrictRainfall {
  district: string;
  rainfall: number;
  timestamp?: string;
  todayRainfall?: number;
  currentRainfall?: number;
  precipitationHours?: number;
  probability?: number;
  hourly?: RainfallChartPoint[];
  source?: string;
}

export interface RainfallDerivedStats {
  filteredData: DistrictRainfall[];
  rankedDistricts: DistrictRainfall[];
  wettestDistrict: DistrictRainfall | null;
  driestDistrict: DistrictRainfall | null;
  averageRainfall: number;
  rainfallSpread: number;
}
