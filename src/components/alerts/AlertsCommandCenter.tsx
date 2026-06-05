"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Droplets,
  Flame,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  ThermometerSun,
  Waves,
} from "lucide-react";
import { districts } from "@/data/districts";
import type {
  ClimateAlert,
  ClimateAlertSeverity,
  ClimateAlertType,
} from "@/lib/ai/generateAlerts";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

const severityOptions: Array<ClimateAlertSeverity | "all"> = [
  "all",
  "critical",
  "warning",
  "watch",
  "info",
];

const typeIcons: Record<ClimateAlertType, typeof AlertTriangle> = {
  flood: Waves,
  heat: ThermometerSun,
  humidity: Droplets,
  rainfall: BellRing,
  stable: ShieldCheck,
};

const severityClasses: Record<ClimateAlertSeverity, string> = {
  critical: "border-red-500/30 bg-red-500/10 text-red-100",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  watch: "border-sky-500/30 bg-sky-500/10 text-sky-100",
  info: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
};

function metricSuffix(metric: string) {
  if (metric.toLowerCase().includes("temperature")) return "\u00B0C";
  if (metric.toLowerCase().includes("humidity")) return "%";
  if (metric.toLowerCase().includes("probability")) return "%";
  if (metric.toLowerCase().includes("rainfall")) return " mm";

  return "";
}

function formatMetric(alert: ClimateAlert) {
  if (alert.value === null) return "N/A";

  return `${alert.value.toFixed(1)}${metricSuffix(alert.metric)}`;
}

export default function AlertsCommandCenter() {
  const [severity, setSeverity] = useState<ClimateAlertSeverity | "all">("all");
  const [district, setDistrict] = useState("all");
  const [query, setQuery] = useState("");

  const {
    data: alerts = [],
    error,
    isLoading,
    mutate,
  } = useSWR<ClimateAlert[]>("/api/alerts", fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });

  const filteredAlerts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return alerts.filter((alert) => {
      const severityMatch = severity === "all" || alert.severity === severity;
      const districtMatch = district === "all" || alert.district === district;
      const queryMatch =
        normalizedQuery.length === 0 ||
        alert.title.toLowerCase().includes(normalizedQuery) ||
        alert.detail.toLowerCase().includes(normalizedQuery) ||
        alert.district.toLowerCase().includes(normalizedQuery);

      return severityMatch && districtMatch && queryMatch;
    });
  }, [alerts, district, query, severity]);

  const counts = {
    active: alerts.length,
    critical: alerts.filter((alert) => alert.severity === "critical").length,
    warning: alerts.filter((alert) => alert.severity === "warning").length,
    districts: new Set(alerts.map((alert) => alert.district)).size,
  };

  const topDistricts = Array.from(
    alerts.reduce((map, alert) => {
      map.set(alert.district, (map.get(alert.district) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  )
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5);

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            <Radio size={13} className="animate-pulse" />
            Real-time alert intelligence
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Climate Alert Command Center
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Live rainfall, heat, humidity, and flood-risk signals for monitored
            Maharashtra districts.
          </p>
        </div>

        <button
          onClick={() => mutate()}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-400/30 hover:bg-emerald-500/10"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active alerts", value: counts.active, icon: BellRing },
          { label: "Critical", value: counts.critical, icon: Flame },
          { label: "Warnings", value: counts.warning, icon: AlertTriangle },
          { label: "Districts affected", value: counts.districts, icon: Waves },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {label}
              </p>
              <Icon size={18} className="text-emerald-300" />
            </div>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_220px_220px]">
        <label className="relative block">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search district, metric, or alert"
            className="h-12 w-full rounded-xl border border-white/10 bg-slate-900/70 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40"
          />
        </label>

        <select
          value={severity}
          onChange={(event) =>
            setSeverity(event.target.value as ClimateAlertSeverity | "all")
          }
          className="h-12 rounded-xl border border-white/10 bg-slate-900/70 px-4 text-sm text-white outline-none focus:border-emerald-400/40"
        >
          {severityOptions.map((option) => (
            <option key={option} value={option}>
              {option === "all" ? "All severities" : option}
            </option>
          ))}
        </select>

        <select
          value={district}
          onChange={(event) => setDistrict(event.target.value)}
          className="h-12 rounded-xl border border-white/10 bg-slate-900/70 px-4 text-sm text-white outline-none focus:border-emerald-400/40"
        >
          <option value="all">All districts</option>
          {districts.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
          Live alerts are temporarily unavailable. Retrying automatically.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => {
              const Icon = typeIcons[alert.type];

              return (
                <button
                  key={alert.id}
                  onClick={() => setDistrict(alert.district)}
                  className={`w-full rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:border-white/30 ${severityClasses[alert.severity]}`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/20">
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider">
                            {alert.severity}
                          </span>
                          <span className="text-sm text-white/60">
                            {alert.district}
                          </span>
                        </div>
                        <h2 className="text-xl font-semibold text-white">
                          {alert.title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-300">
                          {alert.detail}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 md:text-right">
                      <p className="text-xs uppercase tracking-wider text-white/50">
                        {alert.metric}
                      </p>
                      <p className="mt-1 text-xl font-bold text-white">
                        {formatMetric(alert)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-3 text-xs text-white/50">
                    Updated {new Date(alert.updatedAt).toLocaleString()}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8">
              <div className="mb-3 flex items-center gap-3 text-emerald-200">
                <CheckCircle2 size={22} />
                <h2 className="text-xl font-semibold">No matching alerts</h2>
              </div>
              <p className="text-sm text-slate-300">
                Current live data is below alert thresholds for this filter.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
              District hotspots
            </h2>
            {topDistricts.length > 0 ? (
              <div className="space-y-3">
                {topDistricts.map(([name, count]) => (
                  <button
                    key={name}
                    onClick={() => setDistrict(name)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-emerald-400/30"
                  >
                    <span className="font-medium">{name}</span>
                    <span className="rounded-full bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-200">
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No hotspots detected from the current live feed.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Alert rules
            </h2>
            <div className="space-y-3 text-sm text-slate-300">
              <p>Flood risk: rain probability at or above 80%.</p>
              <p>Heat stress: temperature at or above 38\u00B0C.</p>
              <p>Humidity risk: humidity at or above 90%.</p>
              <p>Rainfall accumulation: today rainfall at or above 100 mm.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
