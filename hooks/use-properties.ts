"use client";

import useSWR from "swr";
import { Property } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
