import { prisma } from "@/lib/prisma";
import { requireApiAuth, unauthorizedResponse } from "@/lib/apiAuth";
import { rateLimitRequest } from "@/lib/api";
import { badRequestResponse, readJsonObject, requireSameOrigin } from "@/lib/security";

export async function POST(request: Request) {
  const originError = requireSameOrigin(request);

  if (originError) {
    return originError;
  }

  const rateLimitError = await rateLimitRequest({
    request,
    bucket: "weather-save",
    limit: 30,
    windowMs: 15 * 60 * 1000,
  });

  if (rateLimitError) {
    return rateLimitError;
  }

  try {
    const user = await requireApiAuth();

    if (!user) {
      return unauthorizedResponse();
    }

    const body = await readJsonObject(request);

    if (!body) {
      return badRequestResponse("Invalid weather payload");
    }

    const temperature = Number(body.temperature);
    const humidity = Number(body.humidity);
    const windSpeed = Number(body.windSpeed);
    const districtId = Number(body.districtId);

    if (
      !Number.isFinite(temperature) ||
      !Number.isFinite(humidity) ||
      !Number.isFinite(windSpeed) ||
      !Number.isInteger(districtId) ||
      temperature < -50 ||
      temperature > 60 ||
      humidity < 0 ||
      humidity > 100 ||
      windSpeed < 0 ||
      windSpeed > 300 ||
      districtId < 1
    ) {
      return badRequestResponse("Invalid weather payload");
    }

    const districtExists = await prisma.district.findUnique({
      where: {
        id: districtId,
      },
      select: {
        id: true,
      },
    });

    if (!districtExists) {
      return badRequestResponse("Invalid district");
    }

    const weather =
      await prisma.weather.create({
        data: {
          temperature,
          humidity,
          windSpeed,
          districtId,
        },
      });

    return Response.json(weather);

  } catch {

    return Response.json(
      {
        error: "Failed to save weather",
      },
      {
        status: 500,
      }
    );
  }
}
