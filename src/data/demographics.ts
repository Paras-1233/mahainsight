export interface DemographicProfile {
  district: string;
  region: string;
  population: number;
  literacyRate: number;
  workforce: string;
  urbanizationRate: number;
  populationDensity: number;
}

export const demographicsData: DemographicProfile[] = [
  { district: "Ahmednagar", region: "Western Maharashtra", population: 4543159, literacyRate: 79.1, workforce: "Agriculture", urbanizationRate: 20, populationDensity: 266 },
  { district: "Akola", region: "Vidarbha", population: 1813906, literacyRate: 88.1, workforce: "Agriculture", urbanizationRate: 39, populationDensity: 321 },
  { district: "Amravati", region: "Vidarbha", population: 2888445, literacyRate: 87.4, workforce: "Agriculture", urbanizationRate: 36, populationDensity: 237 },
  { district: "Aurangabad", region: "Marathwada", population: 3701282, literacyRate: 79.0, workforce: "Mixed", urbanizationRate: 44, populationDensity: 365 },
  { district: "Beed", region: "Marathwada", population: 2585049, literacyRate: 76.9, workforce: "Agriculture", urbanizationRate: 18, populationDensity: 242 },
  { district: "Bhandara", region: "Vidarbha", population: 1200334, literacyRate: 83.8, workforce: "Agriculture", urbanizationRate: 20, populationDensity: 294 },
  { district: "Buldhana", region: "Vidarbha", population: 2586258, literacyRate: 82.7, workforce: "Agriculture", urbanizationRate: 22, populationDensity: 268 },
  { district: "Chandrapur", region: "Vidarbha", population: 2204307, literacyRate: 80.0, workforce: "Mining & Agriculture", urbanizationRate: 35, populationDensity: 193 },
  { district: "Dhule", region: "North Maharashtra", population: 2050862, literacyRate: 72.8, workforce: "Agriculture", urbanizationRate: 28, populationDensity: 285 },
  { district: "Gadchiroli", region: "Vidarbha", population: 1072942, literacyRate: 74.4, workforce: "Forest & Agriculture", urbanizationRate: 11, populationDensity: 74 },
  { district: "Gondia", region: "Vidarbha", population: 1322507, literacyRate: 85.4, workforce: "Agriculture", urbanizationRate: 17, populationDensity: 253 },
  { district: "Hingoli", region: "Marathwada", population: 1178973, literacyRate: 78.2, workforce: "Agriculture", urbanizationRate: 15, populationDensity: 244 },
  { district: "Jalgaon", region: "North Maharashtra", population: 4229917, literacyRate: 78.2, workforce: "Agriculture", urbanizationRate: 31, populationDensity: 359 },
  { district: "Jalna", region: "Marathwada", population: 1959046, literacyRate: 73.6, workforce: "Agriculture", urbanizationRate: 20, populationDensity: 255 },
  { district: "Kolhapur", region: "Western Maharashtra", population: 3876001, literacyRate: 81.5, workforce: "Agriculture & Industry", urbanizationRate: 31, populationDensity: 504 },
  { district: "Latur", region: "Marathwada", population: 2454196, literacyRate: 77.3, workforce: "Agriculture", urbanizationRate: 25, populationDensity: 343 },
  { district: "Mumbai", region: "Konkan", population: 12442373, literacyRate: 89.2, workforce: "Services", urbanizationRate: 100, populationDensity: 20694 },
  { district: "Mumbai Suburban", region: "Konkan", population: 9356962, literacyRate: 89.9, workforce: "Services", urbanizationRate: 100, populationDensity: 23271 },
  { district: "Nagpur", region: "Vidarbha", population: 4653570, literacyRate: 88.4, workforce: "Services & Industry", urbanizationRate: 68, populationDensity: 470 },
  { district: "Nanded", region: "Marathwada", population: 3361292, literacyRate: 75.5, workforce: "Agriculture", urbanizationRate: 27, populationDensity: 319 },
  { district: "Nandurbar", region: "North Maharashtra", population: 1648295, literacyRate: 64.4, workforce: "Agriculture", urbanizationRate: 16, populationDensity: 276 },
  { district: "Nashik", region: "North Maharashtra", population: 6107187, literacyRate: 80.0, workforce: "Agriculture & Industry", urbanizationRate: 43, populationDensity: 393 },
  { district: "Osmanabad", region: "Marathwada", population: 1657576, literacyRate: 76.3, workforce: "Agriculture", urbanizationRate: 17, populationDensity: 219 },
  { district: "Palghar", region: "Konkan", population: 2990116, literacyRate: 66.7, workforce: "Agriculture & Industry", urbanizationRate: 32, populationDensity: 560 },
  { district: "Parbhani", region: "Marathwada", population: 1835982, literacyRate: 75.2, workforce: "Agriculture", urbanizationRate: 31, populationDensity: 295 },
  { district: "Pune", region: "Western Maharashtra", population: 9429408, literacyRate: 86.2, workforce: "Services & Industry", urbanizationRate: 61, populationDensity: 603 },
  { district: "Raigad", region: "Konkan", population: 2634200, literacyRate: 83.1, workforce: "Industry & Agriculture", urbanizationRate: 37, populationDensity: 368 },
  { district: "Ratnagiri", region: "Konkan", population: 1615069, literacyRate: 82.2, workforce: "Fishing & Agriculture", urbanizationRate: 17, populationDensity: 196 },
  { district: "Sangli", region: "Western Maharashtra", population: 2822143, literacyRate: 81.5, workforce: "Agriculture", urbanizationRate: 25, populationDensity: 329 },
  { district: "Satara", region: "Western Maharashtra", population: 3003741, literacyRate: 82.9, workforce: "Agriculture", urbanizationRate: 19, populationDensity: 287 },
  { district: "Sindhudurg", region: "Konkan", population: 849651, literacyRate: 85.6, workforce: "Fishing & Tourism", urbanizationRate: 13, populationDensity: 163 },
  { district: "Solapur", region: "Western Maharashtra", population: 4317756, literacyRate: 77.0, workforce: "Agriculture & Textile", urbanizationRate: 32, populationDensity: 290 },
  { district: "Thane", region: "Konkan", population: 11060148, literacyRate: 84.5, workforce: "Services & Industry", urbanizationRate: 76, populationDensity: 1157 },
  { district: "Wardha", region: "Vidarbha", population: 1300774, literacyRate: 87.2, workforce: "Agriculture", urbanizationRate: 28, populationDensity: 206 },
  { district: "Washim", region: "Vidarbha", population: 1197160, literacyRate: 81.7, workforce: "Agriculture", urbanizationRate: 18, populationDensity: 244 },
  { district: "Yavatmal", region: "Vidarbha", population: 2772348, literacyRate: 80.7, workforce: "Agriculture", urbanizationRate: 22, populationDensity: 204 },
];
