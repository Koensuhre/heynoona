"use client";

import { motion } from "framer-motion";

interface FloatingGradientProps {
  color?: "pink" | "blue" | "green" | "mixed";
  className?: string;
  size?: "sm" | "md" | "lg";
  position?: string;
}

const colorMap = {
  pink: "from-pink/40 via-pink/20 to-transparent",
  blue: "from-blue/40 via-blue/20 to-transparent",
  green: "from-green/40 via-green/20 to-transparent",
  mixed:
    "from-pink/30 via-blue/25 via-green/20 to-transparent",
};

const sizeMap = {
  sm: "w-64 h-64",
  md: "w-96 h-96",
  lg: "w-[600px] h-[600px]",
};

export default function FloatingGradient({
  color = "mixed",
  className = "",
  size = "lg",
  position = "top-0 left-0",
}: FloatingGradientProps) {
  return (
    <motion.div
      className={`pointer-events-none absolute ${position} ${sizeMap[size]} rounded-full bg-gradient-radial blur-3xl ${className}`}
      style={{
        background: `radial-gradient(circle, ${
          color === "pink"
            ? "rgba(255,182,217,0.35)"
            : color === "blue"
              ? "rgba(168,243,255,0.35)"
              : color === "green"
                ? "rgba(200,255,176,0.35)"
                : "rgba(255,182,217,0.25)"
        } 0%, transparent 70%)`,
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.5, 0.8, 0.5],
        x: [0, 20, -10, 0],
        y: [0, -15, 10, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    />
  );
}
