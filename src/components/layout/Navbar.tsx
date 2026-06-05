"use client";

import Link from "next/link";
import MobileSidebar from "./MobileSidebar";
import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserCircle } from "lucide-react";

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

export default function Navbar() {
  const router = useRouter();
  const loggedIn = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getServerAuthSnapshot
  );

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    localStorage.removeItem("mahainsight-user");
    window.dispatchEvent(new Event("mahainsight-auth"));
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 min-h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sm:min-h-20">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:min-h-20 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <MobileSidebar />

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-white sm:text-xl">
              Maharashtra Climate Dashboard
            </h2>
            <p className="hidden text-sm text-slate-400 sm:block">
              AI-Powered Climate Intelligence
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse sm:h-3 sm:w-3" />

          {loggedIn && (
            <>
              <Link
                href="/profile"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-200 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2"
              >
                <UserCircle className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-sm font-medium text-red-300 transition hover:border-red-500/40 hover:bg-red-500/20 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
