"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { rainfallData } from "@/data/rainfall";

interface RealtimeRainfallData {
  district: string;
  rainfall: number;
  timestamp: Date;
  trend?: "up" | "down" | "stable";
}

interface UseRealtimeRainfallOptions {
  interval?: number; // in milliseconds, default 5000 (5 seconds)
  enabled?: boolean;
  onUpdate?: (data: RealtimeRainfallData[]) => void;
}

/**
 * Hook for real-time rainfall data updates
 * Simulates real-time data with realistic variations
 */
export function useRealtimeRainfall(
  _district: string = "all",
  options: UseRealtimeRainfallOptions = {}
) {
  void _district;

  const {
    interval = 5000,
    enabled = true,
    onUpdate,
  } = options;

  const [data, setData] = useState<RealtimeRainfallData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<Map<string, number>>(new Map());

  const generateRealtimeData = useCallback(
    (): RealtimeRainfallData[] => {
      return rainfallData.map(({ district, rainfall }) => {
        const baseRainfall = rainfall || 1000;

        // Simulate real-time variation (±2-5%)
        const variation = (Math.random() - 0.5) * 0.1;
        const newRainfall = Math.max(
          baseRainfall * 0.8,
          Math.min(baseRainfall * 1.2, baseRainfall * (1 + variation))
        );

        const previousValue = previousDataRef.current.get(district) || baseRainfall;
        let trend: "up" | "down" | "stable";

        if (newRainfall > previousValue * 1.01) {
          trend = "up";
        } else if (newRainfall < previousValue * 0.99) {
          trend = "down";
        } else {
          trend = "stable";
        }

        previousDataRef.current.set(district, newRainfall);

        return {
          district,
          rainfall: Math.round(newRainfall),
          timestamp: new Date(),
          trend,
        };
      });
    },
    []
  );

  const fetchRealtimeData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Simulate API call
      const newData = generateRealtimeData();

      setData(newData);
      setLastUpdate(new Date());
      setIsLive(true);

      if (onUpdate) {
        onUpdate(newData);
      }
    } catch (error) {
      console.error("Failed to fetch real-time data:", error);
      setIsLive(false);
    } finally {
      setIsLoading(false);
    }
  }, [generateRealtimeData, onUpdate]);

  // Setup interval for real-time updates
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Initial fetch
    const initialFetch = setTimeout(fetchRealtimeData, 0);

    // Setup recurring updates
    intervalRef.current = setInterval(fetchRealtimeData, interval);

    return () => {
      clearTimeout(initialFetch);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, fetchRealtimeData]);

  const stopLive = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsLive(false);
  }, []);

  const startLive = useCallback(() => {
    setIsLive(true);
    fetchRealtimeData();
    intervalRef.current = setInterval(fetchRealtimeData, interval);
  }, [fetchRealtimeData, interval]);

  return {
    data,
    isLoading,
    isLive,
    lastUpdate,
    startLive,
    stopLive,
  };
}
