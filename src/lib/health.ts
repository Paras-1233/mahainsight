import { prisma } from "@/lib/prisma";
import { logServerError } from "@/lib/security";

export async function getHealthStatus() {
  const checks = {
    databaseUrl: Boolean(process.env.DATABASE_URL),
    authSecret: Boolean(process.env.AUTH_SECRET),
    database: false,
    openMeteo: false,
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (error) {
    logServerError("Health check database failure", error);
  }

  try {
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=19.076&longitude=72.8777&current=temperature_2m",
      {
        cache: "no-store",
      }
    );

    checks.openMeteo = response.ok;
  } catch (error) {
    logServerError("Health check Open-Meteo failure", error);
  }

  const healthy = Object.values(checks).every(Boolean);

  return {
    body: {
      status: healthy ? "ok" : "degraded",
      checks,
      checkedAt: new Date().toISOString(),
    },
    status: healthy ? 200 : 503,
  };
}

export function healthHeaders() {
  return {
    "Cache-Control": "no-store, max-age=0",
  };
}
