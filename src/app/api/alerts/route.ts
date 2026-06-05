import { NextResponse } from "next/server";
import {
  getPagination,
  paginateArray,
  paginationHeaders,
  rateLimitRequest,
} from "@/lib/api";
import { generateAlerts, type ClimateAlert } from "@/lib/ai/generateAlerts";
import { fetchOpenMeteoRainfall, type LiveRainfallRecord } from "@/lib/rainfallLive";
import { getLatestRainfallSnapshots } from "@/services/rainfallService";

type AlertSnapshot = Pick<
  LiveRainfallRecord,
  "district" | "rainfall" | "probability" | "temperature" | "humidity" | "timestamp"
>;

function severityRank(alert: ClimateAlert) {
  const ranks = {
    critical: 0,
    warning: 1,
    watch: 2,
    info: 3,
  };

  return ranks[alert.severity];
}

async function getAlertSnapshots(): Promise<AlertSnapshot[]> {
  try {
    return await fetchOpenMeteoRainfall();
  } catch (error) {
    console.error("Live alerts unavailable, using saved snapshots", error);

    return getLatestRainfallSnapshots();
  }
}

export async function GET(request: Request) {
  const rateLimitError = await rateLimitRequest({
    request,
    bucket: "alerts",
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
  const snapshots = await getAlertSnapshots();
  const alerts = snapshots
    .flatMap((snapshot) =>
      generateAlerts({
        district: snapshot.district,
        rainfall: snapshot.rainfall,
        probability: snapshot.probability,
        temperature: snapshot.temperature,
        humidity: snapshot.humidity,
        updatedAt: snapshot.timestamp,
      })
    )
    .sort((left, right) => {
      const rankDifference = severityRank(left) - severityRank(right);

      if (rankDifference !== 0) return rankDifference;

      return (right.value ?? 0) - (left.value ?? 0);
    });

  return NextResponse.json(paginateArray(alerts, pagination), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0",
      ...paginationHeaders(alerts.length, pagination),
    },
  });
}
