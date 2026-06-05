import { LiveRainfallRecord } from "@/lib/rainfallLive";
import {
  CropRecord,
  LiveCropRecord,
  LiveCropSummary,
} from "@/lib/crops/cropTypes";

function rainfallFitScore(rainfallType: string, todayRainfall: number) {
  if (rainfallType === "High") {
    return todayRainfall >= 10 ? 35 : todayRainfall >= 2 ? 26 : 18;
  }

  if (rainfallType === "Medium") {
    return todayRainfall >= 2 && todayRainfall <= 25 ? 35 : todayRainfall > 25 ? 22 : 24;
  }

  return todayRainfall <= 8 ? 35 : todayRainfall <= 20 ? 24 : 16;
}

function climateFitScore(temperature: number | null, humidity: number | null) {
  const temperatureScore =
    temperature === null ? 18 : temperature >= 18 && temperature <= 34 ? 30 : 18;
  const humidityScore = humidity === null ? 12 : humidity >= 45 && humidity <= 85 ? 20 : 11;

  return temperatureScore + humidityScore;
}

function probabilityScore(probability: number) {
  if (probability >= 70) {
    return 15;
  }

  if (probability >= 35) {
    return 11;
  }

  return 7;
}

export function getSuitabilityLabel(score: number) {
  if (score >= 78) {
    return "Strong";
  }

  if (score >= 58) {
    return "Moderate";
  }

  return "Watch";
}

export function buildLiveCropRecords(
  crops: CropRecord[],
  rainfallRecords: LiveRainfallRecord[]
): LiveCropRecord[] {
  const rainfallByDistrict = new Map(
    rainfallRecords.map((record) => [record.district, record])
  );

  return crops.map((crop) => {
    const rainfall = rainfallByDistrict.get(crop.district.name);
    const todayRainfall = rainfall?.todayRainfall ?? 0;
    const probability = rainfall?.probability ?? 0;
    const suitabilityScore = Math.min(
      100,
      Math.round(
        rainfallFitScore(crop.rainfallType, todayRainfall) +
          climateFitScore(rainfall?.temperature ?? null, rainfall?.humidity ?? null) +
          probabilityScore(probability)
      )
    );

    return {
      ...crop,
      currentRainfall: rainfall?.currentRainfall ?? 0,
      todayRainfall,
      probability,
      temperature: rainfall?.temperature ?? null,
      humidity: rainfall?.humidity ?? null,
      windSpeed: rainfall?.windSpeed ?? null,
      suitabilityScore,
      suitabilityLabel: getSuitabilityLabel(suitabilityScore),
      timestamp: rainfall?.timestamp ?? null,
    };
  });
}

export function getLiveCropRecommendations(crops: LiveCropRecord[]) {
  const rankedCropNames = [...crops]
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
    .map((crop) => crop.name);

  return [...new Set(rankedCropNames)].slice(0, 6);
}

export function deriveCropSummary(
  crops: LiveCropRecord[],
  recommendations: string[]
): LiveCropSummary {
  const totalSuitability = crops.reduce((sum, crop) => sum + crop.suitabilityScore, 0);

  return {
    totalCrops: crops.length,
    kharifCount: crops.filter((crop) => crop.season === "Kharif").length,
    highRainfallCrops: crops.filter((crop) => crop.rainfallType === "High").length,
    activeRainDistricts: new Set(
      crops
        .filter((crop) => crop.currentRainfall > 0 || crop.todayRainfall > 0)
        .map((crop) => crop.district.name)
    ).size,
    averageSuitability:
      crops.length > 0 ? Math.round(totalSuitability / crops.length) : 0,
    recommendationCount: recommendations.length,
  };
}
