// components/rainfall/RainfallInsights.tsx
import SectionCard from "@/components/shared/SectionCard";
import { TrendingUp, TrendingDown, Droplets, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ElementType } from "react";

interface District {
  district: string;
  rainfall: number;
}

interface RainfallInsightsProps {
  wettestDistrict: District | null;
  driestDistrict: District | null;
  rainfallGrowth: string | null;
  rainfallSpread: number;
  averageRainfall: number;
}

type Variant = "blue" | "green" | "amber" | "red";

interface Insight {
  variant: Variant;
  icon: ElementType;
  text: string;
}

const STYLES: Record<Variant, { wrap: string; icon: string }> = {
  blue:   { wrap: "border-sky-400/20   bg-sky-400/[0.04]   text-sky-200",        icon: "text-sky-400"     },
  green:  { wrap: "border-emerald-400/20 bg-emerald-400/[0.04] text-emerald-200", icon: "text-emerald-400" },
  amber:  { wrap: "border-amber-400/20  bg-amber-400/[0.04]  text-amber-200",    icon: "text-amber-400"   },
  red:    { wrap: "border-rose-400/20   bg-rose-400/[0.04]   text-rose-200",     icon: "text-rose-400"    },
};

function formatRainfall(value: number) {
  const rounded = value > 0 && value < 1 ? Number(value.toFixed(1)) : Math.round(value);

  return `${rounded.toLocaleString()} mm`;
}

export default function RainfallInsights({
  wettestDistrict,
  driestDistrict,
  rainfallGrowth,
  rainfallSpread,
  averageRainfall,
}: RainfallInsightsProps) {

  const insights: Insight[] = [];

  if (wettestDistrict) {
    insights.push({
      variant: "blue",
      icon: Droplets,
      text: `${wettestDistrict.district} leads at ${formatRainfall(wettestDistrict.rainfall)} - highest across all monitored districts.`,
    });
  }

  if (rainfallGrowth !== null) {
    const g = parseFloat(rainfallGrowth);
    if (g > 0) {
      insights.push({
        variant: "green",
        icon: TrendingUp,
        text: `Rainfall up ${rainfallGrowth}% vs previous period - positive monsoon trend sustained.`,
      });
    } else if (g < 0) {
      insights.push({
        variant: "amber",
        icon: TrendingDown,
        text: `Rainfall declined ${Math.abs(g)}% vs previous period. Monitor drought-prone areas closely.`,
      });
    } else {
      insights.push({
        variant: "amber",
        icon: TrendingUp,
        text: "Rainfall levels are stable compared to the previous period.",
      });
    }
  }

  if (averageRainfall > 0) {
    insights.push({
      variant: "blue",
      icon: Droplets,
      text: `Current average is ${formatRainfall(averageRainfall)} across the selected scope.`,
    });
  }

  if (rainfallSpread > 1000) {
    insights.push({
      variant: "red",
      icon: AlertTriangle,
      text: `High disparity of ${formatRainfall(rainfallSpread)}. ${
        driestDistrict
          ? `${driestDistrict.district} at ${formatRainfall(driestDistrict.rainfall)} may need intervention.`
          : "Driest districts may need attention."
      }`,
    });
  } else {
    insights.push({
      variant: "green",
      icon: CheckCircle2,
      text: `Even distribution across districts - spread of only ${formatRainfall(rainfallSpread)}.`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      variant: "amber",
      icon: AlertTriangle,
      text: "Insufficient data to generate rainfall insights.",
    });
  }

  return (
    <SectionCard title="Rainfall Insights">
      <div className="space-y-2.5">
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          const s = STYLES[ins.variant];
          return (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-xl border p-3.5 text-sm leading-relaxed ${s.wrap}`}
            >
              <Icon size={15} className={`mt-0.5 shrink-0 opacity-80 ${s.icon}`} aria-hidden="true" />
              <p>{ins.text}</p>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
