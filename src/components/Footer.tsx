import { Mail } from "lucide-react";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-foreground/5 bg-white/60 py-16 backdrop-blur-sm md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 md:flex-row md:px-10">
        <div className="text-center md:text-left">
          <p className="font-heading text-3xl font-bold text-foreground">
            HeyNoona
          </p>
          <p className="mt-2 text-sm text-foreground/40">
            Exclusieve photobooth voor elk event
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 md:items-end">
          <a
            href="https://instagram.com/heynoona.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
          >
            <InstagramIcon size={16} />
            @heynoona.nl
          </a>
          <a
            href="mailto:hey.noona@outlook.com"
            className="group flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
          >
            <Mail size={16} strokeWidth={1.5} />
            hey.noona@outlook.com
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-6 md:px-10">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-foreground/5 pt-8 md:flex-row">
          <p className="text-xs text-foreground/30">
            © {new Date().getFullYear()} HeyNoona.nl — Alle rechten voorbehouden
          </p>
          <p className="text-xs text-foreground/30">
            Photobooth huren · Bruiloft · Verjaardag · Nederland
          </p>
        </div>
      </div>
    </footer>
  );
}
