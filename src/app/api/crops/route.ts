import { getPagination, paginatedJson, rateLimitRequest } from "@/lib/api";
import { logServerError } from "@/lib/security";
import { countCrops, getCropsWithDistricts } from "@/services/cropService";

export async function GET(request: Request) {
  const rateLimitError = await rateLimitRequest({
    request,
    bucket: "crops-list",
    limit: 120,
    windowMs: 60 * 1000,
  });

  if (rateLimitError) {
    return rateLimitError;
  }

  const pagination = getPagination(request);

  try {
    const [crops, total] = await Promise.all([
      getCropsWithDistricts({
        skip: pagination.skip,
        take: pagination.take,
      }),
      countCrops(),
    ]);

    return paginatedJson(crops, total, pagination);
  } catch (error) {
    logServerError("Failed to fetch crops", error);

    return Response.json(
      {
        error: "Failed to fetch crops",
      },
      {
        status: 500,
      }
    );
  }
}
