"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useUser } from "@/app/context/AuthContext";
import { CircularProgress } from "@mui/material";

const FE_URL = process.env.NEXT_PUBLIC_FE_BASE_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SubscriptionDetails: React.FC = () => {
  const { user, loading, refreshUser } = useUser();
  const [cancelError, setCancelError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // console.log(user);

  useEffect(() => {
    refreshUser();
  }, []);

  const handleCancelRenewal = async () => {
    if (!user?._id) return;
    setCancelLoading(true);
    setCancelError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/stripe/cancel-subscription`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        if (user?.subscription) {
          user.subscription.cancelAtPeriodEnd = true;
        }
        await refreshUser();
        setConfirmOpen(false); // close dialog
      } else {
        setCancelError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setCancelError(err.message || "Network error. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 2,
        }}
      >
        <CircularProgress size={42} thickness={4} sx={{ color: "#5b21b6" }} />
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Loading your subscription details...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Typography variant="body2" color="text.secondary">
        Please sign in to see subscription details.
      </Typography>
    );
  }

  const sub = user.subscription;
  const trial = user.trial;

  const isActive = sub?.status === "active";
  const isCanceled = sub?.cancelAtPeriodEnd;
  const isEnded = sub?.status === "canceled" && !!sub?.endDate;
  const trialActive = !sub && trial?.active;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "--";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        My Subscriptions
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
        View & Manage your subscription and usage.
      </Typography>
      <Typography variant="body2" sx={{ color: "#5b21b6", mb: 4 }}>
        <b>Email:</b>
        {user.email}
      </Typography>

      <Card
        elevation={0}
        sx={{
          border: "1px solid #eee",
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Top Row */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            {/* Left */}
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 0.75 }}
              >
                {isActive
                  ? "Current Plan"
                  : isCanceled
                  ? "Cancels Soon"
                  : isEnded
                  ? "Canceled Plan"
                  : trialActive
                  ? "Trial"
                  : "Status"}
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: isActive ? "#5b21b6" : "text.primary",
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                {sub?.plan?.name ||
                  (trialActive ? "Trial Active" : "No Active Plan")}
              </Typography>

              {/* {(isActive || trialActive) && ( */}
              <>
                <Typography variant="subtitle2" sx={{ mb: 1.25 }}>
                  What’s included:
                </Typography>
                <List dense disablePadding>
                  <ListItem disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckRoundedIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Image Decks: ${
                        isActive
                          ? user.subscriptionUsage?.imageDecksLeftToday
                          : trial?.imageDecksLeftToday
                      }`}
                      primaryTypographyProps={{ fontSize: 14 }}
                    />
                  </ListItem>
                  <ListItem disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckRoundedIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Predefined Decks: ${
                        isActive
                          ? user.subscriptionUsage?.predefinedDecksLeftToday
                          : trial?.predefinedDecksLeftToday
                      }`}
                      primaryTypographyProps={{ fontSize: 14 }}
                    />
                  </ListItem>
                </List>
              </>
              {/* )} */}
            </Box>

            {/* Right */}
            <Box textAlign="right">
              {isActive && (
                <Typography
                  color="#5b21b6"
                  sx={{
                    fontSize: { xs: 14, md: 36 },
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {sub?.plan?.currency} {sub?.plan?.price}
                  <Typography
                    component="span"
                    sx={{ fontSize: 14, fontWeight: 500, ml: 1 }}
                  >
                    /{sub?.plan?.billingPeriod}
                  </Typography>
                </Typography>
              )}
            </Box>
          </Box>

          {/* Bottom Row */}
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            mt={3}
            gap={2}
          >
            {isActive && (
              <>
                {!isCanceled && (
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontSize: 14 }}
                  >
                    Billing cycle: {formatDate(sub?.currentPeriodEnd)}
                  </Typography>
                )}
                {!isCanceled && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => setConfirmOpen(true)}
                    sx={{ borderRadius: 1.2, textTransform: "none", px: 2 }}
                  >
                    Cancel Renewal
                  </Button>
                )}
              </>
            )}
          </Box>

          {/* Canceled notice */}
          {isCanceled && (
            <Typography
              variant="body2"
              sx={{ color: "error.main", mt: 2, textAlign: "right" }}
            >
              ⚠️ Your plan will cancel after:{" "}
              {formatDate(sub?.currentPeriodEnd)}
            </Typography>
          )}
          {isEnded && (
            <Typography
              variant="body2"
              sx={{ color: "error.main", mt: 2, textAlign: "left" }}
            >
              Your subscription was cancelled on:{" "}
              <b>{formatDate(sub?.currentPeriodEnd)} </b> you can also
              <a
                href={`${FE_URL}/pricing`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#1976d2",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                {" "}
                re-subscribe
              </a>
              .
            </Typography>
          )}

          {/* Trial message */}
          {trialActive && (
            <Typography
              variant="body2"
              sx={{ color: "success.main", mt: 2, fontWeight: 500 }}
            >
              🎉 Trial Active — {trial?.daysLeft} days left
            </Typography>
          )}

          {/* No plan */}
          {!isActive && !trialActive && !isEnded && (
            <Typography
              variant="body2"
              sx={{ color: "error.main", mt: 2, fontWeight: 500 }}
            >
              ⚠️ No active plan or trial.{" "}
              <a
                href={`${FE_URL}/pricing`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#1976d2",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                Upgrade now
              </a>
              .
            </Typography>
          )}

          {/* Cancel error */}
          {cancelError && (
            <Typography
              variant="body2"
              color="error"
              align="right"
              sx={{ mt: 2 }}
            >
              {cancelError}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* ✅ Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => !cancelLoading && setConfirmOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 540,
            borderRadius: 2,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontSize: 18, fontWeight: 600, pb: 1 }}>
          Confirm Cancellation?
        </DialogTitle>

        <DialogContent sx={{ pb: 1 }}>
          <DialogContentText sx={{ fontSize: 14, lineHeight: 1.5 }}>
            Are you sure you want to cancel your subscription renewal? <br />
            You will continue to have access until{" "}
            <strong>{formatDate(sub?.currentPeriodEnd)}</strong>.
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions
          sx={{
            justifyContent: "center",
            px: 2,
            pb: 2,
            width: "100%",
            ml: "auto",
          }}
        >
          <Button
            onClick={() => setConfirmOpen(false)}
            disabled={cancelLoading}
            size="small"
            sx={{
              borderRadius: 1.2,
              textTransform: "none",
            }}
          >
            Keep Subscription
          </Button>
          <Button
            onClick={handleCancelRenewal}
            color="error"
            variant="contained"
            disabled={cancelLoading}
            size="small"
            sx={{
              borderRadius: 1.2, // ✅ less rounded
              textTransform: "none",
            }}
          >
            {cancelLoading ? "Cancelling…" : "Yes, Cancel Renewal"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionDetails;
