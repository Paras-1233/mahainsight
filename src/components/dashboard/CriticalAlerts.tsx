"use client";

import useSWR from "swr";
import { AlertTriangle } from "lucide-react";
import type { ClimateAlert } from "@/lib/ai/generateAlerts";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

const severityStyles = {
  critical: "border-red-500/30 bg-red-500/15 text-red-100",
  warning: "border-amber-500/30 bg-amber-500/15 text-amber-100",
  watch: "border-sky-500/30 bg-sky-500/15 text-sky-100",
  info: "border-emerald-500/30 bg-emerald-500/15 text-emerald-100",
};

export default function CriticalAlerts() {
  const { data: alerts = [] } = useSWR<ClimateAlert[]>("/api/alerts", fetcher, {
    refreshInterval: 30000,
  });

  const urgentAlerts = alerts.slice(0, 4);

  if (urgentAlerts.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 sm:px-5">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-amber-500/5" />
      <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex shrink-0 items-center gap-2">
          <AlertTriangle size={16} className="text-red-300" />
          <span className="text-xs font-semibold uppercase tracking-wider text-red-300">
            Critical Alerts
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
          {urgentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`min-w-0 break-words rounded-xl border px-3 py-2 text-sm ${severityStyles[alert.severity]}`}
            >
              <span className="font-semibold">{alert.district}</span>
              <span className="mx-2 text-white/40">|</span>
              {alert.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
