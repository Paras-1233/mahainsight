export function getDistrictRisk(
  temperature: number,
  humidity: number,
  rainfall: number
) {

  if (
    rainfall > 2500 &&
    humidity > 70
  ) {

    return {
      level: "Severe Risk",
      color: "#ef4444",
    };

  }

  if (
    rainfall > 1800 ||
    temperature > 38
  ) {

    return {
      level: "High Risk",
      color: "#f97316",
    };

  }

  if (
    rainfall > 1000 ||
    temperature > 32
  ) {

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
        value: 50,
        color: "bg-yellow-500",
      };

    case "High Risk":

      return {
        value: 75,
        color: "bg-orange-500",
      };

    case "Severe Risk":

      return {
        value: 100,
        color: "bg-red-500",
      };

    default:

      return {
        value: 0,
        color: "bg-slate-500",
      };

  }

}