"use client";

import {
  Modal,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  Button,
  Stack,
} from "@mui/material";
import { useUser } from "@/app/context/AuthContext";
import { signOut } from "next-auth/react";
import AuthModal from "./AuthModal";
import { useEffect, useState } from "react";

const FE_URL = process.env.NEXT_PUBLIC_FE_BASE_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// helper: format gmail into name
const extractNameFromEmail = (email: string): string => {
  if (!email) return "User";
  const username = email.split("@")[0];
  return username
    .replace(/[._]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// helper: get first name
const getFirstName = (name: string) => {
  return name.split(" ")[0];
};

const ProfileModal = ({
  open,
  onClose,
  presentationId,
}: {
  open: boolean;
  onClose: () => void;
  presentationId?: string | null;
}) => {
  const { user, loading, refreshUser } = useUser();
  const [cancelError, setCancelError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  console.log(user);

  const handleSignOut = async () => {
    await signOut({ redirect: false }); // no page reload or redirect
  };

  const handleCancelRenewal = async () => {
    setCancelLoading(true);
    setCancelError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/stripe/cancel-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user?._id }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        if (user?.subscription) {
          user.subscription.cancelAtPeriodEnd = true;
        }
        // await refreshUser();
      } else {
        setCancelError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setCancelError(err.message || "Network error. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  const displayName =
    user?.name ||
    (user?.email ? extractNameFromEmail(user.email) : "Anonymous User");

  const firstName = getFirstName(displayName);

  useEffect(() => {
    if (open) {
      // console.log("USER FETCHED");
      refreshUser();
      setCancelError("");
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: 350,
          outline: "none",
        }}
      >
        {loading ? (
          <Card sx={{ borderRadius: 3, boxShadow: 6, p: 2 }}>
            <CardContent>
              <Typography align="center">Loading...</Typography>
            </CardContent>
          </Card>
        ) : user ? (
          <Card sx={{ borderRadius: 3, boxShadow: 6, p: 2, maxWidth: "100%" }}>
            <CardContent>
              <Stack spacing={1.5} alignItems="center">
                {/* Avatar */}
                <Avatar sx={{ width: 60, height: 60, bgcolor: "primary.main" }}>
                  {displayName[0].toUpperCase()}
                </Avatar>

                {/* Greeting */}
                <Typography variant="h6">{firstName}</Typography>

                {/* User Info */}
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>

                <Divider flexItem />

                {/* Admin-specific message */}
                {user?.admin && (
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      p: 2,
                      borderColor: "secondary.main",
                    }}
                  >
                    <Stack spacing={1.5} alignItems="center">
                      <Typography
                        variant="subtitle1"
                        color="secondary.main"
                        fontWeight="bold"
                      >
                        👑 Admin Access
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                      >
                        You have full access as Admin. Enjoy unlimited features!
                      </Typography>
                    </Stack>
                  </Card>
                )}
                {/*Non Admin (Trial and Paid)  */}
                {!user?.admin && (
                  <Stack
                    spacing={1.5}
                    sx={{ width: "100%", textAlign: "center" }}
                  >
                    {/*  Subscription Related */}
                    {user?.subscription &&
                    user.subscription.status === "active" ? (
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          p: 1,
                          borderColor: "primary.main",
                        }}
                      >
                        <Stack spacing={1.2} alignItems="center">
                          <Typography
                            variant="subtitle1"
                            color="primary"
                            fontWeight="bold"
                          >
                            ✅ Active Plan: {user.subscription.plan?.name}
                          </Typography>

                          <Divider flexItem />

                          <Stack spacing={0.8}>
                            <Typography variant="body2" color="text.secondary">
                              Price:{" "}
                              <b>
                                {user.subscription.plan?.currency}{" "}
                                {user.subscription.plan?.price} /{" "}
                                {user.subscription.plan?.billingPeriod.toUpperCase()}
                              </b>
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              Valid till{" "}
                              <b>
                                {new Date(
                                  user.subscription.currentPeriodEnd
                                ).toLocaleDateString()}
                              </b>
                            </Typography>

                            {/* Usage stats */}
                            {user.subscriptionUsage?.imageDecksLeftToday !==
                              undefined && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Image decks left today:{" "}
                                <b>
                                  {user.subscriptionUsage.imageDecksLeftToday}
                                </b>
                              </Typography>
                            )}

                            {user.subscriptionUsage
                              ?.predefinedDecksLeftToday !== undefined && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Predefined decks left today:{" "}
                                <b>
                                  {
                                    user.subscriptionUsage
                                      .predefinedDecksLeftToday
                                  }
                                </b>
                              </Typography>
                            )}

                            {/* 🚨 Daily limit reached message */}
                            {user.subscriptionUsage?.imageDecksLeftToday ===
                              0 &&
                              user.subscriptionUsage
                                ?.predefinedDecksLeftToday === 0 && (
                                <Typography
                                  variant="body2"
                                  color="error.main"
                                  fontWeight="bold"
                                  sx={{ mt: 1 }}
                                >
                                  ⚠️ You’ve reached your daily deck limit for
                                  today.
                                </Typography>
                              )}
                          </Stack>
                        </Stack>
                      </Card>
                    ) : user?.subscription ? (
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          p: 2,
                          borderColor: "primary.main",
                        }}
                      >
                        <Stack spacing={1.2} alignItems="center">
                          <Typography
                            variant="subtitle1"
                            color="primary"
                            fontWeight="bold"
                          >
                            Current Plan: {user?.subscription?.plan?.name}
                          </Typography>

                          <Divider flexItem />

                          <Stack spacing={0.8}>
                            <Typography variant="body2" color="text.secondary">
                              Price:{" "}
                              <b>
                                {user?.subscription?.plan?.currency}{" "}
                                {user?.subscription?.plan?.price} /{" "}
                                {user?.subscription?.plan?.billingPeriod.toUpperCase()}
                              </b>
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              Valid till <b>--</b>
                            </Typography>

                            <Typography
                              variant="body2"
                              color="error.main"
                              fontWeight="medium"
                            >
                              Status: <b>{user?.subscription?.status} </b>
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              align="center"
                            >
                              To continue creating decks, please{" "}
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
                                purchase a plan
                              </a>
                              .
                            </Typography>
                          </Stack>
                        </Stack>
                      </Card>
                    ) : null}

                    {user?.subscription?.cancelAtPeriodEnd && (
                      <Typography
                        variant="body2"
                        color="error.main"
                        fontWeight="medium"
                      >
                        ⚠️ Your plan will cancel after:{" "}
                        <b>
                          {new Date(
                            user.subscription.currentPeriodEnd
                          ).toLocaleDateString()}
                        </b>
                      </Typography>
                    )}

                    {/* Trial (only if no active subscription) */}
                    {!user?.subscription && user?.trial?.active && (
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          p: 2,
                          borderColor: "success.main",
                        }}
                      >
                        <Stack spacing={1.2} alignItems="center">
                          <Typography
                            variant="subtitle1"
                            color="success.main"
                            fontWeight="bold"
                          >
                            🎉 Trial Active
                          </Typography>

                          {user.trial.daysLeft !== undefined && (
                            <Typography variant="body2" color="text.secondary">
                              Days left in trial: <b>{user.trial.daysLeft}</b>
                            </Typography>
                          )}

                          {user.trial.imageDecksLeftToday !== undefined && (
                            <Typography variant="body2" color="text.secondary">
                              Image decks left today:{" "}
                              <b>{user.trial.imageDecksLeftToday}</b>
                            </Typography>
                          )}

                          {user.trial.predefinedDecksLeftToday !==
                            undefined && (
                            <Typography variant="body2" color="text.secondary">
                              Predefined decks left today:{" "}
                              <b>{user.trial.predefinedDecksLeftToday}</b>
                            </Typography>
                          )}

                          {/* 🚨 Daily limit reached message */}
                          {user.trial.imageDecksLeftToday === 0 &&
                            user.trial.predefinedDecksLeftToday === 0 && (
                              <Typography
                                variant="body2"
                                color="error.main"
                                fontWeight="bold"
                                sx={{ mt: 1 }}
                              >
                                ⚠️ You’ve reached your daily deck limit for
                                today.
                              </Typography>
                            )}
                        </Stack>
                      </Card>
                    )}

                    {/* No subscription + trial ended */}
                    {!user?.subscription && !user?.trial?.active && (
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          p: 2,
                          borderColor: "error.main",
                        }}
                      >
                        <Stack spacing={1.5} alignItems="center">
                          <Typography
                            variant="subtitle1"
                            color="error.main"
                            fontWeight="bold"
                          >
                            ⚠️ No active plan or trial
                          </Typography>

                          {/* FOR PAYMENT ADDED FEEDBACK */}

                          {/* <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                          >
                            To continue creating decks, please{" "}
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
                              purchase a plan
                            </a>
                            .
                          </Typography> */}

                          {/* FOR NO PAYMENT FEEDBACK */}
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                          >
                            Please join our{" "}
                            <a
                              href={`${FE_URL}/waiting-list`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#1976d2",
                                fontWeight: 600,
                                textDecoration: "underline",
                              }}
                            >
                              waiting list
                            </a>{" "}
                            to receive updates on our upcomming plans. .
                          </Typography>
                        </Stack>
                      </Card>
                    )}
                  </Stack>
                )}

                <Divider flexItem />

                {/* Friendly message */}
                <Typography variant="body2" color="text.secondary">
                  Welcome back, {firstName}. Let’s create presentations!
                </Typography>

                {/* Actions */}
                <Box sx={{ width: "100%" }}>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleSignOut}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        // flex: 1, // 🔑 makes both buttons same width
                      }}
                    >
                      Sign Out
                    </Button>

                    {!user?.subscription?.cancelAtPeriodEnd &&
                      user?.subscription?.status === "active" && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={handleCancelRenewal}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            // flex: 1, // 🔑 same width as Sign Out
                          }}
                          disabled={cancelLoading}
                        >
                          {cancelLoading ? "Cancelling..." : "Cancel Renewal"}
                        </Button>
                      )}
                  </Stack>

                  {/* Error shown below row */}
                  {cancelError && (
                    <Typography
                      variant="body2"
                      color="error"
                      align="center"
                      sx={{ mt: 1 }}
                    >
                      {cancelError}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <AuthModal
            onClose={onClose}
            presentationId={presentationId ?? null}
          />
        )}
      </Box>
    </Modal>
  );
};

export default ProfileModal;
