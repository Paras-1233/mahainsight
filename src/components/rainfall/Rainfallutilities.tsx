// components/rainfall/RainfallChartSkeleton.tsx
export default function RainfallChartSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading chart"
      className="rounded-2xl border border-white/[0.06] bg-[#0D1825] p-6 animate-pulse"
    >
      <div className="h-3 w-36 bg-slate-800 rounded mb-6" />
      <div className="flex items-end gap-2 h-44">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-slate-800/70"
            style={{ height: `${28 + (i % 5) * 14}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-2 w-6 bg-slate-800 rounded" />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

// components/rainfall/RainfallEmptyState.tsx
import { CloudOff } from "lucide-react";

export function RainfallEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-36 text-center space-y-5">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl
          border border-white/[0.08] bg-slate-900"
      >
        <CloudOff size={26} className="text-slate-500" aria-hidden="true" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-2">No Rainfall Data</h2>
        <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
          District rainfall data could not be loaded. Check your data source
          configuration or try refreshing the page.
        </p>
      </div>

      <a
        href="/rainfall"
        className="mt-1 inline-flex items-center gap-2 rounded-xl bg-sky-500
          px-5 py-2.5 text-sm font-semibold text-white
          transition-colors hover:bg-sky-400 active:scale-[0.98]"
      >
        Retry
      </a>
    </div>
  );
}