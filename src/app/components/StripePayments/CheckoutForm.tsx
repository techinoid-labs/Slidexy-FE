"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Box, Button, Typography } from "@mui/material";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    try {
      // 1. Call backend to create PaymentIntent
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5000, currency: "usd" }), // $50.00
      });

      const { clientSecret } = await res.json();

      // 2. Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setMessage(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        setMessage("✅ Payment successful!");
      }
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 shadow-lg rounded-2xl bg-white space-y-4"
    >
      <Typography variant="h6" className="text-center">
        Checkout
      </Typography>

      {/* Stripe Card Element */}
      <Box className="border rounded-lg p-3">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </Box>

      {/* Pay Button */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!stripe || loading}
        className="rounded-xl"
      >
        {loading ? "Processing..." : "Pay $50"}
      </Button>

      {/* Status Message */}
      {message && (
        <Typography
          variant="body2"
          className={`text-center ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}
