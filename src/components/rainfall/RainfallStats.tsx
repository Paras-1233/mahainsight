// components/rainfall/RainfallStats.tsx
import { CloudRain, Droplets, MapPinned, TrendingUp } from "lucide-react";
import type { ElementType } from "react";

interface RainfallStatsProps {
  averageRainfall: number;
  districtCount: number;
  totalDistricts: number;
  wettestDistrict: { district: string; rainfall: number } | null;
  rainfallGrowth: string | null;
}

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: ElementType;
  accent: "blue" | "green" | "amber" | "coral";
}

const ACCENTS = {
  blue:   { bar: "from-sky-900 to-sky-400",    val: "text-sky-400",    icon: "text-sky-400",   bg: "bg-sky-400/5",  border: "border-sky-400/15" },
  green:  { bar: "from-emerald-900 to-emerald-400", val: "text-emerald-400", icon: "text-emerald-400", bg: "bg-emerald-400/5", border: "border-emerald-400/15" },
  amber:  { bar: "from-amber-900 to-amber-400",  val: "text-amber-400",  icon: "text-amber-400",  bg: "bg-amber-400/5",  border: "border-amber-400/15" },
  coral:  { bar: "from-rose-900 to-rose-400",    val: "text-rose-400",   icon: "text-rose-400",   bg: "bg-rose-400/5",   border: "border-rose-400/15" },
};

function formatRainfall(value: number) {
  const rounded = value > 0 && value < 1 ? Number(value.toFixed(1)) : Math.round(value);

  return `${rounded.toLocaleString()} mm`;
}

function StatCard({ label, value, sub, icon: Icon, accent }: StatCardProps) {
  const a = ACCENTS[accent];
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${a.border} ${a.bg}
        bg-[#0D1825] p-5 transition-all duration-200 hover:-translate-y-0.5
        hover:border-opacity-40`}
    >
      {/* Top accent bar */}
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${a.bar} opacity-70`} />

      <Icon size={18} className={`${a.icon} mb-3 opacity-75`} aria-hidden="true" />

      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500 mb-1">
        {label}
      </p>

      <p className={`text-[1.75rem] font-extrabold leading-none tracking-tight ${a.val}`}>
        {value}
      </p>

      <p className="font-mono text-[10px] text-slate-600 mt-1.5">{sub}</p>
    </div>
  );
}

export default function RainfallStats({
  averageRainfall,
  districtCount,
  totalDistricts,
  wettestDistrict,
  rainfallGrowth,
}: RainfallStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        label="Average Rainfall"
        value={formatRainfall(averageRainfall)}
        sub="State average - selected scope"
        icon={CloudRain}
        accent="blue"
      />
      <StatCard
        label="Reporting Districts"
        value={`${districtCount}/${totalDistricts}`}
        sub="Active rainfall records"
        icon={Droplets}
        accent="blue"
      />
      <StatCard
        label="Wettest District"
        value={wettestDistrict ? wettestDistrict.district : "N/A"}
        sub={
          wettestDistrict
            ? `${formatRainfall(wettestDistrict.rainfall)} recorded`
            : "No data available"
        }
        icon={MapPinned}
        accent="green"
      />
      <StatCard
        label="Rainfall Growth"
        value={rainfallGrowth ? `${rainfallGrowth}%` : "N/A"}
        sub="Compared to previous period"
        icon={TrendingUp}
        accent="amber"
      />
    </div>
  );
}
