"use client";

import React from "react";
import { useTheme as useMuiTheme, Avatar } from "@mui/material";

import { Typography } from "@mui/material";

import { useUser } from "@/app/context/AuthContext";

const NavProfileHandler = ({ setProfileModalOpen }: any) => {
  const { user } = useUser();

  return (
    <>
      {user ? (
        <Avatar
          suppressHydrationWarning
          className="cursor-pointer"
          sx={{ width: 44, height: 44, bgcolor: "primary.main" }}
          onClick={() => setProfileModalOpen(true)}
        >
          {user?.email[0]?.toUpperCase() || "User"}
        </Avatar>
      ) : (
        <Typography
          suppressHydrationWarning
          className="cursor-pointer"
          onClick={() => setProfileModalOpen(true)}
          sx={{
            // mt: "5px",
            ml: "10px",
            px: "20px",
            py: "12px",
            color: "#4A00E0",
            height: "48px",
            background: "#F2F0FF",
            borderRadius: "999px",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "16px",
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
          Login / Signup
        </Typography>
      )}
    </>
  );
};

export default NavProfileHandler;
