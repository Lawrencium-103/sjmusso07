import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function getTurnout(db: ReturnType<typeof getDb>) {
  const totalVoters = await db.get(
    "SELECT COUNT(DISTINCT alumni_id) as count FROM votes"
  ) as any;
  const totalAlumni = await db.get(
    "SELECT COUNT(*) as count FROM alumni"
  ) as any;
  return {
    voted: totalVoters.count,
    total: totalAlumni.count,
    percentage: totalAlumni.count > 0
      ? Math.round((totalVoters.count / totalAlumni.count) * 100)
      : 0,
  };
}

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const url = new URL(req.url);
    const scope = url.searchParams.get("scope");

    const results = await db.all(
      `SELECT v.position_id, v.aspirant_id, COUNT(*) as votes,
              p.title as position_title, a.name as aspirant_name
       FROM votes v
       JOIN positions p ON v.position_id = p.id
       JOIN aspirants a ON v.aspirant_id = a.id
       GROUP BY v.position_id, v.aspirant_id, p.title, a.name
       ORDER BY v.position_id, votes DESC`
    );

    if (scope === "drilldown") {
      const user = await getCurrentUser();
      if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
      }
      const positionId = url.searchParams.get("position_id");
      if (!positionId) {
        return NextResponse.json({ error: "position_id is required" }, { status: 400 });
      }
      const position = await db.get("SELECT id, title FROM positions WHERE id = $1", [positionId]) as any;
      if (!position) {
        return NextResponse.json({ error: "Position not found" }, { status: 404 });
      }
      const voters = await db.all(
        `SELECT v.aspirant_id, a.name as aspirant_name, al.name as voter_name,
                al.email as voter_email, al.is_seeded as is_registered
         FROM votes v
         JOIN aspirants a ON v.aspirant_id = a.id
         JOIN alumni al ON v.alumni_id = al.id
         WHERE v.position_id = $1
         ORDER BY v.aspirant_id, al.name`,
        [positionId]
      );
      const grouped: Record<number, { aspirant_name: string; votes: number; voters: { name: string; email: string; is_registered: boolean }[] }> = {};
      for (const v of voters) {
        if (!grouped[v.aspirant_id]) {
          grouped[v.aspirant_id] = { aspirant_name: v.aspirant_name, votes: 0, voters: [] };
        }
        grouped[v.aspirant_id].votes++;
        grouped[v.aspirant_id].voters.push({ name: v.voter_name, email: v.voter_email, is_registered: v.is_registered });
      }
      return NextResponse.json({ position, aspirants: Object.values(grouped) });
    }

    if (scope === "public" || scope === "analytics") {
      if (scope === "analytics") {
        const user = await getCurrentUser();
        if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
          return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }
      }
      return NextResponse.json({ results, turnout: await getTurnout(db) });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Votes GET error:", error);
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
    const { votes } = body;

    if (!votes || !Array.isArray(votes)) {
      return NextResponse.json(
        { error: "votes array is required" },
        { status: 400 }
      );
    }

    const db = getDb();

    const hasVoted = await db.get(
      "SELECT id FROM votes WHERE alumni_id = $1 LIMIT 1",
      [user.id]
    ) as any;

    if (hasVoted) {
      return NextResponse.json(
        { error: "You have already voted" },
        { status: 409 }
      );
    }

    await db.transaction(async () => {
      for (const v of votes) {
        await db.run(
          "INSERT INTO votes (alumni_id, aspirant_id, position_id) VALUES ($1, $2, $3)",
          [user.id, v.aspirant_id, v.position_id]
        );
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Votes POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
