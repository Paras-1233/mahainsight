import { districts } from "@/data/districts";

export interface HistoricalRainfallRecord {
  district: string;
  latitude: number;
  longitude: number;
  year: number;
  rainfall: number;
  source: "Open-Meteo Archive";
}

interface OpenMeteoArchiveDaily {
  time?: string[];
  precipitation_sum?: number[];
}

interface OpenMeteoArchiveResponse {
  daily?: OpenMeteoArchiveDaily;
}

function toNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function parseYear(value: string) {
  return Number(value.slice(0, 4));
}

export async function fetchOpenMeteoHistoricalRainfall(
  startYear: number,
  endYear: number
): Promise<HistoricalRainfallRecord[]> {
  const latitude = districts.map((district) => district.latitude).join(",");
  const longitude = districts.map((district) => district.longitude).join(",");
  const startDate = `${startYear}-01-01`;
  const endDate = `${endYear}-12-31`;

  const params = new URLSearchParams({
    latitude,
    longitude,
    start_date: startDate,
    end_date: endDate,
    daily: "precipitation_sum",
    timezone: "auto",
  });

  const response = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`,
    {
      cache: "no-store",
      next: { revalidate: 0 },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Open-Meteo historical rainfall request failed with ${response.status}`
    );
  }

  const payload = (await response.json()) as
    | OpenMeteoArchiveResponse
    | OpenMeteoArchiveResponse[];
  const locations = Array.isArray(payload) ? payload : [payload];

  return districts.flatMap((district, index) => {
    const daily = locations[index]?.daily ?? {};
    const yearlyTotals = new Map<number, number>();

    daily.time?.forEach((date, dateIndex) => {
      const year = parseYear(date);

      if (year < startYear || year > endYear) {
        return;
      }

      yearlyTotals.set(
        year,
        toNumber(yearlyTotals.get(year)) +
          toNumber(daily.precipitation_sum?.[dateIndex])
      );
    });

    return Array.from(yearlyTotals.entries()).map(([year, rainfall]) => ({
      district: district.name,
      latitude: district.latitude,
      longitude: district.longitude,
      year,
      rainfall: Number(rainfall.toFixed(1)),
      source: "Open-Meteo Archive" as const,
    }));
  });
}
