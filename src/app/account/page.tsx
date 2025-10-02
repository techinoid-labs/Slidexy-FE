"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ArrowRight } from "@mui/icons-material";
import Header from "../components/headers-navbar/Header";
import SidebarTabs, { TabKey } from "../components/account/SidebarTabs";
import SubscriptionDetails from "../components/account/SubscriptionDetails";
import { useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const AccountPage = () => {
  const [selectedTab, setSelectedTab] = useState<TabKey>("subscriptions");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // md = tablets & below
  if (!session) {
    redirect("/");
  }
  return (
    <>
      <Header />
      <Box sx={{ display: "flex", minHeight: "88vh", bgcolor: "#f9fafb" }}>
        {/* Sidebar */}
        {isMobile ? (
          <>
            {session && (
              <>
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{
                    position: "absolute",
                    top: 185,
                    left: -12,
                    zIndex: 1200,
                    bgcolor: "white",
                    borderRadius: 1,
                    boxShadow: 1,
                  }}
                >
                  <ArrowRight />
                </IconButton>

                <Drawer
                  anchor="left"
                  open={mobileOpen}
                  onClose={() => setMobileOpen(false)}
                  PaperProps={{
                    sx: { width: 300, p: 1 },
                  }}
                >
                  <SidebarTabs
                    selected={selectedTab}
                    onSelect={(tab) => {
                      setSelectedTab(tab);
                      setMobileOpen(false);
                    }}
                  />
                </Drawer>
              </>
            )}
          </>
        ) : (
          <SidebarTabs selected={selectedTab} onSelect={setSelectedTab} />
        )}

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 6 }, // responsive padding
            width: "100%",
            overflowX: "hidden",
          }}
        >
          {selectedTab === "subscriptions" && <SubscriptionDetails />}
        </Box>
      </Box>
    </>
  );
};

export default AccountPage;
