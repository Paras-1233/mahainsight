import { prisma } from "@/lib/prisma";
import { HistoricalRainfallRecord } from "@/lib/rainfallHistorical";
import { LiveRainfallRecord } from "@/lib/rainfallLive";

type RainfallRange = "30d" | "90d" | "1y" | "all";

export async function getRainfallHistory(district: string = "all") {
  if (district === "all") {
    return prisma.rainfall.findMany({
      orderBy: {
        year: "asc",
      },
    });
  }

  return prisma.rainfall.findMany({
    where: {
      district: {
        name: district,
      },
    },
    orderBy: {
      year: "asc",
    },
  });
}

export async function getLatestAnnualRainfallByDistrict() {
  const rows = await prisma.$queryRaw<{ district: string; rainfall: number }[]>`
    SELECT DISTINCT ON (d.id)
      d.name AS district,
      r.rainfall
    FROM "District" d
    INNER JOIN "Rainfall" r ON r."districtId" = d.id
    ORDER BY d.id, r.year DESC
  `;

  return rows.map((row) => ({
    district: row.district,
    rainfall: row.rainfall,
  }));
}

export async function getHistoricalRainfallChartData(
  district: string = "all",
  range: RainfallRange = "all"
) {
  if (range === "30d" || range === "90d") {
    const days = range === "30d" ? 30 : 90;
    const rows =
      district === "all"
        ? await prisma.$queryRaw<{ label: string; rainfall: number }[]>`
            SELECT
              to_char(date_trunc('day', "observedAt"), 'Mon DD') AS label,
              AVG("todayRainfall") AS rainfall
            FROM "RainfallSnapshot"
            WHERE "observedAt" >= NOW() - (${days} * INTERVAL '1 day')
            GROUP BY date_trunc('day', "observedAt")
            ORDER BY date_trunc('day', "observedAt") ASC
          `
        : await prisma.$queryRaw<{ label: string; rainfall: number }[]>`
            SELECT
              to_char(date_trunc('day', rs."observedAt"), 'Mon DD') AS label,
              AVG(rs."todayRainfall") AS rainfall
            FROM "RainfallSnapshot" rs
            INNER JOIN "District" d ON d.id = rs."districtId"
            WHERE
              d.name = ${district}
              AND rs."observedAt" >= NOW() - (${days} * INTERVAL '1 day')
            GROUP BY date_trunc('day', rs."observedAt")
            ORDER BY date_trunc('day', rs."observedAt") ASC
          `;

    return rows.map((row) => ({
      year: row.label,
      rainfall: Number(row.rainfall.toFixed(1)),
    }));
  }

  const yearFilter = range === "1y" ? new Date().getFullYear() - 1 : 1940;
  const rows =
    district === "all"
      ? await prisma.$queryRaw<{ year: number; rainfall: number }[]>`
          SELECT
            year,
            AVG(rainfall) AS rainfall
          FROM "Rainfall"
          WHERE year >= ${yearFilter}
          GROUP BY year
          ORDER BY year ASC
        `
      : await prisma.$queryRaw<{ year: number; rainfall: number }[]>`
          SELECT
            r.year,
            AVG(r.rainfall) AS rainfall
          FROM "Rainfall" r
          INNER JOIN "District" d ON d.id = r."districtId"
          WHERE d.name = ${district} AND r.year >= ${yearFilter}
          GROUP BY r.year
          ORDER BY r.year ASC
        `;

  return rows.map((row) => ({
    year: String(row.year),
    rainfall: Number(row.rainfall.toFixed(1)),
  }));
}

export async function getLatestRainfallSnapshots() {
  const rows = await prisma.$queryRaw<
    {
      district: string;
      latitude: number;
      longitude: number;
      rainfall: number;
      todayRainfall: number;
      currentRainfall: number;
      precipitationHours: number;
      probability: number;
      temperature: number | null;
      humidity: number | null;
      windSpeed: number | null;
      source: string;
      observedAt: Date;
    }[]
  >`
    SELECT DISTINCT ON (d.id)
      d.name AS district,
      d.latitude,
      d.longitude,
      rs.rainfall,
      rs."todayRainfall",
      rs."currentRainfall",
      rs."precipitationHours",
      rs.probability,
      rs.temperature,
      rs.humidity,
      rs."windSpeed",
      rs.source,
      rs."observedAt"
    FROM "District" d
    INNER JOIN "RainfallSnapshot" rs ON rs."districtId" = d.id
    ORDER BY d.id, rs."observedAt" DESC
  `;

  return rows.map((row) => ({
    district: row.district,
    latitude: row.latitude,
    longitude: row.longitude,
    rainfall: row.rainfall,
    todayRainfall: row.todayRainfall,
    currentRainfall: row.currentRainfall,
    precipitationHours: row.precipitationHours,
    probability: row.probability,
    temperature: row.temperature,
    humidity: row.humidity,
    windSpeed: row.windSpeed,
    hourly: [],
    timestamp: row.observedAt.toISOString(),
    source: row.source,
  }));
}

