"use client";

import { useState, useEffect } from "react";
import { DistrictRainfall } from "@/lib/rainfall/rainfallTypes";

export function useLiveRainfallData(enabled: boolean = true) {
  const [data, setData] = useState<DistrictRainfall[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchLiveData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/rainfall/live", {
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Failed to fetch live data");

        const liveData = await response.json();

        if (!Array.isArray(liveData)) {
          throw new Error(liveData?.error ?? "Invalid live rainfall response");
        }

        setData(liveData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchLiveData();

    // Open-Meteo updates model-backed weather data periodically, so refresh
    // without hammering the upstream API.
    const interval = setInterval(fetchLiveData, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  return { data, isLoading, error };
}
