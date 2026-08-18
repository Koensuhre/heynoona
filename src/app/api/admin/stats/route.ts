import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const stats = await getDashboardStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[admin stats]", error);

    return NextResponse.json(
      { error: "Kon dashboardgegevens niet ophalen." },
      { status: 500 }
    );
  }
}