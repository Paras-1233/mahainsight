"use client";

import Link from "next/link";
import { BarChart3, CloudRain, MapPinned, Sprout } from "lucide-react";
import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

const highlights = [
  { label: "36 districts", icon: MapPinned },
  { label: "Live rainfall", icon: CloudRain },
  { label: "Crop signals", icon: Sprout },
];

export default function AuthShell({ eyebrow, title, subtitle, children }: AuthShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050b12] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.11),transparent_42%),linear-gradient(180deg,rgba(5,11,18,0.14),#050b12_78%)]" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-6 py-24 lg:grid-cols-[1fr_440px] lg:px-8">
        <section className="hidden max-w-2xl lg:block">
          <Link href="/" className="mb-12 inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20">
              <BarChart3 className="h-4 w-4 text-white" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Maha<span className="text-emerald-400">Insight</span>
            </span>
          </Link>

          <p className="mb-5 inline-flex rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-emerald-300">
            {eyebrow}
          </p>
          <h1 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-tight">
            Climate intelligence for every Maharashtra decision.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
            Keep district weather, rainfall, crops, and alerts in one focused workspace.
          </p>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {highlights.map(({ label, icon: Icon }) => (
              <div key={label} className="rounded-lg border border-white/8 bg-white/5 p-4 backdrop-blur">
                <Icon className="mb-4 h-5 w-5 text-emerald-300" aria-hidden="true" />
                <p className="text-sm font-medium text-slate-200">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[440px] rounded-lg border border-white/10 bg-slate-950/72 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20">
              <BarChart3 className="h-4 w-4 text-white" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Maha<span className="text-emerald-400">Insight</span>
            </span>
          </Link>

          <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">{eyebrow}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
