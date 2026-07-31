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
  rotate: number;
}

function generateBubbles(count: number): Bubble[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,

    // GROTERE BUBBLES
    size: Math.random() * 220 + 100,

    x: Math.random() * 100,
    y: Math.random() * 100,

    delay: Math.random() * 5,
    duration: Math.random() * 8 + 10,

    // VEEL ZICHTBAARDER
    opacity: Math.random() * 0.35 + 0.55,

    rotate: Math.random() * 360,
  }));
}

interface BubbleBackgroundProps {
  count?: number;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
}

export default function BubbleBackground({
  count = 24,
  className = "",
  intensity = "heavy",
}: BubbleBackgroundProps) {
  const bubbles = useMemo(() => generateBubbles(count), [count]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // IETS STERKERE PARALLAX
  const parallaxX = useTransform(mouseX, [-500, 500], [-25, 25]);
  const parallaxY = useTransform(mouseY, [-500, 500], [-25, 25]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const opacityMap = {
    light: 0.7,
    medium: 0.9,
    heavy: 1,
  };

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          x: parallaxX,
          y: parallaxY,
        }}
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

              // @ts-expect-error custom property
              "--bubble-rotate": `${bubble.rotate}deg`,
            }}
            animate={{
              // IETS MEER BEWEGING
              y: [0, -45, 15, -30, 0],
              x: [0, 15, -8, 12, 0],
              scale: [1, 1.08, 0.96, 1.04, 1],
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