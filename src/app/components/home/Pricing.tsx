"use client";

import { usePricingPlans } from "@/hooks/usePricingPlans";
import {
  Box,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type PricingPlan = {
  _id: string;
  name: string;
  price: number;
  billingPeriod: "weekly" | "monthly" | "yearly";
  description?: string;
  features: string[];
  isActive: boolean;
};

export default function PricingSection() {
  const { plans, loading, error } = usePricingPlans();

  const styleMap: Record<
    string,
    { color: string; textColor: string; borderColor: string; btnHover: string }
  > = {
    Basic: {
      color: "#F3F0FF",
      textColor: "#6C2BD7",
      borderColor: "#E9E9FF",
      btnHover: "#E9E9FF",
    },
    Exclusive: {
      color: "#6C2BD7",
      textColor: "#fff",
      borderColor: "#E9E9FF",
      btnHover: "#4A00E0",
    },
    Platinum: {
      color: "#F3F0FF",
      textColor: "#6C2BD7",
      borderColor: "#E9E9FF",
      btnHover: "#E9E9FF",
    },
  };

  const getTenure = (period: PricingPlan["billingPeriod"]) =>
    period === "weekly" ? "Week" : period === "monthly" ? "Month" : "Year";

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1440,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: 6, md: "80px" },
        px: { xs: 2, md: "162px" },
        boxSizing: "border-box",
        mx: "auto",
        mb: '50px'
      }}
    >
      {/* Badge */}
      <Chip
        icon={
          <img
            src="/images/side-star-purple.svg"
            alt="Icon"
            width={20}
            height={20}
            style={{ marginRight: 4 }}
          />
        }
        label={
          <span style={{ fontWeight: 500, fontSize: "1rem", color: "#4A00E0" }}>
            Pricing Plans
          </span>
        }
        sx={{
          background: "#F3F0FF",
          color: "#4A00E0",
          px: 2,
          py: 0.5,
          fontWeight: 500,
          fontSize: "1rem",
          borderRadius: "999px",
          width: "fit-content",
          "& .MuiChip-icon": {
            marginRight: "6px",
          },
        }}
      />

      {/* Heading */}
      <Typography
        sx={{
          fontSize: { xs: "30px", md: "48px" },
          color: "#222",
          mt: 2,
          mb: 4,
          textAlign: "center",
          fontFamily: 'Raleway',
          fontWeight: 500,
          lineHeight: '100%',
        }}
      >
        Enjoy all our feature by subscribing regularly!
      </Typography>

      <Typography
        sx={{
          color: "#757575",
          fontSize: "1rem",
          mb: 4,
          textAlign: "center",
        }}
      >
        100% Secure payment plan with money back guarantee.
      </Typography>

      {/* Pricing Cards */}
      {loading ? (
        <CircularProgress color="secondary" />
      ) : (
        <>
          {error && <Alert severity="error">{error}</Alert>}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 4, md: "48px" },
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {plans.length &&
              plans?.map((plan) => {
                const styles = styleMap[plan.name] || styleMap["Basic"];
                const tenure = getTenure(plan.billingPeriod);

                return (
                  <Box
                    key={plan._id}
                    sx={{
                      width: { xs: "352px" },
                      background: "#fff",
                      borderRadius: "20px",
                      border: `1px solid rgba(246, 246, 246, 1);`,
                      boxShadow: 'none',
                      pt: { sm: "40px", xs: "30px" },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '32px',
                        alignItems: 'center'
                      }}
                    >
                      {/* Plan Name */}
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "24px",
                          color: "#222",
                        }}
                      >
                        {plan.name}
                      </Typography>

                      {/* Price */}
                      <Box
                        sx={{ display: "flex", alignItems: "flex-end" }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "2.8rem",
                            color: "#18181B",
                          }}
                        >
                          ${plan.price}
                        </Typography>
                        <Typography
                          sx={{ color: "#757575", fontSize: "1.1rem", mb: 0.5 }}
                        >
                          /{tenure}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography
                      sx={{
                        color: "#757575",
                        fontSize: "1rem",
                        width: '292px',
                        mb: 3,
                        textAlign: "center",
                      }}
                    >
                      {plan.description ||
                        "Choose the plan that fits your needs"}
                    </Typography>

                    {/* CTA Button (navigate instead of Stripe) */}
                    <Link href="/pricing" passHref>
                      <Button
                        variant="contained"
                        sx={{
                          background: styles.color,
                          color: styles.textColor,
                          borderRadius: "999px",
                          px: 4,
                          py: 1.5,
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          textTransform: "none",
                          width: "292px",
                          height: "48.000003814697266",
                          mb: 3,
                          boxShadow: "none",
                          "&:hover": { background: styles.btnHover },
                        }}
                        endIcon={
                          <span style={{ fontSize: 22, marginLeft: 4 }}>→</span>
                        }
                      >
                        Get Started
                      </Button>
                    </Link>

                    {/* Divider */}
                    <Box
                      sx={{
                        width: "100%",
                        borderTop: "1px solid #f9f9fb",
                        my: 2,
                      }}
                    />

                    {/* Features */}
                    <Box sx={{
                      width: "100%", backgroundColor: '#f9f9fb', pb: { sm: "40px", xs: "30px" },
                      borderBottomLeftRadius: "20px",
                      borderBottomRightRadius: "20px"
                    }}>
                      {plan.features.map((feature, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            px: { sm: "40px", xs: "30px" },
                            mb: 1.5,
                          }}
                        >
                          <span
                            style={{
                              color: "#6C2BD7",
                              fontSize: 20,
                              marginRight: 10,
                            }}
                          >
                            ✔
                          </span>
                          <Typography sx={{ color: "#222", fontSize: "1rem" }}>
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                );
              })}
          </Box>
        </>
      )}
    </Box>
  );
}
