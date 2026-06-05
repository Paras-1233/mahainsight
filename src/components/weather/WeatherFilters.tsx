"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";

interface WeatherFiltersProps {
  districts: string[];
  selectedDistrict: string;
}

export default function WeatherFilters({
  districts,
  selectedDistrict,
}: WeatherFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleDistrictChange = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("district", value);
      router.push(`/weather?${params.toString()}`);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      router.push("/weather");
    });
  };

  const isFiltered = selectedDistrict !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* District Filter */}
      <div className="relative">
        <select
          value={selectedDistrict}
          onChange={(e) => handleDistrictChange(e.target.value)}
          disabled={isPending}
          className="cursor-pointer appearance-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 pr-9 text-sm font-medium text-white transition-colors hover:border-green-400/30 hover:bg-green-500/10 disabled:opacity-50"
        >
          <option value="all" className="bg-slate-950">
            All Districts
          </option>
          {districts
            .slice()
            .sort()
            .map((district) => (
              <option key={district} value={district} className="bg-slate-950">
                {district}
              </option>
            ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>

      {/* Reset Button */}
      {isFiltered && (
        <button
          onClick={handleReset}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-green-400/30 hover:bg-green-500/10 disabled:opacity-50"
        >
          <RotateCcw size={14} />
          Reset Filters
        </button>
      )}
    </div>
  );
}
