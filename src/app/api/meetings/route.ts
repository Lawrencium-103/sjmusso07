import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const db = getDb();
    const rows = await db.all("SELECT * FROM meetings ORDER BY meeting_date DESC");
    return NextResponse.json({ meetings: rows });
  } catch (error) {
    console.error("Meetings GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, meeting_date } = body;

    if (!title || !meeting_date) {
      return NextResponse.json(
        { error: "title and meeting_date are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = await db.run(
      "INSERT INTO meetings (title, description, meeting_date, created_by) VALUES ($1, $2, $3, $4) RETURNING id",
      [title, description || null, meeting_date, user.id]
    );

    const meetingId = result.lastInsertRowid;

    const alumni = await db.all("SELECT id FROM alumni");

    await db.transaction(async () => {
      for (const a of alumni) {
        await db.run(
          "INSERT INTO attendance (meeting_id, alumni_id, attended) VALUES ($1, $2, 0)",
          [meetingId, a.id]
        );
      }
    });

    return NextResponse.json({ success: true, id: meetingId });
  } catch (error) {
    console.error("Meetings POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
