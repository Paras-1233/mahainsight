-- De-duplicate existing historical rainfall rows before adding the uniqueness guard.
DELETE FROM "Rainfall" r
USING "Rainfall" duplicate
WHERE
  r."districtId" = duplicate."districtId"
  AND r.year = duplicate.year
  AND r.id > duplicate.id;

-- CreateIndex
CREATE UNIQUE INDEX "Rainfall_districtId_year_key" ON "Rainfall"("districtId", "year");
