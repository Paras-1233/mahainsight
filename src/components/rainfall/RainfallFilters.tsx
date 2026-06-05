"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface RainfallFiltersProps {
  currentDistrict: string;
  currentRange: string;
  districts: string[];
}

export default function RainfallFilters({
  currentDistrict,
  currentRange,
  districts,
}: RainfallFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleDistrictChange = (district: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("district", district);
      router.push(`/rainfall?${params.toString()}`);
    });
  };

  const handleRangeChange = (range: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("range", range);
      router.push(`/rainfall?${params.toString()}`);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      router.push("/rainfall");
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* District Filter */}
      <div className="relative inline-block">
        <select
          value={currentDistrict}
          onChange={(e) => handleDistrictChange(e.target.value)}
          disabled={isPending}
          className="appearance-none rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 pr-10 text-sm text-white transition-colors hover:border-slate-500 disabled:opacity-50 cursor-pointer"
        >
          <option value="all">All Districts</option>
          {districts.sort().map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>

      {/* Range Filter */}
      <div className="relative inline-block">
        <select
          value={currentRange}
          onChange={(e) => handleRangeChange(e.target.value)}
          disabled={isPending}
          className="appearance-none rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 pr-10 text-sm text-white transition-colors hover:border-slate-500 disabled:opacity-50 cursor-pointer"
        >
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Latest Year</option>
          <option value="all">All Time</option>
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>

      {/* Reset Button */}
      {(currentDistrict !== "all" || currentRange !== "30d") && (
        <button
          onClick={handleReset}
          disabled={isPending}
          className="rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-slate-500 hover:text-white disabled:opacity-50"
        >
          Reset
        </button>
      )}
    </div>
  );
}
