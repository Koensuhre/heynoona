"use client";

import { motion } from "framer-motion";
import BubbleBackground from "./BubbleBackground";
import FloatingGradient from "./FloatingGradient";
import Button from "./ui/Button";
import { fadeInUp } from "@/lib/animations";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <div className="absolute inset-0 bg-gradient-to-r from-pink/20 via-blue/15 to-green/20" />
      <FloatingGradient color="mixed" position="top-0 left-1/4" size="lg" />
      <BubbleBackground count={12} intensity="medium" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="font-heading mb-6 text-4xl font-bold text-foreground md:text-6xl lg:text-7xl">
            Ready to make
            <br />
            <span className="text-foreground/40">memories?</span>
          </h2>
          <p className="mb-12 text-lg text-foreground/60 md:text-xl">
            Boek vandaag nog jouw kleur.
          </p>
          <Button href="/boeken" variant="primary">
            Boek nu
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
