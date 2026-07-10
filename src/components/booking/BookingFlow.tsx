"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import DatePicker from "./DatePicker";
import TimeSlots from "./TimeSlots";
import EventTypeSelect from "./EventTypeSelect";
import PackageSelect from "./PackageSelect";
import ContactForm from "./ContactForm";
import BookingSummary from "./BookingSummary";
import BookingConfirmation from "./BookingConfirmation";
import Button from "@/components/ui/Button";
import { fadeInUp } from "@/lib/animations";
import { validateContactDetails, hasErrors } from "@/lib/validation";
import { TIME_SLOTS, type PackageId } from "@/lib/packages";
import {
  EMPTY_CONTACT_DETAILS,
  type BookingDraft,
  type ContactFieldErrors,
} from "@/types/booking";

const STEPS = [
  "Datum",
  "Tijd",
  "Evenement",
  "Pakket",
  "Gegevens",
  "Bevestigen",
] as const;

function Section({
  children,
  stepIndex,
}: {
  children: React.ReactNode;
  stepIndex: number;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="scroll-mt-32"
      id={`stap-${stepIndex + 1}`}
    >
      {children}
    </motion.div>
  );
}

export default function BookingFlow() {
  const [date, setDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [eventType, setEventType] = useState<string | null>(null);
  const [pkg, setPkg] = useState<PackageId | null>(null);
  const [contact, setContact] = useState(EMPTY_CONTACT_DETAILS);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const activeStepIndex = useMemo(() => {
    if (!date) return 0;
    if (!startTime) return 1;
    if (!eventType) return 2;
    if (!pkg) return 3;
    return 4;
  }, [date, startTime, eventType, pkg]);

  function handleSelectDate(newDate: string) {
    setDate(newDate);
    // Vorige selecties die niet meer geldig zijn resetten
    setStartTime(null);
    setSubmitError(null);
  }

  function updateContact(patch: Partial<typeof contact>) {
    setContact((prev) => ({ ...prev, ...patch }));
  }

  const draft: BookingDraft = { date, startTime, eventType, package: pkg, contact };

  const readyForContact = Boolean(date && startTime && eventType && pkg);

  async function handleSubmit() {
    const fieldErrors = validateContactDetails(contact);
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) {
      document
        .getElementById("stap-5")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const slot = TIME_SLOTS.find((s) => s.start === startTime);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          startTime,
          endTime: slot?.end,
          package: pkg,
          eventType,
          firstName: contact.firstName.trim(),
          lastName: contact.lastName.trim(),
          company: contact.company.trim() || undefined,
          phone: contact.phone.trim(),
          email: contact.email.trim(),
          address: contact.address.trim() || undefined,
          postalCode: contact.postalCode.trim() || undefined,
          city: contact.city.trim() || undefined,
          message: contact.message.trim() || undefined,
          termsAccepted: contact.termsAccepted,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? "Er ging iets mis. Probeer het opnieuw.");
        if (res.status === 409) {
          // Slot bleek toch al bezet — forceer opnieuw kiezen
          setStartTime(null);
        }
        return;
      }

      setConfirmed(true);
    } catch {
      setSubmitError("Er ging iets mis met de verbinding. Probeer het opnieuw.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCloseConfirmation() {
    setConfirmed(false);
    setDate(null);
    setStartTime(null);
    setEventType(null);
    setPkg(null);
    setContact(EMPTY_CONTACT_DETAILS);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Voortgangsindicator */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-medium transition-colors duration-300 ${
                i <= activeStepIndex
                  ? "bg-foreground text-white"
                  : "bg-foreground/10 text-foreground/40"
              }`}
            >
              {i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-4 transition-colors duration-300 sm:w-8 ${
                  i < activeStepIndex ? "bg-foreground" : "bg-foreground/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <Section stepIndex={0}>
          <DatePicker selectedDate={date} onSelectDate={handleSelectDate} />
        </Section>

        <AnimatePresence>
          {date && (
            <Section stepIndex={1}>
              <TimeSlots
                date={date}
                selectedSlot={startTime}
                onSelectSlot={(t) => {
                  setStartTime(t);
                  setSubmitError(null);
                }}
              />
            </Section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {date && startTime && (
            <Section stepIndex={2}>
              <EventTypeSelect selectedType={eventType} onSelectType={setEventType} />
            </Section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {date && startTime && eventType && (
            <Section stepIndex={3}>
              <PackageSelect selectedPackage={pkg} onSelectPackage={setPkg} />
            </Section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {readyForContact && (
            <Section stepIndex={4}>
              <ContactForm details={contact} errors={errors} onChange={updateContact} />
            </Section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {readyForContact && (
            <Section stepIndex={5}>
              <BookingSummary draft={draft} />

              {submitError && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  className={submitting ? "pointer-events-none opacity-60" : ""}
                >
                  {submitting ? "Versturen..." : "Boeking verzenden"}
                </Button>
              </div>
            </Section>
          )}
        </AnimatePresence>
      </div>

      <BookingConfirmation
        open={confirmed}
        customerFirstName={contact.firstName}
        onClose={handleCloseConfirmation}
      />
    </div>
  );
}
