// "use client";

// import React from "react";
// import { useTheme as useMuiTheme, Avatar } from "@mui/material";

// import { Typography } from "@mui/material";

// import { useUser } from "@/app/context/AuthContext";

// const NavProfileHandler = ({ setProfileModalOpen }: any) => {
//   const { user } = useUser();

//   return (
//     <>
//       {user ? (
//         <Avatar
//           suppressHydrationWarning
//           className="cursor-pointer"
//           sx={{ width: 44, height: 44, bgcolor: "primary.main" }}
//           onClick={() => setProfileModalOpen(true)}
//         >
//           {user?.email[0]?.toUpperCase() || "User"}
//         </Avatar>
//       ) : (
//         <Typography
//           suppressHydrationWarning
//           className="cursor-pointer"
//           onClick={() => setProfileModalOpen(true)}
//           sx={{
//             // mt: "5px",
//             ml: "10px",
//             px: "20px",
//             py: "12px",
//             color: "#4A00E0",
//             height: "48px",
//             background: "#F2F0FF",
//             borderRadius: "999px",
//             textTransform: "none",
//             fontWeight: 500,
//             fontSize: "16px",
//             whiteSpace: "nowrap",
//             transition: "all 0.2s ease",
//             "&:hover": {
//               background: "#E8E3FF",
//               boxShadow: "0 2px 6px rgba(74, 0, 224, 0.15)",
//             },
//             "&:active": {
//               transform: "scale(0.97)",
//             },
//           }}
//         >
//           Login / Signup
//         </Typography>
//       )}
//     </>
//   );
// };

// export default NavProfileHandler;

"use client";

import React, { useState } from "react";
import {
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useUser } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const NavProfileHandler = ({
  size,
  setProfileModalOpen,
  setAuthModalOpen,
  showMail,
}: any) => {
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
    signOut();
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
              sx: { mt: 1.5, borderRadius: 2, minWidth: 160 },
            }}
          >
            <MenuItem onClick={handleAccount}>Account</MenuItem>
            <MenuItem onClick={handleLogout}>Sign out</MenuItem>
          </Menu>
        </>
      ) : (
        <Typography
          suppressHydrationWarning
          className="cursor-pointer"
          onClick={() => setAuthModalOpen(true)}
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
      )}
    </>
  );
};

export default NavProfileHandler;
