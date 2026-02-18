"use client";

import useSWR from "swr";
import { ActivityLog } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
