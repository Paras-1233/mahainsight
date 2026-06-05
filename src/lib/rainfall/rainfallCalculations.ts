import {
  DistrictRainfall,
  RainfallChartPoint,
  RainfallDerivedStats,
} from "@/lib/rainfall/rainfallTypes";

export function formatRainfallTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildLiveChartData(data: DistrictRainfall[]): RainfallChartPoint[] {
  const buckets = new Map<string, { rainfall: number; probability: number; count: number }>();

  data.forEach((district) => {
    district.hourly?.forEach((point) => {
      if (!point.time) {
        return;
      }

      const bucket = buckets.get(point.time) ?? {
        rainfall: 0,
        probability: 0,
        count: 0,
      };

      bucket.rainfall += point.rainfall;
      bucket.probability += point.probability ?? 0;
      bucket.count += 1;
      buckets.set(point.time, bucket);
    });
  });

  return Array.from(buckets.entries()).map(([time, bucket]) => ({
    time: formatRainfallTime(time),
    rainfall: Number((bucket.rainfall / bucket.count).toFixed(1)),
    probability: Math.round(bucket.probability / bucket.count),
  }));
}

export function deriveRainfallStats(
  data: DistrictRainfall[],
  district: string
): RainfallDerivedStats {
  const filteredData =
    district === "all" ? data : data.filter((item) => item.district === district);
  const rankedDistricts = [...filteredData].sort((a, b) => b.rainfall - a.rainfall);
  const wettestDistrict = rankedDistricts[0] ?? null;
  const driestDistrict = rankedDistricts[rankedDistricts.length - 1] ?? null;
  const averageRainfall =
    filteredData.length > 0
      ? filteredData.reduce((sum, item) => sum + item.rainfall, 0) / filteredData.length
      : 0;
  const highestRainfall =
    filteredData.length > 0 ? Math.max(...filteredData.map((item) => item.rainfall)) : 0;
  const lowestRainfall =
    filteredData.length > 0 ? Math.min(...filteredData.map((item) => item.rainfall)) : 0;

  return {
    filteredData,
    rankedDistricts,
    wettestDistrict,
    driestDistrict,
    averageRainfall,
    rainfallSpread: Number((highestRainfall - lowestRainfall).toFixed(1)),
  };
}
