"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const galleryItems = [
  { height: "h-72", gradient: "from-pink/40 via-pink/20 to-background-pink", label: "Bruiloft vibes" },
  { height: "h-96", gradient: "from-blue/40 via-blue/20 to-background", label: "Party mode" },
  { height: "h-64", gradient: "from-green/40 via-green/20 to-background", label: "Birthday glow" },
  { height: "h-80", gradient: "from-pink/30 via-blue/20 to-green/15", label: "Event magic" },
  { height: "h-56", gradient: "from-blue/35 via-pink/15 to-background-pink", label: "Golden hour" },
  { height: "h-[22rem]", gradient: "from-green/30 via-blue/25 to-pink/10", label: "Night out" },
  { height: "h-72", gradient: "from-pink/35 via-green/15 to-background", label: "Smile club" },
  { height: "h-64", gradient: "from-blue/30 via-green/20 to-background-pink", label: "Flash moment" },
  { height: "h-96", gradient: "from-green/35 via-pink/20 to-blue/10", label: "Forever frame" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          className="mb-16 flex flex-col items-start justify-between gap-6 md:mb-20 md:flex-row md:items-end"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-foreground/50">
              @heynoona.nl
            </p>
            <h2 className="font-heading text-4xl font-bold text-foreground md:text-6xl">
              Gallery
            </h2>
          </div>
          <p className="max-w-xs text-sm text-foreground/50">
            Instagram-waardige momenten, vastgelegd door HeyNoona.
          </p>
        </motion.div>

        <motion.div
          className="masonry-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="masonry-item group relative overflow-hidden rounded-2xl"
            >
              <div
                className={`${item.height} w-full bg-gradient-to-br ${item.gradient} transition-transform duration-700 ease-out group-hover:scale-105`}
              />
              {/* Glass overlay on hover */}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="glass-dark m-4 rounded-xl px-4 py-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-white">
                    {item.label}
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
