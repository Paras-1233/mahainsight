import { fetchOpenMeteoRainfall } from "./rainfallLive";

export async function getDistrictWeatherData() {
  const records = await fetchOpenMeteoRainfall();

  return records.map((record) => ({
    district: record.district,
    temperature: record.temperature ?? 0,
    humidity: record.humidity ?? 0,
    windSpeed: record.windSpeed ?? 0,
    weatherCode: record.weatherCode ?? 0,
    apparentTemperature: record.apparentTemperature,
    pressure: record.pressure,
    cloudCover: record.cloudCover,
    timestamp: record.timestamp,
    source: record.source,
  }));
}
