"use client";

import useSWR from "swr";
import { MaintenanceRequest } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useMaintenance() {
  const { data, error, isLoading, mutate } = useSWR<MaintenanceRequest[]>(
    "/api/maintenance",
    fetcher
  );

  const addRequest = async (req: Omit<MaintenanceRequest, "createdAt" | "resolvedAt" | "tenantName" | "moughataa">) => {
    await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    mutate();
  };

  const updateStatus = async (id: string, status: string, actualCost?: number) => {
    await fetch(`/api/maintenance/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, actualCost }),
    });
    mutate();
  };

  return {
    requests: data || [],
    isLoading,
    isError: !!error,
    addRequest,
    updateStatus,
    mutate,
  };
}
