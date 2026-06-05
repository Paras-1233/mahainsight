import DashboardLayout from "@/components/layout/DashboardLayout";
import WeatherRealtimeContent from "@/components/weather/WeatherRealtimeContent";
import { districts } from "@/data/districts";
import { getDistrictWeatherData } from "@/lib/districtWeather";
import { getWeatherData } from "@/lib/weather";
import { getWeatherHistory } from "@/services/weatherService";
import { Suspense } from "react";

type ForecastDay = {
  day: string;
  maxTemp: number;
  minTemp: number;
  rainChance: number;
};

interface WeatherPageProps {
  searchParams?: Promise<{
    district?: string;
  }>;
}

export default async function WeatherPage({ searchParams }: WeatherPageProps) {
  const params = await searchParams;
  const selectedDistrict = params?.district ?? "all";
  const forecastDistrict =
    districts.find(
      (district) =>
        district.name.toLowerCase() === selectedDistrict.toLowerCase()
    ) ?? {
      name: "Maharashtra",
      latitude: 19.7515,
      longitude: 75.7139,
    };

  const [weatherData, districtWeather, historyData] = await Promise.all([
    getWeatherData(forecastDistrict.latitude, forecastDistrict.longitude),
    getDistrictWeatherData(),
    getWeatherHistory(1).catch(() => []),
  ]);

  const forecastData: ForecastDay[] =
    weatherData.daily?.time?.map((time: string, index: number) => ({
      day: new Date(time).toLocaleDateString("en-US", {
        weekday: "long",
      }),
      maxTemp: weatherData.daily.temperature_2m_max[index],
      minTemp: weatherData.daily.temperature_2m_min[index],
      rainChance: weatherData.daily.precipitation_probability_max[index] ?? 0,
    })) ?? [];

  return (
    <DashboardLayout>
      <Suspense
        fallback={<div className="h-96 rounded-3xl bg-white/5 animate-pulse" />}
      >
        <WeatherRealtimeContent
          districts={districts.map((district) => district.name)}
          forecastData={forecastData}
          initialWeatherByDistrict={districtWeather}
          historyData={historyData}
        />
      </Suspense>
    </DashboardLayout>
  );
}
