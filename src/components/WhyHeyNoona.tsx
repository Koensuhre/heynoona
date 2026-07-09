"use client";

import { motion } from "framer-motion";
import { Heart, Cake, Building2, Music, Sparkles, Baby, Camera } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import FloatingGradient from "./FloatingGradient";
import BubbleBackground from "./BubbleBackground";

const events = [
  { label: "Bruiloften", icon: Heart, color: "from-pink/30 to-pink/10" },
  { label: "Babyshowers", icon: Baby, color: "from-blue/30 to-blue/10" },
  { label: "Verjaardagen", icon: Cake, color: "from-green/30 to-green/10" },
  { label: "Bedrijfsevents", icon: Building2, color: "from-pink/25 to-blue/15" },
  { label: "Festivals", icon: Music, color: "from-blue/30 to-green/15" },
  { label: "Openingen", icon: Sparkles, color: "from-green/25 to-pink/15" },
  { label: "Influencer events", icon: Camera, color: "from-pink/20 to-green/20" },
];

export default function WhyHeyNoona() {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <FloatingGradient color="mixed" position="top-0 right-0" size="lg" />
      <BubbleBackground count={8} intensity="light" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          className="mb-16 max-w-2xl md:mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <h2 className="font-heading text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
            Niet zomaar
            <br />
            <span className="text-foreground/40">een photobooth.</span>
          </h2>
          <p className="mt-6 text-lg text-foreground/60 md:text-xl">
            Maak van ieder event een ervaring.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {events.map((event, i) => {
            const Icon = event.icon;
            return (
              <motion.div
                key={event.label}
                variants={fadeInUp}
                className={`group relative overflow-hidden rounded-3xl p-6 glass transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink/10 md:p-8 ${
                  i === 0 ? "col-span-2 sm:col-span-1 lg:row-span-2 lg:flex lg:flex-col lg:justify-center" : ""
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="relative z-10">
                  <Icon
                    size={28}
                    className="mb-4 text-foreground/50 transition-colors group-hover:text-foreground"
                    strokeWidth={1.5}
                  />
                  <p className="text-sm font-medium uppercase tracking-wider text-foreground md:text-base">
                    {event.label}
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
