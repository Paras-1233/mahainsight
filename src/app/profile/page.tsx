"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Activity,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Settings,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

const activityItems = [
  "Viewed rainfall analytics for Ratnagiri.",
  "Generated AI crop recommendation report.",
  "Accessed Maharashtra drought dashboard.",
];

const profileStats = [
  {
    label: "Saved Districts",
    value: "12",
    helper: "Pinned for monitoring",
    icon: MapPin,
  },
  {
    label: "AI Reports",
    value: "28",
    helper: "Generated this season",
    icon: Activity,
  },
  {
    label: "Climate Alerts",
    value: "5",
    helper: "Active watchlist",
    icon: Bell,
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      if (!response.ok) {
        router.push("/login");
        return;
      }

      const data = (await response.json()) as { user: User };

      if (active) {
        setUser(data.user);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [router]);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-28 animate-pulse rounded-3xl border border-white/8 bg-white/5" />
          <div className="grid gap-5 md:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-3xl border border-white/8 bg-white/5"
              />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-3xl border border-white/8 bg-white/5" />
        </div>
      </DashboardLayout>
    );
  }

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <DashboardLayout>
      <div className="space-y-6 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-300">
              <UserCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Account Center
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Profile
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Manage your MahaInsight identity, access status, and recent climate
              intelligence activity.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:pt-20">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/25 hover:bg-white/10"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              Settings
            </button>
          </div>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 xl:p-7">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-cyan-500/8 blur-3xl" />

          <div className="relative z-10 grid gap-6 xl:grid-cols-[1fr_360px] xl:items-center">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-500/15 text-3xl font-bold text-emerald-200 shadow-2xl shadow-emerald-950/30">
                {initials}
              </div>

              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h2 className="break-words text-3xl font-bold tracking-tight sm:text-4xl">
                    {user.name}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Active
                  </span>
                </div>

                <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                  <ProfileInfo icon={Mail} label={user.email} />
                  <ProfileInfo icon={ShieldCheck} label="Research Member" />
                  <ProfileInfo icon={CalendarDays} label="Joined 2026" />
                  <ProfileInfo icon={Clock3} label="Session secured" />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/8 bg-slate-950/40 p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                Access Summary
              </p>
              <div className="mt-5 space-y-4">
                <AccessRow label="Authentication" value="Verified" />
                <AccessRow label="Workspace" value="MahaInsight" />
                <AccessRow label="Role" value="Research" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {profileStats.map(({ label, value, helper, icon: Icon }) => (
            <div
              key={label}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-emerald-400/20 hover:bg-white/[0.07]"
            >
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/5 opacity-0 blur-3xl transition group-hover:opacity-100" />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-400">{label}</p>
                  <h3 className="mt-4 text-4xl font-bold tracking-tight text-white">
                    {value}
                  </h3>
                  <p className="mt-3 text-sm text-slate-500">{helper}</p>
                </div>
                <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/10 p-3 text-emerald-300">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-white/8 bg-slate-900/50 p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                  Timeline
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Recent Activity
                </h3>
              </div>
              <Activity className="h-5 w-5 text-emerald-300" aria-hidden="true" />
            </div>

            <div className="space-y-3">
              {activityItems.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-2xl border border-white/6 bg-slate-950/40 p-4"
                >
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-300">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm text-slate-200">{item}</p>
                    <p className="mt-1 text-xs text-slate-500">Updated recently</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/8 bg-slate-900/50 p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
              Preferences
            </p>
            <h3 className="mt-1 text-xl font-semibold text-white">
              Monitoring Setup
            </h3>

            <div className="mt-6 space-y-4">
              <PreferenceRow label="District watchlist" value="12 active" />
              <PreferenceRow label="Alert delivery" value="Dashboard" />
              <PreferenceRow label="Report cadence" value="Weekly" />
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function ProfileInfo({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-white/6 bg-slate-950/30 px-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </div>
  );
}

function AccessRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-100">{value}</span>
    </div>
  );
}

function PreferenceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/6 bg-slate-950/40 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-base font-semibold text-white">{value}</p>
    </div>
  );
}
