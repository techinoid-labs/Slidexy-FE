"use client";

import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function CommunitySection() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100vw",
        background: "#723AFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        pt: { xs: 8, md: "96px" },
        pb: { xs: 8, md: "96px" },
        px: { xs: 3, md: "112px" },
        gap: { xs: 6, md: "80px" },
        boxSizing: "border-box",
        mx: "auto",
      }}
    >
      {/* Icon */}
      {/* <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            width: 150,
            height: 90,
            borderRadius: "50%",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/images/Logo.svg"
            alt="Community Icon"
            width={150}
            height={150}
          />
        </Box>
      </Box> */}

      {/* Heading */}
      <Typography
        sx={{
          color: "white",
          fontWeight: 600,
          fontSize: { xs: "40px", md: "40px" },
          textAlign: "center",
          mt: { xs: 8, md: "40px" },
        }}
      >
        Experience the Future First
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          color: "white",
          fontWeight: 400,
          fontSize: { xs: "1rem", md: "1.18rem" },
          textAlign: "center",
          maxWidth: 524,
          mt: { xs: 0, md: -10 },
        }}
      >
        Join the waitlist today and let AI-powered innovation reach you before
        the crowd.{" "}
      </Typography>

      {/* Button */}
      <Link href="/waiting-list" passHref>
        <Button
          variant="contained"
          sx={{
            color: "#6412FF",
            background:"#FFFFFF",
            borderRadius: "999px",
            borderColor: "white",
            px: 3,
            textTransform: "none",
            fontWeight: 600,
            whiteSpace: "nowrap",

            mt: { xs: 0, md: -10 },
          }}
        >
          Join the Waitlist
        </Button>
      </Link>
    </Box>
  );
}
