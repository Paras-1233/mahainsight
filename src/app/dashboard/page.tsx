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
      className={`rounded-2xl border p-5 group hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-default ${colorClass}`}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium uppercase tracking-widest text-current opacity-60">
          {label}
        </p>
        <Icon size={16} className="opacity-50" />
      </div>
      <p className="text-xl font-bold leading-none">{value}</p>
    </div>
  );
}

function HeroMetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="group rounded-2xl border border-white/8 bg-slate-900/50 p-5 hover:border-green-500/25 hover:bg-slate-900/80 hover:scale-[1.03] transition-all duration-300">
      <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mb-3">
        {title}
      </p>
      <h3 className="text-3xl font-bold text-white tabular-nums">{value}</h3>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [selectedDistrict, setSelectedDistrict] = useState("Ratnagiri");
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
      <div className="space-y-6 text-white" suppressHydrationWarning>

        {/* ── Sticky top status bar ─────────────────────────────────────── */}
        {mounted && (
          <div className="sticky top-0 z-30 pb-2">
            <div className="flex items-center justify-between px-5 py-3 rounded-2xl border border-white/8 bg-slate-950/80 backdrop-blur-xl shadow-xl shadow-black/30">
              <div className="flex items-center gap-4">
                <PulsingDot color="bg-green-400" />
                <span className="text-green-400 text-sm font-medium flex items-center gap-2">
                  <Activity size={14} />
                  AI Systems Active
                </span>
                <span className="hidden md:block w-px h-4 bg-white/10" />
                <div className="hidden md:block">
                  <LiveClock />
                </div>
              </div>

              <div className="flex items-center gap-3">
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
        <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 xl:p-7">
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

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-start gap-10">

            {/* Left: Greeting + actions */}
            <div className="flex-1 min-w-0">

              {/* District selector */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-2xl border border-white/10 bg-slate-800/60">
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
    className="bg-transparent text-white text-sm font-medium outline-none cursor-pointer appearance-none pr-5"
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
<h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight leading-[1.1] mb-4">

  {greeting},{" "}

  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">

    {userName}

  </span>{" "}

  👋

</h1>

              <p className="text-slate-400 text-base xl:text-lg leading-relaxed max-w-xl mb-8">
                MahaInsight is actively monitoring{" "}
                <span className="text-slate-300 font-medium">{selectedDistrict}</span> —
                tracking rainfall, agricultural patterns, and climate risk
                signals in real time across Maharashtra.
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowReport(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-green-500 hover:bg-green-400 active:scale-95 transition-all duration-200 font-medium text-sm text-white shadow-lg shadow-green-500/25"
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
  "
>

  View Analytics

</button>
              </div>
            </div>

            {/* Right: mini metric grid */}
            <div className="grid grid-cols-2 gap-3 xl:min-w-[300px] xl:max-w-[340px] w-full xl:w-auto">
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
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-green-400" />
            <h2 className="text-sm font-medium text-slate-400">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-2 rounded-3xl border border-white/8 bg-slate-900/50 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/6">
              <Map size={16} className="text-green-400" />
              <h2 className="text-sm font-medium text-slate-400">
                Climate Map
              </h2>
              <Badge variant="success">Live</Badge>
            </div>
            <div className="h-[450px]">
              <ClimateMap
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/8 bg-slate-900/50 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/6">
              <BarChart3 size={16} className="text-blue-400" />
              <h2 className="text-sm font-medium text-slate-400">
                District Analytics
              </h2>
            </div>
            <div className="p-5 ">
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
        <div className="rounded-3xl border border-white/8 bg-slate-900/50 overflow-hidden mt-4">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/6">
            <PulsingDot color="bg-red-400" />
            <h2 className="text-sm font-medium text-slate-400">
              Live Alerts
            </h2>
          </div>
          <div className="p-6">
            <LiveAlerts />
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        

      </div>
    </DashboardLayout>
  );
}
