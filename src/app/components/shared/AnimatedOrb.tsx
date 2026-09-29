"use client";

import { Box } from "@mui/material";
import { motion } from "framer-motion";

type AnimatedOrbProps = {
  size?: number | { xs?: number; md?: number };
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  color?: string;
  blur?: number;
  duration?: number;
  delay?: number;
};

export default function AnimatedOrb({
  size = 320,
  top,
  left,
  right,
  bottom,
  color = "rgba(142, 45, 226, 0.28)",
  blur = 60,
  duration = 8,
  delay = 0,
}: AnimatedOrbProps) {
  return (
    <Box
      component={motion.div}
      animate={{
        y: [0, -24, 0],
        x: [0, 16, 0],
        scale: [1, 1.08, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      sx={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
