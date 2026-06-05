"use client";

import RainfallFilters from "@/components/rainfall/RainfallFilters";
import { Radio } from "lucide-react";

interface RainfallHeaderProps {
  district: string;
  range: string;
  rangeLabel: string;
  districts: string[];
  isConnected: boolean;
  lastUpdate: Date | null;
}

export default function RainfallHeader({
  district,
  range,
  rangeLabel,
  districts,
  isConnected,
  lastUpdate,
}: RainfallHeaderProps) {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Rainfall Analytics</h1>
          <p className="mt-3 text-lg text-slate-400">
            Monitor rainfall patterns across Maharashtra districts
          </p>
        </div>

        {isConnected && (
          <div className="flex w-fit items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5">
            <Radio size={14} className="animate-pulse text-green-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-green-300">
              Live
            </span>
            {lastUpdate && (
              <span className="text-xs text-green-400/70">
                {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm text-slate-300">
          <span className="text-slate-400">District:</span>
          <span className="ml-2 font-medium text-white">
            {district === "all" ? "All Districts" : district}
          </span>
          <span className="mx-3 text-slate-600">|</span>
          <span className="text-slate-400">Range:</span>
          <span className="ml-2 font-medium text-white">{rangeLabel}</span>
        </div>

        <RainfallFilters
          currentDistrict={district}
          currentRange={range}
          districts={districts}
        />
      </div>
    </div>
  );
}
