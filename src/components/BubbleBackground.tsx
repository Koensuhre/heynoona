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
  blur: number;
}

function generateBubbles(count: number): Bubble[] {
  return Array.from({ length: count }, (_, i) => {
    // Meer kleine bubbles, minder enorme bubbles
    const sizeRoll = Math.random();

    let size: number;

    if (sizeRoll < 0.45) {
      // Kleine bubbles: 35–90px
      size = Math.random() * 55 + 35;
    } else if (sizeRoll < 0.78) {
      // Middelgrote bubbles: 90–170px
      size = Math.random() * 80 + 90;
    } else if (sizeRoll < 0.95) {
      // Grote bubbles: 170–280px
      size = Math.random() * 110 + 170;
    } else {
      // Enkele enorme bubbles: 280–430px
      size = Math.random() * 150 + 280;
    }

    return {
      id: i,

      size,

      // Iets meer spreiding, maar niet te veel buiten beeld
      x: Math.random() * 100,
      y: Math.random() * 100,

      delay: Math.random() * 8,

      // Verschillende snelheden voor natuurlijker beweging
      duration: Math.random() * 12 + 12,

      // Kleine bubbles zijn iets subtieler
      opacity:
        size < 90
          ? Math.random() * 0.25 + 0.45
          : Math.random() * 0.3 + 0.5,

      rotate: Math.random() * 360,

      // Sommige bubbles zijn iets zachter op de achtergrond
      blur: size < 170 ? Math.random() * 0.8 : 0,
    };
  });
}

interface BubbleBackgroundProps {
  count?: number;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
}

export default function BubbleBackground({
  count = 1,
  className = "",
  intensity = "heavy",
}: BubbleBackgroundProps) {
  const bubbles = useMemo(() => generateBubbles(count), [count]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const parallaxX = useTransform(mouseX, [-500, 500], [-20, 20]);
  const parallaxY = useTransform(mouseY, [-500, 500], [-20, 20]);

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
    light: 0.65,
    medium: 0.85,
    heavy: 8,
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
              filter: bubble.blur
                ? `blur(${bubble.blur}px)`
                : undefined,

              // @ts-expect-error custom property
              "--bubble-rotate": `${bubble.rotate}deg`,
            }}
            animate={{
              y: [0, -35, 15, -25, 0],
              x: [0, 12, -8, 10, 0],
              scale: [1, 1.025, 0.985, 1.015, 1],
              rotate: [
                0,
                bubble.rotate * 0.015,
                bubble.rotate * -0.01,
                bubble.rotate * 0.01,
                0,
              ],
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