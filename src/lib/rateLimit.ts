import { prisma } from "@/lib/prisma";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();
const CLEANUP_SAMPLE_RATE = 0.01;

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimitInMemory({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: now + windowMs,
    };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  entry.count += 1;

  return {
    allowed: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  };
}

export async function checkRateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const nextResetAt = new Date(now + windowMs);

  try {
    const rows = await prisma.$queryRaw<{ count: number; resetAt: Date }[]>`
      INSERT INTO "ApiRateLimit" ("id", "count", "resetAt", "updatedAt")
      VALUES (${key}, 1, ${nextResetAt}, NOW())
      ON CONFLICT ("id") DO UPDATE SET
        count = CASE
          WHEN "ApiRateLimit"."resetAt" <= NOW() THEN 1
          ELSE "ApiRateLimit".count + 1
        END,
        "resetAt" = CASE
          WHEN "ApiRateLimit"."resetAt" <= NOW() THEN EXCLUDED."resetAt"
          ELSE "ApiRateLimit"."resetAt"
        END,
        "updatedAt" = NOW()
      RETURNING count, "resetAt"
    `;

    if (Math.random() < CLEANUP_SAMPLE_RATE) {
      await prisma.$executeRaw`
        DELETE FROM "ApiRateLimit"
        WHERE "resetAt" <= NOW()
      `;
    }

    const entry = rows[0];

    if (!entry) {
      return checkRateLimitInMemory({ key, limit, windowMs });
    }

    return {
      allowed: entry.count <= limit,
      remaining: Math.max(0, limit - entry.count),
      resetAt: entry.resetAt.getTime(),
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Database rate limit unavailable; using in-memory fallback", error);
      return checkRateLimitInMemory({ key, limit, windowMs });
    }

    throw error;
  }
}

export function rateLimitResponse(resetAt: number) {
  return Response.json(
    {
      error: "Too many requests. Please try again shortly.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))),
      },
    }
  );
}
