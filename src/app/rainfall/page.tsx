import { predictRainfall } from "@/lib/ai/rainfallPrediction";
import {
  getHistoricalRainfallChartData,
  getLatestAnnualRainfallByDistrict,
  getRainfallHistory,
  getRainfallSnapshotGrowth,
} from "@/services/rainfallService";
import { rainfallData } from "@/data/rainfall";
import { districts } from "@/data/districts";
import RainfallRealtimeContent from "@/components/rainfall/RainfallRealtimeContent";
import { historicalRainfallData } from "@/data/historicalRainfall";

interface RainfallPageProps {
  searchParams: Promise<{
    district?: string;
    range?: string;
  }>;
}

type RainfallRange = "30d" | "90d" | "1y" | "all";

function parseRange(value?: string): RainfallRange {
  return value === "90d" || value === "1y" || value === "all" ? value : "30d";
}

export default async function RainfallPage({ searchParams }: RainfallPageProps) {
  const params = await searchParams;
  const district = params.district ?? "all";
  const range = parseRange(params.range);

  let rainfallHistoryData: { rainfall: number }[] = [];
  let historicalChartData: { year: string; rainfall: number }[] = [];
  let latestAnnualRainfallData: { district: string; rainfall: number }[] = [];
  let snapshotGrowth: string | null = null;

  try {
    [
      rainfallHistoryData,
      historicalChartData,
      latestAnnualRainfallData,
      snapshotGrowth,
    ] = await Promise.all([
      getRainfallHistory(district),
      getHistoricalRainfallChartData(district, range),
      getLatestAnnualRainfallByDistrict(),
      getRainfallSnapshotGrowth(),
    ]);
  } catch (err) {
    console.error("Failed to load rainfall history", err);
  }

  const rainfallHistory = rainfallHistoryData.map((item) => item.rainfall);
  const historicalAverageRainfall =
    rainfallHistory.length > 0
      ? rainfallHistory.reduce((sum, rainfall) => sum + rainfall, 0) /
        rainfallHistory.length
      : 0;
  const prediction =
    rainfallHistory.length > 0
      ? predictRainfall({ historicalRainfall: rainfallHistory })
      : {
          predictedRainfall: 0,
          insight:
            "Historical rainfall data unavailable. Predictions will be generated once sufficient data is collected.",
        };

  const latestRainfall = rainfallHistory.at(-1) ?? 0;
  const previousRainfall = rainfallHistory.at(-13) ?? rainfallHistory.at(-2) ?? 0;
  const historicalGrowth =
    previousRainfall > 0
      ? (((latestRainfall - previousRainfall) / previousRainfall) * 100).toFixed(1)
      : null;
  const rainfallGrowth = snapshotGrowth ?? historicalGrowth;
  const margin = Math.round(prediction.predictedRainfall * 0.08);
  const rangeLabel =
    range === "30d"
      ? "Last 30 Days"
      : range === "90d"
        ? "Last 90 Days"
        : range === "1y"
          ? "Latest Year"
          : "All Time";
  const historyLabel =
    range === "30d"
      ? "30 Days"
      : range === "90d"
        ? "90 Days"
        : range === "1y"
          ? "Latest Year"
          : "All Years";
  const fallbackHistoricalData =
    range === "30d" || range === "90d" ? [] : historicalRainfallData;

  return (
    <RainfallRealtimeContent
      district={district}
      range={range}
      rangeLabel={rangeLabel}
      districts={districts.map((item) => item.name)}
      initialRainfallData={
        latestAnnualRainfallData.length > 0 ? latestAnnualRainfallData : rainfallData
      }
      historicalRainfallData={
        historicalChartData.length > 0 ? historicalChartData : fallbackHistoricalData
      }
      predictedRainfall={prediction.predictedRainfall}
      predictionInsight={prediction.insight}
      margin={margin}
      rainfallGrowth={rainfallGrowth}
      historyLabel={historyLabel}
      historicalAverageRainfall={historicalAverageRainfall}
    />
  );
}
