import {
  getPagination,
  paginateArray,
  paginationHeaders,
  rateLimitRequest,
} from "@/lib/api";
import { fetchOpenMeteoRainfall } from "@/lib/rainfallLive";
import { getLatestRainfallSnapshots } from "@/services/rainfallService";

export async function GET(request: Request) {
  const rateLimitError = await rateLimitRequest({
    request,
    bucket: "rainfall-live",
    limit: 60,
    windowMs: 60 * 1000,
  });

  if (rateLimitError) {
    return rateLimitError;
  }

  const pagination = getPagination(request, {
    defaultPageSize: 50,
    maxPageSize: 100,
  });

  try {
    const liveData = await fetchOpenMeteoRainfall();
    const records = paginateArray(liveData, pagination);

    return Response.json(records, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
        ...paginationHeaders(liveData.length, pagination),
      },
    });
  } catch (error) {
    console.error("Failed to fetch live rainfall", error);

    const fallbackData = await getLatestRainfallSnapshots();
    const records = paginateArray(fallbackData, pagination);

    return Response.json(records, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
        ...paginationHeaders(fallbackData.length, pagination),
      },
    });
  }
}
