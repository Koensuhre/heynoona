"use client";

import { Calendar, Clock, PartyPopper, Package as PackageIcon } from "lucide-react";
import { getPackageById, formatDateNL, type PackageId } from "@/lib/packages";
import type { BookingDraft } from "@/types/booking";

interface BookingSummaryProps {
  draft: BookingDraft;
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-foreground/40" />
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-foreground/40">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function BookingSummary({ draft }: BookingSummaryProps) {
  const pkg = draft.package ? getPackageById(draft.package as PackageId) : undefined;

  return (
    <div className="rounded-3xl glass p-6 md:p-8">
      <h3 className="mb-2 font-heading text-xl font-semibold text-foreground md:text-2xl">
        Samenvatting
      </h3>
      <p className="mb-4 text-sm text-foreground/50">
        Controleer je gegevens voordat je de boeking verzendt.
      </p>

      <div className="divide-y divide-foreground/10">
        <Row
          icon={Calendar}
          label="Datum"
          value={draft.date ? formatDateNL(draft.date) : "—"}
        />
        <Row icon={Clock} label="Tijd" value={draft.startTime ?? "—"} />
        <Row icon={PartyPopper} label="Evenement" value={draft.eventType ?? "—"} />
        <Row
          icon={PackageIcon}
          label="Pakket"
          value={pkg ? `${pkg.emoji} ${pkg.name} — ${pkg.priceLabel}` : "—"}
        />
      </div>

      <div className="mt-4 rounded-2xl bg-foreground/5 p-4">
        <p className="text-[10px] font-medium uppercase tracking-wider text-foreground/40">
          Persoonsgegevens
        </p>
        <p className="mt-1 text-sm text-foreground">
          {draft.contact.firstName} {draft.contact.lastName}
          {draft.contact.company ? ` · ${draft.contact.company}` : ""}
        </p>
        <p className="text-sm text-foreground/60">{draft.contact.phone}</p>
        <p className="text-sm text-foreground/60">{draft.contact.email}</p>
        {draft.contact.address && (
          <p className="text-sm text-foreground/60">
            {draft.contact.address}
            {draft.contact.postalCode ? `, ${draft.contact.postalCode}` : ""}
            {draft.contact.city ? ` ${draft.contact.city}` : ""}
          </p>
        )}
        {draft.contact.message && (
          <p className="mt-2 text-sm italic text-foreground/50">
            &ldquo;{draft.contact.message}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}
