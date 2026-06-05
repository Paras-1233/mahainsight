"use client";

import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((r) => r.json());

export function useDistrictData(
  district: string
) {
  return useSWR(
    `/api/districts/${district}`,
    fetcher,
    {
      refreshInterval: 30000, // 30 sec
      revalidateOnFocus: true,
    }
  );
}