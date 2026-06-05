"use client";

import { useEffect, useState } from "react";
import { LiveCropResponse } from "@/lib/crops/cropTypes";

export function useLiveCropData(enabled: boolean = true) {
  const [data, setData] = useState<LiveCropResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const fetchLiveCrops = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/crops/live", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch live crop data: ${response.status}`);
        }

        const payload = (await response.json()) as LiveCropResponse;

        if (!Array.isArray(payload.crops)) {
          throw new Error("Invalid live crop response");
        }

        setData(payload);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown crop data error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveCrops();

    const interval = setInterval(fetchLiveCrops, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  return { data, isLoading, error };
}
