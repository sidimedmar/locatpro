"use client";

import useSWR from "swr";
import { Payment } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
