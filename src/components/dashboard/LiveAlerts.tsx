"use client";

import useSWR from "swr";
import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ClimateAlert } from "@/lib/ai/generateAlerts";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

const severityClass = {
  critical: "border-red-500/30 bg-red-500/10 text-red-100",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  watch: "border-sky-500/30 bg-sky-500/10 text-sky-100",
  info: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
};

export default function LiveAlerts() {
  const { data: alerts = [], isLoading } = useSWR<ClimateAlert[]>(
    "/api/alerts",
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  const primaryAlert = alerts[0];

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-white transition-all duration-300 hover:border-emerald-400/30 sm:rounded-3xl sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h2 className="text-xl font-bold sm:text-2xl">Live Climate Alert Feed</h2>
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          {isLoading ? "SYNCING" : "LIVE"}
        </div>
      </div>

      {primaryAlert ? (
        <div
          className={`animate-in rounded-2xl border p-4 duration-500 fade-in sm:p-5 ${severityClass[primaryAlert.severity]}`}
        >
          <div className="mb-3 flex items-center gap-3">
            <AlertTriangle size={18} />
            <p className="text-xs font-semibold uppercase tracking-wider">
              {primaryAlert.severity}
            </p>
          </div>
          <p className="break-words text-base font-semibold sm:text-lg">
            {primaryAlert.title} in {primaryAlert.district}
          </p>
          <p className="mt-2 text-sm text-slate-300">{primaryAlert.detail}</p>
          <p className="mt-4 break-words text-xs text-slate-400">
            {primaryAlert.metric}:{" "}
            <span className="font-semibold text-white">
              {primaryAlert.value?.toFixed(1) ?? "N/A"}
            </span>{" "}
            | Updated {new Date(primaryAlert.updatedAt).toLocaleTimeString()}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <div className="mb-3 flex items-center gap-3 text-emerald-200">
            <CheckCircle2 size={18} />
            <p className="text-sm font-semibold">No active climate alerts</p>
          </div>
          <p className="text-sm text-slate-300">
            Live weather and rainfall signals are currently within configured
            thresholds.
          </p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Active", value: alerts.length },
          {
            label: "Critical",
            value: alerts.filter((alert) => alert.severity === "critical").length,
          },
          {
            label: "Warnings",
            value: alerts.filter((alert) => alert.severity === "warning").length,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-center gap-2 text-slate-400">
              <Activity size={14} />
              <span className="text-xs uppercase tracking-wider">
                {item.label}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
