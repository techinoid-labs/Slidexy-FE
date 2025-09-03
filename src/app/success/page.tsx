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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);

  console.log(sessionData);

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
        background: "#F9FAFB",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 500,
          p: 4,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: "#4A00E0", mb: 2 }}
            >
              🎉 Payment Successful!
            </Typography>
            <Typography sx={{ color: "#555", mb: 3 }}>
              Thank you for subscribing to our {sessionData?.plan ?? "plan"}.
              Your payment was processed successfully.
            </Typography>

            {sessionData?.email && (
              <Typography sx={{ color: "#777", mb: 2 }}>
                A confirmation has been sent to{" "}
                <strong>{sessionData.email}</strong>.
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "999px",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
              }}
              onClick={() => router.push("/home")}
            >
              Go to Homepage →
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
