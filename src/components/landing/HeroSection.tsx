"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";

const stats = [
  { label: "Rainfall", value: "1,240 mm", unit: "avg annual" },
  { label: "Temperature", value: "32°C", unit: "current" },
  { label: "Districts", value: "36", unit: "monitored" },
  { label: "Crop Types", value: "24+", unit: "tracked" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.12,
      ease: "easeOut",
    },
  }),
};

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-[#050b12] text-white flex items-center"
    >
      {/* Ambient glow layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-teal-400/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-cyan-500/4 rounded-full blur-[80px]" />
        {/* Subtle dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* LEFT — Text content */}
          <div>
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-1.5 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-300 tracking-wide uppercase">
                AI-Powered Climate Intelligence · Maharashtra
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="show"
              className="text-5xl lg:text-[3.75rem] xl:text-[4.25rem] font-bold leading-[1.1] tracking-tight"
            >
              Smart Climate
              <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Insights for Maharashtra
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="show"
              className="mt-7 text-[1.05rem] text-slate-400 leading-relaxed max-w-lg"
            >
              Monitor rainfall, weather patterns, crop analytics, district
              climate insights, and AI-driven agricultural intelligence across
              all 36 districts of Maharashtra.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="show"
              className="flex flex-wrap items-center gap-3 mt-10"
            >
              <Link href="/dashboard" className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-all duration-200 font-semibold text-black text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-400/35 active:scale-[0.98]">
                Explore Dashboard
                <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/rainfall" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-sm font-medium text-slate-300">
                View Analytics
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate="show"
              className="mt-12 flex items-center gap-6 text-xs text-slate-500"
            >
              {["36 Districts", "Real-time data", "AI-powered insights"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500/60" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Stats card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            {/* Card glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/12 to-teal-500/8 blur-xl scale-105" />

            <div className="relative rounded-3xl border border-white/8 bg-white/4 backdrop-blur-2xl p-8 shadow-2xl">
              {/* Card header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Live Overview</p>
                  <h3 className="text-base font-semibold text-white mt-0.5">Climate Dashboard</h3>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                    className="group rounded-2xl bg-slate-900/70 border border-white/5 hover:border-emerald-500/20 p-5 transition-all duration-300"
                  >
                    <p className="text-xs text-slate-500 font-medium mb-2">{s.label}</p>
                    <p className="text-3xl font-bold text-white tracking-tight">{s.value}</p>
                    <p className="text-[11px] text-slate-600 mt-1 uppercase tracking-wide">{s.unit}</p>
                  </motion.div>
                ))}
              </div>

              {/* Bottom bar */}
              <div className="mt-6 pt-5 border-t border-white/6 flex items-center justify-between">
                <p className="text-xs text-slate-600">Updated just now</p>
                <Link href="/dashboard" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  View full report →
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
