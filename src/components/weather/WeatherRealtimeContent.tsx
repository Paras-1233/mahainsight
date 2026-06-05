"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import SectionCard from "@/components/shared/SectionCard";
import StatCard from "@/components/cards/StatCard";
import WeatherHistoryChart from "@/components/charts/WeatherHistoryChart";
import WeatherFilters from "@/components/weather/WeatherFilters";
import { useLiveWeatherData } from "@/hooks/useLiveWeatherData";
import {
  AlertCircle,
  Cloud,
  CloudRain,
  Droplets,
  Gauge,
  Radio,
  RefreshCw,
  Thermometer,
  Wind,
} from "lucide-react";

type WeatherHistoryPoint = {
  temperature: number;
  createdAt: Date | string;
};

type DistrictWeather = {
  district: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  apparentTemperature?: number | null;
  pressure?: number | null;
  cloudCover?: number | null;
  timestamp?: string;
  source?: string;
};

interface WeatherRealtimeContentProps {
  districts: string[];
  forecastData: Array<{
    day: string;
    maxTemp: number;
    minTemp: number;
    rainChance: number;
  }>;
  initialWeatherByDistrict: DistrictWeather[];
  historyData: WeatherHistoryPoint[];
}

function getWeatherDescription(code: number): string {
  if (code === 0) return "Clear Sky";
  if (code === 1 || code === 2) return "Mostly Clear";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code === 51 || code === 53 || code === 55) return "Light Drizzle";
  if (code === 61 || code === 63 || code === 65) return "Rain";
  if (code === 71 || code === 73 || code === 75) return "Snow";
  if (code === 80 || code === 81 || code === 82) return "Rain Showers";
  if (code === 85 || code === 86) return "Snow Showers";
  if (code >= 80 && code <= 99) return "Thunderstorm";

  return "Unknown";
}

function getRiskLabel(value: number, warning: number, danger: number) {
  if (value >= danger) return "High";
  if (value >= warning) return "Moderate";

  return "Normal";
}

function average(values: Array<number | null | undefined>) {
  const validValues = values.filter(
    (value): value is number => typeof value === "number" && Number.isFinite(value)
  );

  if (validValues.length === 0) return null;

  return validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
}

function getMaharashtraWeather(weatherData: DistrictWeather[]): DistrictWeather | null {
  if (weatherData.length === 0) return null;

  return {
    district: "Maharashtra",
    temperature: average(weatherData.map((weather) => weather.temperature)) ?? 0,
    humidity: average(weatherData.map((weather) => weather.humidity)) ?? 0,
    windSpeed: average(weatherData.map((weather) => weather.windSpeed)) ?? 0,
    weatherCode: weatherData[0]?.weatherCode ?? 0,
    apparentTemperature: average(
      weatherData.map((weather) => weather.apparentTemperature)
    ),
    pressure: average(weatherData.map((weather) => weather.pressure)),
    cloudCover: average(weatherData.map((weather) => weather.cloudCover)),
    timestamp: weatherData
      .map((weather) => weather.timestamp)
      .filter((timestamp): timestamp is string => Boolean(timestamp))
      .sort()
      .at(-1),
    source: weatherData[0]?.source,
  };
}

function formatMetric(value: number | null | undefined, suffix: string, digits = 0) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "N/A";

  return `${value.toFixed(digits)}${suffix}`;
}

