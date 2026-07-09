"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";

interface Bubble {
  id: number;
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  opacity: number;
}

function generateBubbles(count: number): Bubble[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 120 + 30,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 10,
    opacity: Math.random() * 0.5 + 0.15,
  }));
}

interface BubbleBackgroundProps {
  count?: number;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
}

export default function BubbleBackground({
  count = 18,
  className = "",
  intensity = "medium",
}: BubbleBackgroundProps) {
  const bubbles = useMemo(() => generateBubbles(count), [count]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const parallaxX = useTransform(mouseX, [-500, 500], [-15, 15]);
  const parallaxY = useTransform(mouseY, [-500, 500], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const opacityMap = {
    light: 0.6,
    medium: 1,
    heavy: 1.2,
  };

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0"
        style={{ x: parallaxX, y: parallaxY }}
      >
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="bubble absolute"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              opacity: bubble.opacity * opacityMap[intensity],
            }}
            animate={{
              y: [0, -30, 10, -20, 0],
              x: [0, 10, -5, 8, 0],
              scale: [1, 1.05, 0.98, 1.02, 1],
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
