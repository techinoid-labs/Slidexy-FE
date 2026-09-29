"use client";

import React, { useState } from "react";
import Header from "@/app/components/headers-navbar/Header";
import Footer from "@/app/components/home/Footer";
import { usePricingPlans } from "@/hooks/usePricingPlans";
import { useUser } from "@/app/context/AuthContext";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import {
  Box,
  Typography,
  Button,
  Divider,
  InputBase,
  Card,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const PlanPage = () => {
  const { planId } = useParams();
  const id = Array.isArray(planId) ? planId[0] : planId;

  const { user } = useUser();
  const { loading, error, plan } = usePricingPlans(id);
  // console.log({ user });
  const [coupon, setCoupon] = useState("");
  const [couponData, setCouponData] = useState<any>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({
    text: "",
    type: "",
  });

  const [finalPrice, setFinalPrice] = useState<number | null>(null);

  // 🔹 Loading + Error States
  if (loading)
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  // console.log({ error });

  if (error || !plan)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#fff",
        }}
      >
        <Header />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
          }}
        >
          <Typography
            sx={{ fontSize: "28px", fontWeight: 600, color: "#111", mb: 1 }}
          >
            Oops! Something went wrong
          </Typography>
          <Typography sx={{ fontSize: "16px", color: "#757575", mb: 3 }}>
            {error || "We couldn’t find this plan or it might be inactive."}
          </Typography>
          <Button
            onClick={() => window.location.reload()}
            variant="contained"
          >
            Try Again
          </Button>
        </Box>
        <Footer />
      </Box>
    );

  // From here onwards, plan is guaranteed to exist
  const safePlan = plan;

  // Validate Coupon before Checkout
  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      setMessage({ text: "Please enter a coupon code.", type: "error" });
      return;
    }

    setCheckingCoupon(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/stripe/validate-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon }),
        cache: "no-store",
      });

      // Safely parse JSON
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        // Handle bad JSON response safely
        setMessage({
          text: "Unexpected response from server.",
          type: "error",
        });
        return;
      }

      if (!res.ok || !data.valid) {
        // Don’t throw — handle gracefully
        setCouponData(null);
        setFinalPrice(null);
        setMessage({
          text: data.error || "Invalid or expired coupon",
          type: "error",
        });
        return;
      }

      // ✅ Coupon valid
      setCouponData(data);
      let discountedPrice = safePlan.price;

      if (data.percentOff) {
        discountedPrice =
          safePlan.price - (safePlan.price * data.percentOff) / 100;
      } else if (data.amountOff) {
        discountedPrice = safePlan.price - data.amountOff / 100;
      }

      setFinalPrice(Math.max(discountedPrice, 0));
      setMessage({
        text: data.message || "Coupon applied successfully!",
        type: "success",
      });
    } catch (err: any) {
      console.error("Coupon validation failed:", err);
      setMessage({
        text:
          err instanceof Error
            ? err.message
            : "Something went wrong, please try again.",
        type: "error",
      });
    } finally {
      setCheckingCoupon(false);
    }
  };

  // 🔹 Proceed to Checkout
  const handleCheckout = async (pricePlan: string) => {
    try {
      // Ensure coupon is valid before checkout
      if (coupon && !couponData) {
        setMessage({
          text: "Please apply a valid coupon before proceeding.",
          type: "error",
        });
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan: pricePlan,
            userId: user?._id,
            email: user?.email,
            coupon: couponData?.id || null, // Pass coupon metadata if needed later
          }),
        }
      );

      const data = await res.json();
      if (data.url) window.open(data.url, "_blank");
      else console.error("No checkout URL returned");
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  // 🔹 Render Main Layout
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#fff",
      }}
    >
      {/* Header */}
      <Header />

      {/* Plan Details */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          width: { md: "80%", sm: "100%" },
          flexDirection: { xs: "column-reverse", md: "row" },
          justifyContent: "center",
          justifyItems: "center",
          alignItems: { xs: "center", md: "center" },
          gap: { xs: 6, md: 10 },
          px: { xs: 1, md: 10 },
          py: { xs: 6, md: 10 },
          mx: "auto",
        }}
      >
        {/* Left: Plan Details */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{ fontSize: "28px", fontWeight: 600, color: "#111", mb: 1 }}
          >
            {safePlan.name}
          </Typography>
          <Typography sx={{ fontSize: "16px", color: "#757575", mb: 2 }}>
            {safePlan.description || "No description available"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "baseline", mb: 3 }}>
            <Typography
              sx={{ fontSize: "48px", fontWeight: 600, color: "#111" }}
            >
              ${finalPrice ?? safePlan.price}
            </Typography>
            <Typography sx={{ fontSize: "16px", color: "#757575", ml: 0.5 }}>
              /{safePlan.billingPeriod}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {safePlan.features?.map((feature, idx) => (
              <Box
                key={idx}
                sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
              >
                <Typography
                  component="span"
                  sx={{ color: "#6C2BD7", fontSize: 22 }}
                >
                  ✔
                </Typography>
                <Typography sx={{ color: "#333", fontSize: "16px" }}>
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right: Summary Card */}
        <Card
          sx={{
            flex: 1,
            width: "100%",
            maxWidth: { xs: "100%", md: "546px" },
            p: { xs: 3, md: 5 },
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
            border: "1px solid #F1F1F1",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 500,
              color: "#111",
              mb: 4,
              textAlign: "start",
            }}
          >
            Summary
          </Typography>
          {/* Subtotal */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 1,
              fontSize: "14px",
            }}
          >
            <Typography sx={{ color: "#555" }}>Subtotal</Typography>
            <Typography sx={{ fontWeight: 600 }}>
              ${safePlan.price} {safePlan.currency}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          {/* Coupon Input */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #E0E0E0",
              borderRadius: "10px",
              px: 1.8,
              py: 0.8,
              mb: 3,
              backgroundColor: "#FAFAFA",
            }}
          >
            <DiscountOutlinedIcon sx={{ color: "#6C2BD7", mr: 1 }} />
            <InputBase
              placeholder="Enter coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              sx={{
                flex: 1,
                fontSize: "15px",
                color: "#333",
                "& input::placeholder": { color: "#9E9E9E" },
              }}
            />
            <Button
              disabled={checkingCoupon}
              onClick={handleApplyCoupon}
              variant="text"
              size="small"
            >
              {checkingCoupon ? "Checking..." : "Apply"}
            </Button>
          </Box>
          {couponData && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#F6FFF9",
                border: "1px solid #C8E6C9",
                borderRadius: "10px",
                px: 2,
                py: 1,
                mb: 2,
              }}
            >
              <Typography sx={{ color: "#28A745", fontSize: "14px" }}>
                ✅{" "}
                {couponData.message ||
                  `Applied ${
                    couponData.percentOff || couponData.amountOff / 100
                  }${couponData.percentOff ? "%" : safePlan.currency} off`}
              </Typography>
              <Button
                onClick={() => {
                  setCoupon("");
                  setCouponData(null);
                  setFinalPrice(null);
                  setMessage({
                    text: "Coupon removed.",
                    type: "",
                  });
                }}
                variant="text"
                size="small"
                color="error"
              >
                Remove
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />
          <Typography
            className="text-[#827A70]"
            sx={{ fontWeight: 300, fontSize: "12px", mb: 2 }}
          >
            Taxe calculated at checkout
          </Typography>
          {/* Total */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography sx={{ fontWeight: 500, fontSize: "18px" }}>
              Total
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>
              ${finalPrice ?? safePlan.price} {safePlan.currency}
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => handleCheckout(safePlan.name)}
          >
            Proceed to Checkout
          </Button>
        </Card>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Snackbar for feedback */}
      <Snackbar
        open={!!message.text}
        autoHideDuration={3000}
        onClose={() => setMessage({ text: "", type: "" })}
      >
        <Alert
          severity={message.type || "info"}
          onClose={() => setMessage({ text: "", type: "" })}
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlanPage;
