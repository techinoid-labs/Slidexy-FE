"use client";

import {
  Box,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { usePricingPlans } from "@/hooks/usePricingPlans";
import { useUser } from "@/app/context/AuthContext";
import AuthModal from "../auth/AuthModal";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function PricingSection() {
  const { plans, loading, error } = usePricingPlans();
  const { user } = useUser();
  const router = useRouter();
  // console.log({ plans });
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const handleCheckout = async (pricePlan: string) => {
    try {
      // console.log({ plan: pricePlan, userId: user?._id });
      const res = await fetch(
        `${API_BASE_URL}/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan: pricePlan,
            userId: user?._id,
            email: user?.email,
          }),
        }
      );

      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        console.error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

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
        pb: { xs: 6, md: "80px" },
        gap: "10px",
        boxSizing: "border-box",
        mx: "auto",
      }}
    >
      {/* Header */}
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
          mb: 3,
          width: "fit-content",
          "& .MuiChip-icon": {
            marginRight: "6px",
          },
        }}
      />

      <Typography
        component="h1"
        sx={{
          fontWeight: 600,
          fontSize: { xs: "30px", md: "48px" },
          color: "#222",
          mb: 1,
          textAlign: "center",
        }}
      >
        SlideXY Pricing
      </Typography>

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: { xs: "18px", md: "18px" },
          color: "#6D6D6D",
          textAlign: "center",
        }}
      >
        Unlock the power of AI — start free, then upgrade to a plan that fits
        your goals.
      </Typography>

      <Typography
        sx={{
          color: "#757575",
          fontSize: "1rem",
          mb: 4,
          textAlign: "center",
          maxWidth: "40rem",
        }}
      >
        SlideXY offers flexible plans for every team size and budget. Start with
        the free tier to explore AI-powered slide generation. When you are ready
        for more features, premium templates, and advanced export controls,
        upgrade to a paid plan. All paid plans include a 7-day money-back
        guarantee and secure payment through Stripe.
      </Typography>

      {/* Pricing Cards / Loader */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: { xs: 4, md: "48px" },
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "300px", // ensures space is reserved
        }}
      >
        {loading ? (
          <CircularProgress size={48} sx={{ color: "#6C2BD7" }} />
        ) : (
          <>
            {error && <Alert severity="error">{error}</Alert>}
            {plans.length &&
              plans
                // .filter((plan) => plan.isActive)
                ?.map((plan) => {
                  const styleMap: Record<
                    string,
                    {
                      color: string;
                      textColor: string;
                      borderColor: string;
                      btnHover: string;
                    }
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
                      borderColor: "#6C2BD7",
                      btnHover: "#4A00E0",
                    },
                    Platinum: {
                      color: "#F3F0FF",
                      textColor: "#6C2BD7",
                      borderColor: "#E9E9FF",
                      btnHover: "#E9E9FF",
                    },
                  };

                  const styles = styleMap[plan.name] || styleMap["Basic"];

                  const tenure =
                    plan.billingPeriod === "weekly"
                      ? "Week"
                      : plan.billingPeriod === "monthly"
                      ? "Month"
                      : "Year";

                  return (
                    <Box
                      key={plan._id}
                      sx={{
                        minWidth: { xs: "335px" },
                        maxWidth: { sm: "355px", xs: "auto" },
                        background: "#fff",
                        borderRadius: "20px",
                        border: `1px solid ${styles.borderColor}`,
                        boxShadow: "0 2px 16px 0 rgba(80, 80, 120, 0.07)",
                        p: { sm: "40px", xs: "30px" },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {/* Name + Price */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "20px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "24px",
                            color: "#222",
                            mt: "15px",
                          }}
                        >
                          {plan.name}
                        </Typography>

                        <Box sx={{ display: "flex", pb: "15px" }}>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: "42px",
                              color: "#18181B",
                            }}
                          >
                            ${plan.price}
                          </Typography>
                          <Typography sx={{ color: "#757575", mt: "40px" }}>
                            /{tenure}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Description */}
                      <Typography
                        sx={{
                          color: "#757575",
                          fontSize: "1rem",
                          mb: 3,
                          textAlign: "center",
                        }}
                      >
                        {plan.description ||
                          "Choose the plan that fits your business needs"}
                      </Typography>

                      {/* Button */}
                      <Button
                        variant="contained"
                        disableElevation
                        size="large"
                        sx={{
                          background: styles.color,
                          color: styles.textColor,
                          width: "100%",
                          mb: 3,
                          boxShadow: "none",
                          "&:hover": { background: styles.btnHover, boxShadow: "none" },
                        }}
                        endIcon={<span style={{ fontSize: 22 }}>→</span>}
                        onClick={() => {
                          if (!user) {
                            setAuthModalOpen(true);
                            return;
                          }
                          // handleCheckout(plan.name);
                          router.push(`/pricing/${plan._id}`);
                        }}
                      >
                        Get Started
                      </Button>
                      {/* Features */}
                      <Box sx={{ width: "100%" }}>
                        {plan.features.map((feature, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1.5,
                              width: "100%",
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
                            <Typography
                              sx={{ color: "#222", fontSize: "1rem" }}
                            >
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  );
                })}
          </>
        )}
        <AuthModal
          open={isAuthModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </Box>
    </Box>
  );
}
