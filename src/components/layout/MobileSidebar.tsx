"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Menu,
  LayoutDashboard,
  CloudRain,
  CloudSun,
  Wheat,
  Users,
  Map,
  AlertTriangle,
  UserCircle,
} from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Rainfall",
    href: "/rainfall",
    icon: CloudRain,
  },
  {
    title: "Weather",
    href: "/weather",
    icon: CloudSun,
  },
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
  {
    title: "Maps",
    href: "/maps",
    icon: Map,
  },
  {
    title: "Alerts",
    href: "/alerts",
    icon: AlertTriangle,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: UserCircle,
  },
];

export default function MobileSidebar() {
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Sheet>

        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Open navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-200 transition hover:bg-white/10"
          >
            <Menu aria-hidden="true" />
          </button>
        </SheetTrigger>

        <SheetContent side="left" className="bg-slate-900 text-white border-none">
          <SheetTitle className="sr-only">
            Navigation menu
          </SheetTitle>

          <div className="mt-8">
            <h1 className="text-2xl font-bold mb-8">
              MahaInsight
            </h1>

            <nav className="space-y-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <SheetClose key={item.title} asChild>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        "flex items-center gap-3 rounded-xl p-3 transition",
                        isActive
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white",
                      ].join(" ")}
                    >
                      <Icon size={20} aria-hidden="true" />
                      <span>{item.title}</span>
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
          </div>

        </SheetContent>
      </Sheet>
    </div>
  );
}
