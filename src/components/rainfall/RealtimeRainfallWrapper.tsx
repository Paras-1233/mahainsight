"use client";

import { useLiveRainfallData } from "@/hooks/useLiveRainfallData";

interface RealtimeRainfallWrapperProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function RealtimeIndicatorWrapper() {
  const { data: liveData } = useLiveRainfallData(true);

  return {
    isConnected: Boolean(liveData),
    lastUpdate: liveData ? new Date() : null,
    liveData: liveData || [],
  };
}

export default function RealtimeRainfallWrapper({
  children,
  enabled = true,
}: RealtimeRainfallWrapperProps) {
  void enabled;

  return <>{children}</>;
}
