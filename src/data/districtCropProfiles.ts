export interface DistrictCropProfile {
  district: string;
  crops: {
    name: string;
    season: string;
    rainfallType: "Low" | "Medium" | "High";
  }[];
}

const konkanCrops = [
  { name: "Rice", season: "Kharif", rainfallType: "High" },
  { name: "Mango", season: "Perennial", rainfallType: "Medium" },
  { name: "Cashew", season: "Perennial", rainfallType: "Medium" },
  { name: "Coconut", season: "Perennial", rainfallType: "High" },
] as const;

const westernCrops = [
  { name: "Sugarcane", season: "Perennial", rainfallType: "High" },
  { name: "Soybean", season: "Kharif", rainfallType: "Medium" },
  { name: "Jowar", season: "Rabi", rainfallType: "Low" },
  { name: "Wheat", season: "Rabi", rainfallType: "Medium" },
] as const;

const vidarbhaCrops = [
  { name: "Cotton", season: "Kharif", rainfallType: "Medium" },
  { name: "Soybean", season: "Kharif", rainfallType: "Medium" },
  { name: "Tur", season: "Kharif", rainfallType: "Low" },
  { name: "Orange", season: "Perennial", rainfallType: "Medium" },
] as const;

const marathwadaCrops = [
  { name: "Cotton", season: "Kharif", rainfallType: "Medium" },
  { name: "Soybean", season: "Kharif", rainfallType: "Medium" },
  { name: "Jowar", season: "Rabi", rainfallType: "Low" },
  { name: "Tur", season: "Kharif", rainfallType: "Low" },
] as const;

const northMaharashtraCrops = [
  { name: "Cotton", season: "Kharif", rainfallType: "Medium" },
  { name: "Banana", season: "Perennial", rainfallType: "High" },
  { name: "Onion", season: "Rabi", rainfallType: "Low" },
  { name: "Bajra", season: "Kharif", rainfallType: "Low" },
] as const;

function profile(district: string, crops: readonly DistrictCropProfile["crops"][number][]) {
  return {
    district,
    crops: crops.map((crop) => ({ ...crop })),
  };
}

export const districtCropProfiles: DistrictCropProfile[] = [
  profile("Ahmednagar", westernCrops),
  profile("Akola", vidarbhaCrops),
  profile("Amravati", vidarbhaCrops),
  profile("Aurangabad", marathwadaCrops),
  profile("Beed", marathwadaCrops),
  profile("Bhandara", vidarbhaCrops),
  profile("Buldhana", vidarbhaCrops),
  profile("Chandrapur", vidarbhaCrops),
  profile("Dhule", northMaharashtraCrops),
  profile("Gadchiroli", vidarbhaCrops),
  profile("Gondia", vidarbhaCrops),
  profile("Hingoli", marathwadaCrops),
  profile("Jalgaon", northMaharashtraCrops),
  profile("Jalna", marathwadaCrops),
  profile("Kolhapur", westernCrops),
  profile("Latur", marathwadaCrops),
  profile("Mumbai", konkanCrops),
  profile("Mumbai Suburban", konkanCrops),
  profile("Nagpur", vidarbhaCrops),
  profile("Nanded", marathwadaCrops),
  profile("Nandurbar", northMaharashtraCrops),
  profile("Nashik", northMaharashtraCrops),
  profile("Osmanabad", marathwadaCrops),
  profile("Palghar", konkanCrops),
  profile("Parbhani", marathwadaCrops),
  profile("Pune", westernCrops),
  profile("Raigad", konkanCrops),
  profile("Ratnagiri", konkanCrops),
  profile("Sangli", westernCrops),
  profile("Satara", westernCrops),
  profile("Sindhudurg", konkanCrops),
  profile("Solapur", marathwadaCrops),
  profile("Thane", konkanCrops),
  profile("Wardha", vidarbhaCrops),
  profile("Washim", vidarbhaCrops),
  profile("Yavatmal", vidarbhaCrops),
];
