"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  LayoutDashboard,
  CloudRain,
  CloudSun,
  Wheat,
  Users,
  Map,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from "lucide-react";

const sections = [
  {
    title: "MAIN",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Rainfall",
        href: "/rainfall",
        icon: CloudRain,
        badge: 3,
      },
      {
        title: "Weather",
        href: "/weather",
        icon: CloudSun,
      },
    ],
  },

  {
    title: "AGRICULTURE",
    items: [
      {
        title: "Crops",
        href: "/crops",
        icon: Wheat,
      },
      {
        title: "Demographics",
        href: "/demographics",
        icon: Users,
      },
    ],
  },

  {
    title: "ANALYSIS",
    items: [
      {
        title: "Maps",
        href: "/maps",
        icon: Map,
      },
      {
        title: "Alerts",
        href: "/alerts",
        icon: AlertTriangle,
        badge: 4,
      },
    ],
  },

  {
    title: "ACCOUNT",
    items: [
      {
        title: "Profile",
        href: "/profile",
        icon: UserCircle,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        hidden md:flex
        shrink-0
        flex-col
        h-screen
        sticky top-0
        border-r border-slate-800
        bg-[#020817]
        transition-all duration-300

        ${collapsed ? "w-24" : "w-64"}
      `}
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-800">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                  <span className="text-emerald-400 font-bold text-lg">
                    M
                  </span>
                </div>

                <div>
                  <h1 className="font-bold text-xl text-white">
                    MahaInsight
                  </h1>

                  <p className="text-xs text-slate-500">
                    Climate Intelligence Platform
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCollapsed(!collapsed)
                }
                aria-label="Collapse sidebar"
                className="
                  h-9 w-9
                  rounded-xl
                  border border-slate-700
                  flex items-center justify-center
                  text-slate-400
                  hover:text-white
                  hover:border-slate-500
                  transition-all
                "
              >
                <ChevronLeft size={18} />
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="h-11 w-11 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 font-bold text-lg">
                  M
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCollapsed(!collapsed)
                }
                aria-label="Expand sidebar"
                className="
                  h-9 w-9
                  rounded-xl
                  border border-slate-700
                  flex items-center justify-center
                  text-slate-400
                "
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Status */}
      {!collapsed && (
        <div className="px-4 pt-5">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />

              <span className="text-sm font-medium text-emerald-400">
                AI Systems Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-6">
        {sections.map((section) => (
          <div key={section.title} className="mb-8">
            {!collapsed && (
              <h3
                className="
                  px-3
                  mb-3
                  text-[11px]
                  font-semibold
                  tracking-[0.2em]
                  text-slate-600
                "
              >
                {section.title}
              </h3>
            )}

            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;

                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    title={collapsed ? item.title : undefined}
                    aria-current={isActive ? "page" : undefined}
                    className={`
                      group
                      flex items-center
                      rounded-2xl
                      transition-all duration-300
                      relative

                      ${
                        collapsed
                          ? "justify-center p-3"
                          : "gap-3 px-3 py-3"
                      }

                      ${
                        isActive
                          ? `
                            bg-emerald-500/10
                            border border-emerald-500/20
                            text-emerald-400
                          `
                          : `
                            text-slate-400
                            hover:text-white
                            hover:bg-slate-900
                          `
                      }
                    `}
                  >
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        transition-all

                        ${
                          isActive
                            ? "bg-emerald-500/10"
                            : "bg-slate-800/50"
                        }
                      `}
                    >
                      <Icon size={20} aria-hidden="true" />
                    </div>

                    {!collapsed && (
                      <>
                        <span className="font-medium">
                          {item.title}
                        </span>

                        {item.badge && (
                          <span
                            className="
                              ml-auto
                              h-6
                              w-6
                              rounded-full
                              bg-red-500/20
                              text-red-400
                              text-xs
                              flex
                              items-center
                              justify-center
                              font-semibold
                            "
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-slate-800 p-4">
          <div className="rounded-2xl bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">
                Status
              </span>

              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

                <span className="text-emerald-400 text-sm">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
