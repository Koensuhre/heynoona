"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { TIME_SLOTS } from "@/lib/packages";
import { staggerContainer, fadeInUp } from "@/lib/animations";

interface TimeSlotsProps {
  date: string;
  selectedSlot: string | null;
  onSelectSlot: (startTime: string) => void;
}

export default function TimeSlots({
  date,
  selectedSlot,
  onSelectSlot,
}: TimeSlotsProps) {
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlots() {
      setLoading(true);
      try {
        const res = await fetch(`/api/bookings?date=${date}`);
        const data = await res.json();
        setBookedSlots(data.bookedSlots ?? []);
      } catch {
        setBookedSlots([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSlots();
  }, [date]);

  return (
    <div className="rounded-3xl glass p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <Clock size={20} className="text-foreground/40" strokeWidth={1.5} />
        <h3 className="font-heading text-xl font-semibold text-foreground md:text-2xl">
          Kies een tijdslot
        </h3>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {TIME_SLOTS.map((slot) => (
            <div
              key={slot.start}
              className="h-16 animate-pulse rounded-2xl bg-foreground/5"
            />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 gap-3 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {TIME_SLOTS.map((slot) => {
            const isBooked = bookedSlots.includes(slot.start);
            const isSelected = selectedSlot === slot.start;

            return (
              <motion.button
                key={slot.start}
                type="button"
                variants={fadeInUp}
                disabled={isBooked}
                onClick={() => onSelectSlot(slot.start)}
                className={`relative overflow-hidden rounded-2xl px-4 py-4 text-sm font-medium transition-all duration-300 ${
                  isSelected
                    ? "bg-foreground text-white shadow-lg shadow-pink/20"
                    : isBooked
                      ? "cursor-not-allowed bg-foreground/5 text-foreground/25 line-through"
                      : "glass text-foreground hover:-translate-y-0.5 hover:bg-pink/15 hover:shadow-md hover:shadow-pink/10"
                }`}
                whileHover={!isBooked ? { scale: 1.02 } : {}}
                whileTap={!isBooked ? { scale: 0.98 } : {}}
              >
                {slot.label}
                {isBooked && (
                  <span className="absolute inset-x-0 bottom-1 text-[9px] uppercase tracking-wider text-foreground/30 no-underline">
                    Bezet
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
