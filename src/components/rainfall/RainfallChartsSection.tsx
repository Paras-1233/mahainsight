"use client";

import HistoricalRainfallChart from "@/components/charts/HistoricalRainfallChart";
import RainfallChart from "@/components/charts/RainfallChart";
import { RainfallChartPoint } from "@/lib/rainfall/rainfallTypes";

interface RainfallChartsSectionProps {
  liveChartData?: RainfallChartPoint[];
  historicalRainfallData: {
    year: string;
    rainfall: number;
  }[];
  historyLabel: string;
}

export default function RainfallChartsSection({
  liveChartData,
  historicalRainfallData,
  historyLabel,
}: RainfallChartsSectionProps) {
  return (
    <>
      <RainfallChart data={liveChartData} isLive={Boolean(liveChartData?.length)} />
      <HistoricalRainfallChart data={historicalRainfallData} label={historyLabel} />
    </>
  );
}
