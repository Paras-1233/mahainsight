export function getDistrictRisk(
  temperature: number,
  humidity: number,
  rainfall: number
) {

  let score = 0;

  if (temperature > 38) {
    score += 2;
  }

  if (humidity > 85) {
    score += 2;
  }

  if (rainfall > 2500) {
    score += 3;
  }

  if (score >= 5) {

    return {
      level: "High Risk",
      color: "#ef4444",
    };

  }

  if (score >= 3) {

    return {
      level: "Moderate Risk",
      color: "#eab308",
    };

  }

  return {
    level: "Low Risk",
    color: "#22c55e",
  };

}

/* ───────────────────────────────────────────── */

export function getRiskSeverity(
  level: string
) {

  switch (level) {

    case "Low Risk":

      return {
        value: 25,
        color: "bg-green-500",
      };

    case "Moderate Risk":

      return {
        value: 60,
        color: "bg-yellow-500",
      };

    case "High Risk":

      return {
        value: 90,
        color: "bg-red-500",
      };

    default:

      return {
        value: 0,
        color: "bg-slate-500",
      };

  }

}