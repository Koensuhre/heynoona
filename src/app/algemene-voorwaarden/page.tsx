import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Algemene voorwaarden | HeyNoona",
};

export default function AlgemeneVoorwaardenPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-32 md:pt-40">
        <h1 className="mb-6 font-heading text-3xl font-semibold text-foreground md:text-4xl">
          Algemene voorwaarden
        </h1>
        <p className="leading-relaxed text-foreground/60">
          Deze pagina is een placeholder. Vervang deze tekst door de definitieve
          algemene voorwaarden van HeyNoona (annuleringsbeleid, aansprakelijkheid,
          betalingsvoorwaarden, etc.) voordat de boekingsmodule live gaat.
        </p>
      </main>
      <Footer />
    </>
  );
}
