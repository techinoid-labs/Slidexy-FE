"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type PricingPlan = {
  _id: string;
  name: string;
  price: number;
  billingPeriod: "monthly" | "yearly" | "weekly";
  description?: string;
  features: string[];
  isActive: boolean;
};

export function usePricingPlans() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/plans`);

        if (!res.ok) {
          throw new Error(`Failed to fetch plans: ${res.statusText}`);
        }

        const data: PricingPlan[] = await res.json();
        setPlans(data);
      } catch (err: any) {
        console.error("Error fetching plans:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, []);

  return { plans, loading, error };
}
