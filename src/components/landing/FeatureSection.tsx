"use client";

import { motion } from "framer-motion";
import { CloudRain, CloudSun, Map, Wheat } from "lucide-react";

const features = [
  {
    title: "Rainfall Analytics",
    description:
      "Monitor district-wise rainfall patterns and seasonal climate changes across Maharashtra.",
    icon: CloudRain,
    accent: "emerald",
    stat: "12K+ records",
  },
  {
    title: "Weather Intelligence",
    description:
      "Track temperature, humidity, wind speed, and atmospheric conditions in real time.",
    icon: CloudSun,
    accent: "sky",
    stat: "Real-time",
  },
  {
    title: "Interactive Maps",
    description:
      "Visualize climate intelligence with dynamic geospatial analytics and district markers.",
    icon: Map,
    accent: "teal",
    stat: "36 districts",
  },
  {
    title: "Crop Insights",
    description:
      "Analyze crop patterns, agricultural trends, and seasonal farming intelligence.",
    icon: Wheat,
    accent: "amber",
    stat: "24+ crops",
  },
];

const accentMap: Record<string, { bg: string; iconColor: string; badge: string; glow: string }> = {
  emerald: {
    bg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glow: "group-hover:shadow-emerald-500/10",
  },
  sky: {
    bg: "bg-sky-500/10",
    iconColor: "text-sky-400",
    badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    glow: "group-hover:shadow-sky-500/10",
  },
  teal: {
    bg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    badge: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    glow: "group-hover:shadow-teal-500/10",
  },
  amber: {
    bg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    glow: "group-hover:shadow-amber-500/10",
  },
};

export default function FeatureSection() {
  return (
    <section id="features" className="relative bg-[#060d15] text-white py-32 px-6 overflow-hidden">
      {/* Section ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-400 mb-4">
            Platform capabilities
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]">
            Powerful Climate
            <span className="block text-slate-400 font-normal mt-1">Intelligence Tools</span>
          </h2>
          <p className="mt-5 text-slate-400 text-base leading-relaxed">
            Built for farmers, researchers, policymakers, and climate analysts
            across Maharashtra.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const a = accentMap[feature.accent];

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className={[
                  "group relative rounded-2xl border border-white/7 bg-white/3",
                  "hover:border-white/14 hover:bg-white/5",
                  "p-7 transition-all duration-300 cursor-default overflow-hidden",
                  `hover:shadow-xl ${a.glow}`,
                ].join(" ")}
              >
                {/* Hover gradient sweep */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/3 to-transparent transition-opacity duration-500 rounded-2xl pointer-events-none" />

                {/* Icon */}
                <div
                  className={[
                    "relative w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300",
                    a.bg,
                    "group-hover:scale-110",
                  ].join(" ")}
                >
                  <Icon className={`${a.iconColor} w-5 h-5`} strokeWidth={1.75} />
                </div>

                {/* Content */}
                <h3 className="text-[1.05rem] font-semibold text-white mb-2.5 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">
                  {feature.description}
                </p>

                {/* Stat badge */}
                <span
                  className={[
                    "inline-flex items-center text-[11px] font-semibold tracking-wide uppercase",
                    "px-2.5 py-1 rounded-md border",
                    a.badge,
                  ].join(" ")}
                >
                  {feature.stat}
                </span>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}