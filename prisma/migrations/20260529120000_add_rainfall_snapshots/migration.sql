-- CreateTable
CREATE TABLE "RainfallSnapshot" (
    "id" SERIAL NOT NULL,
    "rainfall" DOUBLE PRECISION NOT NULL,
    "todayRainfall" DOUBLE PRECISION NOT NULL,
    "currentRainfall" DOUBLE PRECISION NOT NULL,
    "precipitationHours" DOUBLE PRECISION NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "temperature" DOUBLE PRECISION,
    "humidity" DOUBLE PRECISION,
    "windSpeed" DOUBLE PRECISION,
    "source" TEXT NOT NULL DEFAULT 'Open-Meteo',
    "observedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "districtId" INTEGER NOT NULL,

    CONSTRAINT "RainfallSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RainfallSnapshot_districtId_observedAt_idx" ON "RainfallSnapshot"("districtId", "observedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RainfallSnapshot_districtId_observedAt_key" ON "RainfallSnapshot"("districtId", "observedAt");

-- AddForeignKey
ALTER TABLE "RainfallSnapshot" ADD CONSTRAINT "RainfallSnapshot_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
