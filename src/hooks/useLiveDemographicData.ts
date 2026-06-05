"use client";

import { useEffect, useState } from "react";
import { LiveDemographicResponse } from "@/lib/demographics/demographicTypes";

export function useLiveDemographicData(enabled = true) {
  const [data, setData] = useState<LiveDemographicResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const fetchLiveDemographics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/demographics/live", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch demographics: ${response.status}`);
        }

        const payload = (await response.json()) as LiveDemographicResponse;

        if (!Array.isArray(payload.records)) {
          throw new Error("Invalid demographics response");
        }

        setData(payload);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown demographics error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveDemographics();

    const interval = setInterval(fetchLiveDemographics, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  return { data, isLoading, error };
}
