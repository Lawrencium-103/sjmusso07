import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const VOTE_PASSWORD = "sjmusso-07";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    if (password !== VOTE_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const db = getDb();

    const positions = await db.all("SELECT * FROM positions ORDER BY id");
    const aspirants = await db.all(
      `SELECT a.id, a.name, a.position_id, a.cleared, p.title as position_title
       FROM aspirants a JOIN positions p ON a.position_id = p.id
       WHERE a.cleared = 1
       ORDER BY p.id, a.name`
    );

    const existingVote = await db.get(
      "SELECT id FROM votes WHERE alumni_id = (SELECT id FROM alumni WHERE email = $1) LIMIT 1",
      [email]
    ) as any;

    const alumni = await db.get("SELECT id FROM alumni WHERE email = $1", [email]) as any;

    return NextResponse.json({
      success: true,
      positions,
      aspirants,
      hasVoted: !!existingVote,
      alumniId: alumni?.id || null,
    });
  } catch (error) {
    console.error("Vote auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
