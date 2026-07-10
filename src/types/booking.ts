import type { PackageId } from "@/lib/packages";

export interface ContactDetails {
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  message: string;
  termsAccepted: boolean;
}

export const EMPTY_CONTACT_DETAILS: ContactDetails = {
  firstName: "",
  lastName: "",
  company: "",
  phone: "",
  email: "",
  address: "",
  postalCode: "",
  city: "",
  message: "",
  termsAccepted: false,
};

export interface BookingDraft {
  date: string | null;
  startTime: string | null;
  eventType: string | null;
  package: PackageId | null;
  contact: ContactDetails;
}

export type ContactFieldErrors = Partial<Record<keyof ContactDetails, string>>;
