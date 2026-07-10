"use client";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Checkbox from "@/components/ui/Checkbox";
import type { ContactDetails, ContactFieldErrors } from "@/types/booking";

interface ContactFormProps {
  details: ContactDetails;
  errors: ContactFieldErrors;
  onChange: (patch: Partial<ContactDetails>) => void;
}

export default function ContactForm({ details, errors, onChange }: ContactFormProps) {
  return (
    <div className="rounded-3xl glass p-6 md:p-8">
      <h3 className="mb-6 font-heading text-xl font-semibold text-foreground md:text-2xl">
        Jouw gegevens
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Voornaam"
          name="firstName"
          value={details.firstName}
          error={errors.firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
          autoComplete="given-name"
        />
        <Input
          label="Achternaam"
          name="lastName"
          value={details.lastName}
          error={errors.lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
          autoComplete="family-name"
        />
        <Input
          label="Bedrijfsnaam"
          name="company"
          optional
          value={details.company}
          onChange={(e) => onChange({ company: e.target.value })}
          autoComplete="organization"
          className="sm:col-span-2"
        />
        <Input
          label="Telefoonnummer"
          name="phone"
          type="tel"
          value={details.phone}
          error={errors.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          autoComplete="tel"
          placeholder="06 12345678"
        />
        <Input
          label="E-mailadres"
          name="email"
          type="email"
          value={details.email}
          error={errors.email}
          onChange={(e) => onChange({ email: e.target.value })}
          autoComplete="email"
        />
        <Input
          label="Adres"
          name="address"
          optional
          value={details.address}
          onChange={(e) => onChange({ address: e.target.value })}
          autoComplete="street-address"
          className="sm:col-span-2"
        />
        <Input
          label="Postcode"
          name="postalCode"
          optional
          value={details.postalCode}
          error={errors.postalCode}
          onChange={(e) => onChange({ postalCode: e.target.value })}
          autoComplete="postal-code"
          placeholder="1234 AB"
        />
        <Input
          label="Plaats"
          name="city"
          optional
          value={details.city}
          onChange={(e) => onChange({ city: e.target.value })}
          autoComplete="address-level2"
        />
        <Textarea
          label="Opmerkingen / wensen"
          name="message"
          optional
          value={details.message}
          onChange={(e) => onChange({ message: e.target.value })}
          placeholder="Bijvoorbeeld: gewenste achtergrondkleur, opstelplek, specifieke wensen..."
          className="sm:col-span-2"
        />
      </div>

      <div className="mt-6 border-t border-foreground/10 pt-6">
        <Checkbox
          name="termsAccepted"
          checked={details.termsAccepted}
          error={errors.termsAccepted}
          onChange={(e) => onChange({ termsAccepted: e.target.checked })}
          label={
            <>
              Ik ga akkoord met de{" "}
              <a href="/algemene-voorwaarden" className="underline hover:text-foreground" target="_blank">
                algemene voorwaarden
              </a>
              .
            </>
          }
        />
      </div>
    </div>
  );
}
