"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/stripe/session/${sessionId}`
        );
        const data = await res.json();
        setSessionData(data);
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 1,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 600,
          width: "100%",
          p: 5,
          borderRadius: 3,
          textAlign: "center",
          bgcolor: "white",
          boxShadow: "0 2px 16px 0 rgba(80, 80, 120, 0.07)",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {/* Success Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <Image
                width={150}
                height={150}
                alt="success-check"
                src={`/images/success/success-icon.svg`}
              />
            </Box>

            {/* Heading */}
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "black", mb: 1 }}
            >
              Payment Successful!
            </Typography>

            {/* Subtext */}
            <Typography fontSize={14} sx={{ color: "#6B6B6B", mb: 2 }}>
              Thank you for subscribing to our plan. Your payment was processed
              successfully.
            </Typography>

            {/* Email */}
            {sessionData?.email && (
              <Typography fontSize={14} sx={{ color: "#6B6B6B", mb: 4 }}>
                A confirmation email has been sent to{" "}
                <span style={{ fontWeight: 600 }}>{sessionData.email}</span>
              </Typography>
            )}

            {/* Button */}
            <Button
              fullWidth
              variant="contained"
              sx={{
                borderRadius: "999px",
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                background: "linear-gradient(90deg, #6a11cb, #4A00E0)",
                "&:hover": {
                  background: "linear-gradient(90deg, #5a0fb9, #4A00E0)",
                },
              }}
              onClick={() => router.push("/")}
            >
              Go to Homepage
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
