"use client";

import "leaflet/dist/leaflet.css";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { LiveMapDistrict } from "@/lib/maps/mapTypes";

interface MaharashtraMapProps {
  districts: LiveMapDistrict[];
  selectedDistrict: string | null;
  onSelectDistrict: (district: string) => void;
}

function formatRainfall(value: number) {
  const rounded = value > 0 && value < 1 ? Number(value.toFixed(1)) : Math.round(value);

  return `${rounded.toLocaleString()} mm`;
}

function markerRadius(district: LiveMapDistrict) {
  return Math.max(8, Math.min(24, 8 + district.riskScore / 5));
}

export default function MaharashtraMap({
  districts,
  selectedDistrict,
  onSelectDistrict,
}: MaharashtraMapProps) {
  return (
    <div className="h-[620px] overflow-hidden rounded-lg border border-white/10 bg-[#050b12] shadow-2xl shadow-black/25">
      <MapContainer
        center={[19.7515, 75.7139]}
        zoom={7}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {districts.map((district) => {
          const isSelected = selectedDistrict === district.district;

          return (
            <CircleMarker
              key={district.district}
              center={[district.latitude, district.longitude]}
              radius={isSelected ? markerRadius(district) + 5 : markerRadius(district)}
              pathOptions={{
                color: isSelected ? "#ffffff" : district.riskColor,
                fillColor: district.riskColor,
                fillOpacity: isSelected ? 0.9 : 0.72,
                opacity: 0.95,
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{
                click: () => onSelectDistrict(district.district),
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -8]}
                opacity={0.95}
                className="mahainsight-map-tooltip"
              >
                <span className="font-semibold">{district.district}</span>
              </Tooltip>

              <Popup className="mahainsight-map-popup">
                <div className="min-w-[230px] space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">{district.district}</h2>
                    <p
                      className="mt-1 inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold"
                      style={{
                        borderColor: district.riskColor,
                        color: district.riskColor,
                        backgroundColor: `${district.riskColor}1a`,
                      }}
                    >
                      {district.riskLevel}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between gap-4 rounded-md bg-white/[0.04] px-3 py-2">
                      <span className="text-slate-500">Risk score</span>
                      <strong>{district.riskScore}%</strong>
                    </div>
                    <div className="flex justify-between gap-4 rounded-md bg-white/[0.04] px-3 py-2">
                      <span className="text-slate-500">Today rain</span>
                      <strong>{formatRainfall(district.todayRainfall)}</strong>
                    </div>
                    <div className="flex justify-between gap-4 rounded-md bg-white/[0.04] px-3 py-2">
                      <span className="text-slate-500">Rain chance</span>
                      <strong>{district.probability}%</strong>
                    </div>
                    <div className="flex justify-between gap-4 rounded-md bg-white/[0.04] px-3 py-2">
                      <span className="text-slate-500">Temperature</span>
                      <strong>
                        {district.temperature === null
                          ? "N/A"
                          : `${Math.round(district.temperature)} C`}
                      </strong>
                    </div>
                    <div className="flex justify-between gap-4 rounded-md bg-white/[0.04] px-3 py-2">
                      <span className="text-slate-500">Humidity</span>
                      <strong>
                        {district.humidity === null
                          ? "N/A"
                          : `${Math.round(district.humidity)}%`}
                      </strong>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
