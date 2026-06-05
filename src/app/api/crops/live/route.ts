import {
  getPagination,
  paginateArray,
  paginationHeaders,
  rateLimitRequest,
} from "@/lib/api";
import { fetchOpenMeteoRainfall } from "@/lib/rainfallLive";
import {
  buildLiveCropRecords,
  deriveCropSummary,
  getLiveCropRecommendations,
} from "@/lib/crops/cropCalculations";
import { getCropsWithDistricts } from "@/services/cropService";

export async function GET(request: Request) {
  const rateLimitError = await rateLimitRequest({
    request,
    bucket: "crops-live",
    limit: 60,
    windowMs: 60 * 1000,
  });

  if (rateLimitError) {
    return rateLimitError;
  }

  const pagination = getPagination(request, {
    defaultPageSize: 200,
    maxPageSize: 200,
  });

  try {
    const [crops, rainfallRecords] = await Promise.all([
      getCropsWithDistricts(),
      fetchOpenMeteoRainfall(),
    ]);
    const liveCrops = buildLiveCropRecords(crops, rainfallRecords);
    const pagedCrops = paginateArray(liveCrops, pagination);
    const recommendations = getLiveCropRecommendations(pagedCrops);

    return Response.json(
      {
        crops: pagedCrops,
        recommendations,
        summary: deriveCropSummary(pagedCrops, recommendations),
        timestamp: new Date().toISOString(),
        source: "Open-Meteo",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
          ...paginationHeaders(liveCrops.length, pagination),
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch live crop intelligence", error);

    const crops = await getCropsWithDistricts();
    const liveCrops = buildLiveCropRecords(crops, []);
    const pagedCrops = paginateArray(liveCrops, pagination);
    const recommendations = getLiveCropRecommendations(pagedCrops);

    return Response.json(
      {
        crops: pagedCrops,
        recommendations,
        summary: deriveCropSummary(pagedCrops, recommendations),
        timestamp: new Date().toISOString(),
        source: "Database",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
          ...paginationHeaders(liveCrops.length, pagination),
        },
      }
    );
  }
}
