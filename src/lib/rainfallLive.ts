import { districts } from "@/data/districts";

export interface RainfallHourlyPoint {
  time: string;
  rainfall: number;
  probability: number;
}

export interface LiveRainfallRecord {
  district: string;
  latitude: number;
  longitude: number;
  rainfall: number;
  todayRainfall: number;
  currentRainfall: number;
  precipitationHours: number;
  probability: number;
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  weatherCode: number | null;
  apparentTemperature: number | null;
  pressure: number | null;
  cloudCover: number | null;
  hourly: RainfallHourlyPoint[];
  timestamp: string;
  source: "Open-Meteo";
}

interface OpenMeteoDaily {
  precipitation_sum?: number[];
  rain_sum?: number[];
  precipitation_hours?: number[];
}

interface OpenMeteoCurrent {
  time?: string;
  precipitation?: number;
  rain?: number;
  showers?: number;
  weather_code?: number;
  temperature_2m?: number;
  relative_humidity_2m?: number;
  wind_speed_10m?: number;
  apparent_temperature?: number;
  pressure_msl?: number;
  cloud_cover?: number;
}

interface OpenMeteoHourly {
  time?: string[];
  precipitation?: number[];
  rain?: number[];
  precipitation_probability?: number[];
}

interface OpenMeteoResponse {
  current?: OpenMeteoCurrent;
  daily?: OpenMeteoDaily;
  hourly?: OpenMeteoHourly;
}

const LIVE_RAINFALL_CACHE_MS = 60 * 1000;

let cachedRainfall:
  | {
      data: LiveRainfallRecord[];
      expiresAt: number;
    }
  | null = null;
let pendingRainfallRequest: Promise<LiveRainfallRecord[]> | null = null;

function toNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toNullableNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

async function fetchOpenMeteoRainfallUncached(): Promise<LiveRainfallRecord[]> {
  const latitude = districts.map((district) => district.latitude).join(",");
  const longitude = districts.map((district) => district.longitude).join(",");

  const params = new URLSearchParams({
    latitude,
    longitude,
    current:
      "precipitation,rain,showers,weather_code,temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,pressure_msl,cloud_cover",
    hourly: "precipitation,rain,precipitation_probability",
    daily: "precipitation_sum,rain_sum,precipitation_hours",
    forecast_days: "1",
    timezone: "auto",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    {
      cache: "no-store",
      next: { revalidate: 0 },
    }
  );

  if (!response.ok) {
    throw new Error(`Open-Meteo rainfall request failed with ${response.status}`);
  }

  const payload = (await response.json()) as OpenMeteoResponse | OpenMeteoResponse[];
  const locations = Array.isArray(payload) ? payload : [payload];
  const timestamp = new Date().toISOString();

  return districts.map((district, index) => {
    const weather = locations[index] ?? {};
    const current = weather.current ?? {};
    const daily = weather.daily ?? {};
    const hourly = weather.hourly ?? {};
    const currentLiquidRain = toNumber(current.rain) + toNumber(current.showers);
    const currentRainfall =
      currentLiquidRain > 0 ? currentLiquidRain : toNumber(current.precipitation);
    const todayRainfall =
      toNumber(daily.rain_sum?.[0], toNumber(daily.precipitation_sum?.[0]));

    return {
      district: district.name,
      latitude: district.latitude,
      longitude: district.longitude,
      rainfall: Number(todayRainfall.toFixed(1)),
      todayRainfall: Number(todayRainfall.toFixed(1)),
      currentRainfall: Number(currentRainfall.toFixed(1)),
      precipitationHours: toNumber(daily.precipitation_hours?.[0]),
      probability: toNumber(hourly.precipitation_probability?.[0]),
      temperature: toNullableNumber(current.temperature_2m),
      humidity: toNullableNumber(current.relative_humidity_2m),
      windSpeed: toNullableNumber(current.wind_speed_10m),
      weatherCode: current.weather_code ?? null,
      apparentTemperature: toNullableNumber(current.apparent_temperature),
      pressure: toNullableNumber(current.pressure_msl),
      cloudCover: toNullableNumber(current.cloud_cover),
      hourly: (hourly.time ?? []).slice(0, 24).map((time, hourIndex) => ({
        time,
        rainfall: Number(
          toNumber(
            hourly.rain?.[hourIndex],
            toNumber(hourly.precipitation?.[hourIndex])
          ).toFixed(1)
        ),
        probability: toNumber(hourly.precipitation_probability?.[hourIndex]),
      })),
      timestamp: current.time ?? timestamp,
      source: "Open-Meteo",
    };
  });
}

export async function fetchOpenMeteoRainfall(): Promise<LiveRainfallRecord[]> {
  const now = Date.now();

  if (cachedRainfall && cachedRainfall.expiresAt > now) {
    return cachedRainfall.data;
  }

  if (pendingRainfallRequest) {
    return pendingRainfallRequest;
  }

  pendingRainfallRequest = fetchOpenMeteoRainfallUncached()
    .then((data) => {
      cachedRainfall = {
        data,
        expiresAt: Date.now() + LIVE_RAINFALL_CACHE_MS,
      };

      return data;
    })
    .finally(() => {
      pendingRainfallRequest = null;
    });

  return pendingRainfallRequest;
}
