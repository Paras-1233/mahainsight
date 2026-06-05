import { prisma } from "@/lib/prisma";

interface SaveWeatherInput {
  temperature: number;
  humidity: number;
  windSpeed: number;
  districtId: number;
}

export async function saveWeatherData({
  temperature,
  humidity,
  windSpeed,
  districtId,
}: SaveWeatherInput) {

  return prisma.weather.create({
    data: {
      temperature,
      humidity,
      windSpeed,
      districtId,
    },
  });
}

export async function getWeatherHistory(
  districtId: number,
  {
    skip = 0,
    take = 20,
  }: {
    skip?: number;
    take?: number;
  } = {}
) {

  return prisma.weather.findMany({
    where: {
      districtId,
    },

    orderBy: {
      createdAt: "desc",
    },

    skip,
    take,
  });
}

export async function countWeatherHistory(districtId: number) {
  return prisma.weather.count({
    where: {
      districtId,
    },
  });
}
