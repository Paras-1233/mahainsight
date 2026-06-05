import {
  getPagination,
  paginateArray,
  paginationHeaders,
  rateLimitRequest,
} from "@/lib/api";
import { fetchOpenMeteoRainfall } from "@/lib/rainfallLive";
import {
  buildLiveDemographics,
  deriveDemographicSummary,
} from "@/lib/demographics/demographicCalculations";

export async function GET(request: Request) {
  const rateLimitError = await rateLimitRequest({
    request,
    bucket: "demographics-live",
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
    const records = buildLiveDemographics(rainfallRecords);
    const pagedRecords = paginateArray(records, pagination);

    return Response.json(
      {
        records: pagedRecords,
        summary: deriveDemographicSummary(pagedRecords),
        timestamp: new Date().toISOString(),
        source: "Open-Meteo",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
          ...paginationHeaders(records.length, pagination),
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch live demographics", error);

    const records = buildLiveDemographics([]);
    const pagedRecords = paginateArray(records, pagination);

    return Response.json(
      {
        records: pagedRecords,
        summary: deriveDemographicSummary(pagedRecords),
        timestamp: new Date().toISOString(),
        source: "Static Baseline",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
          ...paginationHeaders(records.length, pagination),
        },
      }
    );
  }
}
