import { NextResponse } from "next/server";
import { getHealthStatus, healthHeaders } from "@/lib/health";

export async function GET() {
  const health = await getHealthStatus();

  return NextResponse.json(
    health.body,
    {
      status: health.status,
      headers: healthHeaders(),
    }
  );
}