export async function saveRainfallSnapshots(records: LiveRainfallRecord[]) {
  const saved = await prisma.$transaction(
    records.map((record) =>
      prisma.district.upsert({
        where: {
          name: record.district,
        },
        update: {
          latitude: record.latitude,
          longitude: record.longitude,
        },
        create: {
          name: record.district,
          latitude: record.latitude,
          longitude: record.longitude,
        },
      })
    )
  );

  const districtIds = new Map(saved.map((district) => [district.name, district.id]));

  await prisma.$transaction(
    records.map((record) => {
      const districtId = districtIds.get(record.district);

      if (!districtId) {
        throw new Error(`District not found for rainfall snapshot: ${record.district}`);
      }

      return prisma.$executeRaw`
        INSERT INTO "RainfallSnapshot" (
          "districtId",
          rainfall,
          "todayRainfall",
          "currentRainfall",
          "precipitationHours",
          probability,
          temperature,
          humidity,
          "windSpeed",
          source,
          "observedAt"
        )
        VALUES (
          ${districtId},
          ${record.rainfall},
          ${record.todayRainfall},
          ${record.currentRainfall},
          ${record.precipitationHours},
          ${record.probability},
          ${record.temperature},
          ${record.humidity},
          ${record.windSpeed},
          ${record.source},
          ${new Date(record.timestamp)}
        )
        ON CONFLICT ("districtId", "observedAt")
        DO UPDATE SET
          rainfall = EXCLUDED.rainfall,
          "todayRainfall" = EXCLUDED."todayRainfall",
          "currentRainfall" = EXCLUDED."currentRainfall",
          "precipitationHours" = EXCLUDED."precipitationHours",
          probability = EXCLUDED.probability,
          temperature = EXCLUDED.temperature,
          humidity = EXCLUDED.humidity,
          "windSpeed" = EXCLUDED."windSpeed",
          source = EXCLUDED.source
      `;
    })
  );

  return records.length;
}

export async function saveHistoricalRainfall(records: HistoricalRainfallRecord[]) {
  const savedDistricts = await prisma.$transaction(
    records.map((record) =>
      prisma.district.upsert({
        where: {
          name: record.district,
        },
        update: {
          latitude: record.latitude,
          longitude: record.longitude,
        },
        create: {
          name: record.district,
          latitude: record.latitude,
          longitude: record.longitude,
        },
      })
    )
  );

  const districtIds = new Map(
    savedDistricts.map((district) => [district.name, district.id])
  );

  await prisma.$transaction(
    records.map((record) => {
      const districtId = districtIds.get(record.district);

      if (!districtId) {
        throw new Error(`District not found for historical rainfall: ${record.district}`);
      }

      return prisma.$executeRaw`
        INSERT INTO "Rainfall" (
          rainfall,
          year,
          "districtId"
        )
        VALUES (
          ${record.rainfall},
          ${record.year},
          ${districtId}
        )
        ON CONFLICT ("districtId", year)
        DO UPDATE SET
          rainfall = EXCLUDED.rainfall
      `;
    })
  );

  return records.length;
}

export async function getRainfallSnapshotHistory() {
  const rows = await prisma.$queryRaw<{ period: Date; rainfall: number }[]>`
    SELECT
      date_trunc('day', "observedAt") AS period,
      AVG("todayRainfall") AS rainfall
    FROM "RainfallSnapshot"
    WHERE "observedAt" >= NOW() - INTERVAL '30 days'
    GROUP BY period
    ORDER BY period ASC
  `;

  return rows.map((row) => ({
    year: row.period.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    rainfall: Number(row.rainfall.toFixed(1)),
  }));
}

export async function getRainfallSnapshotGrowth() {
  const rows = await prisma.$queryRaw<{ period: Date; rainfall: number }[]>`
    SELECT
      date_trunc('day', "observedAt") AS period,
      AVG("todayRainfall") AS rainfall
    FROM "RainfallSnapshot"
    WHERE "observedAt" >= NOW() - INTERVAL '2 days'
    GROUP BY period
    ORDER BY period DESC
    LIMIT 2
  `;

  const latest = rows[0]?.rainfall ?? 0;
  const previous = rows[1]?.rainfall ?? 0;

  if (previous <= 0) {
    return null;
  }

  return (((latest - previous) / previous) * 100).toFixed(1);
}
