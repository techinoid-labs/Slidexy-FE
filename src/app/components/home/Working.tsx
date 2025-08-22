"use client";

import { Box, Typography, Chip, Button } from "@mui/material";
import Link from "next/link";

export default function WorkingSection() {  
  
  return (
    <Box
      sx={{
        width: "100%",
        background: "#fff",
        px: { xs: 2, md: "162px" },
        py: { xs: 6, md: "80px" },
        display: "flex",
        flexDirection: "column",
        gap: "48px",
        boxSizing: "border-box",
        mx: "auto",
      }}
    >
      {/* Badge */}
      <Box sx={{ mb: 2, textAlign: { xs: "center", md: "left" } }}>
        <Chip
          icon={
            <img
              src="/images/Stars.svg"
              alt="Icon"
              width={18}
              height={18}
              style={{ marginRight: 4 }}
            />
          }
          label={
            <span
              style={{ fontWeight: 500, fontSize: "14px", color: "#4A00E0" }}
            >
              How it Works?
            </span>
          }
          sx={{
            background: "#F3F0FF",
            color: "#4A00E0",
            px: 2,
            py: 0.4,
            fontWeight: 500,
            fontSize: "0.95rem",
            borderRadius: "999px",
            width: "fit-content",
            mx: { xs: "auto", md: 0 },
            "& .MuiChip-icon": {
              marginRight: "6px",
            },
          }}
        />
      </Box>

      {/* Try for Free Button - Desktop View (above heading) */}
      <Box
        sx={{
          textAlign: "right",
          mb: { xs: 0, md: 10 },
          display: { xs: "none", md: "block" }, // Show only in md and above
        }}
      >
        <Button
          variant="contained"
          sx={{
            background: "#6C2BD7",
            color: "#fff",
            borderRadius: "999px",
            px: 4,
            py: 1.5,
            fontWeight: 600,
            fontSize: "1.1rem",
            textTransform: "none",
            boxShadow: "0 2px 8px 0 rgba(80, 80, 120, 0.07)",
            "&:hover": {
              background: "#8E2DE2",
            },
          }}
          endIcon={<span style={{ fontSize: 22, marginLeft: 4 }}>→</span>}
        >
          Try for Free
        </Button>
      </Box>

      {/* Heading */}
      <Box
        sx={{
          textAlign: { xs: "center", md: "left" },
          mt: { xs: -5, md: -24 },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 500,
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: "#18181B",
            mb: { xs: 2, md: 0 }, // Add margin below heading in mobile view for button
          }}
        >
          From Idea to
          <br />
          Stunning Deck
        </Typography>
      </Box>

      {/* Try for Free Button - Mobile View (below heading) */}
      < Box
        sx={{
          textAlign: "center",
          mb: 2,
          mt: { xs: -5 },
          display: { xs: "block", md: "none" }, // Show only in xs
        }}
      >
        <Link href="/presentation/create" passHref>  
          <Button
            variant="contained"
            sx={{
              background: "#6C2BD7",
              color: "#fff",
              borderRadius: "999px",
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 1.5 },
              fontWeight: 600,
              fontSize: { xs: "0.9rem", md: "1.1rem" },
              textTransform: "none",
              boxShadow: "0 2px 8px 0 rgba(80, 80, 120, 0.07)",
              "&:hover": {
                background: "#8E2DE2",
              },
            }}
            endIcon={<span style={{ fontSize: 22, marginLeft: 4 }}>→</span>}
          >
            Try for Free
          </Button>
        </Link>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 6,
          alignItems: "center",
        }}
      >
        {/* Steps */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* Step 1 */}
          <Box
            sx={{
              background: "#F9F9FB",
              borderRadius: "28px",
              p: 3,
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 8px 0 rgba(80, 80, 120, 0.03)",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#6C2BD7",
                  mb: 1,
                }}
              >
                Drop In Your Idea
              </Typography>
              <Typography sx={{ color: "#757575", fontSize: "1.05rem" }}>
                Type a prompt, record a voice note, upload a sketch, or share a
                video. Our AI reads, hears, sees, and processes your input
                intelligently.
              </Typography>
            </Box>
            <Box
              sx={{
                ml: 2,
                width: 32,
                height: 32,
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "0 1px 4px 0 rgba(80, 80, 120, 0.07)",
              }}
            >
              <img
                src="/images/drop-icon.svg"
                alt="Tick"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </Box>

          {/* Step 2 */}
          <Box
            sx={{
              background: "#F8F8FF",
              borderRadius: "28px",
              p: 3,
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 8px 0 rgba(80, 80, 120, 0.03)",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{ fontWeight: 500, fontSize: "1.13rem", color: "#18181B" }}
              >
                AI Builds the Story & Design
              </Typography>
            </Box>
            <Box
              sx={{
                ml: 2,
                width: 32,
                height: 32,
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "0 1px 4px 0 rgba(80, 80, 120, 0.07)",
              }}
            >
              <img
                src="/images/vector-arrow.svg"
                alt="Arrow"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </Box>

          {/* Step 3 */}
          <Box
            sx={{
              background: "#F8F8FF",
              borderRadius: "28px",
              p: 3,
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 8px 0 rgba(80, 80, 120, 0.03)",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{ fontWeight: 500, fontSize: "1.13rem", color: "#18181B" }}
              >
                Customize & Share Instantly
              </Typography>
            </Box>
            <Box
              sx={{
                ml: 2,
                width: 32,
                height: 32,
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "0 1px 4px 0 rgba(80, 80, 120, 0.07)",
              }}
            >
              <img
                src="/images/vector-arrow.svg"
                alt="Arrow"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </Box>
        </Box>

        {/* Right Image */}
        <Box
          sx={{
            width: { xs: "100%", md: 500 },
            height: { xs: 250, md: 400 },
            borderRadius: "50px",
            border: "0.78px solid #E9E9FF",
            background: "#F8F8FF",
            mt: { xs: 0, md: -4 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/images/Stunning.svg"
            alt="Working Graphic"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}