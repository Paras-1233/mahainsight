"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface HistoricalRainfallPoint {
  year: string;
  rainfall: number;
}

interface HistoricalRainfallChartProps {
  data: HistoricalRainfallPoint[];
  label: string;
}

export default function HistoricalRainfallChart({
  data,
  label,
}: HistoricalRainfallChartProps) {

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">

        <div>
          <h2 className="text-2xl font-semibold text-white">
            Historical Comparison
          </h2>

          <p className="text-slate-400 mt-2 text-sm">
            Historical rainfall records from the database
          </p>
        </div>

        <div className="text-xs font-mono uppercase tracking-wider text-slate-500 border border-slate-700/50 rounded px-3 py-1.5 bg-slate-900/50">
          {label}
        </div>

      </div>

      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
          <p className="text-sm text-slate-400">
            No historical rainfall records are available for this selection.
          </p>
        </div>
      ) : (
      <div className="h-[400px]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
            />

            <XAxis
              dataKey="year"
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "#020617",
                border:
                  "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                color: "#fff",
              }}
              labelStyle={{
                color: "#22c55e",
              }}
            />

            <Bar
              dataKey="rainfall"
              fill="#0ea5e9"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>
      )}

    </div>
  );
}
