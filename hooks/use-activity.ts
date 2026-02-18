"use client";

import useSWR from "swr";
import { ActivityLog } from "@/lib/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export function useActivity() {
  const { data, error, isLoading } = useSWR<ActivityLog[]>(
    "/api/activity",
    fetcher
  );

  return {
    activities: data || [],
    isLoading,
    isError: !!error,
  };
}
