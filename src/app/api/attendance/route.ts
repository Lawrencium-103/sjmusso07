import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const db = getDb();
    const url = new URL(req.url);
    const meetingId = url.searchParams.get("meeting_id");
    const alumniId = url.searchParams.get("alumni_id");

    if (meetingId) {
      const rows = await db.all(
        `SELECT a.id, a.meeting_id, a.alumni_id, a.attended, al.name as alumni_name
         FROM attendance a JOIN alumni al ON a.alumni_id = al.id
         WHERE a.meeting_id = $1
         ORDER BY al.name`,
        [meetingId]
      );
      return NextResponse.json({ attendance: rows });
    }

    if (alumniId) {
      const rows = await db.all(
        `SELECT a.id, a.meeting_id, a.attended, m.title, m.meeting_date
         FROM attendance a JOIN meetings m ON a.meeting_id = m.id
         WHERE a.alumni_id = $1
         ORDER BY m.meeting_date DESC`,
        [alumniId]
      );
      return NextResponse.json({ attendance: rows });
    }

    if (user.role === "super_admin" || user.role === "admin") {
      const rows = await db.all(
        `SELECT a.id, a.meeting_id, a.alumni_id, a.attended, al.name as alumni_name, m.title as meeting_title
         FROM attendance a
         JOIN alumni al ON a.alumni_id = al.id
         JOIN meetings m ON a.meeting_id = m.id
         ORDER BY m.meeting_date DESC, al.name`
      );
      return NextResponse.json({ attendance: rows });
    }

    const rows = await db.all(
      `SELECT a.id, a.meeting_id, a.attended, m.title, m.meeting_date
       FROM attendance a JOIN meetings m ON a.meeting_id = m.id
       WHERE a.alumni_id = $1
       ORDER BY m.meeting_date DESC`,
      [user.id]
    );
    return NextResponse.json({ attendance: rows });
  } catch (error) {
    console.error("Attendance GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (user.role !== "super_admin" && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();
    const { meeting_id, alumni_id, attended } = body;

    if (!meeting_id || !alumni_id) {
      return NextResponse.json(
        { error: "meeting_id and alumni_id are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const existing = await db.get(
      "SELECT id FROM attendance WHERE meeting_id = $1 AND alumni_id = $2",
      [meeting_id, alumni_id]
    ) as any;

    if (existing) {
      await db.run("UPDATE attendance SET attended = $1 WHERE id = $2", [
        attended ? 1 : 0,
        existing.id,
      ]);
    } else {
      await db.run(
        "INSERT INTO attendance (meeting_id, alumni_id, attended) VALUES ($1, $2, $3)",
        [meeting_id, alumni_id, attended ? 1 : 0]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Attendance POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
