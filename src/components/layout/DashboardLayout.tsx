"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-950 text-white">

      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">

        <Navbar />

        <div className="px-4 py-5 sm:px-6 lg:p-8">
          {children}
        </div>

      </main>

    </div>
  );
}
