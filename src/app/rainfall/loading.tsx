// app/rainfall/loading.tsx
import RainfallChartSkeleton from "@/components/charts/RainfallChartSkeleton";

export default function Loading() {
  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-300">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-32 rounded bg-slate-800 animate-pulse" />
        <div className="h-10 w-56 rounded-lg bg-slate-800 animate-pulse" />
        <div className="h-3 w-44 rounded bg-slate-800/60 animate-pulse" />
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-7 w-16 rounded-full bg-slate-800 animate-pulse" />
        ))}
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-800 animate-pulse" />
        ))}
      </div>

      {/* Charts skeleton */}
      <RainfallChartSkeleton />
      <RainfallChartSkeleton />
    </div>
  );
}