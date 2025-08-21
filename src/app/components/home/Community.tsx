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
        pt: { xs: 8, md: "100px" },
        pb: { xs: 8, md: "96px" },
        px: { xs: 3, md: "112px" },
        gap: { xs: 6, md: "80px" },
        boxSizing: "border-box",
        mx: "auto",
      }}
    >
      {/* Icon */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
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
      </Box>

      {/* Heading */}
      <Typography
        sx={{
          color: "black",
          fontWeight: 600,
          fontSize: { xs: "2rem", md: "3rem" },
          textAlign: "center",
          mt: { xs: 0, md: -10 },
        }}
      >
        Join the waitlist
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          color: "black",
          fontWeight: 400,
          fontSize: { xs: "1rem", md: "1.18rem" },
          textAlign: "center",
          maxWidth: 700,
          mt: { xs: 0, md: -10 },
        }}
      >
        Join the waitlist today and be the first to experience it.
      </Typography>

      {/* Button */}
      <Link href="/waiting-list" passHref>
        <Button
          variant="contained"
          endIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M7 2a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5H7zm0 2h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm5 2a1 1 0 0 0-1 1v4.586l-2.707 2.707a1 1 0 1 0 1.414 1.414l3-3A1 1 0 0 0 13 10V7a1 1 0 0 0-1-1z"
              />
            </svg>
          }
          sx={{
            color: "#fff",
            borderRadius: "999px",
            px: 3,
            textTransform: "none",
            fontWeight: 600,
            whiteSpace: "nowrap",
            "&:hover": {
              backgroundColor: "red",
            },
            mt: { xs: 0, md: -10 },
          }}
        >
          Join the Waitlist
        </Button>
      </Link>
    </Box>
  );
}
