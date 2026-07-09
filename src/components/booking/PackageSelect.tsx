"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PACKAGES, type PackageId } from "@/lib/packages";
import { staggerContainer, fadeInUp } from "@/lib/animations";

interface PackageSelectProps {
  selectedPackage: PackageId | null;
  onSelectPackage: (id: PackageId) => void;
}

export default function PackageSelect({
  selectedPackage,
  onSelectPackage,
}: PackageSelectProps) {
  return (
    <div>
      <h3 className="mb-6 font-heading text-xl font-semibold text-foreground md:text-2xl">
        Kies jouw kleurpakket
      </h3>

      <motion.div
        className="grid gap-4 md:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {PACKAGES.map((pkg) => {
          const isSelected = selectedPackage === pkg.id;

          return (
            <motion.button
              key={pkg.id}
              type="button"
              variants={fadeInUp}
              onClick={() => onSelectPackage(pkg.id)}
              className={`group relative overflow-hidden rounded-[1.5rem] border p-6 text-left transition-all duration-400 ${
                isSelected
                  ? `${pkg.borderColor} ${pkg.color} ring-2 ring-foreground/20 shadow-xl ${pkg.glowColor}`
                  : "border-foreground/10 glass hover:-translate-y-1 hover:shadow-lg"
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {pkg.popular && (
                <span className="absolute -top-0 right-4 rounded-b-lg bg-foreground px-3 py-1 text-[9px] font-medium uppercase tracking-wider text-white">
                  Populair
                </span>
              )}

              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl">{pkg.emoji}</span>
                <span className="font-heading text-2xl font-bold uppercase">
                  {pkg.name}
                </span>
                {isSelected && (
                  <Check size={18} className="ml-auto text-foreground" />
                )}
              </div>

              <p className="font-heading mb-4 text-3xl font-bold">
                {pkg.priceLabel}
              </p>

              <ul className="space-y-1.5">
                {pkg.features.slice(0, 3).map((f) => (
                  <li
                    key={f}
                    className="text-xs text-foreground/60"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
