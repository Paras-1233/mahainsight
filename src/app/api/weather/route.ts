import { prisma } from "@/lib/prisma";
import { getPagination, paginatedJson, rateLimitRequest } from "@/lib/api";
import { logServerError } from "@/lib/security";

export async function GET(request: Request) {
  const rateLimitError = await rateLimitRequest({
    request,
    bucket: "weather-list",
    limit: 120,
    windowMs: 60 * 1000,
  });

  if (rateLimitError) {
    return rateLimitError;
  }

  const pagination = getPagination(request);

  try {
    const [weather, total] = await Promise.all([
      prisma.weather.findMany({
        include: {
          district: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.weather.count(),
    ]);

    return paginatedJson(weather, total, pagination);
  } catch (error) {
    logServerError("Failed to fetch weather data", error);

    return Response.json(
      {
        error: "Failed to fetch weather data",
      },
      {
        status: 500,
      }
    );
  }
}
