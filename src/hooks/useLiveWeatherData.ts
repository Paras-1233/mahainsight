"use client";

import { useEffect, useState } from "react";

interface LiveWeatherData {
  district: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  apparentTemperature: number | null;
  pressure: number | null;
  cloudCover: number | null;
  timestamp: string;
  source: string;
}

interface UseWeatherDataResult {
  data: LiveWeatherData[] | null;
  isLoading: boolean;
  error: string | null;
}

export function useLiveWeatherData(): UseWeatherDataResult {
  const [data, setData] = useState<LiveWeatherData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch("/api/weather/live", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const weatherData = await response.json();
        setData(weatherData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch weather data"
        );
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();

    const interval = setInterval(fetchWeatherData, 30000);

    return () => clearInterval(interval);
  }, []);

  return { data, isLoading, error };
}
