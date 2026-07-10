"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper } from "lucide-react";
import Button from "@/components/ui/Button";

interface BookingConfirmationProps {
  open: boolean;
  customerFirstName: string;
  onClose: () => void;
}

export default function BookingConfirmation({
  open,
  customerFirstName,
  onClose,
}: BookingConfirmationProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 p-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass w-full max-w-md rounded-[2rem] p-8 text-center shadow-2xl md:p-10"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bubble mx-auto mb-6 flex h-16 w-16 items-center justify-center">
              <PartyPopper size={28} strokeWidth={1.5} className="text-foreground" />
            </div>

            <h3 className="mb-3 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Bedankt voor je reservering, {customerFirstName}!
            </h3>
            <p className="mb-8 text-sm leading-relaxed text-foreground/60">
              Wij hebben je aanvraag ontvangen en nemen zo snel mogelijk contact met je
              op om alles te bevestigen.
            </p>

            <Button onClick={onClose} variant="primary" className="w-full">
              Sluiten
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
