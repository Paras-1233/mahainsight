import DashboardLayout from "@/components/layout/DashboardLayout";
import MapClient from "@/components/maps/MapClient";
import { districts } from "@/data/districts";
import { districtAnalytics } from "@/data/districtAnalytics";
import { fetchOpenMeteoRainfall } from "@/lib/rainfallLive";
import {
  buildLiveMapDistricts,
  deriveMapSummary,
} from "@/lib/maps/mapCalculations";
import type { LiveMapDistrict, LiveMapResponse, MapRiskLevel } from "@/lib/maps/mapTypes";

export const dynamic = "force-dynamic";

function parseMetric(value: string | undefined) {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) ? parsed : 0;
}

function getFallbackRisk(score: number): { level: MapRiskLevel; color: string } {
  if (score >= 70) {
    return { level: "High Risk", color: "#f43f5e" };
  }

  if (score >= 38) {
    return { level: "Moderate Risk", color: "#f59e0b" };
  }

  return { level: "Low Risk", color: "#22c55e" };
}

function buildFallbackMapData(): LiveMapResponse {
  const timestamp = new Date().toISOString();
  const mapDistricts: LiveMapDistrict[] = districts.map((district) => {
    const analytics = districtAnalytics[district.name as keyof typeof districtAnalytics];
    const rainfall = parseMetric(analytics?.rainfall);
    const temperature = parseMetric(analytics?.temperature);
    const probability = Math.min(96, Math.max(12, Math.round(rainfall / 35)));
    const riskScore = Math.min(
      100,
      Math.round(rainfall / 55 + probability * 0.35 + (temperature >= 34 ? 12 : 0))
    );
    const risk = getFallbackRisk(riskScore);

    return {
      district: district.name,
      latitude: district.latitude,
      longitude: district.longitude,
      todayRainfall: Number((rainfall / 30).toFixed(1)),
      currentRainfall: 0,
      probability,
      temperature: temperature || null,
      humidity: null,
      windSpeed: null,
      weatherCode: null,
      riskScore,
      riskLevel: risk.level,
      riskColor: risk.color,
      timestamp,
    };
  });

  return {
    districts: mapDistricts,
    summary: deriveMapSummary(mapDistricts),
    timestamp,
    source: "Open-Meteo",
  };
}

async function getInitialMapData(): Promise<LiveMapResponse> {
  try {
    const records = await fetchOpenMeteoRainfall();
    const mapDistricts = buildLiveMapDistricts(records);

    return {
      districts: mapDistricts,
      summary: deriveMapSummary(mapDistricts),
      timestamp: new Date().toISOString(),
      source: "Open-Meteo",
    };
  } catch (error) {
    console.error("Failed to load live map data", error);
    return buildFallbackMapData();
  }
}

export default async function MapsPage() {
  const initialData = await getInitialMapData();

  return (
    <DashboardLayout>
      <MapClient initialData={initialData} />
    </DashboardLayout>
  );
}
