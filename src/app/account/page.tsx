"use client";
import { useState } from "react";
import { Box, IconButton, Drawer, useMediaQuery } from "@mui/material";
import { ArrowRight, Close as CloseIcon } from "@mui/icons-material";
import Header from "../components/headers-navbar/Header";
import SidebarTabs, { TabKey } from "../components/account/SidebarTabs";
import SubscriptionDetails from "../components/account/SubscriptionDetails";
import AccountSettings from "../components/account/AccountSettings";
import { useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const AccountPage = () => {
  const [selectedTab, setSelectedTab] = useState<TabKey>("subscriptions");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <Header />

      <Box
        sx={{
          display: "flex",
          height: "calc(100vh - 88px)", // subtract header height
          bgcolor: "#f9fafb",
          overflow: "hidden",
        }}
      >
        {/* Sidebar */}
        {isMobile ? (
          <>
            {session && (
              <>
                {/* Mobile Sidebar Toggle Button */}
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

                {/* Drawer for Mobile Sidebar */}
                <Drawer
                  anchor="left"
                  open={mobileOpen}
                  onClose={() => setMobileOpen(false)}
                  PaperProps={{
                    sx: { width: 280, p: 1, position: "relative" },
                  }}
                >
                  {/* Close button inside Drawer */}
                  <IconButton
                    onClick={() => setMobileOpen(false)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 1300,
                      bgcolor: "#f5f5f5",
                      borderRadius: 1,
                      "&:hover": { bgcolor: "#e0e0e0" },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>

                  {/* Sidebar Content */}
                  <Box sx={{ mt: 5 }}>
                    <SidebarTabs
                      selected={selectedTab}
                      onSelect={(tab) => {
                        setSelectedTab(tab);
                        setMobileOpen(false);
                      }}
                    />
                  </Box>
                </Drawer>
              </>
            )}
          </>
        ) : (
          <Box
            sx={{
              flexShrink: 0,
              height: "100%",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <SidebarTabs selected={selectedTab} onSelect={setSelectedTab} />
          </Box>
        )}

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            height: "100%",
            p: { xs: 2, sm: 3, md: 6 },
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {selectedTab === "account" && <AccountSettings />}
          {selectedTab === "subscriptions" && <SubscriptionDetails />}
        </Box>
      </Box>
    </>
  );
};

export default AccountPage;
