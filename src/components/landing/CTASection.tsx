"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section id="cta" className="relative bg-[#060d15] text-white px-6 py-32 overflow-hidden">
      {/* Section lines */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden border border-white/8"
        >
          {/* Multi-layer background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-teal-500/4 to-cyan-500/6" />
          <div className="absolute inset-0 bg-[#060d15]/60" />

          {/* Glow orbs inside card */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-teal-500/12 rounded-full blur-3xl pointer-events-none" />

          {/* Top border accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

          <div className="relative p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* LEFT */}
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase text-emerald-400 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Start Exploring Maharashtra Climate Intelligence
                </span>

                <h2 className="text-4xl lg:text-[2.75rem] font-bold leading-[1.15] tracking-tight">
                  Ready to explore
                  <span className="block bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    climate analytics?
                  </span>
                </h2>

                <p className="mt-5 text-slate-400 text-base leading-relaxed max-w-md">
                  Access rainfall insights, weather intelligence, crop analytics,
                  and interactive climate maps across Maharashtra.
                </p>

                {/* Feature checklist */}
                <ul className="mt-7 space-y-2.5">
                  {[
                    "District-wise rainfall & temperature tracking",
                    "AI-driven crop yield predictions",
                    "Interactive geospatial climate maps",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-400">
                      <svg className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* RIGHT — CTA buttons */}
              <div className="flex flex-col gap-4 lg:items-end">
                <Link href="/dashboard" className="group w-full lg:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 transition-all duration-200 text-black font-semibold text-sm shadow-xl shadow-emerald-500/30 hover:shadow-emerald-400/40 active:scale-[0.98]">
                  Explore Dashboard
                  <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="/weather" className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/12 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-sm font-medium text-slate-300">
                  Learn More
                </Link>

                <p className="text-xs text-slate-600 mt-2 text-center lg:text-right">
                  Free to explore · No signup required
                </p>
              </div>

            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
