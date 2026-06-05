import { prisma } from "@/lib/prisma";
import { CropRecord } from "@/lib/crops/cropTypes";
import { districtCropProfiles } from "@/data/districtCropProfiles";
import { districts } from "@/data/districts";

type CropQueryOptions = {
  skip?: number;
  take?: number;
};

export async function getCropsWithDistricts({
  skip,
  take,
}: CropQueryOptions = {}): Promise<CropRecord[]> {
  const crops = await prisma.crop.findMany({
    include: {
      district: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      {
        district: {
          name: "asc",
        },
      },
      {
        name: "asc",
      },
    ],
    skip,
    take,
  });

  return crops.map((crop) => ({
    id: crop.id,
    name: crop.name,
    season: crop.season,
    rainfallType: crop.rainfallType,
    district: {
      name: crop.district.name,
    },
  }));
}

export async function countCrops() {
  return prisma.crop.count();
}

export async function syncDistrictCropProfiles() {
  const districtCoordinates = new Map(
    districts.map((district) => [district.name, district])
  );

  let created = 0;
  let updated = 0;

  for (const profile of districtCropProfiles) {
    const coordinates = districtCoordinates.get(profile.district);

    if (!coordinates) {
      continue;
    }

    const district = await prisma.district.upsert({
      where: {
        name: profile.district,
      },
      update: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
      create: {
        name: profile.district,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    });

    const existingCrops = await prisma.crop.findMany({
      where: {
        districtId: district.id,
      },
    });
    const profileKeys = new Set(
      profile.crops.map((crop) => `${crop.name}:${crop.season}`)
    );
    const existingByKey = new Map<string, (typeof existingCrops)[number]>();

    for (const crop of existingCrops) {
      const key = `${crop.name}:${crop.season}`;

      if (!profileKeys.has(key) || existingByKey.has(key)) {
        await prisma.crop.delete({
          where: {
            id: crop.id,
          },
        });
        continue;
      }

      existingByKey.set(key, crop);
    }

    for (const crop of profile.crops) {
      const key = `${crop.name}:${crop.season}`;
      const existing = existingByKey.get(key);

      if (existing) {
        await prisma.crop.update({
          where: {
            id: existing.id,
          },
          data: {
            rainfallType: crop.rainfallType,
          },
        });
        updated += 1;
      } else {
        await prisma.crop.create({
          data: {
            name: crop.name,
            season: crop.season,
            rainfallType: crop.rainfallType,
            districtId: district.id,
          },
        });
        created += 1;
      }
    }
  }

  return {
    districts: districtCropProfiles.length,
    created,
    updated,
  };
}
