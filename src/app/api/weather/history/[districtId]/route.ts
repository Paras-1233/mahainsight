import { getPagination, paginatedJson, rateLimitRequest } from "@/lib/api";
import {
  countWeatherHistory,
  getWeatherHistory,
} from "@/services/weatherService";
import { badRequestResponse } from "@/lib/security";

interface Params {
  params: Promise<{
    districtId: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: Params
) {
  const rateLimitError = await rateLimitRequest({
    request,
    bucket: "weather-history",
    limit: 120,
    windowMs: 60 * 1000,
  });

  if (rateLimitError) {
    return rateLimitError;
  }

  const pagination = getPagination(request, {
    defaultPageSize: 20,
    maxPageSize: 100,
  });

  try {

    const { districtId } =
      await params;
    const parsedDistrictId = Number(districtId);

    if (!Number.isInteger(parsedDistrictId) || parsedDistrictId < 1) {
      return badRequestResponse("Invalid district");
    }

    const [history, total] = await Promise.all([
      getWeatherHistory(parsedDistrictId, {
        skip: pagination.skip,
        take: pagination.take,
      }),
      countWeatherHistory(parsedDistrictId),
    ]);

    return paginatedJson(history, total, pagination);

  } catch {

    return Response.json(
      {
        error:
          "Failed to fetch weather history",
      },
      {
        status: 500,
      }
    );
  }
}
