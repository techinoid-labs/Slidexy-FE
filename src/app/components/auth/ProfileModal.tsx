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
  const { user, loading } = useUser();

  const handleSignOut = async () => {
  await signOut({ redirect: false }); // no page reload or redirect
};

  const displayName =
    user?.name ||
    (user?.email ? extractNameFromEmail(user.email) : "Anonymous User");

  const firstName = getFirstName(displayName);

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

                {/* Friendly message */}
                <Typography variant="body2" color="text.secondary">
                  Welcome back, {firstName}. Lets create presentations!
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
          <AuthModal onClose={onClose} presentationId={presentationId ?? null} />
        )}
      </Box>
    </Modal>
  );
};

export default ProfileModal;
