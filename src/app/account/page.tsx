"use client";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import Header from "../components/headers-navbar/Header";
import SidebarTabs, { TabKey } from "../components/account/SidebarTabs";
import SubscriptionDetails from "../components/account/SubscriptionDetails";
import { useUser } from "../context/AuthContext";

const AccountPage = () => {
  const [selectedTab, setSelectedTab] = useState<TabKey>("subscriptions");

  return (
    <>
      <Header />
      <Box sx={{ display: "flex", minHeight: "88vh", bgcolor: "#f9fafb" }}>
        {/* Sidebar */}
        <SidebarTabs selected={selectedTab} onSelect={setSelectedTab} />

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 6 }}>
          {selectedTab === "subscriptions" && <SubscriptionDetails />}
        </Box>
      </Box>
    </>
  );
};

export default AccountPage;
