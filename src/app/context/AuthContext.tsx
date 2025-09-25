"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

// type User = {
//   _id: string;
//   email: string;
//   name?: string;
//   admin?: boolean;
//   presentations?: string[];
//   currentPresentationId?: string | null;
//   pricingPlan?: string | null;
//   trialActive?: boolean;
//   trialStart?: string;
//   trialEnd?: string;
//   daysLeft?: number;
//   presentationsLeftToday?: number;
// } | null;

type PlanConfig = {
  decksPerDay: number;
  imageDecks: number;
  predefinedDecks: number;
  features: {
    deepResearch: boolean;
    aiAgent: boolean;
    presentationAgent: boolean;
  };
};

type PlanConfigMap = {
  weekly: PlanConfig;
  monthly: PlanConfig;
  yearly: PlanConfig;
};

type PricingPlan = {
  _id: string;
  name: string;
  stripePriceId?: string;
  price: number;
  currency: string;
  billingPeriod: "weekly" | "monthly" | "yearly"; // match backend
  description?: string;
  features?: string[];
  isActive?: boolean;
  createdAt?: string;
  __v?: number;
};

type Subscription = {
  _id: string;
  stripeId: string;
  status:
    | "active"
    | "canceled"
    | "incomplete"
    | "past_due"
    | "trialing"
    | "unpaid"
    | "incomplete_expired";
  plan?: PricingPlan | null; // populated from DB
  planSnapshot?: PricingPlan | null; // frozen copy
  startDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  endDate?: string | null;
};

type TrialInfo = {
  active: boolean;
  start?: string;
  end?: string;
  daysLeft: number;
  presentationsLeftToday: number;
};

type SubscriptionUsage = {
  active: boolean;
  daysLeft: number;
  presentationsLeftToday: number;
  imageDecksLeftToday: number;
  predefinedDecksLeftToday: number;
  config: PlanConfig | null;
};

type User = {
  _id: string;
  email: string;
  name?: string;
  admin?: boolean;
  presentations?: string[];
  currentPresentationId?: string | null;
  pricingPlan?: PricingPlan | null;
  subscription?: Subscription | null;

  // 🔹 new structured fields
  trial: TrialInfo;
  subscriptionUsage: SubscriptionUsage;
} | null;

type UserContextType = {
  user: User;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    if (!session?.user?.accessToken) {
      setUser(null);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [session?.user?.accessToken]);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};
