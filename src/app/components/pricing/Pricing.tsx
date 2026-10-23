"use client";

import React, { useMemo, useState } from "react";
import { Box, Container, Typography, CircularProgress, Alert } from "@mui/material";
import CheckRounded from "@mui/icons-material/CheckRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { usePricingPlans } from "@/hooks/usePricingPlans";
import { useUser } from "@/app/context/AuthContext";
import {
  ACCENT,
  Display,
  INK,
  Lede,
  MONO,
  MUTED,
  RULE,
  SectionHead,
} from "@/app/components/home/editorial";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Pricing, shared by /pricing and the landing page.
 *
 * The old version was three rounded cards with drop shadows, a lifted
 * middle tier and a sparkle badge over the heading. Every SaaS site ships
 * that layout, which is why none of them are remembered, and lifting one
 * card off the page makes the other two look like mistakes.
 *
 * This sets the plans as a comparison on rules. Prices are monospace so
 * they read as figures rather than claims, features are a plain list, and
 * the recommended plan is marked by being filled rather than by floating.
 *
 * Checkout behaviour is unchanged.
 */

export default function PricingSection({ compact = false }: { compact?: boolean }) {
  const { plans, loading, error } = usePricingPlans();
  const { user } = useUser();

  const handleCheckout = async (pricePlan: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: pricePlan,
          userId: user?._id,
          email: user?.email,
        }),
      });
      const data = await res.json();
      if (data.url) window.open(data.url, "_blank");
      else console.error("No checkout URL returned");
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  const period = (p: string) =>
    p === "yearly" ? "year" : p === "weekly" ? "week" : "month";

  // Each plan is billed on its own cadence: one weekly, one monthly, one
  // yearly. Side by side those numbers mean nothing, so the table can be
  // put on a single cadence and the real terms shown underneath. Weeks
  // per month is 365/12/7, not 4, or a year's worth of weeks goes missing.
  const WEEKS_PER_MONTH = 365 / 12 / 7;
  const PER_YEAR: Record<string, number> = { weekly: 52, monthly: 12, yearly: 1 };
  const UNITS = [
    { key: "weekly", label: "Per week", noun: "week" },
    { key: "monthly", label: "Per month", noun: "month" },
    { key: "yearly", label: "Per year", noun: "year" },
  ];

  const [unit, setUnit] = useState("monthly");

  const mixed = useMemo(
    () => new Set(plans.map((p) => p.billingPeriod)).size > 1,
    [plans]
  );

  /** A plan's price expressed in the cadence the reader picked. */
  const inUnit = (p: { price: number; billingPeriod: string }) => {
    const yearly = p.price * (PER_YEAR[p.billingPeriod] ?? 12);
    const v =
      unit === "yearly" ? yearly : unit === "monthly" ? yearly / 12 : yearly / 52;
    // Whole numbers where the figure is big enough to carry them.
    return v >= 20 ? Math.round(v).toString() : v.toFixed(2).replace(/\.00$/, "");
  };

  const unitNoun = UNITS.find((u) => u.key === unit)?.noun ?? "month";
  const shown = plans;

  return (
    <Box component="section" sx={{ py: compact ? { xs: 8, md: 12 } : { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        {compact && <SectionHead index="05" label="Pricing" />}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.25fr 1fr" },
            gap: { xs: 3, md: 8 },
            alignItems: "end",
            mb: { xs: 5, md: 7 },
          }}
        >
          <Display>
            Pay for the decks,
            <br />
            not the seat count.
          </Display>
          <Lede sx={{ pb: 1 }}>
            Start free. Paid plans carry a 7 day money back guarantee.
          </Lede>
        </Box>

        {loading && (
          <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={22} sx={{ color: ACCENT }} />
          </Box>
        )}

        {error && !loading && (
          <Alert severity="error" sx={{ borderRadius: 0, mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && mixed && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4, flexWrap: "wrap" }}>
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              Compare
            </Typography>

            <Box sx={{ display: "inline-flex", border: `1px solid ${RULE}` }}>
            {UNITS.map((u) => (
              <Box
                component="button"
                key={u.key}
                onClick={() => setUnit(u.key)}
                aria-pressed={u.key === unit}
                sx={{
                  px: 2.5,
                  py: 1.1,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: MONO,
                  fontSize: "0.72rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  bgcolor: u.key === unit ? INK : "transparent",
                  color: u.key === unit ? "#fff" : MUTED,
                  transition: "background 0.15s ease, color 0.15s ease",
                  "&:hover": { color: u.key === unit ? "#fff" : INK },
                }}
              >
                {u.label}
              </Box>
            ))}
            </Box>
          </Box>
        )}

        {!loading && shown.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: `repeat(${Math.min(shown.length, 3)}, 1fr)` },
              borderTop: `1px solid ${INK}`,
            }}
          >
            {shown.map((plan, i) => {
              const featured = shown.length > 1 && i === 1;
              return (
                <Box
                  key={plan._id}
                  sx={{
                    bgcolor: featured ? INK : "transparent",
                    color: featured ? "#fff" : INK,
                    px: { xs: 2.5, md: 3.5 },
                    pl: { md: i === 0 && !featured ? 0 : 3.5 },
                    py: { xs: 4, md: 5 },
                    borderBottom: `1px solid ${RULE}`,
                    borderRight: {
                      xs: "none",
                      md: i < shown.length - 1 && !featured ? `1px solid ${RULE}` : "none",
                    },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      mb: 2.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: MONO,
                        fontSize: "0.72rem",
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: featured ? "rgba(255,255,255,0.65)" : MUTED,
                      }}
                    >
                      {plan.name}
                    </Typography>
                    {featured && (
                      <Typography
                        sx={{
                          fontFamily: MONO,
                          fontSize: "0.62rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#C9A6F2",
                        }}
                      >
                        Most picked
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
                    <Typography
                      sx={{
                        fontFamily: MONO,
                        fontSize: { xs: "2.6rem", md: "3.2rem" },
                        fontWeight: 500,
                        lineHeight: 1,
                        letterSpacing: "-0.035em",
                      }}
                    >
                      ${mixed ? inUnit(plan) : plan.price}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: MONO,
                        fontSize: "0.76rem",
                        color: featured ? "rgba(255,255,255,0.55)" : "#A9A3B4",
                      }}
                    >
                      per {mixed ? unitNoun : period(plan.billingPeriod)}
                    </Typography>
                  </Box>

                  {mixed && plan.billingPeriod !== unit && (
                    <Typography
                      sx={{
                        mt: 1,
                        fontFamily: MONO,
                        fontSize: "0.68rem",
                        color: featured ? "rgba(255,255,255,0.45)" : "#A9A3B4",
                      }}
                    >
                      Billed ${plan.price} {period(plan.billingPeriod)}ly
                    </Typography>
                  )}

                  <Box
                    sx={{
                      height: 1,
                      bgcolor: featured ? "rgba(255,255,255,0.18)" : RULE,
                      my: 3,
                    }}
                  />

                  <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, mb: 4, flex: 1 }}>
                    {plan.features.map((f, k) => (
                      <Box
                        component="li"
                        key={k}
                        sx={{ display: "flex", gap: 1.25, alignItems: "flex-start", mb: 1.6 }}
                      >
                        <Box
                          sx={{
                            color: featured ? "#C9A6F2" : ACCENT,
                            fontSize: 13,
                            pt: "4px",
                            flexShrink: 0,
                            display: "flex",
                          }}
                        >
                          <CheckRounded />
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "0.92rem",
                            lineHeight: 1.5,
                            color: featured ? "rgba(255,255,255,0.84)" : MUTED,
                          }}
                        >
                          {f}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box
                    component="button"
                    onClick={() => handleCheckout(plan.name)}
                    sx={{
                      alignSelf: "flex-start",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2.75,
                      py: 1.35,
                      fontFamily: "inherit",
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      bgcolor: featured ? "#fff" : "transparent",
                      color: INK,
                      border: featured ? "1.5px solid #fff" : `1.5px solid ${INK}`,
                      transition: "background 0.15s ease, color 0.15s ease, border-color 0.15s ease",
                      "&:hover": {
                        bgcolor: ACCENT,
                        borderColor: ACCENT,
                        color: "#fff",
                      },
                    }}
                  >
                    Choose {plan.name}
                    <ArrowForwardRounded sx={{ fontSize: 15 }} />
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        <Typography sx={{ mt: 3.5, fontSize: "0.88rem", color: "#9A94A6" }}>
          Editable PowerPoint export is on every plan, including the free one.
        </Typography>
      </Container>
    </Box>
  );
}
