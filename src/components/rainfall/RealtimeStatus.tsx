"use client";

import { useLiveRainfallData } from "@/hooks/useLiveRainfallData";
import { Radio } from "lucide-react";

export function RealtimeStatus() {
  const { data: liveData } = useLiveRainfallData(true);
  const isConnected = Boolean(liveData);
  const lastUpdate = liveData ? new Date() : null;

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-green-500/30 bg-green-500/10">
      <Radio size={14} className="text-green-400 animate-pulse" />
      <span className="text-xs font-semibold uppercase tracking-wider text-green-300">
        Live
      </span>
      {lastUpdate && (
        <span className="text-xs text-green-400/70">
          {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
