import { NextRequest, NextResponse } from "next/server";
import {
  createBooking,
  getBookedSlotsForDate,
  getBookedSlotsForMonth,
  isSlotAvailable,
} from "@/lib/db";
import { sendBookingEmails } from "@/lib/email";
import { PACKAGES, TIME_SLOTS, EVENT_TYPES } from "@/lib/packages";
import { validateContactDetails, hasErrors } from "@/lib/validation";
import type { ContactDetails } from "@/types/booking";

export const runtime = "nodejs";

interface BookingBody {
  date: string;
  startTime: string;
  package: string;
  eventType: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone: string;
  email: string;
  address?: string;
  postalCode?: string;
  city?: string;
  message?: string;
  termsAccepted: boolean;
}

function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [y, m, d] = date.split("-").map(Number);
  const parsed = new Date(y, m - 1, d);
  return (
    parsed.getFullYear() === y &&
    parsed.getMonth() === m - 1 &&
    parsed.getDate() === d
  );
}

function isFutureDate(date: string): boolean {
  const [y, m, d] = date.split("-").map(Number);
  const bookingDate = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookingDate >= today;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const date = searchParams.get("date");

  try {
    if (date) {
      const slots = await getBookedSlotsForDate(date);
      return NextResponse.json({ date, bookedSlots: slots });
    }

    if (year && month) {
      const slots = await getBookedSlotsForMonth(Number(year), Number(month));
      return NextResponse.json({
        year: Number(year),
        month: Number(month),
        bookedSlots: slots,
      });
    }

    return NextResponse.json(
      { error: "Geef year+month of date op als query parameter." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[bookings GET]", error);
    return NextResponse.json(
      { error: "Kon beschikbaarheid niet ophalen." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookingBody;

    const {
      date,
      startTime,
      package: packageId,
      eventType,
      firstName,
      lastName,
      company,
      phone,
      email,
      address,
      postalCode,
      city,
      message,
      termsAccepted,
    } = body;

    if (!date || !startTime || !packageId || !eventType) {
      return NextResponse.json(
        { error: "Vul alle verplichte velden in." },
        { status: 400 }
      );
    }

    if (!isValidDate(date) || !isFutureDate(date)) {
      return NextResponse.json(
        { error: "Ongeldige datum geselecteerd." },
        { status: 400 }
      );
    }

    const validPackage = PACKAGES.find((p) => p.id === packageId);
    if (!validPackage) {
      return NextResponse.json(
        { error: "Ongeldig pakket geselecteerd." },
        { status: 400 }
      );
    }

    if (!EVENT_TYPES.includes(eventType)) {
      return NextResponse.json(
        { error: "Ongeldig evenement geselecteerd." },
        { status: 400 }
      );
    }

    const slot = TIME_SLOTS.find((s) => s.start === startTime);
    if (!slot) {
      return NextResponse.json(
        { error: "Ongeldig tijdslot geselecteerd." },
        { status: 400 }
      );
    }

    const contact: ContactDetails = {
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      company: company ?? "",
      phone: phone ?? "",
      email: email ?? "",
      address: address ?? "",
      postalCode: postalCode ?? "",
      city: city ?? "",
      message: message ?? "",
      termsAccepted: Boolean(termsAccepted),
    };

    const fieldErrors = validateContactDetails(contact);
    if (hasErrors(fieldErrors)) {
      const firstError = Object.values(fieldErrors)[0];
      return NextResponse.json({ error: firstError, fieldErrors }, { status: 400 });
    }

    if (!(await isSlotAvailable(date, startTime))) {
      return NextResponse.json(
        { error: "Dit tijdslot is helaas net geboekt. Kies een ander moment." },
        { status: 409 }
      );
    }

    const booking = await createBooking({
      date,
      startTime: slot.start,
      endTime: slot.end,
      package: packageId,
      eventType,
      firstName: contact.firstName.trim(),
      lastName: contact.lastName.trim(),
      company: contact.company.trim() || undefined,
      phone: contact.phone.trim(),
      email: contact.email.trim().toLowerCase(),
      address: contact.address.trim() || undefined,
      postalCode: contact.postalCode.trim() || undefined,
      city: contact.city.trim() || undefined,
      message: contact.message.trim() || undefined,
      termsAccepted: contact.termsAccepted,
    });

    try {
      await sendBookingEmails(booking);
    } catch (emailError) {
      // De boeking is al opgeslagen en het tijdslot is dus terecht bezet.
      // Een mislukte e-mail mag de boeking niet ongedaan maken.
      console.error("[bookings POST] e-mail versturen mislukt", emailError);
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "SLOT_UNAVAILABLE") {
      return NextResponse.json(
        { error: "Dit tijdslot is helaas net geboekt. Kies een ander moment." },
        { status: 409 }
      );
    }

    console.error("[bookings POST]", error);
    return NextResponse.json(
      { error: "Er ging iets mis. Probeer het opnieuw." },
      { status: 500 }
    );
  }
}
