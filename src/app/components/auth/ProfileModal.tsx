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
import { useEffect } from "react";
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

  console.log(user);

  const handleSignOut = async () => {
    await signOut({ redirect: false }); // no page reload or redirect
  };

  const displayName =
    user?.name ||
    (user?.email ? extractNameFromEmail(user.email) : "Anonymous User");

  const firstName = getFirstName(displayName);

  useEffect(() => {
    if (open) {
      // console.log("USER FETCHED");
      refreshUser();
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
          <Card sx={{ borderRadius: 3, boxShadow: 6, p: 3 }}>
            <CardContent>
              <Typography align="center">Loading...</Typography>
            </CardContent>
          </Card>
        ) : user ? (
          <Card sx={{ borderRadius: 3, boxShadow: 6, p: 3 }}>
            <CardContent>
              <Stack spacing={2} alignItems="center">
                {/* Avatar */}
                <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.main" }}>
                  {displayName[0].toUpperCase()}
                </Avatar>

                {/* Greeting */}
                <Typography variant="h6">{firstName}</Typography>

                {/* User Info */}
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>

                <Divider flexItem />
                <Stack spacing={2} sx={{ width: "100%", textAlign: "center" }}>
                  {/* Active Subscription */}
                  {user?.subscription &&
                    user.subscription.status === "active" && (
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
                            ✅ Active Plan: {user.subscription.plan?.name}
                          </Typography>

                          <Divider flexItem />

                          <Stack spacing={0.8}>
                            <Typography variant="body2" color="text.secondary">
                              Price:{" "}
                              <b>
                                {user.subscription.plan?.currency}{" "}
                                {user.subscription.plan?.price} / Yearly
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

                            {user.subscription.cancelAtPeriodEnd && (
                              <Typography
                                variant="body2"
                                color="error.main"
                                fontWeight="medium"
                              >
                                ⚠️ Your plan will cancel at the end of this
                                period
                              </Typography>
                            )}
                            {user.presentationsLeftToday !== undefined && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Presentations left today:{" "}
                                <b>{user.presentationsLeftToday}</b>
                              </Typography>
                            )}
                          </Stack>
                        </Stack>
                      </Card>
                    )}

                  {/* Trial (only if no active sub) */}
                  {!user?.subscription && user?.trialActive && (
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

                        {user.daysLeft !== undefined && (
                          <Typography variant="body2" color="text.secondary">
                            Days left in trial: <b>{user.daysLeft}</b>
                          </Typography>
                        )}

                        {user.presentationsLeftToday !== undefined && (
                          <Typography variant="body2" color="text.secondary">
                            Presentations left today:{" "}
                            <b>{user.presentationsLeftToday}</b>
                          </Typography>
                        )}
                      </Stack>
                    </Card>
                  )}

                  {/* No subscription + trial ended */}
                  {!user?.subscription && !user?.trialActive && (
                    <Card
                      variant="outlined"
                      sx={{ borderRadius: 2, p: 2, borderColor: "error.main" }}
                    >
                      <Typography
                        variant="subtitle1"
                        color="error.main"
                        fontWeight="bold"
                      >
                        ⚠️ No active plan or trial
                      </Typography>
                    </Card>
                  )}
                </Stack>

                <Divider flexItem />

                {/* Friendly message */}
                <Typography variant="body2" color="text.secondary">
                  Welcome back, {firstName}. Let’s create presentations!
                </Typography>

                {/* Actions */}
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleSignOut}
                  sx={{ borderRadius: 2, textTransform: "none" }}
                  fullWidth
                >
                  Sign Out
                </Button>
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
