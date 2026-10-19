"use client";

import React, { useState } from "react"
import {
  Avatar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  ListItemIcon,
  Box,
} from "@mui/material";
import { useUser } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

// Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailIcon from "@mui/icons-material/Email";

const NavProfileHandler = ({ size, showMail }: any) => {
  const { user } = useUser();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleAccount = () => {
    handleClose();
    router.push("/account");
  };

  const handleLogout = () => {
    handleClose();
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {user ? (
        <>
          <IconButton onClick={handleClick} size="small" sx={{ ml: 1 }}>
            <Avatar
              suppressHydrationWarning
              sx={{
                width: size ? size : 44,
                height: size ? size : 44,
                bgcolor: "primary.main",
              }}
            >
              <Typography fontSize={size ? size - 4 : 18}>
                {user?.email?.[0]?.toUpperCase() || "U"}
              </Typography>
            </Avatar>
          </IconButton>

          {isMobile && showMail && (
            <Typography
              onClick={handleClick}
              fontSize={12}
              className="truncate max-w-24"
            >
              {user?.email}
            </Typography>
          )}

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 3,
              sx: { mt: 1.5, borderRadius: 2, minWidth: 200 },
            }}
          >
            <MenuItem onClick={handleAccount}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Account
            </MenuItem>

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sign out
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <Box
              display="flex"
              alignItems="center"
              gap={1}
              px={2}
              py={1}
              sx={{ color: "text.secondary" }}
            >
              <EmailIcon fontSize="small" />
              <Typography
                variant="body2"
                className="truncate"
                sx={{ maxWidth: 160 }}
              >
                {user?.email}
              </Typography>
            </Box>
          </Menu>
        </>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          suppressHydrationWarning
          onClick={() => router.push("/auth")}
          disableElevation
          size={size ? "small" : "medium"}
          sx={{
            ml: "10px",
            whiteSpace: "nowrap",
            // Square and quiet, so the one filled block in the header stays
            // the primary action. A second rounded pill competes with it.
            borderRadius: 0,
            border: "1.5px solid rgba(15,10,25,0.18)",
            color: "#0F0A19",
            bgcolor: "transparent",
            fontWeight: 600,
            fontSize: "0.93rem",
            textTransform: "none",
            px: 2.25,
            "&:hover": { bgcolor: "transparent", borderColor: "#0F0A19" },
          }}
        >
          {size ? `Sign in` : `Log in`}
        </Button>
        {/* Kept from main: the first deck does not need an account, and
            saying so here is worth more than another sign-in prompt.
            Squared off to match the rest of the header. */}
        <Button
          suppressHydrationWarning
          variant="contained"
          disableElevation
          onClick={() => router.push("/tools/prompt-to-deck")}
          size={size ? "small" : "medium"}
          sx={{
            ml: 1.25,
            whiteSpace: "nowrap",
            borderRadius: 0,
            bgcolor: "#0F0A19",
            color: "#fff",
            fontWeight: 600,
            fontSize: size ? "0.82rem" : "0.93rem",
            textTransform: "none",
            px: 2.25,
            "&:hover": { bgcolor: "#8E2DE2" },
          }}
        >
          Try without signing up
        </Button>
        </Box>
      )}
    </>
  );
};

export default NavProfileHandler;
