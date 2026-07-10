"use client";

import { motion } from "framer-motion";
import { EVENT_TYPES, getEventTypeIcon } from "@/lib/eventTypes";
import { staggerContainer, fadeInUp } from "@/lib/animations";

interface EventTypeSelectProps {
  selectedType: string | null;
  onSelectType: (type: string) => void;
}

export default function EventTypeSelect({
  selectedType,
  onSelectType,
}: EventTypeSelectProps) {
  return (
    <div>
      <h3 className="mb-6 font-heading text-xl font-semibold text-foreground md:text-2xl">
        Wat voor evenement is het?
      </h3>

      <motion.div
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {EVENT_TYPES.map((type) => {
          const Icon = getEventTypeIcon(type);
          const isSelected = selectedType === type;

          return (
            <motion.button
              key={type}
              type="button"
              variants={fadeInUp}
              onClick={() => onSelectType(type)}
              className={`flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all duration-300 ${
                isSelected
                  ? "border-pink/40 bg-pink/20 shadow-lg shadow-pink/10 ring-2 ring-foreground/10"
                  : "glass border-foreground/10 hover:-translate-y-0.5 hover:bg-pink/10 hover:shadow-md"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon
                size={26}
                strokeWidth={1.5}
                className={isSelected ? "text-foreground" : "text-foreground/50"}
              />
              <span className="text-xs font-medium text-foreground">{type}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
