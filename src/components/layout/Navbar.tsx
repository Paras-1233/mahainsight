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
    <header className="sticky top-0 z-40 h-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <MobileSidebar />

          <div>
            <h2 className="text-xl font-semibold text-white">
              Maharashtra Climate Dashboard
            </h2>
            <p className="text-sm text-slate-400">
              AI-Powered Climate Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />

          {loggedIn && (
            <>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-200"
              >
                <UserCircle className="h-4 w-4" aria-hidden="true" />
                Profile
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:border-red-500/40 hover:bg-red-500/20"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
