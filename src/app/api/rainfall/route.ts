import { prisma } from "@/lib/prisma";
import { getPagination, paginatedJson, rateLimitRequest } from "@/lib/api";
import { logServerError } from "@/lib/security";

export async function GET(request: Request) {
  const rateLimitError = await rateLimitRequest({
    request,
    bucket: "rainfall-list",
    limit: 120,
    windowMs: 60 * 1000,
  });

  if (rateLimitError) {
    return rateLimitError;
  }

  const pagination = getPagination(request);

  try {
    const [rainfall, total] = await Promise.all([
      prisma.rainfall.findMany({
        include: {
          district: true,
        },
        orderBy: [
          {
            year: "desc",
          },
          {
            district: {
              name: "asc",
            },
          },
        ],
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.rainfall.count(),
    ]);

    return paginatedJson(rainfall, total, pagination);
  } catch (error) {
    logServerError("Failed to fetch rainfall data", error);

    return Response.json(
      {
        error: "Failed to fetch rainfall data",
      },
      {
        status: 500,
      }
    );
  }
}
