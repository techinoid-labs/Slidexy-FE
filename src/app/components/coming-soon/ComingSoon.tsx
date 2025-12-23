"use client";

import React from "react";
import { Button, Container, Typography, Box, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import Image from "next/image";

const ComingSoonPage = () => {
  const theme = useTheme();

  const gradientText = `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Container
        maxWidth="sm"
        className="justify-center flex flex-col gap-12 items-center"
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/images/Logo.svg"
              alt="Slides Logo"
              width={118}
              height={36}
            />
          </Box>
        </Link>

        <div className="text-center flex flex-col items-center justify-center">
          <Box mb={4}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                backgroundImage: gradientText,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Coming Soon
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mt: 2,
                backgroundImage: gradientText,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              We’re working hard to bring you something amazing. Stay tuned!
            </Typography>
          </Box>

          {/* Optional form goes here */}

          <Typography variant="body2" sx={{ mt: 8, opacity: 0.6 }}>
            &copy; {new Date().getFullYear()} Slidexy. All rights reserved.
          </Typography>
        </div>
      </Container>
    </Box>
  );
};

export default ComingSoonPage;
