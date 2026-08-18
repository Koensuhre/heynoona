import { NextRequest, NextResponse } from "next/server";
import { getBookings, getBlockedDates, getBlockedSlots } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;

    const [bookings, blockedDates, blockedSlots] = await Promise.all([
      getBookings({
        dateFrom,
        dateTo,
      }),
      getBlockedDates(),
      getBlockedSlots(),
    ]);

    // Alleen blokkades teruggeven binnen de gevraagde periode.
    const filteredBlockedDates = blockedDates.filter((item) => {
      if (dateFrom && item.date < dateFrom) return false;
      if (dateTo && item.date > dateTo) return false;
      return true;
    });

    const filteredBlockedSlots = blockedSlots.filter((item) => {
      if (dateFrom && item.date < dateFrom) return false;
      if (dateTo && item.date > dateTo) return false;
      return true;
    });

    return NextResponse.json({
      bookings,
      blockedDates: filteredBlockedDates,
      blockedSlots: filteredBlockedSlots,
    });
  } catch (error) {
    console.error("[admin agenda GET]", error);

    return NextResponse.json(
      { error: "Kon agenda niet ophalen." },
      { status: 500 }
    );
  }
}