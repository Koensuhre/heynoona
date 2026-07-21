"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Image from "next/image";

type GalleryItem = {
  height: string;
  image: string;
  label: string;
};

const galleryItems: GalleryItem[] = [
  { height: "h-72", image: "/gallery/1.jpg", label: "Bruiloft vibes" },
  { height: "h-72", image: "/gallery/2.jpg", label: "Vibes" },
  { height: "h-96", image: "/gallery/3.jpg", label: "Party mode" },
  { height: "h-64", image: "/gallery/4.jpg", label: "Birthday glow" },
  { height: "h-80", image: "/gallery/5.jpg", label: "Event magic" },
  { height: "h-56", image: "/gallery/6.jpg", label: "Golden hour" },
  { height: "h-[22rem]", image: "/gallery/7.jpg", label: "Night out" },
  { height: "h-72", image: "/gallery/8.jpg", label: "Smile club" },
  { height: "h-64", image: "/gallery/9.jpg", label: "Flash moment" },
  { height: "h-96", image: "/gallery/10.jpg", label: "Forever frame" },
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
              <div className={`relative ${item.height} w-full overflow-hidden`}>
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

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