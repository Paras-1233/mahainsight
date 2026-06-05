import { requireApiAuth, unauthorizedResponse } from "@/lib/apiAuth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rateLimit";
import { logServerError, requireSameOrigin } from "@/lib/security";
import { syncDistrictCropProfiles } from "@/services/cropService";

async function syncCrops(request: Request) {
  const originError = requireSameOrigin(request);

  if (originError) {
    return originError;
  }

  const ip = getClientIp(request);
  const limit = await checkRateLimit({
    key: `crop-sync:${ip}`,
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

    const result = await syncDistrictCropProfiles();

    return Response.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    logServerError("Failed to sync district crop profiles", error);

    return Response.json(
      {
        ok: false,
        error: "Failed to sync district crop profiles",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  return syncCrops(request);
}

export async function POST(request: Request) {
  return syncCrops(request);
}
