import { demographicsData } from "@/data/demographics";
import { LiveRainfallRecord } from "@/lib/rainfallLive";
import {
  DemographicSummary,
  LiveDemographicRecord,
} from "@/lib/demographics/demographicTypes";

function getExposureLabel(score: number): LiveDemographicRecord["exposureLabel"] {
  if (score >= 72) {
    return "High";
  }

  if (score >= 42) {
    return "Moderate";
  }

  return "Low";
}

function calculateExposureScore({
  todayRainfall,
  rainProbability,
  populationDensity,
  urbanizationRate,
  humidity,
}: {
  todayRainfall: number;
  rainProbability: number;
  populationDensity: number;
  urbanizationRate: number;
  humidity: number | null;
}) {
  const rainfallScore = Math.min(35, todayRainfall * 2.4);
  const probabilityScore = Math.min(25, rainProbability * 0.25);
  const densityScore = Math.min(25, populationDensity / 400);
  const urbanScore = Math.min(10, urbanizationRate / 10);
  const humidityScore = humidity !== null && humidity >= 80 ? 5 : 0;

  return Math.round(rainfallScore + probabilityScore + densityScore + urbanScore + humidityScore);
}

export function buildLiveDemographics(
  rainfallRecords: LiveRainfallRecord[]
): LiveDemographicRecord[] {
  const rainfallByDistrict = new Map(
    rainfallRecords.map((record) => [record.district, record])
  );

  return demographicsData.map((profile) => {
    const rainfall = rainfallByDistrict.get(profile.district);
    const todayRainfall = rainfall?.todayRainfall ?? 0;
    const rainProbability = rainfall?.probability ?? 0;
    const exposureScore = calculateExposureScore({
      todayRainfall,
      rainProbability,
      populationDensity: profile.populationDensity,
      urbanizationRate: profile.urbanizationRate,
      humidity: rainfall?.humidity ?? null,
    });

    return {
      ...profile,
      currentRainfall: rainfall?.currentRainfall ?? 0,
      todayRainfall,
      rainProbability,
      temperature: rainfall?.temperature ?? null,
      humidity: rainfall?.humidity ?? null,
      exposureScore,
      exposureLabel: getExposureLabel(exposureScore),
      timestamp: rainfall?.timestamp ?? null,
    };
  });
}

export function deriveDemographicSummary(
  records: LiveDemographicRecord[]
): DemographicSummary {
  const totalPopulation = records.reduce((sum, record) => sum + record.population, 0);
  const totalLiteracy = records.reduce((sum, record) => sum + record.literacyRate, 0);
  const urbanPopulation = records.reduce(
    (sum, record) => sum + record.population * (record.urbanizationRate / 100),
    0
  );

  return {
    districtCount: records.length,
    totalPopulation,
    averageLiteracy:
      records.length > 0 ? Number((totalLiteracy / records.length).toFixed(1)) : 0,
    urbanPopulationShare:
      totalPopulation > 0 ? Number(((urbanPopulation / totalPopulation) * 100).toFixed(1)) : 0,
    highExposureDistricts: records.filter((record) => record.exposureLabel === "High").length,
  };
}
