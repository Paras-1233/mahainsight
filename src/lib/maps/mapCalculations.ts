import { LiveRainfallRecord } from "@/lib/rainfallLive";
import {
  LiveMapDistrict,
  LiveMapSummary,
  MapRiskLevel,
} from "@/lib/maps/mapTypes";

function getRiskLevel(score: number): MapRiskLevel {
  if (score >= 70) {
    return "High Risk";
  }

  if (score >= 38) {
    return "Moderate Risk";
  }

  return "Low Risk";
}

function getRiskColor(level: MapRiskLevel) {
  if (level === "High Risk") {
    return "#f43f5e";
  }

  if (level === "Moderate Risk") {
    return "#f59e0b";
  }

  return "#22c55e";
}

function calculateRiskScore(record: LiveRainfallRecord) {
  const rainfallScore = Math.min(35, record.todayRainfall * 2.5);
  const currentRainScore = record.currentRainfall > 0 ? 12 : 0;
  const probabilityScore = Math.min(25, record.probability * 0.25);
  const temperatureScore =
    record.temperature !== null && record.temperature >= 38
      ? 16
      : record.temperature !== null && record.temperature >= 34
        ? 8
        : 0;
  const humidityScore =
    record.humidity !== null && record.humidity >= 85
      ? 12
      : record.humidity !== null && record.humidity >= 75
        ? 6
        : 0;

  return Math.round(
    rainfallScore + currentRainScore + probabilityScore + temperatureScore + humidityScore
  );
}

export function buildLiveMapDistricts(records: LiveRainfallRecord[]): LiveMapDistrict[] {
  return records.map((record) => {
    const riskScore = calculateRiskScore(record);
    const riskLevel = getRiskLevel(riskScore);

    return {
      district: record.district,
      latitude: record.latitude,
      longitude: record.longitude,
      todayRainfall: record.todayRainfall,
      currentRainfall: record.currentRainfall,
      probability: record.probability,
      temperature: record.temperature,
      humidity: record.humidity,
      windSpeed: record.windSpeed,
      weatherCode: record.weatherCode,
      riskScore,
      riskLevel,
      riskColor: getRiskColor(riskLevel),
      timestamp: record.timestamp,
    };
  });
}

export function deriveMapSummary(districts: LiveMapDistrict[]): LiveMapSummary {
  const temperatures = districts
    .map((district) => district.temperature)
    .filter((value): value is number => value !== null);
  const humidities = districts
    .map((district) => district.humidity)
    .filter((value): value is number => value !== null);

  return {
    districtCount: districts.length,
    activeRainDistricts: districts.filter(
      (district) => district.currentRainfall > 0 || district.todayRainfall > 0
    ).length,
    highRiskDistricts: districts.filter((district) => district.riskLevel === "High Risk").length,
    averageTemperature:
      temperatures.length > 0
        ? Number((temperatures.reduce((sum, value) => sum + value, 0) / temperatures.length).toFixed(1))
        : null,
    averageHumidity:
      humidities.length > 0
        ? Number((humidities.reduce((sum, value) => sum + value, 0) / humidities.length).toFixed(1))
        : null,
  };
}
