import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const db = getDb();
    const rows = await db.all(
      "SELECT id, name, email, phone_no, gender, location, occupation, role, created_at FROM alumni ORDER BY name"
    );

    const user = await getCurrentUser();
    if (user && (user.role === "super_admin" || user.role === "admin")) {
      return NextResponse.json({ users: rows });
    }

    const publicRows = rows.map((r: any) => ({ id: r.id, name: r.name }));
    return NextResponse.json({ users: publicRows });
  } catch (error) {
    console.error("Users GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();
    const { alumni_id, role } = body;

    if (!alumni_id || !role) {
      return NextResponse.json(
        { error: "alumni_id and role are required" },
        { status: 400 }
      );
    }

    if (role !== "admin" && role !== "user") {
      return NextResponse.json(
        { error: "Role must be 'admin' or 'user'" },
        { status: 400 }
      );
    }

    const db = getDb();
    const target = await db.get(
      "SELECT id, role FROM alumni WHERE id = $1",
      [alumni_id]
    ) as any;

    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (target.role === "super_admin") {
      return NextResponse.json(
        { error: "Cannot change super_admin role" },
        { status: 400 }
      );
    }

    await db.run("UPDATE alumni SET role = $1 WHERE id = $2", [
      role,
      alumni_id,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Users PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
