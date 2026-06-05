"use client";

import { memo } from "react";
import { Radio } from "lucide-react";

interface LiveIndicatorProps {
  isLive: boolean;
  lastUpdate?: Date;
  showTimestamp?: boolean;
}

function LiveIndicatorComponent({
  isLive,
  lastUpdate,
  showTimestamp = true,
}: LiveIndicatorProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
        isLive
          ? "bg-green-500/20 border border-green-500/40"
          : "bg-slate-700/20 border border-slate-500/40"
      }`}
    >
      <div className="relative">
        <Radio
          size={12}
          className={`transition-all ${
            isLive ? "text-green-400 animate-pulse" : "text-slate-400"
          }`}
        />
        {isLive && (
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping" />
        )}
      </div>

      <span
        className={`text-xs font-semibold ${
          isLive ? "text-green-300" : "text-slate-300"
        }`}
      >
        {isLive ? "Live" : "Offline"}
      </span>

      {showTimestamp && lastUpdate && (
        <>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-slate-400">
            {formatTime(lastUpdate)}
          </span>
        </>
      )}
    </div>
  );
}

export default memo(LiveIndicatorComponent);
