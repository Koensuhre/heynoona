import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  createBooking,
  getBookedSlotsForDate,
  getBookedSlotsForMonth,
  isSlotAvailable,
} from "@/lib/db";
import { sendBookingEmails } from "@/lib/email";
import { PACKAGES, TIME_SLOTS } from "@/lib/packages";

export const runtime = "nodejs";

interface BookingBody {
  date: string;
  startTime: string;
  package: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  message?: string;
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
      const slots = getBookedSlotsForDate(date);
      return NextResponse.json({ date, bookedSlots: slots });
    }

    if (year && month) {
      const slots = getBookedSlotsForMonth(Number(year), Number(month));
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
      name,
      email,
      phone,
      eventType,
      message,
    } = body;

    if (
      !date ||
      !startTime ||
      !packageId ||
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !eventType
    ) {
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

    const slot = TIME_SLOTS.find((s) => s.start === startTime);
    if (!slot) {
      return NextResponse.json(
        { error: "Ongeldig tijdslot geselecteerd." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres." },
        { status: 400 }
      );
    }

    if (!isSlotAvailable(date, startTime)) {
      return NextResponse.json(
        { error: "Dit tijdslot is helaas net geboekt. Kies een ander moment." },
        { status: 409 }
      );
    }

    const booking = createBooking(uuidv4(), {
      date,
      startTime: slot.start,
      endTime: slot.end,
      package: packageId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      eventType,
      message: message?.trim(),
    });

    await sendBookingEmails(booking);

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
