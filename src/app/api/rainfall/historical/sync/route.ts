import { fetchOpenMeteoHistoricalRainfall } from "@/lib/rainfallHistorical";
import { requireApiAuth, unauthorizedResponse } from "@/lib/apiAuth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rateLimit";
import { logServerError, requireSameOrigin } from "@/lib/security";
import { saveHistoricalRainfall } from "@/services/rainfallService";

function parseYear(value: string | null, fallback: number) {
  const year = Number(value);

  return Number.isInteger(year) && year >= 1940 ? year : fallback;
}

async function syncHistoricalRainfall(request: Request) {
  const originError = requireSameOrigin(request);

  if (originError) {
    return originError;
  }

  const ip = getClientIp(request);
  const limit = await checkRateLimit({
    key: `historical-rainfall-sync:${ip}`,
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });

  if (!limit.allowed) {
    return rateLimitResponse(limit.resetAt);
  }

  try {
    const user = await requireApiAuth();

    if (!user) {
      return unauthorizedResponse();
    }

    const url = new URL(request.url);
    const completedYear = new Date().getFullYear() - 1;
    const endYear = Math.min(
      parseYear(url.searchParams.get("endYear"), completedYear),
      completedYear
    );
    const startYear = parseYear(url.searchParams.get("startYear"), endYear - 9);

    if (startYear > endYear) {
      return Response.json(
        {
          error: "startYear must be less than or equal to endYear",
        },
        {
          status: 400,
        }
      );
    }

    if (endYear - startYear > 25) {
      return Response.json(
        {
          error: "Date range cannot exceed 25 years",
        },
        {
          status: 400,
        }
      );
    }

    const records = await fetchOpenMeteoHistoricalRainfall(startYear, endYear);
    const savedCount = await saveHistoricalRainfall(records);

    return Response.json({
      source: "Open-Meteo Archive",
      startYear,
      endYear,
      savedCount,
      districtCount: new Set(records.map((record) => record.district)).size,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    logServerError("Failed to sync historical rainfall", error);

    return Response.json(
      {
        error: "Failed to sync historical rainfall",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  return syncHistoricalRainfall(request);
}

export async function POST(request: Request) {
  return syncHistoricalRainfall(request);
}
