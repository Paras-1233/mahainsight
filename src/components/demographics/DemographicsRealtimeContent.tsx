"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import SectionCard from "@/components/shared/SectionCard";
import DemographicFilters from "@/components/demographics/DemographicFilters";
import { useLiveDemographicData } from "@/hooks/useLiveDemographicData";
import {
  deriveDemographicSummary,
} from "@/lib/demographics/demographicCalculations";
import { LiveDemographicResponse } from "@/lib/demographics/demographicTypes";
import {
  Activity,
  Briefcase,
  CloudRain,
  GraduationCap,
  Radio,
  TrendingUp,
  Users,
} from "lucide-react";
import type { ElementType } from "react";

interface DemographicsRealtimeContentProps {
  initialData: LiveDemographicResponse;
  selectedDistrict: string;
  districts: string[];
}

const EXPOSURE_STYLES = {
  Low: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Moderate: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  High: "border-rose-400/20 bg-rose-400/10 text-rose-300",
};

function formatPopulation(value: number) {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(1)}Cr`;
  }

  if (value >= 100000) {
    return `${(value / 100000).toFixed(1)}L`;
  }

  return value.toLocaleString();
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
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-sky-900 to-emerald-400 opacity-70" />
      <Icon size={18} className="mb-3 text-sky-400 opacity-80" aria-hidden="true" />
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

export default function DemographicsRealtimeContent({
  initialData,
  selectedDistrict,
  districts,
}: DemographicsRealtimeContentProps) {
  const { data: liveData, isLoading, error } = useLiveDemographicData(true);
  const data = liveData ?? initialData;
  const filteredRecords =
    selectedDistrict === "all"
      ? data.records
      : data.records.filter((record) => record.district === selectedDistrict);
  const summary = deriveDemographicSummary(filteredRecords);
  const isLive = data.source === "Open-Meteo" && !error;
  const lastUpdate = new Date(data.timestamp);
  const highestExposure = [...filteredRecords]
    .sort((a, b) => b.exposureScore - a.exposureScore)
    .slice(0, 5);
  const mostUrban = [...filteredRecords]
    .sort((a, b) => b.urbanizationRate - a.urbanizationRate)
    .slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-8 text-white">
        <div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold">Demographics Intelligence</h1>
              <p className="mt-3 text-lg text-slate-400">
                Population baseline with live district risk context
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1.5">
              <Radio size={14} className={isLive ? "animate-pulse text-sky-400" : "text-slate-400"} />
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-300">
                {isLive ? "Live" : "Baseline"}
              </span>
              <span className="text-xs text-sky-400/70">
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

            <DemographicFilters currentDistrict={selectedDistrict} districts={districts} />
          </div>
        </div>

        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Activity size={18} className="text-sky-400" />
              <div>
                <p className="font-semibold text-sky-300">
                  {isLive ? "Live Population Risk Context" : "Static Demographic Baseline"}
                </p>
                <p className="text-sm text-slate-400">
                  Demographics are baseline data with live environmental risk context
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="font-medium text-white">{data.source}</span>
              <span>{isLoading ? "Refreshing" : error ?? "Connected"}</span>
              <span>Records: {filteredRecords.length}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Population"
            value={formatPopulation(summary.totalPopulation)}
            sub={`${summary.districtCount} district records`}
            icon={Users}
          />
          <MetricCard
            label="Literacy"
            value={`${summary.averageLiteracy}%`}
            sub="Average literacy rate"
            icon={GraduationCap}
          />
          <MetricCard
            label="Urban Share"
            value={`${summary.urbanPopulationShare}%`}
            sub="Population-weighted estimate"
            icon={Briefcase}
          />
          <MetricCard
            label="High Risk"
            value={`${summary.highExposureDistricts}`}
            sub="Live district context"
            icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SectionCard title="District Demographics">
              <div className="space-y-3">
                {filteredRecords.map((record) => (
                  <div
                    key={record.district}
                    className="rounded-2xl border border-white/10 bg-[#0D1825] p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{record.district}</h3>
                          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                            {record.region}
                          </span>
                          <span className={`rounded-md border px-2 py-0.5 text-xs ${EXPOSURE_STYLES[record.exposureLabel]}`}>
                            {record.exposureLabel}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-400">
                          {record.workforce} workforce
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                        <div>
                          <p className="text-slate-500">Population</p>
                          <p className="font-semibold text-white">{formatPopulation(record.population)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Literacy</p>
                          <p className="font-semibold text-sky-300">{record.literacyRate}%</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Urban</p>
                          <p className="font-semibold text-emerald-300">{record.urbanizationRate}%</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Exposure</p>
                          <p className="font-semibold text-amber-300">{record.exposureScore}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Population Risk Insights">
            <div className="space-y-3">
              {highestExposure.slice(0, 3).map((record) => (
                <div
                  key={`${record.district}-exposure`}
                  className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] p-4"
                >
                  <p className="font-semibold text-sky-200">
                    {record.district}: {record.exposureScore}% exposure
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {formatPopulation(record.population)} people, {record.urbanizationRate}% urbanization, density {record.populationDensity.toLocaleString()} people per sq km.
                  </p>
                </div>
              ))}

              {summary.highExposureDistricts === 0 && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4 text-sm text-emerald-100">
                  No district is currently in high population risk context.
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Regional Intelligence">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mostUrban.map((record) => (
              <div
                key={`${record.district}-urban`}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <CloudRain size={18} className="mb-3 text-sky-300" />
                <h3 className="mb-2 text-lg font-semibold text-white">{record.district}</h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {record.urbanizationRate}% urbanization, density {record.populationDensity.toLocaleString()} people per sq km, risk context {record.exposureScore}%.
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
