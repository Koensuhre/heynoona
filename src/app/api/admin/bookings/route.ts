import { NextRequest, NextResponse } from "next/server";
import { getBookings } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const bookings = await getBookings({
      status: status as
        | "nieuw"
        | "goedgekeurd"
        | "in_behandeling"
        | "afgerond"
        | "geannuleerd"
        | undefined,
      search,
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("[admin bookings]", error);

    return NextResponse.json(
      { error: "Kon boekingen niet ophalen." },
      { status: 500 }
    );
  }
}