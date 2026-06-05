import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  // DISTRICTS
  const pune = await prisma.district.create({
    data: {
      name: "Pune",
      latitude: 18.5204,
      longitude: 73.8567,
      region: "Western Maharashtra",
    },
  });

  const ratnagiri =
    await prisma.district.create({
      data: {
        name: "Ratnagiri",
        latitude: 16.9902,
        longitude: 73.3120,
        region: "Konkan",
      },
    });

  const nagpur = await prisma.district.create({
    data: {
      name: "Nagpur",
      latitude: 21.1458,
      longitude: 79.0882,
      region: "Vidarbha",
    },
  });

  // WEATHER
  await prisma.weather.createMany({
    data: [
      {
        temperature: 32,
        humidity: 68,
        windSpeed: 14,
        districtId: pune.id,
      },
      {
        temperature: 29,
        humidity: 82,
        windSpeed: 10,
        districtId: ratnagiri.id,
      },
      {
        temperature: 36,
        humidity: 48,
        windSpeed: 18,
        districtId: nagpur.id,
      },
    ],
  });

  // RAINFALL
  await prisma.rainfall.createMany({
    data: [
      {
        rainfall: 980,
        year: 2024,
        districtId: pune.id,
      },
      {
        rainfall: 3100,
        year: 2024,
        districtId: ratnagiri.id,
      },
      {
        rainfall: 1100,
        year: 2024,
        districtId: nagpur.id,
      },
    ],
  });

  // CROPS
  await prisma.crop.createMany({
    data: [
      {
        name: "Sugarcane",
        season: "Kharif",
        rainfallType: "Medium",
        districtId: pune.id,
      },
      {
        name: "Rice",
        season: "Kharif",
        rainfallType: "High",
        districtId: ratnagiri.id,
      },
      {
        name: "Cotton",
        season: "Kharif",
        rainfallType: "Medium",
        districtId: nagpur.id,
      },
    ],
  });

  console.log(
    "✅ Database seeded successfully"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });