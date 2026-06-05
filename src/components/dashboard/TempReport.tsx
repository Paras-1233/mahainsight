"use client";

interface Props {
  district: string;
  rainfall: string;
  temperature: string;
  humidity: string;
  windSpeed: string;
  crop: string;
  alert: string;
  onClose: () => void;
}

export default function AIReport({


  district,
  rainfall,
  temperature,
  humidity,
  windSpeed,
  crop,
  alert,
  onClose,
}: Props) {
  const temp = parseFloat(temperature);
const rain = parseFloat(rainfall);
const humidityValue = parseFloat(humidity);

const rainfallInsight =
  rain > 3000
    ? "Heavy rainfall conditions indicate strong monsoon activity with elevated flood risk."
    : rain > 1500
    ? "Moderate rainfall levels support stable agricultural conditions."
    : "Below-average rainfall may require irrigation planning.";

const temperatureInsight =
  temp > 38
    ? "Heat stress conditions detected. Crop monitoring is recommended."
    : temp > 30
    ? "Warm climate conditions remain suitable for most seasonal crops."
    : "Temperature levels remain within a favorable agricultural range.";

const humidityInsight =
  humidityValue > 85
    ? "High humidity may increase fungal disease risk."
    : humidityValue < 30
    ? "Low humidity may increase crop water stress."
    : "Humidity levels are within an acceptable agricultural range.";

let climateScore = 100;

if (temp > 38) climateScore -= 20;
if (humidityValue < 30) climateScore -= 15;
  if (rain < 1000) climateScore -= 25;

  return (

    <div className="relative rounded-3xl border border-green-500/20 bg-green-500/10 p-8 text-white animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Close Button */}
      <button
        onClick={onClose}
        className="
          absolute top-5 right-5
          w-10 h-10 rounded-xl
          border border-white/10
          bg-white/5
          hover:bg-red-500/10
          hover:border-red-500/20
          transition-all duration-300
          flex items-center justify-center
          text-slate-300 hover:text-white
        "
      >

        ✕

      </button>

      <h2 className="text-3xl font-bold mb-6">

        AI Climate Report

      </h2>

      <div className="space-y-5">

  <div>
    <h3 className="text-green-400 font-semibold mb-2">
      District
    </h3>

    <p className="text-slate-200">
      {district}
    </p>
  </div>

  <div>
    <h3 className="text-green-400 font-semibold mb-2">
      Rainfall Analysis
    </h3>

    <p className="text-slate-200">
      {rainfallInsight}
    </p>
  </div>

  <div>
    <h3 className="text-green-400 font-semibold mb-2">
      Temperature Analysis
    </h3>

    <p className="text-slate-200">
      {temperatureInsight}
    </p>
  </div>

  <div>
    <h3 className="text-green-400 font-semibold mb-2">
      Humidity Analysis
    </h3>

    <p className="text-slate-200">
      {humidityInsight}
    </p>
  </div>

  <div>
    <h3 className="text-green-400 font-semibold mb-2">
      Wind Analysis
    </h3>

    <p className="text-slate-200">
      Current wind speed is {windSpeed}.
      {parseFloat(windSpeed) > 20
        ? " Strong wind activity detected."
        : " Wind conditions remain stable."}
    </p>
  </div>

  <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
    <h3 className="text-green-400 font-semibold mb-2">
      AI Climate Score
    </h3>

    <p className="text-4xl font-bold text-green-400">
      {climateScore}/100
    </p>

    <p className="text-sm text-slate-400 mt-2">
      Generated using rainfall, temperature,
      humidity, and environmental risk signals.
    </p>
  </div>

  <div>
    <h3 className="text-green-400 font-semibold mb-2">
      Recommended Crop
    </h3>

    <p className="text-slate-200">
      {crop === "Not Available"
        ? "Crop recommendation data is currently unavailable for this district."
        : `${crop} cultivation is recommended based on current climate conditions.`}
    </p>
  </div>

  <div>
    <h3 className="text-green-400 font-semibold mb-2">
      AI Climate Alert
    </h3>

    <p className="text-slate-200">
      {alert}
    </p>
  </div>

</div>

    </div>

  );
}