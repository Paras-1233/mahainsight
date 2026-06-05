import {
  getPagination,
  paginateArray,
  paginationHeaders,
  rateLimitRequest,
} from "@/lib/api";
import { fetchOpenMeteoRainfall } from "@/lib/rainfallLive";
import {
  buildLiveMapDistricts,
  deriveMapSummary,
} from "@/lib/maps/mapCalculations";

export async function GET(request: Request) {
  const rateLimitError = await rateLimitRequest({
    request,
    bucket: "maps-live",
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
    const rainfallRecords = await fetchOpenMeteoRainfall();
    const districts = buildLiveMapDistricts(rainfallRecords);
    const pagedDistricts = paginateArray(districts, pagination);

    return Response.json(
      {
        districts: pagedDistricts,
        summary: deriveMapSummary(pagedDistricts),
        timestamp: new Date().toISOString(),
        source: "Open-Meteo",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
          ...paginationHeaders(districts.length, pagination),
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch live map data", error);

    return Response.json(
      {
        error: "Failed to fetch live map data",
      },
      {
        status: 500,
      }
    );
  }
}
