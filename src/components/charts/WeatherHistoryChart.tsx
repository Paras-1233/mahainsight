"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WeatherData {
  temperature: number;
  createdAt: Date | string;
}

interface Props {
  data?: WeatherData[];
}

export default function WeatherHistoryChart({ data = [] }: Props) {
  const formattedData = data
    .slice()
    .reverse()
    .map((item) => ({
      temperature: Number(item.temperature.toFixed(1)),
      time: new Date(item.createdAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    }));

  if (formattedData.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-center">
        <div>
          <p className="font-medium text-white">No historical weather yet</p>
          <p className="mt-2 text-sm text-slate-400">
            Temperature history will appear after records are saved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgb(148 163 184)", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgb(148 163 184)", fontSize: 12 }}
            unit="\u00B0"
          />
          <Tooltip
            cursor={{ stroke: "rgba(16, 185, 129, 0.22)" }}
            contentStyle={{
              background: "rgba(15, 23, 42, 0.96)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "12px",
              color: "rgb(226, 232, 240)",
            }}
            labelStyle={{ color: "rgb(148, 163, 184)" }}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="rgb(52, 211, 153)"
            strokeWidth={3}
            dot={{ r: 3, fill: "rgb(52, 211, 153)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
