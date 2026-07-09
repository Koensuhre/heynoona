import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyHeyNoona from "@/components/WhyHeyNoona";
import HowItWorks from "@/components/HowItWorks";
import Packages from "@/components/Packages";
import Extras from "@/components/Extras";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyHeyNoona />
        <HowItWorks />
        <Packages />
        <Extras />
        <Gallery />
        <Reviews />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
