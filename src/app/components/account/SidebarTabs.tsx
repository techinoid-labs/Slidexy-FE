"use client";
import React from "react";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

export type TabKey = "account" | "subscriptions" | "profile" | "billing";

interface SidebarTabsProps {
  selected: TabKey;
  onSelect: (tab: TabKey) => void;
}

const SidebarTabs: React.FC<SidebarTabsProps> = ({ selected, onSelect }) => {
  const tabs: { key: TabKey; label: string }[] = [
    { key: "account", label: "Account Details" },
    { key: "subscriptions", label: "Subscriptions" },
  ];

  return (
    <Box
      sx={{
        width: 260,
        minHeight: "86vh",
        flexShrink: 0,
        bgcolor: "white",
        borderRight: "1px solid #eee",
      }}
    >
      {/* Section Header */}
      <Box sx={{ px: 3, py: 4 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Account Settings
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Tabs */}
      <Box sx={{ px: 2 }}>
        <List disablePadding>
          {tabs.map((t) => (
            <ListItemButton
              key={t.key}
              selected={selected === t.key}
              onClick={() => onSelect(t.key)}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1.25,
                mb: 1,
                "&.Mui-selected": {
                  backgroundColor: "#f3f4f6",
                  color: "text.primary",
                  fontWeight: 600,
                },
                "&:not(.Mui-selected)": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <ListItemText
                primary={t.label}
                primaryTypographyProps={{ fontSize: 14 }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default SidebarTabs;
