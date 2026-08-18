import { NextRequest, NextResponse } from "next/server";
import {
  getBlockedDates,
  getBlockedSlots,
  addBlockedDate,
  removeBlockedDate,
  addBlockedSlot,
  removeBlockedSlot,
} from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [dates, slots] = await Promise.all([
      getBlockedDates(),
      getBlockedSlots(),
    ]);

    return NextResponse.json({
      dates,
      slots,
    });
  } catch (error) {
    console.error("[admin availability GET]", error);

    return NextResponse.json(
      { error: "Kon beschikbaarheid niet ophalen." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === "date") {
      if (!body.date) {
        return NextResponse.json(
          { error: "Datum ontbreekt." },
          { status: 400 }
        );
      }

      const blockedDate = await addBlockedDate(
        body.date,
        body.reason || undefined
      );

      return NextResponse.json({
        success: true,
        date: blockedDate,
      });
    }

    if (body.type === "slot") {
      if (!body.date || !body.startTime) {
        return NextResponse.json(
          { error: "Datum of tijdslot ontbreekt." },
          { status: 400 }
        );
      }

      const blockedSlot = await addBlockedSlot(
        body.date,
        body.startTime,
        body.reason || undefined
      );

      return NextResponse.json({
        success: true,
        slot: blockedSlot,
      });
    }

    return NextResponse.json(
      { error: "Ongeldig type." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[admin availability POST]", error);

    return NextResponse.json(
      { error: "Kon blokkade niet opslaan." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id || !body.type) {
      return NextResponse.json(
        { error: "ID of type ontbreekt." },
        { status: 400 }
      );
    }

    if (body.type === "date") {
      const deleted = await removeBlockedDate(body.id);

      return NextResponse.json({
        success: deleted,
      });
    }

    if (body.type === "slot") {
      const deleted = await removeBlockedSlot(body.id);

      return NextResponse.json({
        success: deleted,
      });
    }

    return NextResponse.json(
      { error: "Ongeldig type." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[admin availability DELETE]", error);

    return NextResponse.json(
      { error: "Kon blokkade niet verwijderen." },
      { status: 500 }
    );
  }
}