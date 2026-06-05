"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, LayoutDashboard, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { label: "Overview", href: "#hero" },
  { label: "Capabilities", href: "#features" },
  { label: "Impact", href: "#stats" },
  { label: "Get Started", href: "#cta" },
];

function subscribeToAuth(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("mahainsight-auth", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("mahainsight-auth", callback);
  };
}

function getAuthSnapshot() {
  return Boolean(window.localStorage.getItem("mahainsight-user"));
}

function getServerAuthSnapshot() {
  return false;
}

export default function LandingNavbar() {
  const router = useRouter();
  const loggedIn = useSyncExternalStore(subscribeToAuth, getAuthSnapshot, getServerAuthSnapshot);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    localStorage.removeItem("mahainsight-user");
    window.dispatchEvent(new Event("mahainsight-auth"));
    closeMenu();
    router.push("/login");
  }

  return (
    <header
      className={[
        "fixed left-0 top-0 z-50 w-full transition-all duration-300",
        scrolled || menuOpen
          ? "border-b border-white/10 bg-[#050b12]/90 shadow-[0_1px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-2xl"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-6">
        <Link href="/" onClick={closeMenu} className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20">
            <BarChart3 className="h-4 w-4 text-white" aria-hidden="true" />
          </span>
          <span className="text-[1.15rem] font-semibold tracking-tight text-white">
            Maha<span className="text-emerald-400">Insight</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Landing navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm text-slate-400 transition-all duration-200 hover:bg-white/8 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:bg-emerald-400 active:scale-[0.98]"
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/20"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-white/10 hover:bg-white/8 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:bg-emerald-400 hover:shadow-emerald-400/30 active:scale-[0.98]"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#050b12]/96 px-5 pb-6 pt-3 shadow-2xl shadow-black/40 backdrop-blur-2xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1" aria-label="Mobile landing navigation">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/8 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mx-auto mt-4 flex max-w-7xl flex-col gap-3 border-t border-white/8 pt-4">
            {loggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-black shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 text-sm font-medium text-red-300 transition hover:border-red-500/40 hover:bg-red-500/20"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-black shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
