"use client";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { Box, Paper, Stack, Typography, IconButton, Drawer, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function RightPanel() {
      const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

    const ExplorerContent = (
    <Box sx={{ width: 260, bgcolor: "#fff", p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Explorer
      </Typography>
      {/* File Tree */}
      <Box sx={{ pl: 1 }}>
        <Typography fontWeight={600}>app</Typography>
        <Box sx={{ pl: 2, mt: 1, mb: 2 }}>
          <Typography>📁 src</Typography>
          <Typography>📄 App.jsx</Typography>
          <Typography>📄 index.css</Typography>
        </Box>
        <Typography fontWeight={600}>components</Typography>
        <Box sx={{ pl: 2, mt: 1 }}>
          <Typography>📄 AboutDaraz.jsx</Typography>
          <Typography>📄 Categories.jsx</Typography>
          <Typography>📄 CustomerCare.jsx</Typography>
          <Typography>📄 FlashSale.jsx</Typography>
        </Box>
      </Box>
    </Box>
  );
    const [selected, setSelected] = useState<string>("code");

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newValue: string | null
    ) => {
        if (newValue !== null) setSelected(newValue);
    };

    return (
        <Box
            sx={{
                maxWidth: "calc(100% - 48px)",
                height: "100vh",
                bgcolor: "#fff",
                p: 3,
                border: "1px solid rgba(231, 231, 231, 1)",
                mx: 3,
                mb: 2,
            }}
        >
            {/* Top Bar */}
            <Stack
                direction={{ xs: "row", sm: "row" }}
                justifyContent="space-between"
                alignItems="center"
                spacing={{ xs: 1, sm: 0 }}
                mb={3}
            >
                {/* Toggle Buttons (Code / Preview) */}
                <ToggleButtonGroup
                    value={selected}
                    exclusive
                    onChange={handleChange}
                    sx={{
                        bgcolor: "rgba(246, 246, 246, 1)",
                        borderRadius: "8px",
                        p: 0.5,
                        mb: { xs: 1, sm: 0 },
                        width: { xs: "100%", sm: "auto" },
                    }}
                >
                    <ToggleButton
                        value="code"
                        sx={{
                            textTransform: "none",
                            borderRadius: "10px",
                            border: "none",
                            px: 2,
                            py: 1,
                            fontWeight: 500,
                            width: { xs: "50%", sm: "auto" }, 
                            "&.Mui-selected": {
                                bgcolor: "rgba(160,140,255,0.2)",
                            },
                        }}
                    >
                        {"Code </>"}
                    </ToggleButton>

                    <ToggleButton
                        value="preview"
                        sx={{
                            textTransform: "none",
                            borderRadius: "10px",
                            border: "none",
                            px: 2,
                            py: 1,
                            fontWeight: 500,
                            color: "grey.600",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            width: { xs: "50%", sm: "auto" },
                            "&.Mui-selected": {
                                bgcolor: "rgba(160,140,255,0.2)",
                                color: "black",
                            },
                        }}
                    >
                        Preview
                        <Image src="/eye-icon.svg" alt="Preview Icon" width={18} height={18} />
                    </ToggleButton>
                </ToggleButtonGroup>

                {/* Download Button */}
                <Button
                    variant="outlined"
                    sx={{
                        textTransform: "none",
                        borderRadius: "30px",
                        border: "none",
                        px: { xs: 1, sm: 3 }, // less padding on mobile
                        py: 1,
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        bgcolor: "rgba(242, 240, 255, 1)",
                        minWidth: { xs: 40, sm: "auto" }, // small width for mobile icon only
                        justifyContent: "center",
                    }}
                >
                    {/* Hide text on mobile */}
                    <Typography
                        sx={{ display: { xs: "none", sm: "inline" } }}
                    >
                        Download
                    </Typography>
                    <Image
                        src="/down-arrow.svg"
                        alt="Download Icon"
                        width={12}
                        height={12}
                    />
                </Button>
            </Stack>


            {/* Main Layout */}
            <Paper
                elevation={1}
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    width: "100%",
                    height: "78vh",
                    overflow: "hidden",
                    borderRadius: "16px",
                }}
            >
 {/* Mobile: Drawer Button */}
      <Box sx={{ display: { xs: "flex", sm: "none" }, p: 1 }}>
        <IconButton onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
          {ExplorerContent}
        </Drawer>
      </Box>

      {/* Sidebar: visible on sm+ */}
      <Box sx={{ display: { xs: "none", sm: "block" } }}>{ExplorerContent}</Box>

                {/* Right Area */}
                <Box
                    sx={{
                        flex: 1, p: 4, bgcolor: "rgba(251, 250, 255, 1)",
                        border: "1px solid rgba(232, 228, 255, 1)",
                    }}>
                    <Stack spacing={4}>
                        <Box
                            sx={{
                                height: 70,
                                bgcolor: "rgba(160,140,255,0.2)",
                                borderRadius: "12px",
                            }}
                        />
                        <Box
                            sx={{
                                height: 70,
                                bgcolor: "rgba(160,140,255,0.2)",
                                borderRadius: "12px",
                            }}
                        />
                        <Box
                            sx={{
                                height: 70,
                                bgcolor: "rgba(160,140,255,0.2)",
                                borderRadius: "12px",
                            }}
                        />
                        <Box
                            sx={{
                                height: 70,
                                bgcolor: "rgba(160,140,255,0.2)",
                                borderRadius: "12px",
                            }}
                        />
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}