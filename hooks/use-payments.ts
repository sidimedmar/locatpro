"use client";

import useSWR from "swr";
import { Payment } from "@/lib/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export function usePayments() {
  const { data, error, isLoading, mutate } = useSWR<Payment[]>(
    "/api/payments",
    fetcher
  );

  const addPayment = async (payment: Omit<Payment, "createdAt" | "tenantName" | "moughataa">) => {
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    });
    mutate();
  };

  return {
    payments: data || [],
    isLoading,
    isError: !!error,
    addPayment,
    mutate,
  };
}
