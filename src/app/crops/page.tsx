import CropRealtimeContent from "@/components/crops/CropRealtimeContent";
import { districts } from "@/data/districts";
import {
  buildLiveCropRecords,
  deriveCropSummary,
  getLiveCropRecommendations,
} from "@/lib/crops/cropCalculations";
import { LiveCropResponse } from "@/lib/crops/cropTypes";
import { getCropsWithDistricts } from "@/services/cropService";

interface CropsPageProps {
  searchParams: Promise<{
    district?: string;
  }>;
}

export default async function CropsPage({ searchParams }: CropsPageProps) {
  const params = await searchParams;
  const districtNames = districts.map((district) => district.name);
  const selectedDistrict =
    params.district && districtNames.includes(params.district) ? params.district : "all";
  const crops = await getCropsWithDistricts();
  const liveCrops = buildLiveCropRecords(crops, []);
  const recommendations = getLiveCropRecommendations(liveCrops);
  const initialData: LiveCropResponse = {
    crops: liveCrops,
    recommendations,
    summary: deriveCropSummary(liveCrops, recommendations),
    timestamp: new Date().toISOString(),
    source: "Database",
  };

  return (
    <CropRealtimeContent
      initialData={initialData}
      selectedDistrict={selectedDistrict}
      districts={districtNames}
    />
  );
}
