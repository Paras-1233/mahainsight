"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { ElementType } from "react";
import {
  Activity,
  CloudRain,
  Compass,
  MapPinned,
  Radio,
  RefreshCw,
  ThermometerSun,
  TriangleAlert,
  Waves,
  Wind,
} from "lucide-react";
import { useLiveMapData } from "@/hooks/useLiveMapData";
import { LiveMapDistrict, LiveMapResponse } from "@/lib/maps/mapTypes";

const MaharashtraMap = dynamic(
  () => import("@/components/maps/MaharashtraMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[620px] items-center justify-center rounded-lg border border-white/10 bg-slate-950/70 text-slate-300">
        <RefreshCw className="mr-2 h-4 w-4 animate-spin text-emerald-300" aria-hidden="true" />
        Loading climate map
      </div>
    ),
  }
);

interface MapClientProps {
  initialData: LiveMapResponse;
}

function formatRainfall(value: number) {
  const rounded = value > 0 && value < 1 ? Number(value.toFixed(1)) : Math.round(value);

  return `${rounded.toLocaleString()} mm`;
}

function formatNullable(value: number | null, suffix: string) {
  return value === null ? "N/A" : `${Math.round(value).toLocaleString()}${suffix}`;
}

function Metric({
  label,
  value,
  icon: Icon,
  tone = "emerald",
}: {
  label: string;
  value: string;
  icon: ElementType;
  tone?: "emerald" | "sky" | "rose" | "amber";
}) {
  const tones = {
    emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    sky: "text-sky-300 bg-sky-500/10 border-sky-500/20",
    rose: "text-rose-300 bg-rose-500/10 border-rose-500/20",
    amber: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <div className="group rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-emerald-500/25 hover:bg-white/[0.06]">
      <div className={["mb-4 flex h-9 w-9 items-center justify-center rounded-lg border", tones[tone]].join(" ")}>
        <Icon size={17} aria-hidden="true" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</p>
    </div>
  );
}

function DistrictPanel({ district }: { district: LiveMapDistrict }) {
  const districtMetrics: Array<{
    label: string;
    value: string;
    icon: ElementType;
  }> = [
    { label: "Today rainfall", value: formatRainfall(district.todayRainfall), icon: Waves },
    { label: "Current rainfall", value: formatRainfall(district.currentRainfall), icon: CloudRain },
    { label: "Rain probability", value: `${district.probability}%`, icon: Activity },
    { label: "Temperature", value: formatNullable(district.temperature, " C"), icon: ThermometerSun },
    { label: "Humidity", value: formatNullable(district.humidity, "%"), icon: Compass },
    { label: "Wind speed", value: formatNullable(district.windSpeed, " km/h"), icon: Wind },
  ];

  return (
    <aside className="rounded-lg border border-white/10 bg-slate-950/70 p-5 shadow-xl shadow-black/20">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            <MapPinned className="h-3.5 w-3.5" aria-hidden="true" />
            Selected district
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-white">{district.district}</h2>
          <p className="mt-1 text-sm text-slate-400">Live climate conditions</p>
        </div>
        <span
          className="shrink-0 rounded-md border px-2.5 py-1 text-xs font-semibold"
          style={{
            borderColor: district.riskColor,
            color: district.riskColor,
            backgroundColor: `${district.riskColor}1a`,
          }}
        >
          {district.riskLevel}
        </span>
      </div>

      <div className="mb-5 rounded-lg border border-white/8 bg-white/[0.04] p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>Risk score</span>
          <span className="font-semibold text-white">{district.riskScore}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              width: `${district.riskScore}%`,
              backgroundColor: district.riskColor,
            }}
          />
        </div>
      </div>

      <div className="space-y-3 text-sm">
        {districtMetrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between gap-4 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2.5">
            <span className="flex items-center gap-2 text-slate-400">
              <Icon className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
              {label}
            </span>
            <span className="font-semibold text-white">{value}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function MapClient({ initialData }: MapClientProps) {
  const { data: liveData, isLoading, error } = useLiveMapData(true);
  const data = liveData ?? initialData;
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
    data.districts[0]?.district ?? null
  );
  const selected = useMemo(
    () =>
      data.districts.find((district) => district.district === selectedDistrict) ??
      data.districts[0],
    [data.districts, selectedDistrict]
  );
  const highRiskDistricts = data.districts.filter(
    (district) => district.riskLevel === "High Risk"
  );
  const isLive = data.source === "Open-Meteo" && !error;

  return (
    <div className="space-y-6 text-white">
      <section className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-slate-950 via-[#07111b] to-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-60" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
              <Radio className={["h-3.5 w-3.5", isLive ? "animate-pulse" : ""].join(" ")} aria-hidden="true" />
              Live geospatial intelligence
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Maharashtra Climate Map
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
              Track rainfall, temperature, humidity, and risk signals across all monitored districts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="rounded-md border border-white/10 bg-white/5 px-3 py-2 font-medium text-white">
              {data.source}
            </span>
            <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-emerald-200">
              {isLoading ? "Refreshing" : error ?? "Connected"}
            </span>
            <span className="rounded-md border border-white/10 bg-white/5 px-3 py-2">
              {new Date(data.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </section>

      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Radio size={18} className={isLive ? "animate-pulse text-emerald-300" : "text-slate-400"} />
            <div>
              <p className="font-semibold text-emerald-200">Live district markers</p>
              <p className="text-sm text-slate-400">
                District markers use Open-Meteo rainfall, temperature, humidity, and probability
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span className="font-medium text-white">{data.source}</span>
            <span>{isLoading ? "Refreshing" : error ?? "Connected"}</span>
            <span>{new Date(data.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Districts"
          value={data.summary.districtCount.toLocaleString()}
          icon={Activity}
          tone="emerald"
        />
        <Metric
          label="Active Rain"
          value={data.summary.activeRainDistricts.toLocaleString()}
          icon={CloudRain}
          tone="sky"
        />
        <Metric
          label="High Risk"
          value={data.summary.highRiskDistricts.toLocaleString()}
          icon={TriangleAlert}
          tone="rose"
        />
        <Metric
          label="Avg Temp"
          value={formatNullable(data.summary.averageTemperature, " C")}
          icon={ThermometerSun}
          tone="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MaharashtraMap
            districts={data.districts}
            selectedDistrict={selected?.district ?? null}
            onSelectDistrict={setSelectedDistrict}
          />
        </div>

        {selected && <DistrictPanel district={selected} />}
      </div>

      <div className="rounded-lg border border-white/10 bg-slate-950/70 p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Watchlist</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Risk Watchlist</h2>
          </div>
          <TriangleAlert className="h-5 w-5 text-rose-300" aria-hidden="true" />
        </div>
        {highRiskDistricts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {highRiskDistricts.map((district) => (
              <button
                key={district.district}
                onClick={() => setSelectedDistrict(district.district)}
                className="rounded-lg border border-rose-400/20 bg-rose-400/[0.06] p-4 text-left transition hover:border-rose-300/50 hover:bg-rose-400/10"
              >
                <p className="font-semibold text-rose-200">{district.district}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {district.riskScore}% risk score, {district.probability}% rain probability
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06] p-4 text-sm text-emerald-100">
            No districts are currently in the high-risk band.
          </div>
        )}
      </div>
    </div>
  );
}
