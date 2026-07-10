import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingFlow from "@/components/booking/BookingFlow";
import FloatingGradient from "@/components/FloatingGradient";

export const metadata: Metadata = {
  title: "Boek jouw photobooth | HeyNoona",
  description:
    "Kies je datum, tijdslot, evenement en kleurpakket en boek direct jouw HeyNoona photobooth.",
};

export default function BoekenPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden pb-24 pt-32 md:pt-40">
        <FloatingGradient />
        <div className="relative mx-auto max-w-5xl px-6 md:px-10">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-foreground/40">
              Reserveren
            </p>
            <h1 className="font-heading text-4xl font-semibold text-foreground md:text-5xl">
              Boek jouw photobooth
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60 md:text-base">
              Kies een datum, tijdslot, evenement en kleurpakket — je boeking is in
              een paar minuten geregeld.
            </p>
          </div>

          <BookingFlow />
        </div>
      </main>
      <Footer />
    </>
  );
}
