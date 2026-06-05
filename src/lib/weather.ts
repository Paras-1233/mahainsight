export async function getWeatherData(
  latitude: number,
  longitude: number
) {

  const url =
  `https://api.open-meteo.com/v1/forecast
  ?latitude=${latitude}
  &longitude=${longitude}
  &current=
  temperature_2m,
  relative_humidity_2m,
  wind_speed_10m,
  weather_code,
  apparent_temperature,
  pressure_msl,
  cloud_cover
  &daily=
  weather_code,
  temperature_2m_max,
  temperature_2m_min,
  precipitation_probability_max
  &timezone=auto`
  .replace(/\s+/g, "");
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    console.error(
      "Weather API Error:",
      response.status
    );

    throw new Error("Failed to fetch weather data");
  }

  return response.json();
}
