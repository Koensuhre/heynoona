"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const reviews = [
  {
    text: "Het hoogtepunt van onze bruiloft.",
    author: "Sophie & Mark",
    event: "Bruiloft",
  },
  {
    text: "Onze gasten stonden de hele avond in de rij.",
    author: "Lisa",
    event: "Verjaardag",
  },
  {
    text: "Super stijlvol en geweldige kwaliteit.",
    author: "Noah",
    event: "Bedrijfsevent",
  },
];

function Stars() {
  return (
    <div className="mb-6 flex gap-1 text-lg tracking-wider text-foreground">
      {"★★★★★".split("").map((star, i) => (
        <span key={i}>{star}</span>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section
      id="reviews"
      className="relative overflow-hidden bg-background-pink/30 py-28 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.h2
          className="mb-16 font-heading text-4xl font-bold text-foreground md:mb-20 md:text-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          Wat zeggen ze?
        </motion.h2>

        <motion.div
          className="grid gap-6 md:grid-cols-3 md:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-[2rem] glass p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink/10 md:p-12"
              whileHover={{ scale: 1.01 }}
            >
              <Stars />
              <blockquote className="font-heading mb-8 text-2xl font-medium leading-snug text-foreground md:text-3xl">
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-foreground/10" />
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {review.author}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-foreground/40">
                    {review.event}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
