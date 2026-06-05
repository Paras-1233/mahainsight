"use client";

import { useEffect, useState } from "react";
import { LiveMapResponse } from "@/lib/maps/mapTypes";

export function useLiveMapData(enabled = true) {
  const [data, setData] = useState<LiveMapResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const fetchMapData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/maps/live", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch live map data: ${response.status}`);
        }

        const payload = (await response.json()) as LiveMapResponse;

        if (!Array.isArray(payload.districts)) {
          throw new Error("Invalid live map response");
        }

        setData(payload);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown map data error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMapData();

    const interval = setInterval(fetchMapData, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  return { data, isLoading, error };
}
