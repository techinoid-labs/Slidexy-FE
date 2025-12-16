"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Link,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useSearchParams, useRouter } from "next/navigation";
import { useLinkedIn } from "@/app/context/LinkedInContext";

/**
 * LinkedInCallbackHandler Component
 * Handles OAuth callback redirect from LinkedIn
 * Should be rendered on /linkedin/callback route
 */
export const LinkedInCallbackHandler: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshConnectionStatus } = useLinkedIn();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing LinkedIn authorization...");

  useEffect(() => {
    const processCallback = async () => {
      try {
        const success = searchParams.get("success");
        const error = searchParams.get("error");

        if (success === "true") {
          setStatus("success");
          setMessage("✅ Successfully connected to LinkedIn!");

          // Refresh connection status
          await refreshConnectionStatus();

          // Redirect after 3 seconds
          setTimeout(() => {
            router.push("/presentation/outline");
          }, 5000);
        } else if (error) {
          setStatus("error");
          setMessage(`❌ Authorization failed: ${decodeURIComponent(error)}`);

          // Redirect after 5 seconds
          setTimeout(() => {
            router.push("/presentation/outline");
          }, 5000);
        } else {
          setStatus("error");
          setMessage("❌ Invalid callback parameters");

          setTimeout(() => {
            router.push("/presentation/outline");
          }, 3000);
        }
      } catch (err) {
        setStatus("error");
        setMessage("❌ Error processing callback");
        console.error("[LinkedIn Callback] Error:", err);

        setTimeout(() => {
          router.push("/presentation/outline");
        }, 3000);
      }
    };

    processCallback();
  }, [searchParams, router, refreshConnectionStatus]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%" }}>
        <CardContent sx={{ textAlign: "center", py: 4 }}>
          {status === "loading" && (
            <>
              <CircularProgress size={60} sx={{ mb: 2, color: "#0A66C2" }} />
              <Typography variant="h6">{message}</Typography>
              <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                Please wait while we verify your LinkedIn connection...
              </Typography>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircleIcon
                sx={{ fontSize: 60, color: "#4caf50", mb: 2 }}
              />
              <Typography variant="h6">{message}</Typography>
              <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                Redirecting you back to your presentation...
              </Typography>
              <LinearProgress sx={{ mt: 2 }} />
            </>
          )}

          {status === "error" && (
            <>
              <ErrorIcon sx={{ fontSize: 60, color: "#f44336", mb: 2 }} />
              <Typography variant="h6">{message}</Typography>
              <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                Redirecting you back to your presentation...
              </Typography>
              <LinearProgress sx={{ mt: 2 }} />
            </>
          )}

          <Typography
            variant="caption"
            sx={{ display: "block", mt: 3, color: "text.secondary" }}
          >
            If you're not redirected automatically,{" "}
            <Link
              href="/presentation/outline"
              underline="hover"
              sx={{ cursor: "pointer" }}
            >
              click here
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

import { LinearProgress } from "@mui/material";

export default LinkedInCallbackHandler;
