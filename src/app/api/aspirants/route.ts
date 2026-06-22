import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const db = getDb();
    const rows = await db.all(
      `SELECT a.id, a.name, a.position_id, a.cleared, p.title as position_title
       FROM aspirants a JOIN positions p ON a.position_id = p.id
       ORDER BY p.id, a.name`
    );
    return NextResponse.json({ aspirants: rows });
  } catch (error) {
    console.error("Aspirants GET error:", error);
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
    const { name, position_id } = body;

    if (!name || !position_id) {
      return NextResponse.json(
        { error: "name and position_id are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = await db.run(
      "INSERT INTO aspirants (name, position_id, cleared) VALUES ($1, $2, 0)",
      [name, position_id]
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error("Aspirants POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, position_id, cleared } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const db = getDb();
    await db.run(
      "UPDATE aspirants SET name = $1, position_id = $2, cleared = $3 WHERE id = $4",
      [name || null, position_id || null, cleared !== undefined ? (cleared ? 1 : 0) : 0, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Aspirants PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const db = getDb();
    await db.run("DELETE FROM aspirants WHERE id = $1", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Aspirants DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
