"use client";

import { motion } from "framer-motion";

const stats = [
  {
    title: "Districts Monitored",
    value: "36+",
    description: "All Maharashtra districts with live climate feeds",
    icon: "🗺",
  },
  {
    title: "Rainfall Records",
    value: "12K+",
    description: "Historical and real-time precipitation data points",
    icon: "🌧",
  },
  {
    title: "Climate Insights",
    value: "500+",
    description: "AI-generated seasonal and trend analyses published",
    icon: "📊",
  },
  {
    title: "Crop Analytics",
    value: "24+",
    description: "Agricultural varieties tracked with yield predictions",
    icon: "🌾",
  },
];

export default function StatsSection() {
  return (
    <section id="stats" className="relative bg-[#050b12] text-white py-32 px-6 overflow-hidden">
      {/* Decorative line */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      {/* Background glow */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/6 rounded-full blur-[80px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/6 rounded-full blur-[80px]" />

      <div className="max-w-7xl mx-auto relative">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-400 mb-4">
            By the numbers
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]">
            Maharashtra Climate
            <span className="block text-slate-400 font-normal mt-1">Intelligence at Scale</span>
          </h2>
          <p className="mt-5 text-slate-400 text-base leading-relaxed">
            Real-time analytics and agricultural insights powered by modern
            climate data systems.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.09 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl border border-white/7 bg-white/3 p-8 overflow-hidden hover:border-emerald-500/20 hover:bg-white/5 transition-all duration-300"
            >
              {/* Corner glow */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/8 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                {/* Emoji icon */}
                <span className="text-2xl mb-5 block">{stat.icon}</span>

                {/* Value */}
                <p className="text-5xl font-bold text-emerald-400 tracking-tight leading-none mb-4">
                  {stat.value}
                </p>

                {/* Title */}
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
                  {stat.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed">
                  {stat.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}