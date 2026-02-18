"use client";

import useSWR from "swr";
import { Property } from "@/lib/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export function useProperties() {
  const { data, error, isLoading, mutate } = useSWR<Property[]>(
    "/api/properties",
    fetcher
  );

  const addProperty = async (property: Property) => {
    await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(property),
    });
    mutate();
  };

  const updateProperty = async (id: string, property: Property) => {
    await fetch(`/api/properties/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(property),
    });
    mutate();
  };

  const deleteProperty = async (id: string) => {
    await fetch(`/api/properties/${id}`, { method: "DELETE" });
    mutate();
  };

  return {
    properties: data || [],
    isLoading,
    isError: !!error,
    addProperty,
    updateProperty,
    deleteProperty,
    mutate,
  };
}
