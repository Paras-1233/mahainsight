// components/rainfall/RainfallPrediction.tsx
import SectionCard from "@/components/shared/SectionCard";

interface RainfallPredictionProps {
  predictedRainfall: number;
  insight: string;
  confidence: number;
  margin: number;
  delta: string;
  averageRainfall: number;
}

interface PredStatProps {
  label: string;
  value: string;
  color: string;
}

function PredStat({ label, value, color }: PredStatProps) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 px-4 py-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500 mb-1">
        {label}
      </p>
      <p className={`font-mono text-base font-medium ${color}`}>{value}</p>
    </div>
  );
}

export default function RainfallPrediction({
  predictedRainfall,
  insight,
  confidence,
  margin,
  delta,
  averageRainfall,
}: RainfallPredictionProps) {
  const low = (predictedRainfall - margin).toLocaleString();
  const high = (predictedRainfall + margin).toLocaleString();
  const deltaNum = parseFloat(delta);
  const deltaColor = deltaNum >= 0 ? "text-amber-400" : "text-rose-400";
  const deltaStr = (deltaNum >= 0 ? "+" : "") + delta + "%";

  return (
    <SectionCard title="AI Rainfall Prediction">
      <div className="relative overflow-hidden rounded-2xl border border-sky-400/20 bg-sky-400/5 p-6">
        {/* Decorative radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full
            bg-sky-400/[0.06]"
        />

        {/* Main figure */}
        <div className="mb-1">
          <span className="text-5xl font-extrabold tracking-tight text-sky-400 leading-none">
            {predictedRainfall.toLocaleString()}
          </span>
          <span className="ml-2 font-mono text-sm text-slate-400">mm predicted</span>
        </div>

        <p className="mb-5 text-sm text-slate-400 leading-relaxed max-w-xl">{insight}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <PredStat label="Confidence" value={`${confidence}%`} color="text-emerald-400" />
          <PredStat label="Expected Range" value={`${low} - ${high} mm`} color="text-sky-400" />
          <PredStat label="Vs Historical Avg" value={deltaStr} color={deltaColor} />
        </div>

        <p className="mt-4 font-mono text-[10px] text-slate-600">
          Historical avg: {Math.round(averageRainfall).toLocaleString()} mm - Based on rainfall history dataset
        </p>
      </div>
    </SectionCard>
  );
}
