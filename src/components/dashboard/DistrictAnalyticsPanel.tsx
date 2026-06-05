"use client";
import {
  getRiskSeverity,
} from "@/lib/ai/mapRiskEngine";

import React from "react";
import {
  CloudRain,
  CloudSun,
  AlertTriangle,
  Wheat,
  Wind,
  Droplets,
  ShieldAlert,
} from "lucide-react";

interface Props {
  district: string;
  rainfall: string;
  temperature: string;
  humidity: string;
  windSpeed: string;
  crop: string;
  alert: string;
  riskLevel: string;
}

 function DistrictAnalyticsPanel({
  district,
  rainfall,
  temperature,
  humidity,
  windSpeed,
  crop,
  alert,
  riskLevel,
}: Props) {
  
  const severity =
  getRiskSeverity(riskLevel);

  return (

    <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-slate-950/60 p-4 text-white backdrop-blur-xl sm:rounded-3xl sm:p-5">

      {/* Single subtle glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">

            <div className="min-w-0">

              <div className="flex items-center gap-2 mb-2">

                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />

                <span className="text-green-400 text-xs uppercase tracking-widest font-medium">

                  Live District Monitoring

                </span>

              </div>

              <h2 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">

                {district}

              </h2>

            </div>

            {/* Risk Badge */}
            {/* Risk Severity */}
<div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:min-w-[240px] sm:max-w-xs sm:flex-1">

  <div className="flex items-center justify-between mb-3">

    <p className="text-xs uppercase tracking-widest text-slate-500">

      Risk Severity

    </p>

    <span className="text-sm font-semibold text-white">

      {severity.value}%

    </span>

  </div>

  {/* Progress Bar */}
  <div className="h-3 rounded-full bg-white/5 overflow-hidden">

    <div
      className={`
        h-full rounded-full
        transition-all duration-700
        ${severity.color}
      `}
      style={{
        width: `${severity.value}%`,
      }}
    />

  </div>

  <p className="mt-3 text-sm font-medium text-slate-300">

    {riskLevel}

  </p>

</div>

          </div>

          <p className="text-slate-400 text-sm leading-relaxed">

            AI-powered environmental monitoring
            and climate intelligence system
            actively tracking atmospheric
            conditions in real time.

          </p>

        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">

            <div className="flex items-center gap-2 mb-3">

              <CloudRain
                size={18}
                className="text-blue-400"
              />

              <h3 className="text-sm font-medium">

                Rainfall

              </h3>

            </div>

            <p className="break-words text-xl font-bold sm:text-2xl">

              {rainfall}

            </p>

          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">

            <div className="flex items-center gap-2 mb-3">

              <CloudSun
                size={18}
                className="text-yellow-400"
              />

              <h3 className="text-sm font-medium">

                Temperature

              </h3>

            </div>

            <p className="break-words text-xl font-bold sm:text-2xl">

              {temperature}

            </p>

          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">

            <div className="flex items-center gap-2 mb-3">

              <Droplets
                size={18}
                className="text-cyan-400"
              />

              <h3 className="text-sm font-medium">

                Humidity

              </h3>

            </div>

           <p className="break-words text-xl font-bold sm:text-2xl">
  {humidity}
</p>

          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">

            <div className="flex items-center gap-2 mb-3">

              <Wind
                size={18}
                className="text-slate-300"
              />

              <h3 className="text-sm font-medium">

                Wind Speed

              </h3>

            </div>

            <p className="break-words text-xl font-bold sm:text-2xl">
  {windSpeed}
</p>

          </div>

        </div>

        {/* Intelligence Sections */}
        <div className="space-y-4 mt-6">

          {/* Crop Intelligence */}
          <div className="rounded-2xl border border-green-500/15 bg-green-500/5 p-4">

            <div className="flex items-center gap-2 mb-3">

              <Wheat
                size={18}
                className="text-green-400"
              />

              <h3 className="text-lg font-semibold">

                Crop Intelligence

              </h3>

            </div>

            <p className="text-slate-300 text-sm leading-relaxed">

              AI systems recommend
              <span className="text-green-400 font-semibold">
                {" "} {crop}
              </span>
              cultivation based on current
              rainfall distribution,
              climate conditions,
              and soil moisture predictions.

            </p>

          </div>

          {/* Climate Alert */}
          <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-4">

            <div className="flex items-center gap-2 mb-3">

              <AlertTriangle
                size={18}
                className="text-red-400"
              />

              <h3 className="text-lg font-semibold">

                Climate Alert

              </h3>

            </div>

            <p className="text-slate-300 text-sm leading-relaxed">

              {alert}

            </p>

          </div>

          {/* AI Recommendations */}
          <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4">

            <div className="flex items-center gap-2 mb-3">

              <ShieldAlert
                size={18}
                className="text-blue-400"
              />

              <h3 className="text-lg font-semibold">

                AI Recommendations

              </h3>

            </div>

            <ul className="space-y-2 text-sm text-slate-300">

              <li>
                • Monitor rainfall intensity
                over the next 48 hours.
              </li>

              <li>
                • Prepare drainage systems
                in high-risk flood regions.
              </li>

              <li>
                • Continue AI-assisted crop
                monitoring and irrigation planning.
              </li>

            </ul>

          </div>

        </div>

      </div>

    </div>

  );
}
export default React.memo(
  DistrictAnalyticsPanel
);
