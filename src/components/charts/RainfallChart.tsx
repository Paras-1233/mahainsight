"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { RainfallChartPoint } from "@/lib/rainfall/rainfallTypes";

export type { RainfallChartPoint };

const fallbackData: RainfallChartPoint[] = [
  { month: "Jan", rainfall: 20 },
  { month: "Feb", rainfall: 35 },
  { month: "Mar", rainfall: 50 },
  { month: "Apr", rainfall: 80 },
  { month: "May", rainfall: 120 },
  { month: "Jun", rainfall: 300 },
  { month: "Jul", rainfall: 420 },
  { month: "Aug", rainfall: 390 },
  { month: "Sep", rainfall: 250 },
  { month: "Oct", rainfall: 140 },
  { month: "Nov", rainfall: 60 },
  { month: "Dec", rainfall: 30 },
];

interface RainfallChartProps {
  data?: RainfallChartPoint[];
  isLive?: boolean;
}

export default function RainfallChart({ data, isLive = false }: RainfallChartProps) {
  const chartData = data && data.length > 0 ? data : fallbackData;
  const xAxisKey = chartData[0]?.time ? "time" : "month";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">

      {/* Header */}
      <div className="mb-8">

        <h2 className="text-2xl font-semibold text-white">
          Rainfall Overview
        </h2>

        <p className="text-sm text-slate-400 mt-2">
          {isLive && data && data.length > 0
            ? "Next 24-hour average rainfall from Open-Meteo"
            : "Monthly rainfall pattern across Maharashtra"}
        </p>

      </div>

      {/* Chart */}
      <div className="h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={chartData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
            />

            <XAxis
              dataKey={xAxisKey}
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
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                color: "#fff",
              }}
              labelStyle={{
                color: "#22c55e",
              }}
            />

            <Line
              type="monotone"
              dataKey="rainfall"
              stroke="#22c55e"
              strokeWidth={4}
              dot={{
                r: 5,
                fill: "#22c55e",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 8,
                fill: "#4ade80",
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}
