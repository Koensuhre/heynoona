"use client";

import { motion } from "framer-motion";
import { Clock, PartyPopper, Palette, Printer, Sparkles } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const extras = [
  {
    title: "Extra uur",
    description: "Meer tijd, meer memories.",
    icon: Clock,
    color: "from-pink/20 to-transparent",
  },
  {
    title: "Props",
    description: "Leuke accessoires voor extra fun.",
    icon: PartyPopper,
    color: "from-blue/20 to-transparent",
  },
  {
    title: "Gepersonaliseerde layout",
    description: "Jouw event, jouw stijl.",
    icon: Palette,
    color: "from-green/20 to-transparent",
  },
  {
    title: "Extra prints",
    description: "Meer fysieke herinneringen.",
    icon: Printer,
    color: "from-pink/15 to-blue/10",
  },
  {
    title: "Luxe backdrop",
    description: "Premium achtergrond voor de perfecte shot.",
    icon: Sparkles,
    color: "from-blue/15 to-green/10",
  },
];

export default function Extras() {
  return (
    <section className="relative overflow-hidden bg-white/50 py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          className="mb-16 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-foreground/50">
            Uitbreidingen
          </p>
          <h2 className="font-heading text-4xl font-bold text-foreground md:text-6xl">
            Maak het extra speciaal
          </h2>
        </motion.div>

        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {extras.map((extra) => {
            const Icon = extra.icon;
            return (
              <motion.div
                key={extra.title}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-3xl glass p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink/5"
                whileHover={{ scale: 1.01 }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${extra.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="relative z-10">
                  <Icon
                    size={24}
                    className="mb-5 text-foreground/40 transition-colors group-hover:text-foreground"
                    strokeWidth={1.5}
                  />
                  <h3 className="mb-2 text-lg font-medium text-foreground">
                    {extra.title}
                  </h3>
                  <p className="text-sm text-foreground/55">
                    {extra.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
