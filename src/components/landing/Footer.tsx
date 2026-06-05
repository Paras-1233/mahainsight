import Link from "next/link";

export default function Footer() {
  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Analytics", href: "/rainfall" },
    { label: "Maps", href: "/maps" },
    { label: "Weather", href: "/weather" },
  ];

  return (
    <footer className="relative bg-[#050b12] border-t border-white/7 text-white px-6 py-12 overflow-hidden">
      {/* Subtle top gradient */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                  <circle cx="8" cy="8" r="2" fill="white" />
                </svg>
              </span>
              <h2 className="text-lg font-semibold tracking-tight">
                Maha<span className="text-emerald-400">Insight</span>
              </h2>
            </div>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              AI-Powered Maharashtra Climate Intelligence Platform
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} MahaInsight · All rights reserved
          </p>
          <p className="text-xs text-slate-700">
            Built with climate data for Maharashtra
          </p>
        </div>
      </div>
    </footer>
  );
}
