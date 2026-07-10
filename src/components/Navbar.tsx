"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Pakketten", href: "#pakketten" },
  { label: "Hoe het werkt", href: "#hoe-het-werkt" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass py-3 shadow-sm shadow-pink/5"
            : "bg-transparent py-5 md:py-6"
        }`}
        style={{ opacity: scrolled ? navOpacity : 1 }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10">
          <a
            href="https://heynoona.vercel.app"
            className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl"
          >
            HeyNoona
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/boeken"
              className="btn-glow rounded-full bg-foreground px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-white transition-all hover:shadow-lg hover:shadow-pink/25"
            >
              Boek nu
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full glass md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Menu sluiten" : "Menu openen"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <motion.div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 glass md:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        initial={false}
        animate={{
          opacity: mobileOpen ? 1 : 0,
          y: mobileOpen ? 0 : -20,
        }}
        transition={{ duration: 0.3 }}
        style={{ visibility: mobileOpen ? "visible" : "hidden" }}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-lg font-medium uppercase tracking-[0.2em] text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a
          href="/boeken"
          className="btn-glow rounded-full bg-foreground px-8 py-3 text-sm font-medium uppercase tracking-[0.15em] text-white"
          onClick={() => setMobileOpen(false)}
        >
          Boek nu
        </a>
      </motion.div>
    </>
  );
}
