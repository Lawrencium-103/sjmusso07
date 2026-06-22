import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();

  const totalAlumni = await db.get("SELECT COUNT(*) as c FROM alumni") as { c: number };
  const totalPositions = await db.get("SELECT COUNT(*) as c FROM positions") as { c: number };
  const totalMeetings = await db.get("SELECT COUNT(*) as c FROM meetings") as { c: number };
  const totalPaidMonths = await db.get("SELECT COUNT(*) as c FROM payments WHERE paid = 1") as { c: number };

  const gradYear = 2007;
  const currentYear = new Date().getFullYear();
  const yearsSinceGrad = currentYear - gradYear;

  return NextResponse.json({
    total_alumni: totalAlumni.c,
    total_positions: totalPositions.c,
    total_meetings: totalMeetings.c,
    total_paid_months: totalPaidMonths.c,
    years_since_graduation: yearsSinceGrad,
  });
}
