"use client";
import dynamic from "next/dynamic";
import { useRouter }
from "next/navigation";
import { useDistrictData }
from "@/hooks/useDistrictData";

import { useEffect,useRef, useState,useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/cards/StatCard";
import AIReport from "@/components/dashboard/TempReport";
import LiveAlerts from "@/components/dashboard/LiveAlerts";
import { generateDashboardInsights } from "@/lib/ai/dashboardInsights";
import { districts } from "@/data/districts";
import DistrictAnalyticsPanel from "@/components/dashboard/DistrictAnalyticsPanel";
import CriticalAlerts from "@/components/dashboard/CriticalAlerts";
import LiveClock
from "@/components/dashboard/LiveClock";

// Dynamic import to prevent server-side leaflet errors
const ClimateMap = dynamic(() => import("@/components/maps/ClimateMap"), {
  ssr: false,
  loading: () => <div className="rounded-lg bg-slate-800 h-96 animate-pulse" />,
});
import {
  CloudRain,

  Wheat,
  Users,
  Activity,

  Zap,
  TrendingUp,
  AlertTriangle,
  Thermometer,
  ChevronDown,
  BarChart3,
  Map,
  RefreshCw,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGreeting() {

  const h =
    new Date().getHours();

  if (h < 5)
    return "Good Night";

  if (h < 12)
    return "Good Morning";

  if (h < 17)
    return "Good Afternoon";

  if (h < 21)
    return "Good Night";

  return "Good Night";

}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PulsingDot({ color = "bg-green-400" }: { color?: string }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-2.5 w-2.5"
    >
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${color}`}
      />
      <span
        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`}
      />
    </span>
  );
}

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const styles = {
    default: "bg-slate-700/60 text-slate-300 border-slate-600/40",
    success: "bg-green-500/15 text-green-400 border-green-500/30",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    danger: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

function InsightChip({
  label,
  value,
  colorClass,
  icon: Icon,
}: {
  label: string;
  value: string;
  colorClass: string;
  icon: React.ElementType;
}) {
  return (
    <div
      className={`group cursor-default rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] sm:p-5 ${colorClass}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="min-w-0 text-xs font-medium uppercase text-current opacity-60">
          {label}
        </p>
        <Icon size={16} className="shrink-0 opacity-50" />
      </div>
      <p className="break-words text-lg font-bold leading-tight sm:text-xl">{value}</p>
    </div>
  );
}

function HeroMetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="group rounded-2xl border border-white/8 bg-slate-900/50 p-4 transition-all duration-300 hover:scale-[1.03] hover:border-green-500/25 hover:bg-slate-900/80 sm:p-5">
      <p className="mb-3 text-xs font-medium uppercase text-slate-500">
        {title}
      </p>
      <h3 className="text-2xl font-bold tabular-nums text-white sm:text-3xl">{value}</h3>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [userName, setUserName] = useState("Researcher");
  const [showReport, setShowReport] = useState(false);
  const [mounted, setMounted] = useState(false);
  const analyticsRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const greeting = getGreeting();

  // Ensure hydration matches
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showReport) {
      reportRef.current?.focus();
    }
  }, [showReport]);

  // Load user
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem("mahainsight-user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserName(parsed.name || "Researcher");
        }
      } catch {
        // ignore parse errors
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);



   const handleRefresh = () => {

  if (isRefreshing) return;

  setIsRefreshing(true);

  router.refresh();

  setTimeout(() => {

    setIsRefreshing(false);

  }, 1200);

};



  const { data, isLoading } =
  useDistrictData(selectedDistrict);

const currentData =
  data ?? {
    rainfall: "Loading...",
    temperature: "Loading...",
    crop: "Loading...",
    alert: "Loading...",
    humidity: "Loading...",
windSpeed: "Loading...",
probability: "Loading..."
  };

  const insights = useMemo(() => {

  return generateDashboardInsights({

    rainfall:
      parseInt(currentData.rainfall) || 0,

    temperature:
      parseInt(currentData.temperature) || 0,

  });

}, [
  currentData.rainfall,
  currentData.temperature,
]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="space-y-5 text-white sm:space-y-6" suppressHydrationWarning>

        {/* ── Sticky top status bar ─────────────────────────────────────── */}
        {mounted && (
          <div className="sticky top-16 z-30 pb-2 sm:top-20">
            <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-slate-950/80 px-4 py-3 shadow-xl shadow-black/30 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
                <PulsingDot color="bg-green-400" />
                <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-green-400">
                  <Activity size={14} />
                  AI Systems Active
                </span>
                <span className="hidden md:block w-px h-4 bg-white/10" />
                <div className="hidden md:block">
                  <LiveClock />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <Badge variant="success">
                  {isLoading ? "Syncing Districts" : "36 Districts Online"}
                </Badge>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  aria-label="Refresh data"
                  className="p-2 rounded-xl border border-white/8 bg-white/5 hover:bg-white/10 hover:border-white/15 transition-all duration-200 text-slate-400 hover:text-white"
                >
                  <RefreshCw
                    size={14}
                    className={isRefreshing ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Critical Alerts ───────────────────────────────────────────── */}
        <CriticalAlerts />

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-4 sm:rounded-3xl sm:p-6 xl:p-7">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-green-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-blue-500/8 blur-3xl" />

          {/* Subtle grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 flex flex-col gap-7 xl:flex-row xl:items-start xl:gap-10">

            {/* Left: Greeting + actions */}
            <div className="flex-1 min-w-0">

              {/* District selector */}
              <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-2xl border border-white/10 bg-slate-800/60 px-4 py-2">
  <Map
    size={15}
    className="text-green-400 shrink-0"
    aria-hidden="true"
  />

  <label
    htmlFor="district-select"
    className="sr-only"
  >
    Select district
  </label>

  <select
    id="district-select"
    value={selectedDistrict}
    onChange={(e) => setSelectedDistrict(e.target.value)}
    className="min-w-0 max-w-[13rem] cursor-pointer appearance-none bg-transparent pr-5 text-sm font-medium text-white outline-none sm:max-w-none"
  >
                  {districts.map((d) => (
                    <option key={d.name} value={d.name} className="bg-slate-900">
                      {d.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-slate-500 shrink-0 -ml-4 pointer-events-none" />
              </div>

              {/* Greeting */}
              {/* Greeting */}
<h1 className="mb-4 break-words text-3xl font-bold leading-tight tracking-tight sm:text-4xl xl:text-5xl 2xl:text-6xl">

  {greeting},{" "}

  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">

    {userName}

  </span>{" "}

  👋

</h1>

              <p className="mb-6 max-w-xl text-sm leading-relaxed text-slate-400 sm:mb-8 sm:text-base xl:text-lg">
                MahaInsight is actively monitoring{" "}
                <span className="text-slate-300 font-medium">{selectedDistrict}</span> —
                tracking rainfall, agricultural patterns, and climate risk
                signals in real time across Maharashtra.
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  onClick={() => setShowReport(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-500/25 transition-all duration-200 hover:bg-green-400 active:scale-95"
                >
                  <Zap size={15} />
                  Generate AI Report
                </button>
               <button
  onClick={() => {

    analyticsRef.current?.
      scrollIntoView({
        behavior: "smooth",
      });

  }}
  className="
    px-6 py-3 rounded-2xl
    border border-white/10
    bg-white/5
    hover:bg-white/10
    hover:border-green-500/20
    transition-all duration-300
    font-medium
    text-sm sm:text-base
  "
>

  View Analytics

</button>
              </div>
            </div>

            {/* Right: mini metric grid */}
            <div className="grid w-full grid-cols-2 gap-3 xl:w-auto xl:min-w-[300px] xl:max-w-[340px]">
              {[
                { title: "Active Districts", value: "36" },
                { title: "AI Predictions", value: "124" },
                { title: "Rainfall Alerts", value: "18" },
                { title: "Crop Insights", value: "52" },
              ].map((item) => (
                <HeroMetricCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>

        {/* ── AI Report (conditional) ───────────────────────────────────── */}
        {showReport && (
  <div
    ref={reportRef}
    tabIndex={-1}
    role="region"
    aria-label="AI Generated Report"
    className="animate-in slide-in-from-top-2 duration-300 focus:outline-none"
  >
    <AIReport
      district={selectedDistrict}
      rainfall={currentData.rainfall}
      temperature={currentData.temperature}
      crop={currentData.crop}
      alert={currentData.alert}
      humidity={currentData.humidity}
      windSpeed={currentData.windSpeed}
      onClose={() => setShowReport(false)}
   
   />
  </div>
)}

        {/* ── Stat Cards ───────────────────────────────────────────────── */}
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
  <StatCard
    title="Annual Rainfall"
    value={currentData.rainfall}
    icon={CloudRain}
    description={`Recorded in ${selectedDistrict}`}
    delta="+12.4%"
    deltaPositive={true}
  />
  <StatCard
    title="Temperature"
    value={currentData.temperature}
    icon={Thermometer}
    description={`Current in ${selectedDistrict}`}
    delta="-2.1%"
    deltaPositive={false}
  />
  <StatCard
    title="Major Crop"
    value={currentData.crop}
    icon={Wheat}
    description={`Recommended for ${selectedDistrict}`}
    delta="+8.3%"
    deltaPositive={true}
  />
  <StatCard
    title="Population"
    value="12.4 Cr"
    icon={Users}
    description="Maharashtra state total"
    delta="+2.1%"
    deltaPositive={true}
  />
</div>

        {/* ── AI Insight Chips ──────────────────────────────────────────── */}
        <div className="mt-2">
          <div className="mb-5 flex min-w-0 items-center gap-2">
            <TrendingUp size={16} className="text-green-400" />
            <h2 className="min-w-0 break-words text-sm font-medium text-slate-400">
              AI Risk Analysis — {selectedDistrict}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InsightChip
              label="Flood Risk"
              value={insights.floodRisk}
              colorClass="border-red-500/25 bg-red-500/8 text-red-300"
              icon={AlertTriangle}
            />
            <InsightChip
              label="Heatwave Risk"
              value={insights.heatwaveRisk}
              colorClass="border-orange-500/25 bg-orange-500/8 text-orange-300"
              icon={Thermometer}
            />
            <InsightChip
              label="Rainfall Trend"
              value={insights.rainfallTrend}
              colorClass="border-blue-500/25 bg-blue-500/8 text-blue-300"
              icon={CloudRain}
            />
            <InsightChip
              label="Recommended Crop"
              value={currentData.crop}
              colorClass="border-green-500/25 bg-green-500/8 text-green-300"
              icon={Wheat}
            />
          </div>
        </div>

        {/* ── Map + District Analytics (side by side on xl) ─────────────── */}
        <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-slate-900/50 sm:rounded-3xl lg:col-span-2">
            <div className="flex flex-wrap items-center gap-3 border-b border-white/6 px-4 py-4 sm:px-6">
              <Map size={16} className="text-green-400" />
              <h2 className="text-sm font-medium text-slate-400">
                Climate Map
              </h2>
              <Badge variant="success">Live</Badge>
            </div>
            <div className="h-[320px] sm:h-[420px] lg:h-[450px]">
              <ClimateMap
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/8 bg-slate-900/50 sm:rounded-3xl">
            <div className="flex flex-wrap items-center gap-3 border-b border-white/6 px-4 py-4 sm:px-6">
              <BarChart3 size={16} className="text-blue-400" />
              <h2 className="text-sm font-medium text-slate-400">
                District Analytics
              </h2>
            </div>
            <div className="p-4 sm:p-5">
              <div ref={analyticsRef}>
                <DistrictAnalyticsPanel
                  district={selectedDistrict}
                  rainfall={currentData.rainfall}
                  temperature={currentData.temperature}
                  humidity={currentData.humidity}
                  windSpeed={currentData.windSpeed}
                  crop={currentData.crop}
                  alert={currentData.alert}
                  riskLevel={insights.floodRisk}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Live Alerts ───────────────────────────────────────────────── */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/8 bg-slate-900/50 sm:rounded-3xl">
          <div className="flex items-center gap-3 border-b border-white/6 px-4 py-4 sm:px-6">
            <PulsingDot color="bg-red-400" />
            <h2 className="text-sm font-medium text-slate-400">
              Live Alerts
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <LiveAlerts />
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        

      </div>
    </DashboardLayout>
  );
}
