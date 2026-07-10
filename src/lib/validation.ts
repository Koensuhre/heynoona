import type { ContactDetails, ContactFieldErrors } from "@/types/booking";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Nederlandse mobiele/vaste nummers, met of zonder spaties/streepjes/landcode
const PHONE_RE = /^(\+31|0)[\s-]?6?[\s-]?\d(?:[\s-]?\d){7,9}$/;
const POSTAL_CODE_RE = /^\d{4}\s?[A-Za-z]{2}$/;

export function validateContactDetails(details: ContactDetails): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  if (!details.firstName.trim()) errors.firstName = "Voornaam is verplicht.";
  if (!details.lastName.trim()) errors.lastName = "Achternaam is verplicht.";

  if (!details.phone.trim()) {
    errors.phone = "Telefoonnummer is verplicht.";
  } else if (!PHONE_RE.test(details.phone.trim())) {
    errors.phone = "Vul een geldig telefoonnummer in.";
  }

  if (!details.email.trim()) {
    errors.email = "E-mailadres is verplicht.";
  } else if (!EMAIL_RE.test(details.email.trim())) {
    errors.email = "Vul een geldig e-mailadres in.";
  }

  if (details.postalCode.trim() && !POSTAL_CODE_RE.test(details.postalCode.trim())) {
    errors.postalCode = "Vul een geldige postcode in (bv. 1234 AB).";
  }

  if (!details.termsAccepted) {
    errors.termsAccepted = "Je moet akkoord gaan met de algemene voorwaarden.";
  }

  return errors;
}

export function hasErrors(errors: ContactFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
