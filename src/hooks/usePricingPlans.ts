"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type PricingPlan = {
  _id: string;
  name: string;
  stripePriceId: string;
  price: number;
  currency?: string;
  billingPeriod: "monthly" | "yearly" | "weekly";
  description?: string;
  features: string[];
  isActive: boolean;
};

export function usePricingPlans(planId?: string) {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [plan, setPlan] = useState<PricingPlan>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const url = planId
  //         ? `${API_BASE_URL}/api/plans/${planId}`
  //         : `${API_BASE_URL}/api/plans`;

  //       const res = await fetch(url);

  //       const data = await res.json().catch(() => ({}));

  //       if (!res.ok) {
  //         // use backend error if available
  //         throw new Error(data.error || `Failed to fetch: ${res.statusText}`);
  //       }

  //       planId ? setPlan(data) : setPlans(data);
  //     } catch (err: any) {
  //       console.error("Error fetching plan(s):", err);
  //       setError(err.message || "Something went wrong");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchData();
  // }, [planId]);

  useEffect(() => {
    let isMounted = true; // Avoid state updates after unmount

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const url = planId
          ? `${API_BASE_URL}/api/plans/${planId}`
          : // : `${API_BASE_URL}/api/plans/?test=true`; // For Testing
            `${API_BASE_URL}/api/plans`;

        const res = await fetch(url, { cache: "no-store" });

        // Safely parse JSON
        let data: any = {};
        try {
          data = await res.json();
        } catch {
          // If backend sends non-JSON response (like 500 HTML), handle gracefully
          if (isMounted)
            setError("Unexpected server response. Please try again.");
          return;
        }

        if (!res.ok) {
          // Don’t throw — handle gracefully
          if (isMounted)
            setError(data.error || `Failed to fetch (${res.statusText})`);
          return;
        }

        // ✅ Success — set plans or single plan
        if (isMounted) {
          planId ? setPlan(data) : setPlans(data);
        }
      } catch (err: any) {
        console.error("Error fetching plan(s):", err);
        if (isMounted)
          setError(
            err instanceof Error
              ? err.message
              : "Unable to fetch data. Please check your connection."
          );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [planId]);

  return { plans, plan, loading, error };
}
