import React from "react";
import Image from "next/image";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";

const UpperNavBar: React.FC<{
  onExportPDF: () => void;
  onExportPPT?: () => void;
}> = ({ onExportPDF, onExportPPT }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#fff",
        color: "#18181B",
        borderBottom: "1px solid #E0E0E0",
        width: "100%",
        height: 80,
        boxSizing: "border-box",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 80,
          height: 80,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
        }}
      >
        {/* Left icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: -1 }}>
          <IconButton onClick={() => router.push("/home")} sx={{ p: 1 }}>
            <Image
              src="/images/home-icon.svg"
              alt="Home"
              width={25} // increased from 32
              height={25}
            />
          </IconButton>
          <Box
            sx={{
              width: "1px",
              height: 32,
              background: "#E0E0E0",
              borderRadius: 1,
              mx: 1,
              display: { xs: "none", md: "block" },
            }}
          />
          <IconButton sx={{ p: 1.5 }}>
            <Image
              src="/images/list-icon.svg"
              alt="List"
              width={25}
              height={25}
            />
          </IconButton>
          <IconButton sx={{ p: 1.5 }}>
            <Image
              src="/images/ai-star.svg"
              alt="Star"
              width={25}
              height={25}
            />
          </IconButton>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "flex-start",
              ml: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, fontSize: 16 }}
            >
              File Name Here
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#888", mt: -0.5, fontSize: 12 }}
            >
              File Type
            </Typography>
          </Box>
        </Box>

        {/* Right icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton sx={{ p: 1.5 }}>
            <Image
              src="/images/profile-icon.svg"
              alt="Profile"
              width={40}
              height={40}
            />
          </IconButton>
          <IconButton sx={{ p: 1.5 }}>
            <Image
              src="/images/bell-icon.svg"
              alt="Notifications"
              width={40}
              height={40}
            />
          </IconButton>
          <IconButton sx={{ p: 1.5 }}>
            <Image
              src="/images/play-button.svg"
              alt="Play"
              width={40}
              height={40}
            />
          </IconButton>
          {/* Share button */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#18181B",
              background:
                "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
              color: "#fff",
              borderRadius: "999px",
              px: 3,
              py: 1.2,
              ml: 1.5,
              cursor: "pointer",
              gap: 1.5,
              fontSize: 14,
              fontWeight: 600,
              transition: "background 0.2s",
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Share
            <Image
              src="/images/share-icon.svg"
              alt="Share"
              width={26}
              height={26}
            />
          </Box>

          <Box
            onClick={onExportPDF}
            sx={{
              bgcolor: "#18181B",
              background:
                "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
              color: "#fff",
              borderRadius: "999px",
              px: 3,
              py: 1.2,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Export as PDF
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default UpperNavBar;
