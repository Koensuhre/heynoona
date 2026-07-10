"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Button from "./ui/Button";
import BubbleBackground from "./BubbleBackground";
import FloatingGradient from "./FloatingGradient";

const packages = [
  {
    name: "Roze",
    emoji: "🌸",
    price: "€185",
    vat: "excl. BTW",
    color: "bg-pink/25",
    borderColor: "border-pink/30",
    glowColor: "hover:shadow-pink/20",
    features: [
      "2 uur photobooth",
      "Onbeperkt digitale foto's",
      "Achtergrond layout",
      "Foto's digitaal toegestuurd",
    ],
    cta: "Boek Roze",
    popular: false,
    offset: "md:mt-0",
  },
  {
    name: "Blauw",
    emoji: "💙",
    price: "€250",
    vat: "excl. BTW",
    color: "bg-blue/25",
    borderColor: "border-blue/30",
    glowColor: "hover:shadow-blue/20",
    features: [
      "2 uur photobooth",
      "Onbeperkt digitale foto's",
      "200 prints",
      "Achtergrond layout",
      "Foto's digitaal toegestuurd",
    ],
    cta: "Boek Blauw",
    popular: true,
    offset: "md:-mt-8",
  },
  {
    name: "Groen",
    emoji: "💚",
    price: "€325",
      vat: "excl. BTW",
    color: "bg-green/25",
    borderColor: "border-green/30",
    glowColor: "hover:shadow-green/20",
    features: [
      "2 uur photobooth",
      "Onbeperkt digitale foto's",
      "Onbeperkt prints (fair use)",
      "Achtergrond layout",
      "Foto's digitaal toegestuurd",
    ],
    cta: "Boek Groen",
    popular: false,
    offset: "md:mt-8",
  },
];

export default function Packages() {
  return (
    <section
      id="pakketten"
      className="relative overflow-hidden py-28 md:py-40"
    >
      <FloatingGradient color="pink" position="top-20 -left-40" size="lg" />
      <FloatingGradient color="blue" position="bottom-20 -right-40" size="lg" />
      <BubbleBackground count={10} intensity="light" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          className="mb-16 text-center md:mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-foreground/50">
            Prijslijst
          </p>
          <h2 className="font-heading text-4xl font-bold text-foreground md:text-6xl lg:text-7xl">
            Kies jouw kleur
          </h2>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-3 md:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.name}
              variants={fadeInUp}
              className={`group relative ${pkg.offset}`}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-5 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white">
                  Meest gekozen
                </div>
              )}

              <div
                className={`relative overflow-hidden rounded-[2rem] border ${pkg.borderColor} ${pkg.color} p-8 backdrop-blur-sm transition-all duration-500 ${pkg.glowColor} hover:shadow-2xl md:p-10`}
              >
                {/* Organic blob background */}
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl transition-transform duration-700 group-hover:scale-150" />

                <div className="relative z-10">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="text-3xl">{pkg.emoji}</span>
                    <h3 className="font-heading text-3xl font-bold uppercase tracking-wide text-foreground">
                      {pkg.name}
                    </h3>
                  </div>

                  <div className="mb-8 flex items-end justify-center gap-2">
  <span className="font-heading text-5xl font-bold text-foreground md:text-6xl">
    {pkg.price}
  </span>
  <span className="mb-1 text-xs text-foreground/60">
    excl. BTW
  </span>
</div>

                  <ul className="mb-10 space-y-3">
                    {pkg.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-foreground/70"
                      >
                        <Check
                          size={16}
                          className="mt-0.5 shrink-0 text-foreground/40"
                          strokeWidth={2}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    href="/boeken"
                    variant={pkg.popular ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {pkg.cta}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
