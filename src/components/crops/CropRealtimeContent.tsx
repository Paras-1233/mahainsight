"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import CropFilters from "@/components/crops/CropFilters";
import SectionCard from "@/components/shared/SectionCard";
import { useLiveCropData } from "@/hooks/useLiveCropData";
import { LiveCropResponse } from "@/lib/crops/cropTypes";
import {
  deriveCropSummary,
  getLiveCropRecommendations,
} from "@/lib/crops/cropCalculations";
import {
  Activity,
  CloudRain,
  Radio,
  Sprout,
  ThermometerSun,
  TrendingUp,
  Wheat,
} from "lucide-react";
import type { ElementType } from "react";

interface CropRealtimeContentProps {
  initialData: LiveCropResponse;
  selectedDistrict: string;
  districts: string[];
}

const SCORE_STYLES = {
  Strong: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Moderate: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  Watch: "border-amber-400/20 bg-amber-400/10 text-amber-300",
};

function formatNumber(value: number) {
  return value.toLocaleString();
}

function formatRainfall(value: number) {
  const rounded = value > 0 && value < 1 ? Number(value.toFixed(1)) : Math.round(value);

  return `${rounded.toLocaleString()} mm`;
}

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: ElementType;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-emerald-900 to-sky-400 opacity-70" />
      <Icon size={18} className="mb-3 text-emerald-400 opacity-80" aria-hidden="true" />
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="text-[1.75rem] font-extrabold leading-none text-white">
        {value}
      </p>
      <p className="mt-1.5 font-mono text-[10px] text-slate-600">{sub}</p>
    </div>
  );
}

export default function CropRealtimeContent({
  initialData,
  selectedDistrict,
  districts,
}: CropRealtimeContentProps) {
  const { data: liveData, isLoading, error } = useLiveCropData(true);
  const data = liveData ?? initialData;
  const filteredCrops =
    selectedDistrict === "all"
      ? data.crops
      : data.crops.filter((crop) => crop.district.name === selectedDistrict);
  const filteredRecommendations = getLiveCropRecommendations(filteredCrops);
  const filteredSummary = deriveCropSummary(filteredCrops, filteredRecommendations);
  const isLive = data.source === "Open-Meteo" && !error;
  const lastUpdate = new Date(data.timestamp);
  const topCrops = [...filteredCrops]
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
    .slice(0, 6);

  return (
    <DashboardLayout>
      <div className="space-y-8 text-white">
        <div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold">Crop Intelligence</h1>
              <p className="mt-3 text-lg text-slate-400">
                Live crop suitability across Maharashtra districts
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
              <Radio size={14} className={isLive ? "animate-pulse text-emerald-400" : "text-slate-400"} />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                {isLive ? "Live" : "Fallback"}
              </span>
              <span className="text-xs text-emerald-400/70">
                {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm text-slate-300">
              <span className="text-slate-400">District:</span>
              <span className="ml-2 font-medium text-white">
                {selectedDistrict === "all" ? "All Districts" : selectedDistrict}
              </span>
            </div>

            <CropFilters currentDistrict={selectedDistrict} districts={districts} />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Activity size={18} className="text-emerald-400" />
              <div>
                <p className="font-semibold text-emerald-300">
                  {isLive ? "Live Crop Conditions" : "Database Crop Baseline"}
                </p>
                <p className="text-sm text-slate-400">
                  Recommendations use rainfall, temperature, and humidity signals
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="font-medium text-white">{data.source}</span>
              <span>{isLoading ? "Refreshing" : error ?? "Connected"}</span>
              <span>Records: {filteredCrops.length}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Crop Records"
            value={formatNumber(filteredSummary.totalCrops)}
            sub="District crop entries"
            icon={Wheat}
          />
          <MetricCard
            label="Kharif Crops"
            value={formatNumber(filteredSummary.kharifCount)}
            sub="Monsoon season records"
            icon={CloudRain}
          />
          <MetricCard
            label="Active Rain Districts"
            value={formatNumber(filteredSummary.activeRainDistricts)}
            sub="Live rainfall signal"
            icon={Sprout}
          />
          <MetricCard
            label="Avg Suitability"
            value={`${filteredSummary.averageSuitability}%`}
            sub="Climate fit score"
            icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SectionCard title="District Crop Conditions">
              <div className="space-y-3">
                {filteredCrops.map((crop) => (
                  <div
                    key={`${crop.district.name}-${crop.name}-${crop.id}`}
                    className="rounded-2xl border border-white/10 bg-[#0D1825] p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{crop.name}</h3>
                          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                            {crop.season}
                          </span>
                          <span
                            className={`rounded-md border px-2 py-0.5 text-xs ${
                              SCORE_STYLES[crop.suitabilityLabel as keyof typeof SCORE_STYLES]
                            }`}
                          >
                            {crop.suitabilityLabel}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-400">{crop.district.name}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                        <div>
                          <p className="text-slate-500">Today</p>
                          <p className="font-semibold text-sky-300">
                            {formatRainfall(crop.todayRainfall)}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Rain Chance</p>
                          <p className="font-semibold text-sky-300">{crop.probability}%</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Temp</p>
                          <p className="font-semibold text-amber-300">
                            {crop.temperature === null ? "N/A" : `${Math.round(crop.temperature)} C`}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Fit</p>
                          <p className="font-semibold text-emerald-300">
                            {crop.suitabilityScore}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredCrops.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
                    <p className="text-lg font-semibold text-white">No Crop Records</p>
                    <p className="mt-2 text-sm text-slate-400">
                      This district does not have crop entries in the database yet.
                    </p>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Live Insights">
            <div className="space-y-3">
              {topCrops.slice(0, 3).map((crop) => (
                <div
                  key={`${crop.district.name}-${crop.name}-insight`}
                  className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4"
                >
                  <p className="font-semibold text-emerald-200">
                    {crop.name} in {crop.district.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {crop.suitabilityScore}% fit with {formatRainfall(crop.todayRainfall)} today and {crop.probability}% rain probability.
                  </p>
                </div>
              ))}

              {filteredSummary.activeRainDistricts === 0 && (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm text-amber-100">
                  No active rainfall signal right now. Irrigation-sensitive crops should be watched closely.
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Climate-Based Recommendations">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredRecommendations.map((crop) => (
              <div
                key={crop}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <ThermometerSun size={18} className="mb-3 text-amber-300" />
                <h3 className="mb-2 text-lg font-semibold text-white">{crop}</h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Recommended from current district rainfall, temperature, and humidity conditions.
                </p>
              </div>
            ))}

            {filteredRecommendations.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">
                No climate recommendation is available for this selection yet.
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
