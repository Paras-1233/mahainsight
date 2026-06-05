import { NextResponse } from "next/server";
import { rateLimitRequest } from "@/lib/api";
import { fetchOpenMeteoRainfall } from "@/lib/rainfallLive";
import { prisma } from "@/lib/prisma";
import { badRequestResponse, logServerError } from "@/lib/security";
import { getLatestRainfallSnapshots } from "@/services/rainfallService";

type DistrictSnapshot = {
  district: string;
  latitude: number;
  longitude: number;
  rainfall: number;
  probability: number;
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  timestamp: string;
  source: string;
};

async function getDistrictSnapshots(): Promise<DistrictSnapshot[]> {
  try {
    return await fetchOpenMeteoRainfall();
  } catch {
    console.warn("Live district data unavailable; using saved snapshot fallback");

    return getLatestRainfallSnapshots();
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ district: string }> }
) {
  const rateLimitError = await rateLimitRequest({
    request: req,
    bucket: "district-live",
    limit: 120,
    windowMs: 60 * 1000,
  });

  if (rateLimitError) {
    return rateLimitError;
  }

  try {
    const { district } = await params;
    const decodedDistrict = decodeURIComponent(district).trim();

    if (
      decodedDistrict.length < 2 ||
      decodedDistrict.length > 80 ||
      !/^[A-Za-z\s.-]+$/.test(decodedDistrict)
    ) {
      return badRequestResponse("Invalid district");
    }

    const snapshots = await getDistrictSnapshots();
    const snapshot = snapshots.find(
      (item) => item.district.toLowerCase() === decodedDistrict.toLowerCase()
    );

    if (!snapshot) {
      return NextResponse.json(
        { error: "District not found" },
        { status: 404 }
      );
    }

    const districtRecord = await prisma.district.findUnique({
      where: {
        name: snapshot.district,
      },
      include: {
        crops: true,
      },
    });

    const crop = districtRecord?.crops?.[0]?.name ?? "Not Available";
    let alert = "Climate conditions stable.";

    if (snapshot.probability >= 80) {
      alert = "Heavy rainfall and flood risk detected.";
    }

    if (snapshot.temperature !== null && snapshot.temperature >= 38) {
      alert = "Heatwave warning active.";
    }

    return NextResponse.json(
      {
        rainfall: `${snapshot.rainfall} mm`,
        temperature: `${snapshot.temperature ?? 0}\u00B0C`,
        humidity: `${snapshot.humidity ?? 0}%`,
        windSpeed: `${snapshot.windSpeed ?? 0} km/h`,
        probability: `${snapshot.probability}%`,
        crop,
        alert,
        source: snapshot.source,
        updatedAt: snapshot.timestamp,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    logServerError("Failed to fetch district data", error);

    return NextResponse.json(
      {
        error: "Failed to fetch district data",
      },
      {
        status: 500,
      }
    );
  }
}
