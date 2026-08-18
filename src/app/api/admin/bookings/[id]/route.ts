import { NextRequest, NextResponse } from "next/server";
import { getBookingById, updateBooking } from "@/lib/db";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const booking = await getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { error: "Boeking niet gevonden." },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("[admin booking GET]", error);

    return NextResponse.json(
      { error: "Kon boeking niet ophalen." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const allowedStatuses = [
      "nieuw",
      "goedgekeurd",
      "in_behandeling",
      "afgerond",
      "geannuleerd",
    ];

    if (
      body.status !== undefined &&
      !allowedStatuses.includes(body.status)
    ) {
      return NextResponse.json(
        { error: "Ongeldige status." },
        { status: 400 }
      );
    }

    const booking = await updateBooking(id, {
      status: body.status,
      adminNotes: body.adminNotes,
      approvedBy: body.approvedBy,
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Boeking niet gevonden." },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("[admin booking PATCH]", error);

    return NextResponse.json(
      { error: "Kon boeking niet aanpassen." },
      { status: 500 }
    );
  }
}