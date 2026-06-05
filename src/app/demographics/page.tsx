import DemographicsRealtimeContent from "@/components/demographics/DemographicsRealtimeContent";
import { demographicsData } from "@/data/demographics";
import {
  buildLiveDemographics,
  deriveDemographicSummary,
} from "@/lib/demographics/demographicCalculations";
import { LiveDemographicResponse } from "@/lib/demographics/demographicTypes";

interface DemographicsPageProps {
  searchParams: Promise<{
    district?: string;
  }>;
}

export default async function DemographicsPage({
  searchParams,
}: DemographicsPageProps) {
  const params = await searchParams;
  const districts = demographicsData.map((profile) => profile.district);
  const selectedDistrict =
    params.district && districts.includes(params.district) ? params.district : "all";
  const records = buildLiveDemographics([]);
  const initialData: LiveDemographicResponse = {
    records,
    summary: deriveDemographicSummary(records),
    timestamp: new Date().toISOString(),
    source: "Static Baseline",
  };

  return (
    <DemographicsRealtimeContent
      initialData={initialData}
      selectedDistrict={selectedDistrict}
      districts={districts}
    />
  );
}
