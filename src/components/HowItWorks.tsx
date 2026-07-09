"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const steps = [
  {
    number: "01",
    title: "Kies jouw kleurpakket",
    description: "Roze, Blauw of Groen — elk pakket heeft z'n eigen vibe.",
  },
  {
    number: "02",
    title: "Wij bouwen de photobooth op",
    description: "Wij regelen alles. Jij hoeft alleen te genieten.",
  },
  {
    number: "03",
    title: "Geniet van onbeperkt foto's maken",
    description: "Smile, pose, repeat. Herinneringen voor altijd.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="hoe-het-werkt"
      className="relative overflow-hidden bg-background-pink/50 py-28 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.h2
          className="mb-20 font-heading text-4xl font-bold text-foreground md:text-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          Hoe werkt het?
        </motion.h2>

        <motion.div
          className="grid gap-12 md:grid-cols-3 md:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={fadeInUp}
              className="group relative"
            >
              <span className="font-heading text-[clamp(5rem,15vw,10rem)] font-bold leading-none text-foreground/[0.06] transition-colors duration-500 group-hover:text-pink/20">
                {step.number}
              </span>
              <div className="-mt-8 md:-mt-12">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="h-px flex-1 bg-foreground/10" />
                </div>
                <h3 className="mb-3 text-xl font-medium text-foreground md:text-2xl">
                  {step.title}
                </h3>
                <p className="text-foreground/55 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
