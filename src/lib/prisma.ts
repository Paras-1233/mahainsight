import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

const logLevels: Prisma.LogLevel[] =
  process.env.NODE_ENV === "production"
    ? ["warn", "error"]
    : ["warn", "error"];

function databaseUrlWithPoolConfig() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return undefined;
  }

  try {
    const url = new URL(databaseUrl);

    if (!url.searchParams.has("connection_limit")) {
      url.searchParams.set("connection_limit", process.env.DB_CONNECTION_LIMIT ?? "25");
    }

    return url.toString();
  } catch {
    return databaseUrl;
  }
}

const pooledDatabaseUrl = databaseUrlWithPoolConfig();

export function getDatabaseUrlConfigError() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return "DATABASE_URL is not configured.";
  }

  try {
    const url = new URL(databaseUrl);
    const placeholderValues = new Set([
      "USER",
      "PASSWORD",
      "HOST",
      "PORT",
      "DATABASE",
    ]);

    if (
      placeholderValues.has(decodeURIComponent(url.username)) ||
      placeholderValues.has(decodeURIComponent(url.password)) ||
      placeholderValues.has(url.hostname) ||
      placeholderValues.has(url.port) ||
      placeholderValues.has(url.pathname.replace(/^\//, ""))
    ) {
      return "DATABASE_URL still contains placeholder values. Replace USER, PASSWORD, HOST, PORT, and DATABASE with your real Postgres connection details.";
    }

    if (url.port && !/^\d+$/.test(url.port)) {
      return "DATABASE_URL has an invalid port. Use a numeric Postgres port such as 5432.";
    }

    return null;
  } catch {
    return "DATABASE_URL is not a valid Postgres connection string. Escape special characters in the username or password.";
  }
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    ...(pooledDatabaseUrl && {
      datasources: {
        db: {
          url: pooledDatabaseUrl,
        },
      },
    }),
    log: logLevels,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
