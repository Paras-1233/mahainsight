"use client";

import { Radio } from "lucide-react";

interface RainfallData {
  district: string;
  rainfall: number;
}

interface RealtimeIndicatorProps {
  isLive?: boolean;
}

export function RealtimeIndicator({ isLive = true }: RealtimeIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-green-300">
      <Radio 
        size={14} 
        className={isLive ? "animate-pulse" : ""} 
      />
      <span className="text-xs font-semibold uppercase tracking-wide">
        {isLive ? "Live" : "Offline"}
      </span>
    </div>
  );
}

interface RealtimeRainfallDisplayProps {
  liveData: RainfallData[] | null;
  children: (data: RainfallData[]) => React.ReactNode;
}

export function RealtimeRainfallDisplay({
  liveData,
  children,
}: RealtimeRainfallDisplayProps) {
  if (!liveData) {
    return <div className="text-slate-400 text-sm">Loading live data...</div>;
  }

  return <>{children(liveData)}</>;
}
