"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
}: ButtonProps) {
  const base =
    "btn-glow inline-flex items-center justify-center px-8 py-4 text-sm font-medium tracking-widest uppercase transition-all duration-300 rounded-full cursor-pointer";

  const variants = {
    primary:
      "bg-foreground text-white hover:bg-foreground/90 shadow-lg shadow-pink/20",
    secondary:
      "glass text-foreground hover:bg-white/70 shadow-sm",
    outline:
      "border border-foreground/20 text-foreground hover:bg-foreground/5 bg-transparent",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={classes}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
