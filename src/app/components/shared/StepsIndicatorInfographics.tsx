"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography, useTheme, keyframes, Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useSlides } from "@/app/context/SlidesContext";
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.6; }
  100% { transform: scale(1); opacity: 1; }
`;

const growLine = keyframes`
  0% { transform: scaleX(0); opacity: 0; }
  100% { transform: scaleX(1); opacity: 1; }
`;

interface StepIndicatorProps {
  activeStep: number; // 0-indexed
}

const steps = [
  "Drop In Your Idea",
  "Review the Infographics",
];

const stepRoutes = ["/presentation/create", "/presentation/outline", "/editor"];

export default function StepIndicator({ activeStep }: StepIndicatorProps) {
  const theme = useTheme();
  const { slides } = useSlides();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        mb: 4,
        width: "100%",
        overflowX: "auto",
        backgroundColor: "#FFFF",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minWidth: 500,
          width: "fit-content",
          px: 8,
          whiteSpace: "nowrap",
          minHeight: 100,
        }}
      >
        {steps.map((label, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isNextAllowed = index === activeStep + 1 && slides.length > 0;
          const isClickable = isCompleted || isNextAllowed;
          const isLast = index === steps.length - 1;

          const StepContent = (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                cursor: isClickable ? "pointer" : "default",
                "&:hover .step-label": {
                  textDecoration: isClickable ? "underline" : "none",
                },
                flexShrink: 0,
                pr: 1,
              }}
            >
              {/* Circle */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor:
                    isActive || isCompleted || isNextAllowed
                      ? isNextAllowed
                        ? "#E8F0FF"
                        : "#E8E4FF"
                      : theme.palette.grey[200],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 1,
                  animation: isActive
                    ? `${pulse} 1.5s ease-in-out infinite`
                    : "none",
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor:
                      isActive || isCompleted || isNextAllowed
                        ? "#F2F8FF"
                        : theme.palette.grey[200],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isCompleted ? (
                    <CheckIcon
                      sx={{ fontSize: 16, color: theme.palette.primary.dark }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: isActive
                          ? theme.palette.primary.dark
                          : theme.palette.grey[500],
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* Label */}
              <Typography
                className="step-label"
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color:
                    isActive || isCompleted || isNextAllowed
                      ? isNextAllowed
                        ? theme.palette.primary.light
                        : theme.palette.primary.dark
                      : theme.palette.grey[600],
                  whiteSpace: "nowrap",
                  transition: "text-decoration 0.2s",
                }}
              >
                {label}
              </Typography>
            </Box>
          );

          const tooltipTitle = isClickable
            ? `Go to ${label}`
            : isActive
            ? `You are here: ${label}`
            : `Complete previous steps first`;

          return (
            <React.Fragment key={index}>
              <Tooltip title={tooltipTitle} arrow>
                {isClickable ? (
                  <Link href={stepRoutes[index]} passHref>
                    <Box sx={{ textDecoration: "none" }}>{StepContent}</Box>
                  </Link>
                ) : (
                  <Box>{StepContent}</Box>
                )}
              </Tooltip>

              {!isLast && (
                <Box
                  sx={{
                    flexShrink: 0,
                    height: 2,
                    backgroundColor:
                      isActive || isCompleted || isNextAllowed
                        ? theme.palette.primary.light
                        : theme.palette.grey[200],
                    mx: 1,
                    minWidth: 40,
                    transformOrigin: "left",
                    animation: isActive
                      ? `${growLine} 0.5s ease-in-out`
                      : "none",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
}
