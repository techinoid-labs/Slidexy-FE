"use client";

import React, { useState } from "react"
import {
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  ListItemIcon,
  Box,
  Button,
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
        <Box sx={{
          display: "flex"
}}>
        <Typography
          suppressHydrationWarning
          className="cursor-pointer"
           onClick={() => router.push("/auth")}
          sx={{
            ml: "10px",
            px: "20px",
            py: "12px",
            color: "#4A00E0",
            height: "48px",
            background: "#F2F0FF",
            borderRadius: "999px",
            textTransform: "none",
            fontWeight: 500,
            fontSize: size ? "12px" : "16px",
            whiteSpace: "nowrap",
            transition: "all 0.2s ease",
            "&:hover": {
              background: "#E8E3FF",
              boxShadow: "0 2px 6px rgba(74, 0, 224, 0.15)",
            },
            "&:active": {
              transform: "scale(0.97)",
            },
          }}
        >
          {size ? `Sign In` : `Login / Signup`}
        </Typography>
        <Button
        variant="contained"
        onClick={() => router.push("/tools/prompt-to-deck")}
        sx={{
          ml: 2,
          px: "20px",
          py: "12px",
          height: "48px",
          borderRadius: "999px",
          textTransform: "none",
          fontWeight: 500,
          fontSize: size ? "12px" : "16px",
          background: "#4A00E0",
          "&:hover": {
            background: "#3a00b3",
          },
        }}
        >
          Try Without Sign Up
        </Button>
        </Box>
      )}
    </>
  );
};

export default NavProfileHandler;
