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

    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:border-green-400/20 hover:bg-white/[0.07]">

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500" />

      <div className="relative z-10">

        {/* Top */}
        <div className="flex items-center justify-between mb-5">

          <h3 className="text-slate-400 font-medium tracking-wide">

            {title}

          </h3>

          <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/10">

            <Icon
              className="text-green-400"
              size={20}
            />

          </div>

        </div>

        {/* Value */}
        <div className="flex items-end justify-between gap-4">

          <div>

            <h2 className="text-4xl font-bold text-white tracking-tight">

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