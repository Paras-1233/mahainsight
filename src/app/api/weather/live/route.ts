import { NextResponse } from "next/server";
import {
  getPagination,
  paginateArray,
  paginationHeaders,
  rateLimitRequest,
} from "@/lib/api";
import { fetchOpenMeteoRainfall } from "@/lib/rainfallLive";
import { getLatestRainfallSnapshots } from "@/services/rainfallService";

type WeatherRecord = {
  district: string;
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  weatherCode?: number | null;
  apparentTemperature?: number | null;
  pressure?: number | null;
  cloudCover?: number | null;
  timestamp: string;
  source: string;
};

function toWeatherResponse(records: WeatherRecord[]) {
  return records.map((record) => ({
    district: record.district,
    temperature: record.temperature ?? 0,
    humidity: record.humidity ?? 0,
    windSpeed: record.windSpeed ?? 0,
    weatherCode: record.weatherCode ?? 0,
    apparentTemperature: record.apparentTemperature ?? null,
    pressure: record.pressure ?? null,
    cloudCover: record.cloudCover ?? null,
    timestamp: record.timestamp,
    source: record.source,
  }));
}

export async function GET(request: Request) {
  const rateLimitError = await rateLimitRequest({
    request,
    bucket: "weather-live",
    limit: 60,
    windowMs: 60 * 1000,
  });

  if (rateLimitError) {
    return rateLimitError;
  }

  const pagination = getPagination(request, {
    defaultPageSize: 50,
    maxPageSize: 100,
  });

  try {
    const liveData = await fetchOpenMeteoRainfall();
    const records = paginateArray(toWeatherResponse(liveData), pagination);

    return NextResponse.json(records, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
        ...paginationHeaders(liveData.length, pagination),
      },
    });
  } catch (error) {
    console.error("Failed to fetch live weather data", error);

    const fallbackData = await getLatestRainfallSnapshots();
    const records = paginateArray(toWeatherResponse(fallbackData), pagination);

    return NextResponse.json(records, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
        ...paginationHeaders(fallbackData.length, pagination),
      },
    });
  }
}
