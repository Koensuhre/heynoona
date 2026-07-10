"use client";

import { motion } from "framer-motion";
import BubbleBackground from "./BubbleBackground";
import FloatingGradient from "./FloatingGradient";
import Button from "./ui/Button";
import { fadeInUp } from "@/lib/animations";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink/30 via-background-pink to-background" />
      <FloatingGradient color="pink" position="-top-32 -left-32" size="lg" />
      <FloatingGradient color="blue" position="top-1/3 -right-48" size="md" />
      <FloatingGradient color="green" position="-bottom-32 left-1/4" size="md" />
      <BubbleBackground count={22} intensity="heavy" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
        <motion.p
          className="mb-6 text-[10px] font-medium uppercase tracking-[0.35em] text-foreground/60 md:text-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Exclusieve photobooth voor elk event
        </motion.p>

        <motion.h1
          className="font-heading text-[clamp(3.5rem,12vw,9rem)] font-bold leading-[0.85] tracking-[-0.02em] text-foreground"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
  src="/heynoona-logo.svg"
  alt="HeyNoona"
  className="w-64 md:w-[32rem] h-auto"
/>
        </motion.h1>

        <motion.div
          className="mx-auto my-6 h-px w-16 bg-foreground/30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        />

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9 }}
        >
          <p className="mb-2 text-base text-foreground/70 md:text-lg">
            🫧 Uitgesproken als &ldquo;noo-na&rdquo;
          </p>
          <p className="mx-auto max-w-md text-lg font-light text-foreground/80 md:text-xl">
            Een exclusieve photobooth, boek nu jóuw kleur.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
        >
          <Button href="/boeken" variant="primary">
            Boek jouw kleur
          </Button>
          <Button href="#pakketten" variant="secondary">
            Bekijk pakketten
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="h-10 w-6 rounded-full border border-foreground/20 p-1">
          <motion.div
            className="mx-auto h-2 w-1 rounded-full bg-foreground/40"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
