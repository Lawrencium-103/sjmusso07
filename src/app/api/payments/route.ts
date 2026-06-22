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
    const alumniId = url.searchParams.get("alumni_id");
    const scope = url.searchParams.get("scope");

    if (scope === "all" && (user.role === "super_admin" || user.role === "admin")) {
      const rows = await db.all(
        `SELECT p.id, p.alumni_id, p.year, p.month, p.paid, p.confirmed, a.name as alumni_name
         FROM payments p JOIN alumni a ON p.alumni_id = a.id
         ORDER BY a.name, p.year DESC, p.month DESC`
      );
      return NextResponse.json({ payments: rows });
    }

    if (alumniId && (user.role === "super_admin" || user.role === "admin")) {
      const rows = await db.all(
        "SELECT * FROM payments WHERE alumni_id = $1 ORDER BY year DESC, month DESC",
        [alumniId]
      );
      return NextResponse.json({ payments: rows });
    }

    const rows = await db.all(
      "SELECT * FROM payments WHERE alumni_id = $1 ORDER BY year DESC, month DESC",
      [user.id]
    );
    return NextResponse.json({ payments: rows });
  } catch (error) {
    console.error("Payments GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { alumni_id, year, month, paid, confirmed } = body;

    if (!year || !month) {
      return NextResponse.json(
        { error: "year and month are required" },
        { status: 400 }
      );
    }

    if (alumni_id && user.role !== "super_admin" && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const targetId = alumni_id || user.id;

    const db = getDb();
    const existing = await db.get(
      "SELECT id FROM payments WHERE alumni_id = $1 AND year = $2 AND month = $3",
      [targetId, year, month]
    ) as any;

    if (existing) {
      const updates = ["paid = $1"];
      const params: any[] = [paid ? 1 : 0];
      if (confirmed !== undefined) {
        updates.push("confirmed = $2");
        params.push(confirmed ? 1 : 0);
        updates.push("confirmed_by = $3");
        params.push(confirmed ? user.id : null);
        params.push(existing.id);
        await db.run(
          `UPDATE payments SET ${updates.join(", ")} WHERE id = $4`,
          params
        );
      } else {
        params.push(existing.id);
        await db.run(
          `UPDATE payments SET ${updates.join(", ")} WHERE id = $2`,
          params
        );
      }
    } else {
      await db.run(
        "INSERT INTO payments (alumni_id, year, month, paid, confirmed, confirmed_by) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          targetId,
          year,
          month,
          paid ? 1 : 0,
          confirmed ? 1 : 0,
          confirmed ? user.id : null,
        ]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payments POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
