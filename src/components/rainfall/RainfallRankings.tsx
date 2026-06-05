// components/rainfall/RainfallRankings.tsx
import SectionCard from "@/components/shared/SectionCard";

interface District {
  district: string;
  rainfall: number;
}

interface RainfallRankingsProps {
  districts: District[];
}

const MEDALS = ["#1", "#2", "#3"];

function formatRainfall(value: number) {
  const rounded = value > 0 && value < 1 ? Number(value.toFixed(1)) : Math.round(value);

  return `${rounded.toLocaleString()} mm`;
}

export default function RainfallRankings({ districts }: RainfallRankingsProps) {
  const max = Math.max(districts[0]?.rainfall ?? 0, 1);

  return (
    <SectionCard title="District Rainfall Rankings">
      {districts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
          <p className="text-lg font-semibold text-white mb-2">No Rainfall Data</p>
          <p className="text-sm text-slate-400">
            District records could not be loaded. Verify the data source and retry.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {districts.map((d, i) => {
            const pct = Math.round((d.rainfall / max) * 100);
            const isTop = i < 2;
            const barColor =
              i === 0
                ? "from-emerald-700 to-emerald-400"
                : i === 1
                ? "from-sky-800 to-sky-400"
                : "from-slate-700 to-sky-600";

            return (
              <div
                key={d.district}
                className="group flex items-center gap-4 rounded-xl border border-transparent
                  px-4 py-3 transition-all duration-150
                  hover:border-white/10 hover:bg-white/[0.04]"
              >
                {/* Rank badge */}
                <span
                  className={`w-7 shrink-0 text-center font-mono text-sm font-bold
                    ${isTop ? "text-amber-400" : "text-slate-600"}`}
                >
                  {i < 3 ? MEDALS[i] : `#${i + 1}`}
                </span>

                {/* Name + bar */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate mb-1.5">
                    {d.district}
                  </p>
                  <div className="h-[3px] w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Value */}
                <span
                  className={`font-mono text-sm font-medium shrink-0 min-w-[80px] text-right
                    ${i === 0 ? "text-emerald-400" : "text-sky-400"}`}
                >
                  {formatRainfall(d.rainfall)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
