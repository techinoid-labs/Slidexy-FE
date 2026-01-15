"use client";

import { ArrowForward } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import TemplateHero from "../../../../public/images/templatesHero.svg";
import { useRouter } from "next/navigation";

export default function Hero() {
  
  const router = useRouter();
   const queryParams = new URLSearchParams();
   queryParams.set("name", "Template");
  
  
  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        margin: "0 auto",
        marginBottom: "120px",
        gap: { xs: 4, md: 5 },
      }}
    >
      {/* Text Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: { xs: "100%", md: "600px" },
          padding: "50px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "24px", sm: "32px", md: "48px" },
            lineHeight: 1.2,
            textAlign: { xs: "center", md: "left" },
            width: { sm: "640px" },
            marginTop: { sm: "137px"},
          }}
        >
          Present Like a Pro with Ready-to-Use Templates
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            fontWeight: 400,
            fontSize: { xs: "0.95rem", sm: "1rem", md: "18px" },
            lineHeight: { xs: "22px", md: "28px" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Turn any thought into a polished, on-brand presentation — powered by
          AI, styled by designers.
        </Typography>

        <Box
          sx={{
            mt: { xs: 2, md: 3 },
            display: "flex",
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Button
            onClick={()=>router.push(`/tools/prompt-to-template`)}
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              px: { xs: 3, md: 4 },
              py: { xs: 1.2, md: 1.5 },
              fontSize: { xs: "14px", md: "16px" },
              background: "#4A00E0",
              color: "#fff",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": {
                background: "#4A00E0",
              },
            }}
          >
            Get Started for Free
          </Button>
        </Box>
      </Box>

      {/* Image Section */}
      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "100%" },
        }}
      >
        <Image
          src={TemplateHero}
          alt="TemplateHero"
          className="sm:w-full w-auto object-cover"
          priority
        />
      </Box>
    </Box>
  );
}
