"use client";

import { CloudRain, Radio } from "lucide-react";

interface RainfallSourceStatusProps {
  hasLiveData: boolean;
  isConnected: boolean;
  isUsingAnnualBaseline: boolean;
  sourceCount: number;
  totalDistricts: number;
  error: string | null;
}

export default function RainfallSourceStatus({
  hasLiveData,
  isConnected,
  isUsingAnnualBaseline,
  sourceCount,
  totalDistricts,
  error,
}: RainfallSourceStatusProps) {
  return (
    <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Radio size={18} className="animate-pulse text-green-400" />
          <div>
            <p className="font-semibold text-green-300">
              Latest Open-Meteo Rainfall Data
            </p>
            <p className="text-sm text-slate-400">
              Model-backed data refreshes every 10 minutes
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-2 font-medium text-white">
            <CloudRain size={16} className="text-green-400" />
            {isUsingAnnualBaseline
              ? "Open-Meteo + annual baseline"
              : hasLiveData
                ? "Open-Meteo"
                : "Database fallback"}
          </span>
          <span className="text-slate-400">
            {isUsingAnnualBaseline
              ? "Live totals dry; cards use latest annual rainfall"
              : isConnected
                ? "Connected"
                : error ?? "Waiting for live data"}
          </span>
          <span className="text-slate-400">
            Coverage: {sourceCount}/{totalDistricts}
          </span>
        </div>
      </div>
    </div>
  );
}
