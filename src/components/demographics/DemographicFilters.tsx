"use client";

import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface DemographicFiltersProps {
  currentDistrict: string;
  districts: string[];
}

export default function DemographicFilters({
  currentDistrict,
  districts,
}: DemographicFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleDistrictChange = (district: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      if (district === "all") {
        params.delete("district");
      } else {
        params.set("district", district);
      }

      const query = params.toString();
      router.push(query ? `/demographics?${query}` : "/demographics");
    });
  };

  return (
    <div className="relative inline-block">
      <select
        value={currentDistrict}
        onChange={(event) => handleDistrictChange(event.target.value)}
        disabled={isPending}
        className="cursor-pointer appearance-none rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 pr-10 text-sm text-white transition-colors hover:border-slate-500 disabled:opacity-50"
      >
        <option value="all">All Districts</option>
        {[...districts].sort().map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}
