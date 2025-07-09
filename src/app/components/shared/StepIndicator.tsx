"use client";

import React from "react";
import { Box, Typography, useTheme, keyframes } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

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
  activeStep: number;
}

const steps = [
  "Drop In Your Idea",
  "Review the Outline",
  "Customize & Share Instantly",
];

export default function StepIndicator({ activeStep }: StepIndicatorProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        mb: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: 720,
        }}
      >
        {steps.map((label, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              {/* Step block */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                {/* Outer Circle */}
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor:
                      isActive || isCompleted
                        ? "#E8E4FF"
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
                  {/* Middle Circle or Check Icon */}
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor:
                        isActive || isCompleted
                          ? "#F2F0FF"
                          : theme.palette.grey[200],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isCompleted ? (
                      <CheckIcon
                        sx={{
                          fontSize: 16,
                          color: theme.palette.primary.dark,
                        }}
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
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color:
                      isActive || isCompleted
                        ? theme.palette.primary.dark
                        : theme.palette.grey[600],
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </Typography>
              </Box>

              {/* Line */}
              {!isLast && (
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    backgroundColor:
                      isActive || isCompleted
                        ? theme.palette.primary.light
                        : theme.palette.grey[200],
                    mx: { xs: 1, sm: 2 },
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
