-- Create distributed rate-limit storage used by src/lib/rateLimit.ts.
CREATE TABLE "ApiRateLimit" (
    "id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "resetAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiRateLimit_pkey" PRIMARY KEY ("id")
);

-- Add indexes for high-volume list and history endpoints.
CREATE INDEX "ApiRateLimit_resetAt_idx" ON "ApiRateLimit"("resetAt");
CREATE INDEX "Weather_districtId_createdAt_idx" ON "Weather"("districtId", "createdAt");
CREATE INDEX "RainfallSnapshot_createdAt_idx" ON "RainfallSnapshot"("createdAt");
CREATE INDEX "Crop_districtId_idx" ON "Crop"("districtId");
