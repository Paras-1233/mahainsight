import SectionCard from "@/components/shared/SectionCard";

interface WettestDistrict {
  district: string;
  rainfall: number;
}

interface RainfallTrendAnalysisProps {
  wettestDistrict: WettestDistrict | null;
  rainfallSpread: number;
  rainfallGrowth: string | null;
}

function formatRainfall(value: number) {
  const rounded = value > 0 && value < 1 ? Number(value.toFixed(1)) : Math.round(value);

  return `${rounded.toLocaleString()} mm`;
}

export default function RainfallTrendAnalysis({
  wettestDistrict,
  rainfallSpread,
  rainfallGrowth,
}: RainfallTrendAnalysisProps) {
  return (
    <SectionCard title="Climate Trend Analysis">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
          <h3 className="text-lg font-semibold text-white mb-2">
            Highest Rainfall
          </h3>

          <p className="text-slate-300">
            {wettestDistrict?.district ?? "N/A"}
          </p>

          <p className="text-green-400 font-semibold">
            {formatRainfall(wettestDistrict?.rainfall ?? 0)}
          </p>
        </div>

        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5">
          <h3 className="text-lg font-semibold text-white mb-2">
            Rainfall Variation
          </h3>

          <p className="text-slate-300">
            Difference between wettest and driest districts
          </p>

          <p className="text-yellow-400 font-semibold">
            {formatRainfall(rainfallSpread)}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
          <h3 className="text-lg font-semibold text-white mb-2">
            Growth Trend
          </h3>

          <p className="text-slate-300">
            Compared to previous rainfall period
          </p>

          <p className="text-blue-400 font-semibold">
            {rainfallGrowth ?? "N/A"}%
          </p>
        </div>

      </div>
    </SectionCard>
  );
}
