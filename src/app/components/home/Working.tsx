"use client";

import { Box, Typography, Chip, Button } from "@mui/material";
import Link from "next/link";
import Lottie from "lottie-react";
import Gif10ContextAware from "@/json/Gif10-context-aware.json";
import StepsAccordion from "./components/working/StepsAccordion";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { analyticsEvent } from "@/lib/gtag";

export default function WorkingSection() {
  const router = useRouter();
  const handleRedirect = () => {
    analyticsEvent("get_started_click", {
      category: "engagement",
      label: "home_page_to_slide_generation",
    });
    router.push(`/tools`);
  };

  return (
    <Box
      id="how-it-works"
      sx={{
        width: "100%",
        background: "linear-gradient(180deg, #fff 0%, #F8F5FF 100%)",
        px: { xs: 2.5, md: 10 },
        py: { xs: 6, md: 10 },
        display: "flex",
        flexDirection: "column",
        gap: 4,
        boxSizing: "border-box",
        mx: "auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
        <Chip
          icon={
            <img
              src="/images/Stars.svg"
              alt=""
              width={16}
              height={16}
              style={{ marginRight: 4 }}
            />
          }
          label="How it works"
          sx={{
            background: "#F3F0FF",
            color: "#4A00E0",
            px: 2,
            py: 0.5,
            fontWeight: 500,
            border: "1px solid rgba(142, 45, 226, 0.12)",
            mb: 2,
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "center", md: "flex-end" },
          gap: 3,
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Typography
          variant="h2"
          className="sx-display"
          sx={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: { xs: "1.75rem", md: "2.5rem" },
            color: "#0F0A19",
            letterSpacing: "-0.03em",
            maxWidth: 480,
          }}
        >
          From blank page to finished deck in three steps
        </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleRedirect}
            endIcon={<span style={{ fontSize: 20 }}>→</span>}
          >
            Get started
          </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 4,
          alignItems: "center",
        }}
      >
        <Box sx={{ flex: 1, width: "100%" }}>
          <StepsAccordion />
        </Box>

        <Box
          component={motion.div}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          sx={{
            flex: 1,
            width: "100%",
            maxWidth: 480,
            borderRadius: "24px",
            overflow: "hidden",
            background:
              "radial-gradient(circle at 50% 50%, rgba(142,45,226,0.1), transparent 70%)",
          }}
        >
          <Lottie
            animationData={Gif10ContextAware}
            loop
            autoplay
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
      </Box>

      <Box sx={{ display: "none" }}>
        <Link href="/tools">tools</Link>
      </Box>
    </Box>
  );
}
