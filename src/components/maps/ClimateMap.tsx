"use client";

import "leaflet/dist/leaflet.css";

import React from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from "react-leaflet";
import { districts } from "@/data/districts";
import { districtAnalytics } from "@/data/districtAnalytics";
import { getDistrictRisk } from "@/lib/ai/mapRiskEngine";

interface Props {
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
}

function parseMetric(value: string | undefined) {
  const parsed = Number.parseInt(value ?? "0", 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function ClimateMap({ selectedDistrict, setSelectedDistrict }: Props) {
  return (
    <div className="h-full w-full overflow-hidden rounded-lg bg-[#050b12]">
      <MapContainer
        center={[19.7515, 75.7139]}
        zoom={7}
        scrollWheelZoom={false}
        className="z-0 h-full min-h-[450px] w-full"
        style={{ width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {districts.map((district) => {
          const analytics = districtAnalytics[district.name as keyof typeof districtAnalytics];
          const rainfall = parseMetric(analytics?.rainfall);
          const temperature = parseMetric(analytics?.temperature);
          const risk = getDistrictRisk(temperature, 80, rainfall);
          const isSelected = selectedDistrict === district.name;
          const radius =
            risk.level === "High Risk" ? 22 : risk.level === "Moderate Risk" ? 18 : 14;

          return (
            <CircleMarker
              key={district.name}
              center={[district.latitude, district.longitude]}
              radius={isSelected ? radius + 5 : radius}
              pathOptions={{
                color: isSelected ? "#ffffff" : risk.color,
                fillColor: risk.color,
                fillOpacity: isSelected ? 0.9 : 0.72,
                opacity: 0.95,
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{
                click: () => setSelectedDistrict(district.name),
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -8]}
                opacity={0.95}
                className="mahainsight-map-tooltip"
              >
                <span className="font-semibold">{district.name}</span>
              </Tooltip>

              <Popup className="mahainsight-map-popup">
                <div className="min-w-[230px] space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">{district.name}</h2>
                    <p
                      className="mt-1 inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold"
                      style={{
                        borderColor: risk.color,
                        color: risk.color,
                        backgroundColor: `${risk.color}1a`,
                      }}
                    >
                      {risk.level}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between gap-4 rounded-md bg-white/[0.04] px-3 py-2">
                      <span className="text-slate-500">Rainfall</span>
                      <strong>{analytics?.rainfall ?? "N/A"}</strong>
                    </div>
                    <div className="flex justify-between gap-4 rounded-md bg-white/[0.04] px-3 py-2">
                      <span className="text-slate-500">Temperature</span>
                      <strong>{analytics?.temperature ?? "N/A"}</strong>
                    </div>
                    <div className="flex justify-between gap-4 rounded-md bg-white/[0.04] px-3 py-2">
                      <span className="text-slate-500">Crop</span>
                      <strong>{analytics?.crop ?? "N/A"}</strong>
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

export default React.memo(ClimateMap);
