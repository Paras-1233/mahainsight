"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import SectionCard from "@/components/shared/SectionCard";
import RainfallInsights from "@/components/rainfall/RainFallInsights";
import RainfallStats from "@/components/rainfall/RainfallStats";
import RainfallPrediction from "@/components/rainfall/RainfallPrediction";
import RainfallRankings from "@/components/rainfall/RainfallRankings";
import RainfallTrendAnalysis from "@/components/rainfall/RainfallTrendAnalysis";
import RainfallChartsSection from "@/components/rainfall/RainfallChartsSection";
import RainfallHeader from "@/components/rainfall/RainfallHeader";
import RainfallSourceStatus from "@/components/rainfall/RainfallSourceStatus";
import { useLiveRainfallData } from "@/hooks/useLiveRainfallData";
import {
  buildLiveChartData,
  deriveRainfallStats,
} from "@/lib/rainfall/rainfallCalculations";
import { DistrictRainfall } from "@/lib/rainfall/rainfallTypes";

interface RainfallRealtimeContentProps {
  district: string;
  range: string;
  rangeLabel: string;
  districts: string[];
  initialRainfallData: DistrictRainfall[];
  historicalRainfallData: {
    year: string;
    rainfall: number;
  }[];
  predictedRainfall: number;
  predictionInsight: string;
  margin: number;
  rainfallGrowth: string | null;
  historyLabel: string;
  historicalAverageRainfall: number;
}

function hasPositiveRainfall(data: DistrictRainfall[]) {
  return data.some((item) => {
    const value = item.todayRainfall ?? item.rainfall;

    return Number.isFinite(value) && value > 0;
  });
}

function applyAnnualBaseline(
  liveData: DistrictRainfall[],
  annualData: DistrictRainfall[]
) {
  if (hasPositiveRainfall(liveData)) {
    return liveData;
  }

  const annualRainfallByDistrict = new Map(
    annualData.map((item) => [item.district, item.rainfall])
  );

  return liveData.map((item) => ({
    ...item,
    rainfall: annualRainfallByDistrict.get(item.district) ?? item.rainfall,
  }));
}

export default function RainfallRealtimeContent({
  district,
  range,
  rangeLabel,
  districts,
  initialRainfallData,
  historicalRainfallData,
  predictedRainfall,
  predictionInsight,
  margin,
  rainfallGrowth,
  historyLabel,
  historicalAverageRainfall,
}: RainfallRealtimeContentProps) {
  const { data: liveData, isLoading, error } = useLiveRainfallData(true);
  const hasLiveData = Boolean(liveData?.length);
  const liveRainfallData: DistrictRainfall[] = liveData ?? [];
  const isUsingAnnualBaseline = hasLiveData && !hasPositiveRainfall(liveRainfallData);
  const sourceData: DistrictRainfall[] = hasLiveData
    ? applyAnnualBaseline(liveRainfallData, initialRainfallData)
    : initialRainfallData;
  const {
    filteredData,
    rankedDistricts,
    wettestDistrict,
    driestDistrict,
    averageRainfall,
    rainfallSpread,
  } = deriveRainfallStats(sourceData, district);
  const delta =
    historicalAverageRainfall > 0
      ? (((predictedRainfall - historicalAverageRainfall) / historicalAverageRainfall) * 100).toFixed(1)
      : "0";
  const chartData = hasLiveData ? buildLiveChartData(filteredData) : undefined;
  const lastUpdate = liveData?.[0]?.timestamp ? new Date(liveData[0].timestamp) : null;
  const isConnected = hasLiveData && !error;

  return (
    <DashboardLayout>
      <div className="space-y-8 text-white">
        <RainfallHeader
          district={district}
          range={range}
          rangeLabel={rangeLabel}
          districts={districts}
          isConnected={isConnected}
          lastUpdate={lastUpdate}
        />

        <RainfallSourceStatus
          hasLiveData={hasLiveData}
          isConnected={isConnected}
          isUsingAnnualBaseline={isUsingAnnualBaseline}
          sourceCount={sourceData.length}
          totalDistricts={districts.length}
          error={isLoading ? "Loading latest data" : error}
        />

        {filteredData.length > 0 ? (
          <RainfallStats
            averageRainfall={averageRainfall}
            districtCount={filteredData.length}
            totalDistricts={districts.length}
            wettestDistrict={wettestDistrict}
            rainfallGrowth={rainfallGrowth}
          />
        ) : (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6 text-center">
            <p className="text-yellow-200">No data available for selected district</p>
          </div>
        )}

        <RainfallChartsSection
          liveChartData={chartData}
          historicalRainfallData={historicalRainfallData}
          historyLabel={historyLabel}
        />

        <RainfallPrediction
          predictedRainfall={predictedRainfall}
          insight={predictionInsight}
          confidence={isConnected ? 82 : 0}
          margin={margin}
          delta={delta}
          averageRainfall={historicalAverageRainfall}
        />

        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RainfallRankings districts={rankedDistricts} />
            </div>
            <RainfallInsights
              wettestDistrict={wettestDistrict}
              driestDistrict={driestDistrict}
              rainfallGrowth={rainfallGrowth}
              rainfallSpread={rainfallSpread}
              averageRainfall={averageRainfall}
            />
          </div>
        ) : (
          <SectionCard title="District Rankings">
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400">Select a different district to view rankings</p>
            </div>
          </SectionCard>
        )}

        <RainfallTrendAnalysis
          wettestDistrict={wettestDistrict}
          rainfallSpread={rainfallSpread}
          rainfallGrowth={rainfallGrowth}
        />
      </div>
    </DashboardLayout>
  );
}