export default function WeatherRealtimeContent({
  districts,
  forecastData,
  initialWeatherByDistrict,
  historyData,
}: WeatherRealtimeContentProps) {
  const searchParams = useSearchParams();
  const selectedDistrict = searchParams.get("district") ?? "all";
  const { data: liveWeatherData, isLoading, error } = useLiveWeatherData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const weatherData = liveWeatherData?.length
    ? liveWeatherData
    : initialWeatherByDistrict;
  const currentWeather = useMemo(() => {
    if (selectedDistrict === "all") {
      return getMaharashtraWeather(weatherData) ?? initialWeatherByDistrict[0];
    }

    return (
      weatherData.find(
        (weather) =>
          weather.district.toLowerCase() === selectedDistrict.toLowerCase()
      ) ??
      initialWeatherByDistrict.find(
        (weather) =>
          weather.district.toLowerCase() === selectedDistrict.toLowerCase()
      ) ??
      initialWeatherByDistrict[0]
    );
  }, [initialWeatherByDistrict, selectedDistrict, weatherData]);

  const lastUpdate = currentWeather?.timestamp
    ? new Date(currentWeather.timestamp)
    : null;
  const isConnected = Boolean(liveWeatherData?.length) && !error;
  const selectedLabel =
    selectedDistrict === "all" ? "Maharashtra" : selectedDistrict;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch("/api/weather/live", { cache: "no-store" });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!currentWeather) {
    return <div className="h-96 rounded-3xl bg-white/5 animate-pulse" />;
  }

  const condition = getWeatherDescription(currentWeather.weatherCode);
  const weatherAlerts = [
    currentWeather.temperature > 38 && {
      title: "Heatwave",
      detail: "High temperature warning active",
      className: "border-red-500/30 bg-red-500/10 text-red-200",
      iconClassName: "text-red-400",
    },
    currentWeather.humidity > 80 && {
      title: "High Humidity",
      detail: "High humidity levels detected",
      className: "border-blue-500/30 bg-blue-500/10 text-blue-200",
      iconClassName: "text-blue-400",
    },
    currentWeather.windSpeed > 40 && {
      title: "Strong Winds",
      detail: "Wind speed exceeds safe levels",
      className: "border-amber-500/30 bg-amber-500/10 text-amber-200",
      iconClassName: "text-amber-400",
    },
  ].filter(Boolean) as Array<{
    title: string;
    detail: string;
    className: string;
    iconClassName: string;
  }>;

  return (
    <div className="space-y-8 text-white">
      <div>
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Weather Intelligence Center</h1>
            <p className="mt-3 text-lg text-slate-400">
              Real-time climate and atmospheric conditions across Maharashtra
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5">
            <Radio size={14} className="animate-pulse text-green-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-green-300">
              {isLoading ? "Loading" : isConnected ? "Live" : "Cached"}
            </span>
            {lastUpdate && (
              <span className="text-xs text-green-400/70">
                {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm text-slate-300">
            <span className="text-slate-400">Region:</span>
            <span className="ml-2 font-medium text-white">{selectedLabel}</span>
            <span className="mx-3 text-slate-600">|</span>
            <span className="text-slate-400">Source:</span>
            <span className="ml-2 font-medium text-white">
              {currentWeather.source ?? (isConnected ? "Live feed" : "Server snapshot")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <WeatherFilters
              districts={districts}
              selectedDistrict={selectedDistrict}
            />
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-green-400/30 hover:bg-green-500/10 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={isRefreshing ? "animate-spin text-green-400" : ""}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
          Live weather feed is unavailable. Showing latest server snapshot.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Temperature"
          value={`${currentWeather.temperature.toFixed(1)}\u00B0C`}
          icon={Thermometer}
          description={`Current in ${selectedLabel}`}
        />
        <StatCard
          title="Humidity"
          value={`${currentWeather.humidity.toFixed(0)}%`}
          icon={Droplets}
          description="Current humidity level"
        />
        <StatCard
          title="Wind Speed"
          value={`${currentWeather.windSpeed.toFixed(1)} km/h`}
          icon={Wind}
          description="Average wind conditions"
        />
        <StatCard
          title="Conditions"
          value={condition.split(" ")[0]}
          icon={Cloud}
          description={condition}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard title="7-Day Weather Forecast">
            <div className="space-y-3">
              {forecastData.slice(0, 7).map((forecast) => (
                <div
                  key={forecast.day}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-green-400/20 hover:bg-white/[0.07]"
                >
                  <div className="min-w-0">
                    <h3 className="font-medium text-white">{forecast.day}</h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                      <CloudRain size={14} className="text-green-400" />
                      Rain chance {forecast.rainChance}%
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-right font-semibold text-white">
                    {forecast.maxTemp.toFixed(0)}
                    {"\u00B0"} / {forecast.minTemp.toFixed(0)}
                    {"\u00B0"}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Weather Alerts">
          <div className="space-y-3">
            {weatherAlerts.length > 0 ? (
              weatherAlerts.map((alert) => (
                <div
                  key={alert.title}
                  className={`flex items-start gap-3 rounded-lg border p-3 ${alert.className}`}
                >
                  <AlertCircle
                    size={16}
                    className={`mt-0.5 flex-shrink-0 ${alert.iconClassName}`}
                  />
                  <div>
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs opacity-80">{alert.detail}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-green-200">
                <AlertCircle
                  size={16}
                  className="mt-0.5 flex-shrink-0 text-green-400"
                />
                <div>
                  <p className="text-sm font-medium">Safe Conditions</p>
                  <p className="text-xs opacity-80">No active weather alerts</p>
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="AI Weather Intelligence">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Heat Stress",
              value: getRiskLabel(currentWeather.temperature, 32, 38),
              className: "border-orange-500/20 bg-orange-500/10 text-orange-300",
            },
            {
              title: "Humidity Risk",
              value: getRiskLabel(currentWeather.humidity, 75, 85),
              className: "border-blue-500/20 bg-blue-500/10 text-blue-300",
            },
            {
              title: "Wind Risk",
              value: getRiskLabel(currentWeather.windSpeed, 25, 40),
              className: "border-green-500/20 bg-green-500/10 text-green-300",
            },
            {
              title: "Pressure Watch",
              value: condition,
              className: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`rounded-2xl border p-5 ${item.className}`}
            >
              <h3 className="mb-2 text-sm font-medium">{item.title}</h3>
              <p className="text-2xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Live District Weather">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {weatherData.slice(0, 9).map((weather) => (
            <div
              key={weather.district}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-green-400/20 hover:bg-white/[0.07]"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="truncate text-lg font-semibold text-white">
                  {weather.district}
                </h3>
                <div className="h-2 w-2 rounded-full bg-green-400" />
              </div>

              <div className="space-y-3">
                {[
                  {
                    label: "Temperature",
                    value: `${weather.temperature.toFixed(1)}\u00B0C`,
                    icon: Thermometer,
                  },
                  {
                    label: "Humidity",
                    value: `${weather.humidity.toFixed(0)}%`,
                    icon: Droplets,
                  },
                  {
                    label: "Wind Speed",
                    value: `${weather.windSpeed.toFixed(1)} km/h`,
                    icon: Wind,
                  },
                  {
                    label: "Conditions",
                    value: getWeatherDescription(weather.weatherCode),
                    icon: Cloud,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 text-slate-400">
                      <Icon size={14} />
                      <span className="text-sm">{label}</span>
                    </div>
                    <span className="text-right text-sm font-semibold text-white">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-white/10 pt-3 text-xs text-slate-400">
                Updated{" "}
                {weather.timestamp
                  ? new Date(weather.timestamp).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })
                  : "recently"}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard title="Historical Weather Trends">
            <WeatherHistoryChart data={historyData} />
          </SectionCard>
        </div>

        <SectionCard title="Atmospheric Metrics">
          <div className="space-y-4">
            {[
              {
                title: "Feels Like",
                value: formatMetric(
                  currentWeather.apparentTemperature,
                  "\u00B0C",
                  1
                ),
                icon: Thermometer,
              },
              {
                title: "Air Pressure",
                value: formatMetric(currentWeather.pressure, " hPa", 0),
                icon: Gauge,
              },
              {
                title: "Cloud Cover",
                value: formatMetric(currentWeather.cloudCover, "%", 0),
                icon: Cloud,
              },
              {
                title: "Source",
                value: currentWeather.source ?? "Open-Meteo",
                icon: CloudRain,
              },
            ].map(({ title, value, icon: Icon }) => (
              <div
                key={title}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center gap-3 text-slate-400">
                  <Icon size={16} className="text-green-400" />
                  <span className="text-sm">{title}</span>
                </div>
                <span className="font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
