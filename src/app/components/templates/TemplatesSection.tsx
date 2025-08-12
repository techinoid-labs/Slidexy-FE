"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Box, Typography, Button } from "@mui/material";
import Template01 from "../../../../public/images/Template01.svg";
import Template02 from "../../../../public/images/Template02.svg";
import Template03 from "../../../../public/images/Template03.svg";
import Template04 from "../../../../public/images/Template04.svg";
import Template05 from "../../../../public/images/Template05.svg";
import Template06 from "../../../../public/images/Template06.svg";
import Template07 from "../../../../public/images/Template07.svg";
import Template08 from "../../../../public/images/Template08.svg";
import Template09 from "../../../../public/images/Template09.svg";
import Template10 from "../../../../public/images/Template10.svg";
import Template11 from "../../../../public/images/Template11.svg";
import Template12 from "../../../../public/images/Template12.svg";
import Stars from "../../../../public/images/Stars.svg";

export default function TemplatesSection() {
  const categories = [
    "All Templates",
    "Educational",
    "Project Proposal",
    "Brand Awareness",
    "Client Proposal",
    "Financial Analysis",
    "Business Report",
  ];

  const templates = [
    {
      id: 1,
      image: Template01,
      title: "Creative Brand Awareness Campaign Presentation Template",
      category: "Brand Awareness",
    },
    {
      id: 2,
      image: Template02,
      title: "Modern Educational Course Presentation Template",
      category: "Educational",
    },
    {
      id: 3,
      image: Template03,
      title: "Business Proposal Deck Template",
      category: "Client Proposal",
    },
    {
      id: 4,
      image: Template04,
      title: "Financial Report Template",
      category: "Financial Analysis",
    },
    {
      id: 5,
      image: Template05,
      title: "Financial Report Template",
      category: "Financial Analysis",
    },
    {
      id: 6,
      image: Template06,
      title: "Educational Seminar Template",
      category: "Educational",
    },
    {
      id: 7,
      image: Template07,
      title: "Brand Awareness Marketing Plan",
      category: "Brand Awareness",
    },
    {
      id: 8,
      image: Template08,
      title: "Business Project Proposal",
      category: "Project Proposal",
    },
    {
      id: 9,
      image: Template09,
      title: "Business Annual Report",
      category: "Business Report",
    },
    {
      id: 10,
      image: Template10,
      title: "Client Deal Closing Presentation",
      category: "Client Proposal",
    },
    {
      id: 11,
      image: Template11,
      title: "Advanced Financial Analysis",
      category: "Financial Analysis",
    },
    {
      id: 12,
      image: Template12,
      title: "Educational Workshop Template",
      category: "Educational",
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("All Templates");

  const filteredTemplates =
    selectedCategory === "All Templates"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  return (
    <>
      <Box
        component="section"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          px: { xs: 2, sm: 4 },
        }}
      >
        {/* AI Templates Badge */}
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            background: "#E8E4FF",
            px: { xs: 2, sm: "20px" },
            py: { xs: "6px", sm: "8px" },
            borderRadius: "48px",
          }}
        >
          <Box>
            <Image
              src={Stars}
              alt="TemplateHero"
              style={{ width: "20px", height: "auto", objectFit: "cover" }}
              priority
            />
          </Box>

          <Box>
            <Typography sx={{ ml: 1, fontSize: { xs: 14, sm: 16 } }}>
              AI Templates
            </Typography>
          </Box>
        </Box>

        {/* Heading */}
        <Box>
          <Typography
            sx={{
              fontSize: { xs: "28px", sm: "36px", md: "40px" },
              fontWeight: 500,
              lineHeight: { xs: "36px", sm: "40px", md: "40px" },
              textAlign: "center",
            }}
          >
            Ready-to-Use Templates
          </Typography>
        </Box>
      </Box>

      <Box
        component="section"
        sx={{ px: { xs: 2, sm: 4, md: 6 }, mb: 12, marginTop: "36px" }}
      >
        {/* Categories */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1.5, sm: 2 }, // Slightly smaller gap on mobile
            flexDirection: { sm: "column", xs: "column", lg: "row" },
            flexWrap: "nowrap", // Keep buttons in a single row
            overflowX: "auto", // Allow horizontal scroll on small screens
            pb: 1,
            mb: 4,
          }}
        >
          {categories.map((label) => (
            <Button
              key={label}
              onClick={() => setSelectedCategory(label)}
              variant={selectedCategory === label ? "contained" : "outlined"}
              sx={{
                textTransform: "none",
                whiteSpace: "nowrap",
                backgroundColor:
                  selectedCategory === label ? "black" : "transparent",
                color: selectedCategory === label ? "#fff" : "#000",
                borderColor: "#ccc",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === label ? "black" : "rgba(0,0,0,0.05)",
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {/* Templates Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // Mobile: 1 column
              sm: "repeat(2, 1fr)", // Tablet: 2 columns
              lg: "repeat(2, 1fr)", // Desktop: 3 columns
            },
            gap: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {filteredTemplates.map((template) => (
            <Box
              key={template.id}
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #F6F6F6",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {/* Image Container */}
              <Box
                className="image-container"
                sx={{
                  position: "relative",
                  height: { xs: "220px", sm: "280px", md: "340px" },
                  overflow: "hidden",
                  "&:hover .hover-buttons": {
                    opacity: 1,
                    pointerEvents: "auto",
                  },
                }}
              >
                <Image
                  src={template.image}
                  alt={template.title}
                  fill
                  style={{ objectFit: "cover" }}
                />

                {/* Hover Buttons */}
                <Box
                  className="hover-buttons"
                  sx={{
                    position: "absolute",
                    bottom: 60,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    gap: 1.5,
                    py: 1.5,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    pointerEvents: "none",
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#ccc",
                      color: "#000",
                      px: 3,
                      fontWeight: 500,
                      textTransform: "none",
                      background: "white",
                      width: { sm: "150px" },
                    }}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#4A00E0",
                      textTransform: "none",
                      px: 3,
                      "&:hover": { backgroundColor: "#4A00E0" },
                      width: { sm: "150px" },
                    }}
                  >
                    Customize
                  </Button>
                </Box>
              </Box>

              {/* Title */}
              <Typography
                sx={{
                  fontSize: { xs: "16px", sm: "18px" },
                  fontWeight: 600,
                  px: 2,
                  mt: 2,
                }}
              >
                {template.title}
              </Typography>

              {/* Category */}
              <Typography
                sx={{
                  fontSize: { xs: "14px", sm: "15px" },
                  fontWeight: 500,
                  px: 2,
                  pb: 2,
                  color: "text.secondary",
                }}
              >
                {template.category}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
