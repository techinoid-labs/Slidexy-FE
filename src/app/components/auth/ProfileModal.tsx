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

                {/* Trial / Subscription Info */}
                {/* <Stack spacing={1} sx={{ width: "100%", textAlign: "center" }}>
                  {user.trialActive && (
                    <Typography variant="body2" color="success.main">
                      🎉 Trial Active
                    </Typography>
                  )}

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
                </Stack> */}
                {/* Trial / Subscription Info */}
                <Stack spacing={1} sx={{ width: "100%", textAlign: "center" }}>
                  {/* Active Subscription */}
                  {user?.subscription &&
                    user.subscription.status === "active" && (
                      <>
                        <Typography variant="body2" color="primary">
                          ✅ Active Plan: <b>{user.subscription.plan?.name}</b>
                        </Typography>

                        {user.daysLeft !== undefined && (
                          <Typography variant="body2" color="text.secondary">
                            Days left in billing cycle: <b>{user.daysLeft}</b>
                          </Typography>
                        )}

                        {user.presentationsLeftToday !== undefined && (
                          <Typography variant="body2" color="text.secondary">
                            Presentations left today:{" "}
                            <b>{user.presentationsLeftToday}</b>
                          </Typography>
                        )}
                      </>
                    )}

                  {/* Trial (only if no active sub) */}
                  {!user?.subscription && user?.trialActive && (
                    <>
                      <Typography variant="body2" color="success.main">
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
                    </>
                  )}

                  {/* No subscription + trial ended */}
                  {!user?.subscription && !user?.trialActive && (
                    <Typography variant="body2" color="error.main">
                      ⚠️ No active plan or trial
                    </Typography>
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
