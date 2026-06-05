import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  delta?: string;
  deltaPositive?: boolean;
}

import React from "react";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  delta,
  deltaPositive = true,
}: StatCardProps) {

  return (

    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-300 hover:border-green-400/20 hover:bg-white/[0.07] sm:rounded-3xl sm:p-6">

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500" />

      <div className="relative z-10">

        {/* Top */}
        <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5">

          <h3 className="min-w-0 text-sm font-medium tracking-wide text-slate-400 sm:text-base">

            {title}

          </h3>

          <div className="shrink-0 rounded-xl border border-green-500/10 bg-green-500/10 p-2.5 sm:rounded-2xl sm:p-3">

            <Icon
              className="text-green-400"
              size={20}
            />

          </div>

        </div>

        {/* Value */}
        <div className="flex items-end justify-between gap-4">

          <div>

            <h2 className="break-words text-2xl font-bold tracking-tight text-white sm:text-3xl xl:text-4xl">

              {value}

            </h2>

            {/* Delta Indicator */}
            {delta && (

              <div
                className={`
                  mt-3 inline-flex items-center gap-2
                  rounded-full px-3 py-1 text-xs font-medium

                  ${
                    deltaPositive
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }
                `}
              >

                <span>

                  {deltaPositive
                    ? "↑"
                    : "↓"}

                </span>

                {delta}

              </div>

            )}

          </div>

        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed mt-4">

          {description}

        </p>

      </div>

    </div>

  );
}

export default React.memo(StatCard);
