import { fetchOpenMeteoRainfall } from "@/lib/rainfallLive";
import { requireApiAuth, unauthorizedResponse } from "@/lib/apiAuth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rateLimit";
import { logServerError, requireSameOrigin } from "@/lib/security";
import { saveRainfallSnapshots } from "@/services/rainfallService";

async function syncRainfallSnapshots(request: Request) {
  const originError = requireSameOrigin(request);

  if (originError) {
    return originError;
  }

  const ip = getClientIp(request);
  const limit = await checkRateLimit({
    key: `rainfall-sync:${ip}`,
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });

  if (!limit.allowed) {
    return rateLimitResponse(limit.resetAt);
  }

  try {
    const user = await requireApiAuth();

    if (!user) {
      return unauthorizedResponse();
    }

    const liveData = await fetchOpenMeteoRainfall();
    const savedCount = await saveRainfallSnapshots(liveData);

    return Response.json({
      savedCount,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    logServerError("Failed to sync rainfall snapshots", error);

    return Response.json(
      {
        error: "Failed to sync rainfall snapshots",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  return syncRainfallSnapshots(request);
}

export async function POST(request: Request) {
  return syncRainfallSnapshots(request);
}
