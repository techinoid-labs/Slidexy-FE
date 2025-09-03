"use client";

import { Box, Typography, Chip, Button } from "@mui/material";
import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function PricingSection() {
  const [plan, setPlan] = useState("monthly");

  // Stripe Checkout Handler
  const handleCheckout = async (pricePlan: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: pricePlan }),
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
        gap: "48px",
        boxSizing: "border-box",
        mx: "auto",
      }}
    >
      <Box
        sx={{
          width: "100%",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
            <span
              style={{ fontWeight: 500, fontSize: "1rem", color: "#4A00E0" }}
            >
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
            mb: 4,
            width: "fit-content",
            "& .MuiChip-icon": {
              marginRight: "6px",
            },
          }}
        />

        {/* Heading */}
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: { xs: "30px", md: "48px" },
            color: "#222",
            mb: 2,
            textAlign: "center",
          }}
        >
          From Free to Full Power
        </Typography>

        <Typography
          sx={{
            fontWeight: 400,
            fontSize: { xs: "18px", md: "18px" },
            color: "#6D6D6D",
            mb: 2,
            textAlign: "center",
          }}
        >
          Test the AI magic for free, then take it to the next level with
          scalable plans.
        </Typography>

        {/* Secure Note */}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: { xs: 4, md: "48px" },
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {[
            {
              name: "Basic",
              price: "$9",
              pricePlan: "basic", // 👈 Replace with real Stripe Price ID for Basic
              color: "#F3F0FF",
              textColor: "#6C2BD7",
              borderColor: "#E9E9FF",
              btnHover: "#E9E9FF",
            },
            {
              name: "Exclusive",
              price: "$14",
              pricePlan: "exclusive", // 👈 Replace with real Stripe Price ID for Exclusive
              color: "#6C2BD7",
              textColor: "#fff",
              borderColor: "#6C2BD7",
              btnHover: "#4A00E0",
            },
            {
              name: "Platinum",
              price: "$20",
              pricePlan: "platinum", // 👈 Replace with real Stripe Price ID for Platinum
              color: "#F3F0FF",
              textColor: "#6C2BD7",
              borderColor: "#E9E9FF",
              btnHover: "#E9E9FF",
            },
          ].map(
            (
              {
                name,
                price,
                pricePlan,
                color,
                textColor,
                borderColor,
                btnHover,
              },
              index
            ) => (
              <Box
                key={index}
                sx={{
                  maxWidth: { sm: "355px", xs: "auto" },
                  background: "#fff",
                  borderRadius: "20px",
                  border: `1px solid ${borderColor}`,
                  boxShadow: "0 2px 16px 0 rgba(80, 80, 120, 0.07)",
                  p: { sm: "40px", xs: "30px" },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{ display: "flex", flexDirection: "row", gap: "80px" }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "24px",
                        color: "#222",
                        marginTop: "20px",
                      }}
                    >
                      {name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", paddingBottom: "20px" }}>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "48px",
                        color: "#18181B",
                      }}
                    >
                      {price}
                    </Typography>
                    <Typography sx={{ color: "#757575", mt: "40px" }}>
                      /month
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    color: "#757575",
                    fontSize: "1rem",
                    mb: 3,
                    textAlign: "center",
                  }}
                >
                  Choose the plan that fits your business needs
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    background: color,
                    color: textColor,
                    borderRadius: "999px",
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    textTransform: "none",
                    width: "100%",
                    mb: 3,
                    boxShadow: "none",
                    "&:hover": { background: btnHover },
                  }}
                  endIcon={
                    <span style={{ fontSize: 22, marginLeft: 4 }}>→</span>
                  }
                  onClick={() => handleCheckout(pricePlan)}
                >
                  Get Started
                </Button>
                <Box
                  sx={{
                    width: "100%",
                    borderTop: "1px solid #E9E9FF",
                    my: 2,
                    backgroundColor: "#E7E7E7",
                  }}
                />

                <Box sx={{ width: "100%" }}>
                  {[
                    "Unlimited decks",
                    "Style library access",
                    "Branding customization",
                    "Team collaboration",
                    "Priority export formats",
                  ].map((feature, i) => (
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
                      <Typography sx={{ color: "#222", fontSize: "1rem" }}>
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )
          )}
        </Box>
      </Box>
    </Box>
  );
}
