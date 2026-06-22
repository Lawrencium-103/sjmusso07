import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, votes } = body;

    if (!name || !email || !votes || !Array.isArray(votes)) {
      return NextResponse.json({ error: "name, email, and votes array are required" }, { status: 400 });
    }

    const db = getDb();

    let alumni = await db.get("SELECT id FROM alumni WHERE email = $1", [email]) as any;

    if (!alumni) {
      const result = await db.run(
        "INSERT INTO alumni (name, email, role, must_change_password) VALUES ($1, $2, 'user', 0) RETURNING id",
        [name, email]
      );
      alumni = { id: result.lastInsertRowid };
    }

    const hasVoted = await db.get(
      "SELECT id FROM votes WHERE alumni_id = $1 LIMIT 1",
      [alumni.id]
    ) as any;

    if (hasVoted) {
      return NextResponse.json({ error: "This email has already voted" }, { status: 409 });
    }

    await db.transaction(async () => {
      for (const v of votes) {
        await db.run(
          "INSERT INTO votes (alumni_id, aspirant_id, position_id) VALUES ($1, $2, $3)",
          [alumni.id, v.aspirant_id, v.position_id]
        );
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vote submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
