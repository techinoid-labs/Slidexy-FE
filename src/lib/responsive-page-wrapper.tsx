"use client";

import React from "react";
import { Box } from "@mui/material";

export default function ResponsivePageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-2">
      {children}
    </Box>
  );
}
